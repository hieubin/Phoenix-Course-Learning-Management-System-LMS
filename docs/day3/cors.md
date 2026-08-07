# CORS

## 1. CORS là gì?

CORS (Cross-Origin Resource Sharing) là cơ chế bảo mật của Browser cho phép hoặc từ chối việc một trang Web gọi API từ Origin khác.

Origin được xác định bởi:

- Protocol
- Domain
- Port

Ví dụ:

```text
http://localhost:5500
http://localhost:3000
```

Hai địa chỉ trên khác Origin vì khác Port.

---

## 2. Vì sao Browser chặn Request khác Origin?

Browser áp dụng Same-Origin Policy để bảo vệ người dùng.

Nếu Frontend chạy:

```text
http://localhost:5500
```

nhưng gọi API:

```text
http://localhost:3000/users
```

thì đây là Cross-Origin Request.

Browser sẽ kiểm tra Response từ Server có CORS Header cho phép Origin đó hay không.

Nếu Server không cho phép, Browser sẽ chặn việc Frontend đọc Response.

---

## 3. CORS Error và Server Error khác nhau

### CORS Error

Server có thể vẫn nhận và xử lý Request, nhưng Browser không cho JavaScript của Frontend đọc Response vì CORS không hợp lệ.

Đây chủ yếu là vấn đề giữa Browser và Server về chính sách Cross-Origin.

### Server Error

Server thực sự gặp lỗi khi xử lý Request.

Ví dụ:

```text
400 Bad Request
404 Not Found
500 Internal Server Error
```

CORS Error không đồng nghĩa với Server Error.

---

## 4. CORS Headers

Server sử dụng các Header:

```http
Access-Control-Allow-Origin: *
```

Cho phép tất cả Origin.

Trong môi trường thực tế nên giới hạn Origin cụ thể.

```http
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

Cho biết những HTTP Method nào được phép.

```http
Access-Control-Allow-Headers: Content-Type, Authorization
```

Cho biết những Request Header nào được phép.

---

## 5. Preflight OPTIONS

Khi Frontend gửi một Request Cross-Origin có thể cần kiểm tra trước, Browser sẽ gửi một Request `OPTIONS`.

Ví dụ Frontend muốn gửi:

```http
POST /users
Content-Type: application/json
```

Browser có thể gửi trước:

```http
OPTIONS /users
```

Server phải trả về CORS Headers và status:

```text
204 No Content
```

Server trong bài thực nghiệm xử lý:

```javascript
if (req.method === "OPTIONS") {
  res.writeHead(204);
  res.end();
  return;
}
```

Sau khi Preflight được Server cho phép, Browser mới thực hiện POST JSON.

---

## 6. Cách tự test

### Bước 1: Chạy API Server

```powershell
node experiments/day3/raw-router.js
```

Server chạy tại:

```text
http://localhost:3000
```

### Bước 2: Tạo Frontend ở Origin khác

Ví dụ chạy HTML bằng VS Code Live Server:

```text
http://localhost:5500
```

Frontend có thể gọi:

```javascript
fetch("http://localhost:3000/users")
```

Frontend:

```text
localhost:5500
```

API:

```text
localhost:3000
```

Khác Port nên khác Origin.

### Bước 3: Test POST JSON

```javascript
fetch("http://localhost:3000/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "An",
    email: "an@example.com"
  })
});
```

Browser có thể gửi Preflight `OPTIONS` trước.

Server trả:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

và:

```text
204 No Content
```

Sau đó Browser mới gửi POST.

---

## 7. Cách ghi nhớ

```text
Frontend khác Origin
        ↓
Browser kiểm tra CORS
        ↓
Server có CORS Headers?
      ↙       ↘
    Có         Không
     ↓           ↓
 Cho phép     Browser chặn
```

Trong bài Lab:

```text
Frontend
localhost:5500
      ↓
      ↓ CORS
      ↓
API Server
localhost:3000
```

> CORS là cơ chế của Browser để kiểm soát việc Frontend gọi API khác Origin. Server cần trả CORS Headers phù hợp, và với một số Request Browser sẽ gửi Preflight OPTIONS trước.