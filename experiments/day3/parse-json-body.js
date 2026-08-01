import http from "http";

const server = http.createServer((req, res) => {
    // Chỉ xử lý POST /api/echo
    if (req.method === "POST" && req.url === "/api/echo") {
        let body = "";

        // Request body là một Stream nên dữ liệu có thể
        // được gửi đến Server thành nhiều chunk.
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        // Khi nhận đủ toàn bộ body
        req.on("end", () => {
            try {
                // Chuyển JSON String thành JavaScript Object
                const data = JSON.parse(body);

                // Trả lại chính JSON vừa nhận
                res.writeHead(200, {
                    "Content-Type": "application/json; charset=utf-8",
                });

                res.end(JSON.stringify(data));
            } catch (error) {
                // JSON không hợp lệ
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

    // Route không tồn tại
    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
    });

    res.end("Not Found");
});

server.listen(3000, () => {
    console.log("Server chạy tại http://localhost:3000");
});