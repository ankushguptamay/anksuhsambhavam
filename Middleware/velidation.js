const joi = require('joi');

exports.validateUserRegistration = (data) => {
    const schema = joi.object().keys({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required().label('Email'),
        phoneNumber: joi.string().length(10).pattern(/^[0-9]+$/).required()
    });
    return schema.validate(data);
}

exports.validateUserLogin = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
    });
    return schema.validate(data);
}

exports.validateResendRegistration = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
        phoneNumber: joi.string().length(10).pattern(/^[0-9]+$/).required()
    });
    return schema.validate(data);
}

exports.validateVerifyOTPRegistration = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
        emailOTP: joi.string().length(6).required(),
        phoneNumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
        mobileOTP: joi.string().length(6).required(),
    })//.options({ allowUnknown: true });
    return schema.validate(data);
}

exports.validateLoginOTP = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
        emailOTP: joi.string().length(6).required()
    })//.options({ allowUnknown: true });
    return schema.validate(data);
}
