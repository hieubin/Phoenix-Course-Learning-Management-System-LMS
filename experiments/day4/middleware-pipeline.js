import express from "express";

const app = express();
const PORT = 3000;

// Middleware 1
app.use((req, res, next) => {
  console.log("MW1 - Request bắt đầu:", new Date().toISOString());

  // next() chuyển Request sang Middleware tiếp theo
  next();
});

// Middleware 2
app.use((req, res, next) => {
  console.log("MW2 - Request đang đi qua middleware");

  // Tiếp tục Pipeline
  next();
});

// Middleware cố ý gây lỗi
app.use((req, res, next) => {
  console.log("MW3 - Request bị dừng tại đây!");

  // CỐ Ý KHÔNG gọi next()
  // Cũng KHÔNG gửi response bằng res.send(), res.json()...
  //
  // Kết quả:
  // Request sẽ không đi tiếp đến Route Handler
  // Client sẽ chờ mãi.
});

// Route Handler
app.get("/demo", (req, res) => {
  console.log("Route Handler - /demo");

  res.status(200).send("Hello from /demo");
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});