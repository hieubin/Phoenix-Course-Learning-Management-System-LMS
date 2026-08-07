import http from "http";
import { URL } from "url";

const users = [
  {
    id: 1,
    name: "Hieu",
    email: "hieu@example.com",
  },
  {
    id: 2,
    name: "Nam",
    email: "nam@example.com",
  },
];

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // =========================
  // CORS Headers
  // =========================

  // Cho phép tất cả origin - chỉ dùng cho lab
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Các HTTP Method được phép
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // Các Request Header được phép
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // =========================
  // Preflight Request
  // =========================

  // Browser có thể gửi OPTIONS trước POST JSON
  // để hỏi Server xem Request có được phép hay không.
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // =========================
  // GET /users
  // =========================

  if (req.method === "GET" && pathname === "/users") {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
    });

    res.end(JSON.stringify(users));
    return;
  }

  // =========================
  // POST /users
  // =========================

  if (req.method === "POST" && pathname === "/users") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        const newUser = {
          id: users.length + 1,
          name: data.name,
          email: data.email,
        };

        users.push(newUser);

        res.writeHead(201, {
          "Content-Type": "application/json; charset=utf-8",
        });

        res.end(JSON.stringify(newUser));
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });

        res.end(
          JSON.stringify({
            message: "Invalid JSON",
          })
        );
      }
    });

    return;
  }

  // Method không được hỗ trợ
  if (pathname === "/users") {
    res.writeHead(405, {
      "Content-Type": "text/plain; charset=utf-8",
    });

    res.end("Method Not Allowed");
    return;
  }

  // Route không tồn tại
  res.writeHead(404, {
    "Content-Type": "text/plain; charset=utf-8",
  });

  res.end("Not Found");
});

server.listen(3000, () => {
  console.log("Server chạy tại http://localhost:3000");
});