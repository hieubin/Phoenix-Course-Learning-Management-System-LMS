# Các loại Middleware trong Express

## 1. Application-level Middleware

Application-level middleware được gắn trực tiếp vào đối tượng `app` bằng:

```javascript
app.use(...)
```

Middleware này có thể áp dụng cho toàn bộ Application.

Ví dụ:

```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

Middleware trên sẽ chạy với mọi Request đi vào Server.

Ví dụ:

```text
GET /home
GET /api/users
POST /api/users
```

đều đi qua middleware này.

---

## 2. Router-level Middleware

Router-level middleware được gắn trên một `express.Router()`.

Ví dụ:

```javascript
const router = express.Router();

router.use((req, res, next) => {
  console.log("API Router");
  next();
});

app.use("/api", router);
```

Middleware này chỉ áp dụng cho các Route thuộc Router `/api`.

Ví dụ:

```text
GET /api/users
GET /api/courses
POST /api/users
```

sẽ đi qua router-level middleware.

Nhưng:

```text
GET /home
```

không đi qua middleware của `/api`.

### Sơ đồ

```text
                    Request
                       |
                       v
             Application Middleware
                       |
                       v
                +--------------+
                |  Path /api ? |
                +--------------+
                  /          \
                Có            Không
                |               |
                v               v
       Router Middleware      /home
                |
                v
          /api/users
          /api/courses
```

---

## 3. Error-handling Middleware

Error-handling middleware dùng để xử lý lỗi trong Express.

Nó có đặc biệt **4 tham số**:

```javascript
(err, req, res, next)
```

Ví dụ:

```javascript
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});
```

Điểm quan trọng là phải có tham số `err` đầu tiên.

Middleware thông thường:

```javascript
(req, res, next)
```

Error-handling middleware:

```javascript
(err, req, res, next)
```

Khi Route phát hiện lỗi, có thể chuyển lỗi đến Error-handling middleware bằng:

```javascript
next(new Error("Có lỗi xảy ra"));
```

---

## 4. Demo

File thực nghiệm:

```text
experiments/day4/middleware-types.js
```

Trong đó có:

- 1 Application-level middleware.
- 1 Router-level middleware cho `/api`.
- 1 Route cố ý tạo Error.
- 1 Error-handling middleware.

### Application-level

```javascript
app.use((req, res, next) => {
  console.log(`[APP] ${req.method} ${req.url}`);
  next();
});
```

Middleware này chạy với mọi Request.

### Router-level

```javascript
router.use((req, res, next) => {
  console.log("[ROUTER /api]");
  next();
});
```

Middleware này chỉ chạy với Request đi vào Router `/api`.

### Tạo Error

```javascript
router.get("/error", (req, res, next) => {
  next(new Error("Có lỗi xảy ra trong /api/error"));
});
```

`next(error)` chuyển Error đến Error-handling middleware.

### Error-handling

```javascript
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});
```

Server trả về:

```json
{
  "message": "Có lỗi xảy ra trong /api/error"
}
```

với HTTP Status Code:

```text
500 Internal Server Error
```

---

## 5. Chứng minh Router-level chỉ áp dụng cho /api

### Request `/api/users`

```text
GET /api/users
```

Đi qua:

```text
Application Middleware
        ↓
Router /api Middleware
        ↓
GET /api/users
        ↓
Response
```

Terminal:

```text
[APP] GET /api/users
[ROUTER /api] Request đi qua router-level middleware
```

### Request `/home`

```text
GET /home
```

Đi qua:

```text
Application Middleware
        ↓
GET /home
        ↓
Response
```

Terminal:

```text
[APP] GET /home
```

Không xuất hiện:

```text
[ROUTER /api] ...
```

Điều này chứng minh Router-level middleware của `/api` không áp dụng cho `/home`.

---

## 6. Bảng so sánh

| Loại Middleware | Gắn ở đâu? | Phạm vi | Mục đích |
|---|---|---|---|
| Application-level | `app.use()` | Toàn bộ Application | Logging, CORS, Body Parser... |
| Router-level | `router.use()` | Một nhóm Route | Authentication, Authorization cho một nhóm API |
| Error-handling | `app.use((err, req, res, next) => {})` | Xử lý Error | Bắt lỗi và trả Response phù hợp |

---

## 7. Cách ghi nhớ

```text
app.use()
    ↓
Application-level
    ↓
Toàn bộ App


router.use()
    ↓
Router-level
    ↓
Chỉ nhóm Route của Router


(err, req, res, next)
    ↓
Error-handling
    ↓
Xử lý lỗi
```

> Application-level middleware áp dụng rộng cho toàn App, Router-level middleware chỉ áp dụng cho một nhóm Route, còn Error-handling middleware chuyên xử lý lỗi và được nhận diện bởi 4 tham số `(err, req, res, next)`.