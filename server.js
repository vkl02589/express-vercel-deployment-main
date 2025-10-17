const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Biến toàn cục để lưu nội dung hiển thị
let displayText = "Subscribe to Arpan Neupane's channel";

app.get("/", (req, res) => {
  res.send(displayText); // Hiển thị nội dung từ biến displayText
});

// API để thay đổi nội dung hiển thị trên route "/"
app.post("/api/change-text", (req, res) => {
  const { newText } = req.body;
  
  if (!newText) {
    return res.status(400).json({ error: "Vui lòng cung cấp newText" });
  }
  
  // Cập nhật nội dung hiển thị
  displayText = newText;
  console.log("✅ Nội dung đã được cập nhật:", newText);
  
  res.json({ 
    success: true, 
    message: "Đã thay đổi nội dung thành công",
    currentText: displayText
  });
});

// API để xem nội dung hiện tại
app.get("/api/current-text", (req, res) => {
  res.json({ 
    currentText: displayText
  });
});

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});