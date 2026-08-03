# Express Middleware

## 1. Middleware là gì?

Middleware là một hàm nằm giữa Request và Response.

Middleware có thể:

- Đọc hoặc thay đổi Request.
- Kiểm tra Authentication.
- Logging.
- Validate dữ liệu.
- Thay đổi Response.
- Gọi `next()` để chuyển Request sang Middleware tiếp theo.

Middleware thường có dạng:

```javascript
(req, res, next) => {
  // xử lý gì đó

  next();
}
```

Trong đó:

- `req`: Request từ Client.
- `res`: Response trả về Client.
- `next()`: Chuyển Request sang Middleware tiếp theo.

---

## 2. Middleware Pipeline

Trong Express, Request đi qua các Middleware theo thứ tự chúng được khai báo.

Sơ đồ:

```text
Client
  |
  v
Request
  |
  v
+----------------+
| Middleware 1   |
|      next()    |
+----------------+
  |
  v
+----------------+
| Middleware 2   |
|      next()    |
+----------------+
  |
  v
+----------------+
| Middleware 3   |
|  KHÔNG next() |
|  KHÔNG response|
+----------------+
  |
  X
  |
  v
Route Handler
  |
  X
```

Middleware 3 cố ý không gọi `next()` và cũng không gửi Response.

Vì vậy Request bị dừng tại Middleware 3.

---

## 3. `next()` hoạt động như thế nào?

Ví dụ:

```javascript
app.use((req, res, next) => {
  console.log("MW1");

  next();
});
```

`next()` có nghĩa là:

> Tôi xử lý xong phần của mình, hãy chuyển Request sang Middleware tiếp theo.

Pipeline:

```text
Request
   ↓
MW1
   ↓ next()
MW2
   ↓ next()
Route Handler
   ↓
Response
```

Nếu không gọi `next()`:

```javascript
app.use((req, res, next) => {
  console.log("Request bị dừng");

  // Không next()
  // Không res.send()
});
```

Pipeline sẽ dừng:

```text
Request
   ↓
MW1
   ↓
MW2
   ↓
MW3
   ↓
STOP
```

Route Handler phía sau sẽ không được chạy.

---

## 4. Thí nghiệm Middleware cố ý gây lỗi

Trong file:

```text
experiments/day4/middleware-pipeline.js
```

Có 3 Middleware.

### Middleware 1

```javascript
app.use((req, res, next) => {
  console.log("MW1");
  next();
});
```

Có gọi `next()` nên Request tiếp tục.

### Middleware 2

```javascript
app.use((req, res, next) => {
  console.log("MW2");
  next();
});
```

Có gọi `next()` nên Request tiếp tục.

### Middleware 3

```javascript
app.use((req, res, next) => {
  console.log("MW3");

  // Không next()
  // Không response
});
```

Middleware 3 cố ý không gọi `next()`.

Nó cũng không gửi Response.

Do đó Client chờ mãi.

Route:

```javascript
app.get("/demo", (req, res) => {
  console.log("Route Handler - /demo");

  res.status(200).send("Hello from /demo");
});
```

sẽ không được thực thi.

---

## 5. Kết quả thực nghiệm

Chạy:

```powershell
node experiments/day4/middleware-pipeline.js
```

Truy cập:

```text
http://localhost:3000/demo
```

Terminal:

```text
MW1 - Request bắt đầu: ...
MW2 - Request đang đi qua middleware
MW3 - Request bị dừng tại đây!
```

Không xuất hiện:

```text
Route Handler - /demo
```

Browser tiếp tục loading.

---

## 6. Cách ghi nhớ

```text
Middleware muốn Request đi tiếp
            ↓
         next()

Middleware muốn kết thúc Request
            ↓
     res.send()
     res.json()
     res.end()

Không next()
+
Không response
            ↓
       Request treo
```

> Middleware là các bước xử lý trung gian trong Request Pipeline. Nếu Middleware gọi `next()`, Request được chuyển tiếp. Nếu Middleware không gọi `next()` và cũng không gửi Response thì Request sẽ bị treo.