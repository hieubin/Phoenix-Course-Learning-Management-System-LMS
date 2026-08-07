import express from "express";
import authorsRouter from "./routes/authors.js";
import prisma from "./lib/prisma.js";

const app = express();

app.use(express.json());

app.use("/authors", authorsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal Server Error",
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});