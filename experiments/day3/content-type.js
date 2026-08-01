import http from "http";

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/api/echo") {
        let body = "";

        // Lấy Content-Type từ Request Header
        const contentType = req.headers["content-type"];

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            // Nếu Client gửi JSON
            if (contentType?.includes("application/json")) {
                try {
                    const data = JSON.parse(body);

                    res.writeHead(200, {
                        "Content-Type": "application/json; charset=utf-8",
                    });

                    res.end(
                        JSON.stringify({
                            message: "Server đang xử lý dữ liệu dưới dạng JSON",
                            data: data,
                        })
                    );
                } catch (error) {
                    res.writeHead(400, {
                        "Content-Type": "application/json; charset=utf-8",
                    });

                    res.end(
                        JSON.stringify({
                            message: "JSON không hợp lệ",
                        })
                    );
                }

                return;
            }

            // Nếu Client gửi text/plain
            if (contentType?.includes("text/plain")) {
                res.writeHead(200, {
                    "Content-Type": "text/plain; charset=utf-8",
                });

                res.end(
                    `Server đang xử lý dữ liệu dưới dạng text thuần.\nDữ liệu nhận được: ${body}`
                );

                return;
            }

            // Content-Type không được hỗ trợ
            res.writeHead(415, {
                "Content-Type": "text/plain; charset=utf-8",
            });

            res.end("Unsupported Content-Type");
        });

        return;
    }

    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
    });

    res.end("Not Found");
});

server.listen(3000, () => {
    console.log("Server chạy tại http://localhost:3000");
});