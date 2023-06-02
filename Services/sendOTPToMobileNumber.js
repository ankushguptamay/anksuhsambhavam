const axios = require('axios');

exports.sendOTP = async (phoneNumber, otp) => {
    try {
        const message = `Dear Candidate, OTP - ${otp} (Valid for 2 Minutes) To verify the request for login. - DIYA DELHI.`;
        const type = 3;
        // console.log('SEND OTP:', { phoneNumber, message, type, templateId });
        let response = await axios.get(
            `http://api.bulksmsgateway.in/sendmessage.php?user=${encodeURIComponent(
                process.env.SMS_CREDENTIALS_USER_NAME
            )}&password=${encodeURIComponent(
                process.env.SMS_CREDENTIALS_PWD
            )}&mobile=${phoneNumber}&message=${message}&sender=DIYASM&type=${encodeURIComponent(
                type
            )}&template_id=${process.env.SMS_TEMPLATEID_OTP}`
        );
        return response;
    } catch (e) {
        console.log('Something went wrong in sending SMS: ', e);
    }
}