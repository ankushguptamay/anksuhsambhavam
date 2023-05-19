module.exports = (sequelize, DataTypes) => {
    const UserProfile = sequelize.define("userProfile", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fatherName: {
            type: DataTypes.STRING
        },
        motherName: {
            type: DataTypes.STRING
        },
        dateOfBirth: {
            type: DataTypes.DATE
        },
        gender: {
            type: DataTypes.STRING
        },
        minority: {
            type: DataTypes.BOOLEAN
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        nameOFGuardian: {
            type: DataTypes.STRING
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        occupationOfGuardian: {
            type: DataTypes.STRING
        },
        phoneNumberOfGuardian: {
            type: DataTypes.STRING
        },
        academicQualification: {
            type: DataTypes.STRING
        },
        maritalStatus: {
            type: DataTypes.BOOLEAN
        },
        spouseName: {
            type: DataTypes.STRING
        },
        isEmailverified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isPhoneNumberVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    })
    return UserProfile;
}