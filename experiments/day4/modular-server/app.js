import express from "express";
import usersRouter from "./routes/users.js";
import coursesRouter from "./routes/courses.js";

const app = express();
const PORT = 3000;

// Cho phép Express tự đọc JSON Body
app.use(express.json());

// Mount users router
app.use("/users", usersRouter);

// Mount courses router
app.use("/courses", coursesRouter);

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
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