import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ============================================================
// TẠO LẠI __filename VÀ __dirname TRONG ESM
// ============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ============================================================
// ĐỌC FILE SYLLABUS
// ============================================================

const filePath = path.join(__dirname, "../../data/syllabus.json");

const syllabusData = fs.readFileSync(filePath, "utf8");


// ============================================================
// TẠO HTTP SERVER
// ============================================================

const server = http.createServer((req, res) => {

  // Route: GET /api/courses
  if (req.method === "GET" && req.url === "/api/courses") {

    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
    });

    res.end(syllabusData);

  } else {

    // Route không tồn tại
    res.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
    });

    res.end("Not Found");
  }
});


// ============================================================
// SERVER LISTEN PORT 3000
// ============================================================

server.listen(3000, () => {
  console.log("Server đang chạy tại http://localhost:3000");
});