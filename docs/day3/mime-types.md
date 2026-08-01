# MIME Types và Content-Type

## 1. MIME Types là gì?

MIME Type là thông tin cho biết dữ liệu đang có định dạng gì.

Một số MIME Type thường gặp:

- `application/json` → dữ liệu JSON
- `text/plain` → văn bản thuần
- `text/html` → HTML
- `image/png` → hình ảnh PNG

## 2. Content-Type dùng để làm gì?

`Content-Type` cho biết **dữ liệu được gửi đi hoặc trả về đang có định dạng gì**.

### Ở Request

Client gửi:

```http
Content-Type: application/json
```

Server hiểu rằng Request Body là JSON và có thể dùng:

```javascript
JSON.parse(body)
```

để chuyển JSON String thành JavaScript Object.

Nếu Client gửi:

```http
Content-Type: text/plain
```

Server phải coi Body là **text thuần**, không tự động parse JSON.

### Ở Response

Server cũng cần đặt `Content-Type` để Client biết dữ liệu trả về có định dạng gì.

Ví dụ:

```http
Content-Type: application/json
```

→ Response là JSON.

```http
Content-Type: text/plain
```

→ Response là text thuần.

## 3. Thực nghiệm

Server có endpoint:

```http
POST /api/echo
```

### Trường hợp 1: application/json

Request:

```http
POST /api/echo
Content-Type: application/json

{"name":"Hieu","course":"Node.js"}
```

Server nhận biết Body là JSON và thực hiện:

```javascript
JSON.parse(body)
```

Sau đó trả về JSON:

```json
{
  "message": "Server đang xử lý dữ liệu dưới dạng JSON",
  "data": {
    "name": "Hieu",
    "course": "Node.js"
  }
}
```

Response:

```http
Content-Type: application/json
```

### Trường hợp 2: text/plain

Request:

```http
POST /api/echo
Content-Type: text/plain

{"name":"Hieu","course":"Node.js"}
```

Mặc dù Body trông giống JSON nhưng Server **không parse JSON**.

Server coi toàn bộ Body là text:

```text
{"name":"Hieu","course":"Node.js"}
```

Response:

```http
Content-Type: text/plain
```

Server giải thích rằng dữ liệu đang được xử lý dưới dạng text thuần.

## 4. Vì sao Content-Type quan trọng?

Cùng một Body:

```text
{"name":"Hieu","course":"Node.js"}
```

nhưng:

```text
Content-Type: application/json
```

→ Server hiểu là JSON → có thể `JSON.parse()`.

Trong khi:

```text
Content-Type: text/plain
```

→ Server hiểu là text → không tự động `JSON.parse()`.

Vì vậy Server cần đọc `Content-Type` để biết **nên diễn giải và xử lý Request Body như thế nào**.

## 5. Cách ghi nhớ

```text
application/json
        ↓
Body là JSON
        ↓
Có thể JSON.parse()

text/plain
        ↓
Body là text
        ↓
Không tự parse JSON
```

## 6. Kết luận

`MIME Type` mô tả định dạng của dữ liệu.

`Content-Type` là HTTP Header dùng để thông báo định dạng dữ liệu của Request Body hoặc Response Body.

Trong bài thực nghiệm:

- `application/json` → Server parse Body thành JSON.
- `text/plain` → Server xử lý Body như text thuần.
- Response cũng phải đặt `Content-Type` phù hợp với dữ liệu trả về.