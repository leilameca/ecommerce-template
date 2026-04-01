const multer = require("multer");

const ApiError = require("../utils/api-error");

const storage = multer.memoryStorage();
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new ApiError(400, "Only JPG, PNG and WEBP images are allowed."));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

module.exports = {
  upload,
};
