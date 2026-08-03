# Express JSON Body

## 1. Bài toán mệt mỏi của Day 3

Ở Day 3, khi dùng Node.js HTTP thuần, muốn đọc JSON Body phải tự xử lý Stream:

```javascript
let body = "";

req.on("data", (chunk) => {
  body += chunk.toString();
});

req.on("end", () => {
  const data = JSON.parse(body);
});
```

Cách này có nhiều đoạn code phải tự viết:

1. Gom các `chunk`.
2. Chờ sự kiện `end`.
3. Chuyển Buffer thành String.
4. `JSON.parse()` dữ liệu.
5. Tự xử lý lỗi JSON không hợp lệ.

Đây là phần code lặp lại và khá dài nếu có nhiều API nhận JSON Body.

---

## 2. `express.json()` giải quyết vấn đề gì?

Express cung cấp Middleware:

```javascript
app.use(express.json());
```

Middleware này tự đọc Request Body có:

```http
Content-Type: application/json
```

Sau đó parse JSON và đưa kết quả vào:

```javascript
req.body
```

Ví dụ Client gửi:

```json
{
  "name": "Hieu",
  "course": "Node.js"
}
```

thì Route có thể lấy trực tiếp:

```javascript
console.log(req.body);
```

Kết quả là JavaScript Object:

```javascript
{
  name: "Hieu",
  course: "Node.js"
}
```

---

## 3. `express.json()` nằm ở đâu trong Pipeline?

Pipeline:

```text
Client
   |
   | POST /api/echo
   | Content-Type: application/json
   | Body: {"name":"Hieu"}
   v
express.json()
   |
   | đọc Body
   | parse JSON
   | tạo req.body
   v
Route Handler
   |
   | req.body
   v
Response
```

Vì:

```javascript
app.use(express.json());
```

được đặt trước Route:

```javascript
app.post("/api/echo", ...)
```

nên Route Handler có thể sử dụng:

```javascript
req.body
```

---

## 4. Before / After

### Before - Node.js HTTP thuần Day 3

```javascript
let body = "";

req.on("data", (chunk) => {
  body += chunk.toString();
});

req.on("end", () => {
  const data = JSON.parse(body);

  res.end(JSON.stringify(data));
});
```

Developer phải tự xử lý Stream và JSON.

### After - Express

Thêm một lần:

```javascript
app.use(express.json());
```

Sau đó Route rất ngắn:

```javascript
app.post("/api/echo", (req, res) => {
  res.status(200).json(req.body);
});
```

Express đã xử lý phần đọc và parse Body trước khi Route chạy.

---

## 5. JSON không hợp lệ

Nếu Client gửi JSON sai:

```json
{
  "name": "Hieu",
}
```

`express.json()` sẽ không thể parse dữ liệu.

Middleware sẽ chuyển Error xuống Error-handling middleware:

```javascript
app.use((err, req, res, next) => {
  res.status(400).json({
    message: "Invalid JSON",
  });
});
```

Response:

```json
{
  "message": "Invalid JSON"
}
```

HTTP Status:

```text
400 Bad Request
```

Trong bài thực nghiệm, chúng ta chủ động viết Error-handling middleware để trả Response rõ ràng thay vì để behavior mặc định của Express.

---

## 6. Demo

File:

```text
experiments/day4/json-body.js
```

Middleware:

```javascript
app.use(express.json());
```

Route:

```javascript
app.post("/api/echo", (req, res) => {
  res.status(200).json(req.body);
});
```

Điểm quan trọng:

```text
Day 3
req.on("data")
req.on("end")
JSON.parse()
        ↓
Day 4 Express
express.json()
        ↓
req.body
```

## 7. Cách ghi nhớ

> `express.json()` là Middleware dùng để đọc và parse JSON Request Body. Nó thay phần code `req.on("data")`, `req.on("end")` và `JSON.parse()` mà chúng ta phải tự viết ở Day 3.

```text
Request
   ↓
express.json()
   ↓
req.body
   ↓
Route Handler
   ↓
Response
```