const db = require('../Models');
const jwt = require("jsonwebtoken");
const util = require('../Util/generateOTP');
const { validateUserLogin, validateUserRegistration } = require("../Middleware/velidation");
const MailObject = require('../Util/mailObject');
const { Op } = require("sequelize");

const UserProfile = db.userProfile;
const EmailOTP = db.emailOTP;

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID, JWT_SECRET_KEY, SENDGRID_API_KEY, ADMIN_EMAIL_ID, JWT_ACCESS_VALIDITY_IN_MILLISECONDS, OTP_DIGITS_LENGTH, OTP_VALIDITY_IN_MILLISECONDS } = process.env;
const twilio = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true
});

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
            return res.status(400).send("User is already registered!");
        }
        // Creating Student Profile
        const user = await UserProfile.create({
            ...req.body
        });
        // Generate OTP
        const otp = util.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
        // Send OTP to Email
        const sendGridResults = await new MailObject(
            email,
            'Sambhavam-IAS: SignUp verification',
            `<p>Please use OTP for SignUp: ${otp}. Expires in ${parseInt(OTP_VALIDITY_IN_MILLISECONDS) / 1000 / 60} minutes.</p>`
        ).sendMail();
        //  Store OTP and studentID
        await EmailOTP.create({
            vallidTill: new Date().getTime() + parseInt(OTP_VALIDITY_IN_MILLISECONDS),
            otp: otp,
            userProfileId: user.id
        });

        res.status(200).send({
            success: 'true',
            message: `OTP sent to user's Email!`
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

exports.userLogin = async (req, res) => {
    try {
        const { error } = validateUserLogin(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }
        // Chaking is email present or not
        const { email } = req.body;
        const isUser = await UserProfile.findOne({
            where: {
                email: email
            }
        });
        if (!isUser) {
            return res.send({ message: "First register your self!" });
        }
        // Generate OTP
        const otp = util.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);

        // Send OTP to Email
        const sendGridResults = new MailObject(
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
            success: 'true',
            message: `OTP sent to user's Email!`
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        // Is Otp exist
        const isOtp = await EmailOTP.findOne({
            where: {
                otp: otp
            }
        });
        if (!isOtp) {
            return res.send({ message: `Invalid OTP, please enter correct OTP or regenerate OTP!` });
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
            return res.send({ message: `Invalid OTP or Email, please enter correct OTP or regenerate OTP!` });
        }
        // is expired?
        const isOtpExpired = new Date().getTime() > parseInt(isOtp.vallidTill);
        if (isOtpExpired) {
            await isOtp.destroy();
            return res.send({ message: `OTP expired, please regenerate new OTP!` });
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
        const accessToken = jwt.sign(
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
                    accessToken
                },
            });
    } catch (err) {
        res.status(500).send({ message: err.message });
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
        res.status(200).send(userProfile);
    } catch (err) {
        res.status(500).send({ message: err.message });
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
            return res.send({ message: "Profile is not present!" });
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
            success: 'true',
            message: `User profile updated!`
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}