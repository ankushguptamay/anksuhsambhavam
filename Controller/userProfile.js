const db = require('../Models');
const jwt = require("jsonwebtoken");
const util = require('../Util/generateOTP');
const { validateUserLogin, validateUserRegistration, validateResendRegistration, validateVerifyOTPRegistration, validateLoginOTP } = require("../Middleware/velidation");
const MailObject = require('../Util/mailObject');
const { Op } = require("sequelize");
const { sendOTP } = require('../Services/sendOTPToMobileNumber');

const UserProfile = db.userProfile;
const EmailOTP = db.emailOTP;
const MobileOTP = db.mobileOTP;

const { JWT_SECRET_KEY, JWT_ACCESS_VALIDITY_IN_MILLISECONDS, OTP_DIGITS_LENGTH, OTP_VALIDITY_IN_MILLISECONDS } = process.env;

exports.registerUser = async (req, res) => {
    try {
        const { error } = validateUserRegistration(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }
        // Chaking is email present or not
        const { name, email, phoneNumber } = req.body;
        const isUser = await UserProfile.findOne({
            where: {
                email: email,
            }
        });
        if (isUser) {
            return res.status(400).send({
                success: false,
                message: "User is already registered!"
            });
        }
        // Creating Student Profile
        const user = await UserProfile.create({
            ...req.body
        });
        // Generate OTPs
        const OTPForEmail = util.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
        const OTPForMobile = util.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
        // Send Email OTP to Email
        await new MailObject(
            email,
            'Sambhavam-IAS: SignUp verification',
            `<p>Please use OTP for SignUp: ${OTPForEmail}. Expires in ${parseInt(OTP_VALIDITY_IN_MILLISECONDS) / 1000 / 60} minutes.</p>`
        ).sendMail();
        //  Store Email OTP
        await EmailOTP.create({
            vallidTill: new Date().getTime() + parseInt(OTP_VALIDITY_IN_MILLISECONDS),
            otp: OTPForEmail,
            userProfileId: user.id
        });
        // Send Mobile OTP to Mobile
        await sendOTP(phoneNumber, OTPForMobile);
        //  Store Mobile OTP
        await MobileOTP.create({
            vallidTill: new Date().getTime() + parseInt(OTP_VALIDITY_IN_MILLISECONDS),
            otp: OTPForMobile,
            userProfileId: user.id
        });
        res.status(200).send({
            success: true,
            message: `OTP sent to user's Email and Mobile Number!`,
            data: {
                email: email,
                name: name,
                phoneNumber: phoneNumber
            }
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.resendOTPForRegistration = async (req, res) => {
    try {
        const { error } = validateResendRegistration(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }
        // Chaking is email present or not
        const { email, phoneNumber } = req.body;
        const user = await UserProfile.findOne({
            where: {
                [Op.and]: [
                    { phoneNumber: phoneNumber }, { email: email }
                ]
            }
        });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "User is not registered! First register your self!"
            });
        }
        // Generate OTPs
        const OTPForEmail = util.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
        const OTPForMobile = util.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
        // Send Email OTP to Email
        await new MailObject(
            email,
            'Sambhavam-IAS: SignUp verification',
            `<p>Please use OTP for SignUp: ${OTPForEmail}. Expires in ${parseInt(OTP_VALIDITY_IN_MILLISECONDS) / 1000 / 60} minutes.</p>`
        ).sendMail();
        //  Store Email OTP
        await EmailOTP.create({
            vallidTill: new Date().getTime() + parseInt(OTP_VALIDITY_IN_MILLISECONDS),
            otp: OTPForEmail,
            userProfileId: user.id
        });
        // Send Mobile OTP to Mobile
        await sendOTP(phoneNumber, OTPForMobile);
        //  Store Mobile OTP
        await MobileOTP.create({
            vallidTill: new Date().getTime() + parseInt(OTP_VALIDITY_IN_MILLISECONDS),
            otp: OTPForMobile,
            userProfileId: user.id
        });
        res.status(200).send({
            success: true,
            message: `OTP sent to user's Email and Mobile Number!`,
            data: {
                email: email,
                name: user.name,
                phoneNumber: phoneNumber
            }
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.verifyRegisterOtp = async (req, res) => {
    try {
        // Validate body
        const { error } = validateVerifyOTPRegistration(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }
        const { phoneNumber, emailOTP, email, mobileOTP } = req.body;
        // Is Email Otp exist
        const isEmailOtp = await EmailOTP.findOne({
            where: {
                otp: emailOTP
            }
        });
        // Is Mobile Otp exist
        const isMobileOtp = await MobileOTP.findOne({
            where: {
                otp: mobileOTP
            }
        });
        if (!isMobileOtp || !isEmailOtp) {
            return res.status(400).send({
                success: false,
                message: `Invalid OTP, please enter correct OTP or regenerate OTP!`
            });
        }
        // Checking is mobile number present or not
        const isEmailUser = await UserProfile.findOne({
            where: {
                [Op.and]: [
                    { phoneNumber: phoneNumber }, { email: email }, { id: isEmailOtp.userProfileId }
                ]
            }
        });
        const isMobileUser = await UserProfile.findOne({
            where: {
                [Op.and]: [
                    { phoneNumber: phoneNumber }, { email: email }, { id: isMobileOtp.userProfileId }
                ]
            }
        });
        if (!isEmailUser || !isMobileUser) {
            return res.status(400).send({
                success: false,
                message: "User is not present. First register your self or regenerate OTP!"
            });
        }
        // is email otp expired?
        const isOtpExpired = new Date().getTime() > parseInt(isEmailOtp.vallidTill);
        if (isOtpExpired) {
            await EmailOTP.destroy({ where: { userProfileId: isEmailOtp.userProfileId } });
            await MobileOTP.destroy({ where: { userProfileId: isMobileOtp.userProfileId } });
            return res.status(400).send({
                success: false,
                message: `OTP expired, please regenerate new OTP!`
            });
        }
        // update profile
        await isEmailUser.update({
            ...isEmailUser,
            isEmailverified: true,
            isPhoneNumberVerified: true
        });
        // delete otp from data base only for clear data
        await EmailOTP.destroy({ where: { userProfileId: isEmailOtp.userProfileId } });
        await MobileOTP.destroy({ where: { userProfileId: isMobileOtp.userProfileId } });
        // generating auth Token
        const data = {
            id: isEmailUser.id,
            email: isEmailUser.email
        }
        const authToken = jwt.sign(
            data,
            JWT_SECRET_KEY,
            { expiresIn: JWT_ACCESS_VALIDITY_IN_MILLISECONDS } // five day
        );
        res.status(200).send({
            success: true,
            message: `OTP verified successfully!`,
            authToken: authToken
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.userLogin = async (req, res) => {
    try {
        const { error } = validateUserLogin(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }
        const { email } = req.body;
        // Chaking is email present or not
        const isUser = await UserProfile.findOne({
            where: {
                email: email
            }
        });
        if (!isUser) {
            return res.status(400).send({
                success: false,
                message: "First register your self!"
            });
        }
        // Is Mobile Number and Email Verified
        const isVerified = await UserProfile.findOne({
            where: {
                [Op.and]: [
                    { isEmailverified: true }, { isPhoneNumberVerified: true }, { email: email }
                ]
            }
        });
        if (!isVerified) {
            return res.status(400).send({
                success: false,
                message: "Mobile Number or Email is not verified! First Verify its!"
            });
        }
        // Generate OTP
        const otp = util.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);

        // Send OTP to Email
        new MailObject(
            email,
            'Sambhavam-IAS: SignUp verification',
            `<p>Please use OTP for SignUp: ${otp}. Expires in ${parseInt(OTP_VALIDITY_IN_MILLISECONDS) / 1000 / 60} minutes.</p>`
        ).sendMail();
        //  Store OTP and studentID
        await EmailOTP.create({
            vallidTill: new Date().getTime() + parseInt(OTP_VALIDITY_IN_MILLISECONDS),
            otp: otp,
            userProfileId: isUser.id
        });

        res.status(200).send({
            success: true,
            message: `OTP sent to user's Email!`,
            data: {
                email: email
            }
        });
    }catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.verifyLoginOtp = async (req, res) => {
    try {
        const { error } = validateLoginOTP(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }
        const { email, emailOTP } = req.body;
        // Is Mobile Number and Email Verified
        const isVerified = await UserProfile.findOne({
            where: {
                [Op.and]: [
                    { isEmailverified: true }, { isPhoneNumberVerified: true }, { email: email }
                ]
            }
        });
        if (!isVerified) {
            return res.status(400).send({
                success: false,
                message: "Mobile Number or Email is not verified! First Verify its!"
            });
        }
        // Is Otp exist
        const isOtp = await EmailOTP.findOne({
            where: {
                otp: emailOTP
            }
        });
        if (!isOtp) {
            return res.status(400).send({
                success: false,
                message: `Invalid OTP, please enter correct OTP or regenerate OTP!`
            });
        }
        // Is user present
        const user = await UserProfile.findOne({
            where: {
                [Op.and]: [
                    { id: isOtp.userProfileId }, { email: email }
                ]
            }
        });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: `Invalid OTP or Email, please enter correct OTP or regenerate OTP!`
            });
        }
        // is expired?
        const isOtpExpired = new Date().getTime() > parseInt(isOtp.vallidTill);
        if (isOtpExpired) {
            await isOtp.destroy();
            return res.status(400).send({
                success: false,
                message: `OTP expired, please regenerate new OTP!`
            });
        }
        // update profile
        await user.update({
            ...user,
            isEmailverified: true
        });
        const userInfo = {
            name: user.name,
            email: email,
            phoneNumber: user.phoneNumber,
        };
        // delete otp from data base only for clear data
        await isOtp.destroy();
        // authToken
        const authToken = jwt.sign(
            {
                email: email,
                id: user.id,
            },
            JWT_SECRET_KEY,
            { expiresIn: JWT_ACCESS_VALIDITY_IN_MILLISECONDS } // five day
        );
        res
            .status(200)
            .send({
                success: true,
                message: `Verification successful!`,
                data: {
                    userInfo,
                    authToken
                }
            });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.userProfile = async (req, res) => {
    try {
        const userProfile = await UserProfile.findOne({
            where: {
                [Op.and]: [
                    { id: req.user.id }, { email: req.user.email }
                ]
            }
        });
        res.status(200).send({
            success: true,
            message: `User Profile fetched successfully!`,
            data: userProfile
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.updateUserProfile = async (req, res) => {
    try {
        const userProfile = await UserProfile.findOne({
            where: {
                [Op.and]: [
                    { id: req.user.id }, { email: req.user.email }
                ]
            }
        });
        const { name, fatherName, motherName, dateOfBirth, gender, minority, nameOFGuardian,
            occupationOfGuardian, phoneNumberOfGuardian, academicQualification, maritalStatus, spouseName } = req.body;
        if (!userProfile) {
            return res.status(400).send({
                success: false,
                message: "Profile is not present!"
            });
        }
        await userProfile.update({
            name: name,
            fatherName: fatherName,
            motherName: motherName,
            dateOfBirth: dateOfBirth,
            gender: gender,
            minority: minority,
            nameOFGuardian: nameOFGuardian,
            occupationOfGuardian: occupationOfGuardian,
            phoneNumberOfGuardian: phoneNumberOfGuardian,
            academicQualification: academicQualification,
            maritalStatus: maritalStatus,
            spouseName: spouseName
        })
        res.status(200).send({
            success: true,
            message: `User profile updated!`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}