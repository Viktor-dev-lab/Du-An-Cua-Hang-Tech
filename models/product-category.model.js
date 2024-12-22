const mongoose = require('mongoose'); // import thư viện Mongoose
const slug = require('mongoose-slug-updater'); // Thư viện hỗ trợ tạo slug từ tiêu đề bài viết cho URL

mongoose.plugin(slug); //Gọi phương thức plugin của Mongoose để đăng ký plugin slug

// schema: là một đối tượng cung cấp cấu trúc cho tài liệu của bạn, xác định các trường và kiểu dữ liệu của chúng trong database.
const productCategorySchema = new mongoose.Schema({
    title: String,
    parent_id: {
        type: String,
        default: ""
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deleteAt:{
            type: String,
            default: Date
        }
    },
    updatedBy: [
        {
            account_id: String,
            updateAt:{
                type: Date,
                default: Date
            }
        }
    ],
}, {
    timestamps: true
});

// "Product": Tên của mô hình. Đây là tên sẽ được sử dụng trong mã để tham chiếu đến mô hình này.
//  Schema: Lược đồ đã được định nghĩa trước đó, cung cấp cấu trúc cho các tài liệu của mô hình.
// "products": Tên của bộ sưu tập (collection) trong MongoDB
const ProductCategory = new mongoose.model("ProductCategory", productCategorySchema, "products-category");

// Đoạn mã này xuất mô hình Product để các tệp khác trong ứng dụng có thể yêu cầu (require)
module.exports = ProductCategory;


