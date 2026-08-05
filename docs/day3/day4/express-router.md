# Express Router

## 1. Vấn đề

Khi project nhỏ, có thể viết tất cả Route trong `app.js`.

Nhưng khi API tăng lên:

```text
/users
/courses
/enrollments
/lessons
/grades
```

thì `app.js` sẽ ngày càng dài và khó maintain.

Giải pháp là dùng:

```javascript
express.Router()
```

để chia Route thành các module riêng.

---

## 2. express.Router() là gì?

`express.Router()` tạo ra một Router độc lập.

Ví dụ:

```javascript
const router = express.Router();
```

Sau đó các Route liên quan đến User được đặt trong `users.js`:

```javascript
router.get("/", ...);

router.post("/", ...);

router.get("/:id", ...);
```

Cuối cùng export Router:

```javascript
export default router;
```

---

## 3. Mount Router

Trong `app.js`:

```javascript
import usersRouter from "./routes/users.js";

app.use("/users", usersRouter);
```

`"/users"` được gọi là **mount path / prefix**.

Nếu trong `users.js`:

```javascript
router.get("/");
```

thì URL cuối cùng là:

```text
/users + /
      ↓
GET /users
```

Nếu:

```javascript
router.get("/:id");
```

thì:

```text
/users + /:id
      ↓
GET /users/:id
```

---

## 4. Sơ đồ

```text
                    app.js
                       |
             +---------+---------+
             |                   |
             v                   v
       /users prefix       /courses prefix
             |                   |
             v                   v
       usersRouter         coursesRouter
             |                   |
       +-----+-----+        +----+----+
       |     |     |        |         |
      GET   POST   GET      GET       GET
       /     /    /:id      /         /:id
       |     |     |        |         |
       v     v     v        v         v
    /users /users /users  /courses /courses
             /:id                    /:id
```

---

## 5. Cấu trúc Project

```text
modular-server/
├── app.js
├── routes/
│   ├── users.js
│   └── courses.js
└── data/
    └── store.js
```

### app.js

Chịu trách nhiệm:

- Tạo Express app.
- Middleware global.
- Mount Router.
- Error handling.
- Listen Port 3000.

### users.js

Chứa:

```text
GET  /users
POST /users
GET  /users/:id
```

### courses.js

Chứa:

```text
GET /courses
GET /courses/:id
```

### store.js

Chứa dữ liệu mock:

```javascript
users
courses
```

---

## 6. express.json()

Trong `app.js`:

```javascript
app.use(express.json());
```

Middleware này giúp Express đọc JSON Body.

Vì vậy trong:

```javascript
router.post("/", (req, res) => {
  const { name, email } = req.body;
});
```

có thể lấy trực tiếp:

```javascript
req.body
```

Không cần tự viết:

```javascript
req.on("data", ...);
req.on("end", ...);
JSON.parse(...);
```

như Day 3.

---

## 7. Các API

### Users

```text
GET  /users
POST /users
GET  /users/:id
```

### Courses

```text
GET /courses
GET /courses/:id
```

Nếu không tìm thấy User hoặc Course:

```text
404 Not Found
```

Khi tạo User thành công:

```text
201 Created
```

---

## 8. Chạy Server

Từ thư mục gốc project:

```powershell
node experiments/day4/modular-server/app.js
```

Server:

```text
http://localhost:3000
```

Test:

```text
GET http://localhost:3000/users

GET http://localhost:3000/users/1

GET http://localhost:3000/courses

GET http://localhost:3000/courses/1
```

POST User:

```text
POST http://localhost:3000/users
```

Body:

```json
{
  "name": "An",
  "email": "an@example.com"
}
```

---

## 9. Kết luận

`express.Router()` giúp chia một Application lớn thành các module nhỏ.

```text
app.js
   |
   +── /users   → usersRouter
   |
   +── /courses → coursesRouter
```

Thay vì nhét tất cả Route vào `app.js`, mỗi nhóm Resource có Router riêng.

Điều này giúp code:

- Dễ đọc.
- Dễ tìm.
- Dễ maintain.
- Dễ mở rộng khi số lượng API tăng.

> `express.Router()` = chia Route thành các module riêng, sau đó dùng `app.use()` để mount Router vào một prefix.