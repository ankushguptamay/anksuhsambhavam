const db = require('../Models');
const UserProfileImage = db.userProfileImage;

exports.addUserProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Please..Upload Profile Image!"
            });
        }
        await UserProfileImage.create({
            profileImage: req.file.path,
            userProfileId: req.user.id
        })
        res.status(200).send({
            success: true,
            message: `User Profile Image added successfully!`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.userProfileImage = async (req, res) => {
    try {
        const user = await UserProfileImage.findOne({
            where: { userProfileId: req.user.id }
        });
        res.status(200).send({
            success: true,
            message: `User Profile Image fetched successfully!`,
            data: user
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}