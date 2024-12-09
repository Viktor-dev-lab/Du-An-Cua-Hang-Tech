const mongoose = require('mongoose'); // import thư viện Mongoose
const slug = require('mongoose-slug-updater'); // Thư viện hỗ trợ tạo slug từ tiêu đề bài viết cho URL

mongoose.plugin(slug); //Gọi phương thức plugin của Mongoose để đăng ký plugin slug

// schema: là một đối tượng cung cấp cấu trúc cho tài liệu của bạn, xác định các trường và kiểu dữ liệu của chúng trong database.
const RoleSchema = new mongoose.Schema({
    title: String,
    description: String,
    permission: {
        type: Array,
        default: []
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});

// "Product": Tên của mô hình. Đây là tên sẽ được sử dụng trong mã để tham chiếu đến mô hình này.
//  Schema: Lược đồ đã được định nghĩa trước đó, cung cấp cấu trúc cho các tài liệu của mô hình.
// "products": Tên của bộ sưu tập (collection) trong MongoDB
const Role = new mongoose.model("Role", RoleSchema, "roles");

// Đoạn mã này xuất mô hình Product để các tệp khác trong ứng dụng có thể yêu cầu (require)
module.exports = Role;


