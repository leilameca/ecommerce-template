const streamifier = require("streamifier");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");
const asyncHandler = require("../utils/async-handler");
const ApiError = require("../utils/api-error");

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded.");
  }

  if (!isCloudinaryConfigured) {
    throw new ApiError(500, "Cloudinary is not configured.");
  }

  const uploadFromBuffer = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "ecommerce/products",
          resource_type: "image",
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

  const result = await uploadFromBuffer();

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully.",
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      alt: req.file.originalname,
    },
  });
});

module.exports = {
  uploadImage,
};
