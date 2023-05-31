const dbConfig = require('../Config/db.Config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// User
db.userProfile = require('./User/userProfile.js')(sequelize, Sequelize);
db.emailOTP = require('./User/emailOTP.js')(sequelize, Sequelize);
db.userForm = require('./User/userForm.js')(sequelize, Sequelize);
db.userProfileImage = require('./User/userProfileImage.js')(sequelize, Sequelize);
db.mobileOTP = require('./User/mobileOTP.js')(sequelize, Sequelize);

db.userProfile.hasOne(db.emailOTP, { foreignKey: 'userProfileId' });
db.emailOTP.belongsTo(db.userProfile, { foreignKey: 'userProfileId' });

db.userProfile.hasOne(db.userForm, { foreignKey: 'userProfileId' });
db.userForm.belongsTo(db.userProfile, { foreignKey: 'userProfileId' });

db.userProfile.hasOne(db.mobileOTP, { foreignKey: 'userProfileId' });
db.mobileOTP.belongsTo(db.userProfile, { foreignKey: 'userProfileId' });

db.userProfile.hasOne(db.userProfileImage, { foreignKey: 'userProfileId' });
db.userProfileImage.belongsTo(db.userProfile, { foreignKey: 'userProfileId' });

module.exports = db;
