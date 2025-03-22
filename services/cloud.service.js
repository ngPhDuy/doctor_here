const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: "dpquv4bcu",
  api_key: "579443119474135",
  api_secret: "FOv1YmVP7yLXsxtFFT5cN1acpoA", // Click 'View API Keys' above to copy your API secret
});

// Upload file nhận được từ client lên Cloudinary
exports.uploadFile = async (file, folder, type) => {
  // Upload an image
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: type, folder: folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });

  return uploadResult.secure_url;
};
