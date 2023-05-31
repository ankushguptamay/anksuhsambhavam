module.exports = (sequelize, DataTypes) => {
    const UserProfileImage = sequelize.define("userProfileImage", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        profileImage:{
            type: DataTypes.TEXT('medium')
        }
    })
    return UserProfileImage;
}