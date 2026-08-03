import express from "express";

const app = express();
const PORT = 3000;

// Middleware để Express tự đọc JSON Body
app.use(express.json());

// ==========================================
// 1. Query Parameters
// GET /search?keyword=node
// ==========================================

app.get("/search", (req, res) => {
  const keyword = req.query.keyword;

  res.status(200).json({
    source: "query",
    data: keyword,
  });
});

// ==========================================
// 2. Route / Path Parameters
// GET /users/:id
// ==========================================

app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  res.status(200).json({
    source: "params",
    data: id,
  });
});

// ==========================================
// 3. Request Body
// POST /users
// ==========================================

app.post("/users", (req, res) => {
  const user = req.body;

  res.status(200).json({
    source: "body",
    data: user,
  });
});

// Route không tồn tại
app.use((req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});