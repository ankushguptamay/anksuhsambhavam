const multer = require("multer");
const path = require("path");

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

var imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profileImage") {
            cb(null, path.join(`${__dirname}/../Resourse/Profile`));
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

uploadFile = multer({ storage: imageStorage, fileFilter: imageFilter });

module.exports = uploadFile;