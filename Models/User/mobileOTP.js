module.exports = (sequelize, DataTypes) => {
    const MobileOTP = sequelize.define("mobileOTP", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        otp: {
            type: DataTypes.INTEGER,
        },
        vallidTill:{
            type: DataTypes.STRING
        }
    })
    return MobileOTP;
}