# Request Data trong Express

Express cung cấp các cách khác nhau để lấy dữ liệu từ Request.

## Bảng so sánh

| Loại dữ liệu | Ví dụ URL/body | Biến Express |
|---|---|---|
| Query Parameters | `GET /search?keyword=node` | `req.query.keyword` |
| Route / Path Parameters | `GET /users/123` | `req.params.id` |
| Request Body | `POST /users` với JSON Body | `req.body` |

## 1. Query Parameters

Query Parameters nằm sau dấu `?` trong URL.

Ví dụ:

```text
GET /search?keyword=node
```

Lấy dữ liệu bằng:

```javascript
req.query.keyword
```

Kết quả:

```json
{
  "source": "query",
  "data": "node"
}
```

Query Parameters thường dùng để:

- Tìm kiếm.
- Filter.
- Sort.
- Phân trang.

---

## 2. Route / Path Parameters

Path Parameters là một phần của URL được dùng để xác định một Resource cụ thể.

Ví dụ:

```text
GET /users/123
```

Route:

```javascript
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
});
```

Lấy dữ liệu bằng:

```javascript
req.params.id
```

Kết quả:

```json
{
  "source": "params",
  "data": "123"
}
```

Thường dùng để lấy một Resource cụ thể.

Ví dụ:

```text
GET /users/123
GET /courses/10
```

---

## 3. Request Body

Request Body chứa dữ liệu được gửi bên trong Request.

Ví dụ:

```http
POST /users
Content-Type: application/json
```

Body:

```json
{
  "name": "Hieu",
  "email": "hieu@example.com"
}
```

Express cần:

```javascript
app.use(express.json());
```

Sau đó lấy dữ liệu bằng:

```javascript
req.body
```

Kết quả:

```json
{
  "source": "body",
  "data": {
    "name": "Hieu",
    "email": "hieu@example.com"
  }
}
```

Request Body thường dùng khi:

- Tạo dữ liệu.
- Cập nhật dữ liệu.
- Gửi dữ liệu có cấu trúc.

---

## 4. Cách ghi nhớ

```text
Query
/search?keyword=node
        ↓
req.query.keyword


Params
/users/123
        ↓
req.params.id


Body
POST /users
{"name":"Hieu"}
        ↓
req.body
```

> Query thường dùng để tìm kiếm/lọc, Params dùng để xác định Resource cụ thể, còn Body dùng để gửi dữ liệu cần tạo hoặc cập nhật.