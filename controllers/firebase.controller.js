// Upload file nhận được từ client lên Cloudinary
exports.uploadFile = async (req, res, next) => {
  // Lấy file từ request
  const file = req.file;
  // Upload an image
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "uploads" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });

  console.log(uploadResult.secure_url);

  // Trả về URL của file đã upload
  res.json({
    url: uploadResult.secure_url,
  });
};
