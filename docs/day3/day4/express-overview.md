# Express.js Overview

## 1. Express.js là gì?

Express.js là một **Web Framework tối giản (Minimalist Web Framework)** được xây dựng trên Node.js.

Express giúp việc xây dựng Web Server và REST API bằng Node.js trở nên đơn giản hơn.

Express vẫn sử dụng nền tảng HTTP của Node.js, nhưng cung cấp thêm nhiều API và cơ chế hỗ trợ như:

- Routing
- Middleware
- Xử lý Request và Response
- Đọc Request Body
- Xử lý Header và HTTP Status Code

---

## 2. Vì sao Express được gọi là Minimalist Framework?

Express được gọi là **Minimalist Framework** vì nó cung cấp những chức năng cốt lõi cần thiết để xây dựng Web Server và API nhưng không ép buộc Developer phải sử dụng một cấu trúc project hoặc kiến trúc quá phức tạp.

Express không tự động cung cấp mọi thứ.

Developer có thể:

- Tự tổ chức cấu trúc project.
- Chọn Database muốn sử dụng.
- Chọn thư viện Authentication.
- Chọn cách validate dữ liệu.
- Thêm Middleware cần thiết.

Nói đơn giản:

> Express cung cấp những công cụ cơ bản để xây dựng Web Server, còn Developer tự quyết định cách tổ chức và mở rộng ứng dụng.

---

## 3. HTTP thuần ở Day 3

Khi sử dụng module `http` của Node.js, chúng ta phải tự xử lý khá nhiều thứ.

Ví dụ:

```javascript
import http from "http";

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/users") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(users));
  }
});
```

Khi số lượng route tăng lên, việc sử dụng nhiều `if/else` sẽ khiến code dài và khó quản lý.

Nếu muốn đọc JSON Body, chúng ta cũng phải tự dùng:

```javascript
req.on("data", ...)
req.on("end", ...)
JSON.parse(...)
```

---

## 4. Express giúp code ngắn và dễ quản lý hơn

### Routing

HTTP thuần:

```javascript
if (req.method === "GET" && req.url === "/users") {
  // ...
}
```

Express:

```javascript
app.get("/users", (req, res) => {
  // ...
});
```

Express giúp khai báo Route trực tiếp bằng:

```text
app.get()
app.post()
app.put()
app.delete()
```

Code dễ đọc hơn khi có nhiều API.

---

### Đọc Request Body

HTTP thuần phải tự gom các chunk:

```javascript
let body = "";

req.on("data", (chunk) => {
  body += chunk.toString();
});

req.on("end", () => {
  const data = JSON.parse(body);
});
```

Express có Middleware:

```javascript
app.use(express.json());
```

Sau đó có thể lấy JSON Body trực tiếp:

```javascript
app.post("/users", (req, res) => {
  console.log(req.body);
});
```

---

### Header và Status Code

HTTP thuần:

```javascript
res.writeHead(200, {
  "Content-Type": "application/json",
});

res.end(JSON.stringify(data));
```

Express:

```javascript
res.status(200).json(data);
```

Hoặc:

```javascript
res.status(201).json(newUser);
```

Code ngắn và dễ đọc hơn.

---

### Middleware

HTTP thuần không có hệ thống Middleware tiện dụng như Express.

Express cho phép tạo các Middleware để xử lý Request trước khi đến Route.

Ví dụ:

```javascript
app.use(express.json());
```

Hoặc Middleware kiểm tra Authentication:

```javascript
app.use(authMiddleware);
```

Có thể dùng Middleware cho:

- Authentication
- Logging
- Validation
- CORS
- Parsing Body
- Error Handling

---

## 5. Bảng so sánh HTTP thuần và Express

| Tiêu chí | HTTP thuần | Express |
|---|---|---|
| Routing | Tự kiểm tra `req.method` và `req.url` bằng `if/else` | Có `app.get()`, `app.post()`, `app.put()`, `app.delete()` |
| Đọc JSON Body | Tự xử lý `data`, `end`, `JSON.parse()` | Dùng `express.json()` và lấy dữ liệu từ `req.body` |
| Response | Dùng `res.writeHead()` và `res.end()` | Dùng `res.status()` và `res.json()` |
| Middleware | Không có hệ thống Middleware tiện dụng như Express | Có hệ thống Middleware rõ ràng |
| Quản lý nhiều Route | Dễ trở thành nhiều `if/else` | Route được khai báo rõ ràng |
| Code | Dài và phải xử lý nhiều chi tiết HTTP | Ngắn, dễ đọc và dễ maintain hơn |

---

## 6. Ví dụ so sánh

### HTTP thuần

```javascript
if (req.method === "GET" && req.url === "/users") {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(users));
}
```

### Express

```javascript
app.get("/users", (req, res) => {
  res.status(200).json(users);
});
```

Express giúp Developer tập trung nhiều hơn vào **logic của API** thay vì phải tự xử lý các chi tiết HTTP cơ bản.

---

## 7. Cách ghi nhớ

```text
Node.js HTTP
    ↓
Tự xử lý nhiều thứ
    ↓
req.method
req.url
req.on("data")
req.on("end")
res.writeHead()
res.end()
if/else routing
```

Trong khi Express cung cấp abstraction tiện dụng hơn:

```text
Express
    ↓
app.get()
app.post()
app.put()
app.delete()
req.body
req.params
req.query
res.status()
res.json()
Middleware
```

> Express.js là một Framework tối giản cho Node.js, giúp việc xây dựng Web Server và REST API dễ dàng hơn bằng cách cung cấp các cơ chế tiện dụng như Routing, Middleware, Request Body và Response API.