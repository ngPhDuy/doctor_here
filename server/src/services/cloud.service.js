const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: "dpquv4bcu",
  api_key: "579443119474135",
  api_secret: "FOv1YmVP7yLXsxtFFT5cN1acpoA", // Click 'View API Keys' above to copy your API secret
});

// Upload MỘT file nhận được từ client lên Cloudinary
exports.uploadFile = async (file, folder, type) => {
  // Upload an image
  const uploadResult = await new Promise((resolve, reject) => {
    if (type === "image") {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: type,
          folder: folder,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(file.buffer);
    } else {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: type,
          folder: folder,
          unique_filename: true,
          use_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(file.buffer);
    }
  });

  return uploadResult.secure_url;
};

// Xóa MỘT file từ Cloudinary
exports.deleteFile = async (url) => {
  try {
    //url: "https://res.cloudinary.com/dpquv4bcu/image/upload/v1744558781/diagnosis/ycru9dgd7gubbiw14g5q.png"
    //publicID: "diagnosis/ycru9dgd7gubbiw14g5q"
    let publicID = url.split("upload/")[1];
    publicID = publicID.split(".")[0];
    publicID = publicID.split("/").slice(1).join("/"); // Lấy phần sau "upload/"
    console.log("Public ID:", publicID); // Kiểm tra publicID
    console.log("URL:", url); // Kiểm tra URL
    // Xóa file từ Cloudinary
    const result = await cloudinary.uploader.destroy(publicID, {
      resource_type: "image",
    });

    console.log("File deleted:", result);
    if (result.result === "ok") {
      return true; // Xóa thành công
    } else {
      if (result.result === "not found") {
        console.log("File not found on Cloudinary.");
        return true; // File không tồn tại
      } else {
        console.log("Error deleting file:", result.result);
        return false; // Xóa không thành công
      }
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
