const express = require("express");
const app = express();

const port = process.env.PORT || 8080;

// Route chính - LUÔN hiển thị "Subscribe to khanh" cho mọi người
app.get("/", (req, res) => {
  res.send("Subscribe to khanh");
});

// API endpoint để xem thống kê (chỉ admin xem)
let updateCount = 0;
let lastUpdates = [];

app.get("/admin", (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
      <title>Admin Stats</title>
      <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .stat { background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 5px; }
      </style>
  </head>
  <body>
      <h1>📊 Admin Statistics</h1>
      <div class="stat">
          <strong>Tổng số lần cập nhật:</strong> ${updateCount}
      </div>
      <div class="stat">
          <strong>5 lần cập nhật gần nhất:</strong>
          <ul>
              ${lastUpdates.map(update => 
                  `<li>${update.time}: "${update.message}" (IP: ${update.ip})</li>`
              ).join('')}
          </ul>
      </div>
      <div class="stat">
          <strong>Public page:</strong> Luôn hiển thị "Subscribe to khanh" cho mọi visitor
      </div>
  </body>
  </html>
  `;
  res.send(html);
});

// API để nhận tin nhắn từ local (chỉ để thống kê, không hiển thị ra public)
app.post("/api/message", (req, res) => {
  const { message } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (message && message.trim() !== "") {
    updateCount++;
    
    // Lưu lịch sử cập nhật (chỉ 5 cái mới nhất)
    lastUpdates.unshift({
      message: message.trim(),
      time: new Date().toLocaleString(),
      ip: clientIP
    });
    
    if (lastUpdates.length > 5) {
      lastUpdates = lastUpdates.slice(0, 5);
    }
    
    console.log(`📢 Received message #${updateCount} from ${clientIP}: "${message}"`);
    
    res.json({
      success: true,
      message: "Message received (but not displayed to public)",
      receivedMessage: message,
      totalUpdates: updateCount,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(400).json({
      success: false,
      error: "Message cannot be empty"
    });
  }
});

// Endpoint để nhận tin nhắn từ form
app.post("/update", express.urlencoded({ extended: true }), (req, res) => {
  const { message } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (message && message.trim() !== "") {
    updateCount++;
    
    lastUpdates.unshift({
      message: message.trim(),
      time: new Date().toLocaleString(),
      ip: clientIP
    });
    
    if (lastUpdates.length > 5) {
      lastUpdates = lastUpdates.slice(0, 5);
    }
    
    console.log(`📢 Received message #${updateCount} from ${clientIP}: "${message}"`);
    
    res.json({
      success: true,
      message: "Message received (but not displayed to public)",
      receivedMessage: message,
      totalUpdates: updateCount,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(400).json({
      success: false,
      error: "Message cannot be empty"
    });
  }
});

// Endpoint GET để nhận tin nhắn nhanh
app.get("/update", (req, res) => {
  const { message } = req.query;
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (message && message.trim() !== "") {
    updateCount++;
    
    lastUpdates.unshift({
      message: message.trim(),
      time: new Date().toLocaleString(),
      ip: clientIP
    });
    
    if (lastUpdates.length > 5) {
      lastUpdates = lastUpdates.slice(0, 5);
    }
    
    console.log(`📢 Received message #${updateCount} from ${clientIP}: "${message}"`);
    
    res.json({
      success: true,
      message: "Message received (but not displayed to public)",
      receivedMessage: message,
      totalUpdates: updateCount,
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
  console.log(`🌐 Public page: http://localhost:${port} (ALWAYS shows "Subscribe to khanh")`);
  console.log(`📊 Admin stats: http://localhost:${port}/admin`);
});