import express from "express";

const app = express();
const router = express.Router();

const PORT = 3000;

// ==========================================
// 1. APPLICATION-LEVEL MIDDLEWARE
// ==========================================
// Chạy với mọi Request đi vào app.
app.use((req, res, next) => {
  console.log(`[APP] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// 2. ROUTER-LEVEL MIDDLEWARE
// ==========================================
// Middleware này chỉ áp dụng cho các route
// được gắn với router /api.
router.use((req, res, next) => {
  console.log("[ROUTER /api] Request đi qua router-level middleware");
  next();
});

// Route thuộc /api
router.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Hieu" },
    { id: 2, name: "Nam" },
  ]);
});

// Route cố ý tạo lỗi
router.get("/error", (req, res, next) => {
  // Chuyển Error sang Error-handling middleware
  next(new Error("Có lỗi xảy ra trong /api/error"));
});

// Gắn router vào /api
app.use("/api", router);

// ==========================================
// Route bên ngoài /api
// ==========================================
// Route này chỉ đi qua Application-level middleware.
// Nó KHÔNG đi qua router-level middleware của /api.
app.get("/home", (req, res) => {
  res.json({
    message: "Home page",
  });
});

// ==========================================
// 3. ERROR-HANDLING MIDDLEWARE
// ==========================================
// Error-handling middleware phải có ĐỦ 4 tham số:
// (err, req, res, next)
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);

  res.status(500).json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});