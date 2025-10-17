const express = require("express");
const app = express();

const port = process.env.PORT || 8080;

// Biến toàn cục để lưu nội dung
let currentMessage = "Subscribe to khanh";

// Middleware để parse JSON
app.use(express.json());

// Route chính - hiển thị nội dung hiện tại
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Live Message Display</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f0f0f0;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-align: center;
            }
            h1 {
                color: #333;
            }
            .message {
                font-size: 24px;
                color: #007bff;
                margin: 20px 0;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 5px;
                border-left: 4px solid #007bff;
            }
            .info {
                margin-top: 30px;
                padding: 15px;
                background-color: #e9ecef;
                border-radius: 5px;
                font-size: 14px;
                text-align: left;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔴 Live Message Display</h1>
            <div class="message" id="message">${currentMessage}</div>
            <div class="info">
                <h3>📡 Cách sử dụng API:</h3>
                <p><strong>GET /</strong> - Xem nội dung hiện tại</p>
                <p><strong>POST /update</strong> - Cập nhật nội dung mới</p>
                <p><strong>GET /api/message</strong> - Lấy nội dung dạng JSON</p>
                <p><strong>POST /api/message</strong> - Cập nhật nội dung qua JSON</p>
                <br>
                <p><strong>Ví dụ cập nhật từ terminal:</strong></p>
                <code>curl -X POST http://your-domain.com/update -d "message=Hello World"</code>
                <br><br>
                <code>curl -X POST http://your-domain.com/api/message -H "Content-Type: application/json" -d '{"message":"Xin chào"}'</code>
            </div>
        </div>

        <script>
            // Auto refresh mỗi 5 giây để cập nhật nội dung mới
            setInterval(() => {
                fetch('/api/message')
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('message').textContent = data.message;
                    });
            }, 5000);
        </script>
    </body>
    </html>
  `);
});

// API để lấy nội dung hiện tại (JSON)
app.get("/api/message", (req, res) => {
  res.json({
    success: true,
    message: currentMessage,
    timestamp: new Date().toISOString()
  });
});

// API để cập nhật nội dung qua JSON
app.post("/api/message", (req, res) => {
  const { message } = req.body;
  
  if (message && message.trim() !== "") {
    currentMessage = message.trim();
    console.log(`📢 Message updated: "${currentMessage}" at ${new Date().toLocaleString()}`);
    
    res.json({
      success: true,
      message: "Message updated successfully",
      newMessage: currentMessage,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(400).json({
      success: false,
      error: "Message cannot be empty"
    });
  }
});

// Endpoint để cập nhật từ form data
app.post("/update", express.urlencoded({ extended: true }), (req, res) => {
  const { message } = req.body;
  
  if (message && message.trim() !== "") {
    currentMessage = message.trim();
    console.log(`📢 Message updated via form: "${currentMessage}" at ${new Date().toLocaleString()}`);
    
    res.json({
      success: true,
      message: "Message updated successfully",
      newMessage: currentMessage,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(400).json({
      success: false,
      error: "Message cannot be empty"
    });
  }
});

// Endpoint GET để cập nhật nhanh (cho tiện dụng)
app.get("/update", (req, res) => {
  const { message } = req.query;
  
  if (message && message.trim() !== "") {
    currentMessage = message.trim();
    console.log(`📢 Message updated via GET: "${currentMessage}" at ${new Date().toLocaleString()}`);
    
    res.json({
      success: true,
      message: "Message updated successfully",
      newMessage: currentMessage,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(400).json({
      success: false,
      error: "Message parameter is required"
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
  console.log(`📊 Truy cập: http://localhost:${port}`);
  console.log(`📝 Current message: "${currentMessage}"`);
});