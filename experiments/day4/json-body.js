import express from "express";

const app = express();
const PORT = 3000;

// Middleware này tự đọc Request Body có Content-Type: application/json
// và chuyển JSON thành JavaScript Object trong req.body.
app.use(express.json());

// POST /api/echo
app.post("/api/echo", (req, res) => {
  // Không cần req.on("data") và req.on("end") nữa.
  // Express đã xử lý Body trước đó.
  res.status(200).json(req.body);
});

// Error-handling middleware
// express.json() sẽ chuyển lỗi JSON không hợp lệ xuống đây.
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);

  res.status(400).json({
    message: "Invalid JSON",
  });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});