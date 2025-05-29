const service = require("../services/cloud.service");

exports.uploadFile = async (req, res) => {
  try {
    const { folderName } = req.body;
    const files = req.files;
    let fileUrls = [];
    let types = [];
    console.log(`Upload ${files.length} files to ${folderName}`);
    if (files && files.length > 0) {
      // Upload từng file lên Cloudinary và lấy URL
      const uploadPromises = files.map(async (file) => {
        console.log(file);
        let type = file.mimetype.split("/")[0];
        console.log(type);
        if (type !== "image") {
          type = "raw";
        }
        const fileUrl = await service.uploadFile(file, folderName, type);
        types.push(type);
        return fileUrl; // Trả về URL sau khi upload thành công
      });

      // Đợi tất cả các upload hoàn thành
      fileUrls = await Promise.all(uploadPromises);
    }

    //return [{url: fileUrl, type: type}]
    let result = [];
    for (let i = 0; i < fileUrls.length; i++) {
      result.push({ url: fileUrls[i], type: types[i] });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
