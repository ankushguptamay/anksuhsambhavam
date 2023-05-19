const db = require('../Models');
const UserProfile = db.userProfile;

exports.isUserPreasent = async (req, res, next) => {
    try {
        const user = await UserProfile.findOne({
            where: {
                [Op.and]: [
                    { id: req.user.id }, { email: req.user.email }
                ]
            } 
            });
        if (!user) {
            return res.send({
                message: "User profile is not present! Are you register?.. "
            })
        }
        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}