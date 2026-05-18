const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, safeName);
    }

});

// File filter
const fileFilter = (req, file, cb) => {

    const allowedTypes = /jpg|jpeg|png/;

    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb("Only JPG, JPEG, PNG files allowed");
    }

};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;