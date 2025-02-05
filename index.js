const express = require('express') // thêm thư viện express
const methodOverride = require('method-override') // thêm thư viện ghi đề phương thức HTTP
require("dotenv").config(); // sử dụng thư viện dotenv để cấu hình các thông tin bảo mật
const database = require("./config/database.js") // Nhúng từ bên file config cấu hình database
const bodyParser = require('body-parser') // Thư viện lấy dữ liệu từ các biểu mẫu (forms) trong các yêu cầu HTTP.
const flash = require('express-flash') // Thư viện để thông báo một sự kiện
const session = require('express-session') // Thư viện để thông báo một sự kiện
const cookieParser = require('cookie-parser') // Thư viện để thông báo một sự kiện
const path = require('path');
const dayjs = require('dayjs');
const http = require('http'); // Dùng để sài socket.io

database.connect() // gọi hàm connect để connect

const app = express() // Gọi hàm express() để khởi tạo một ứng dụng Express
const { Server } = require("socket.io"); // Dùng để sài socket.io
const port = process.env.PORT // Cổng 3000
const routeClient = require('./routes/client/index.route.js') // Nhúng route client
const routeAdmin = require('./routes/admin/index.route.js') // Nhúng route admin
const systemConfig = require('./config/system.js') // Nhúng PATH_ADMIN 
const server = http.createServer(app); // Dùng để sài socket.io
const io = new Server(server); // Nhúng socket.io


app.set("views", `${__dirname}/views`); // cài đặt chế độ hiển thị của pug trong thư mục views
app.set("view engine", "pug"); // cài đặt template engine là pug

app.use(express.static(`${__dirname}/public`)); // Nhúng file tĩnh có tên folder public
// Thư viện methodOverride
app.use(methodOverride('_method')) // sử dụng phương thức ghi đè HTTP
// Thư viện bodyParser
app.use(bodyParser.urlencoded({ extended: false })) //user send data form HTML, data in body của yêu cầu HTTP. body-parser giúp phân tích dữ liệu này và chuyển nó thành một đối tượng JavaScript mà bạn có thể truy cập thông qua req.body.
// Thư viện Flash
app.use(cookieParser('Xuandeptrai')); // sử dụng middleware cookieParser để phân tích và dùng chuỗi bí mật dùng để ký tên cookie trong các yêu cầu HTTP
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce'))); 

// route
routeClient(app)
routeAdmin(app)

// Biến toàn cục cho toàn bộ ứng dụng
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.dayjs = dayjs; 
global._io = io

// Xử Lý TH route ngoài lề thì 404
app.get("*", (req,res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 NOT FOUND",
  });
});

// Cấu hình server để lắng nghe tất cả địa chỉ IP
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});