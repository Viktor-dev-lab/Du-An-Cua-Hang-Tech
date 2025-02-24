const multer = require('multer'); // xử lý upload file trong Express.

module.exports = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/uploads'); // Thư mục lưu file
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now(); // Thêm timestamp để tránh trùng tên file
            cb(null, uniqueSuffix + '-' + file.originalname); // Định dạng tên file
        }
    });
    return storage;
};
