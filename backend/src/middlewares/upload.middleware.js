const multer = require("multer");
const ApiError = require("../utils/api-error");

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const storage = multer.memoryStorage();
const allowedMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(
      new ApiError(
        400,
        "Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed."
      ),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

module.exports = upload;
