const express = require("express");
const app = express();
const session = require('express-session');
const path = require("path");

const port = process.env.PORT || 8080;

// Thiết lập view engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Hoặc nếu bạn muốn dùng HTML thuần:
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.set('views', path.join(__dirname, 'views'));

// Cấu hình session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Phục vụ file tĩnh

// Middleware để khởi tạo message cho session mới
app.use((req, res, next) => {
  if (!req.session.userMessage) {
    req.session.userMessage = "Subscribe to khanh";
    req.session.userId = generateUserId();
  }
  next();
});

// Hàm tạo ID ngẫu nhiên cho user
function generateUserId() {
  return Math.random().toString(36).substr(2, 9);
}

// Route chính - hiển thị message theo session
app.get("/", (req, res) => {
  res.render("index", {
    userMessage: req.session.userMessage,
    userId: req.session.userId
  });
});

// API để cập nhật message cho session hiện tại
app.post("/update-message", (req, res) => {
  const { message } = req.body;
  
  if (message && message.trim() !== "") {
    req.session.userMessage = message.trim();
    
    res.json({
      success: true,
      newMessage: req.session.userMessage,
      userId: req.session.userId,
      message: "Cập nhật thành công!"
    });
  } else {
    res.status(400).json({
      success: false,
      error: "Tin nhắn không được để trống"
    });
  }
});

// Route đăng nhập
app.get("/login", (req, res) => {
  res.render("login");
});

// Xử lý đăng nhập
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  // Xử lý logic đăng nhập ở đây
  if (username && password) {
    req.session.isLoggedIn = true;
    req.session.username = username;
    res.redirect("/");
  } else {
    res.render("login", { error: "Vui lòng điền đầy đủ thông tin!" });
  }
});

// Đăng xuất
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
  console.log(`🌐 Truy cập: http://localhost:${port}`);
});