# PostgreSQL và Security

## 1. Thư viện `pg` là gì?

`pg` (node-postgres) là thư viện Node.js dùng để kết nối và làm việc với PostgreSQL.

Vai trò của `pg`:

- Kết nối Node.js với PostgreSQL.
- Gửi câu lệnh SQL từ Node.js đến Database.
- Nhận kết quả từ PostgreSQL.
- Hỗ trợ Query, Transaction và Connection Pool.

Ví dụ:

```js
import pg from "pg";

const { Pool } = pg;
```

Sau đó Node.js có thể sử dụng `Pool` để thực hiện SQL Query.

---

## 2. Connection Pool là gì?

Connection Pool là một nhóm các Database Connection được tạo và quản lý sẵn để ứng dụng có thể tái sử dụng.

Ví dụ:

```text
Node.js App
     |
     v
Connection Pool
  |   |   |
  v   v   v
 DB  DB  DB
```

Khi có request:

```text
Request
   ↓
Pool lấy một connection
   ↓
Thực hiện SQL
   ↓
Trả connection về Pool
```

### Vì sao dùng Pool?

Không nên tạo một `Client` mới cho mỗi request:

```text
Request 1 → tạo Client → DB → đóng
Request 2 → tạo Client → DB → đóng
Request 3 → tạo Client → DB → đóng
```

Nếu có hàng nghìn request đồng thời, việc liên tục tạo và đóng connection sẽ:

- Tốn tài nguyên.
- Tăng thời gian kết nối.
- Tạo áp lực lớn lên PostgreSQL.
- Có thể làm Database quá tải.

Connection Pool cho phép tái sử dụng connection:

```text
Request 1 ─┐
Request 2 ─┼→ Pool → PostgreSQL
Request 3 ─┘
```

Do đó Pool giúp ứng dụng sử dụng Database hiệu quả hơn.

---

## 3. SQL Injection là gì?

SQL Injection là một lỗ hổng bảo mật xảy ra khi dữ liệu người dùng nhập vào được nối trực tiếp vào câu SQL.

Ví dụ code nguy hiểm:

```js
const id = req.params.id;

const query = `SELECT * FROM books WHERE id = ${id}`;
```

Nếu người dùng gửi:

```text
/api/books/1
```

SQL có thể trở thành:

```sql
SELECT * FROM books WHERE id = 1;
```

Trường hợp này có vẻ bình thường.

Nhưng nếu dữ liệu đầu vào không được kiểm soát, attacker có thể chèn thêm SQL vào input.

Ví dụ:

```text
1 OR 1=1
```

SQL trở thành:

```sql
SELECT * FROM books WHERE id = 1 OR 1=1;
```

Điều kiện `1=1` luôn đúng, có thể khiến query trả về nhiều dữ liệu hơn dự kiến.

Vì vậy không nên nối chuỗi dữ liệu người dùng trực tiếp vào SQL.

---

## 4. Parameterized Query

Parameterized Query sử dụng placeholder như `$1`, `$2`, `$3` thay vì nối trực tiếp dữ liệu vào SQL.

Ví dụ:

```js
const result = await pool.query(
  "SELECT * FROM books WHERE id = $1",
  [req.params.id]
);
```

Ở đây:

```text
$1
```

là placeholder.

Giá trị thực tế được truyền riêng:

```js
[req.params.id]
```

Database sẽ xử lý giá trị này như **data**, không phải một phần của câu SQL.

---

## 5. So sánh

### Cách nguy hiểm

```js
const query = `
  SELECT * FROM books
  WHERE id = ${req.params.id}
`;
```

Dữ liệu người dùng được nối trực tiếp vào SQL.

```text
User input
    ↓
Nối chuỗi
    ↓
SQL
    ↓
Database
```

Có nguy cơ SQL Injection.

### Cách an toàn hơn

```js
const result = await pool.query(
  "SELECT * FROM books WHERE id = $1",
  [req.params.id]
);
```

Dữ liệu và câu SQL được truyền tách biệt:

```text
SQL:  SELECT * FROM books WHERE id = $1

Data: [req.params.id]
```

PostgreSQL hiểu `$1` là giá trị dữ liệu chứ không phải SQL code.

---

## 6. Tổng kết

| Nội dung | Ý nghĩa |
|---|---|
| `pg` | Thư viện Node.js làm việc với PostgreSQL |
| Connection Pool | Quản lý và tái sử dụng Database Connection |
| SQL Injection | Kẻ tấn công chèn SQL thông qua input |
| `$1`, `$2` | Placeholder trong Parameterized Query |
| Parameterized Query | Tách SQL và dữ liệu để giảm nguy cơ Injection |

Nguyên tắc:

```text
Không nối trực tiếp user input vào SQL.

Không nên:
SELECT ... WHERE id = ${id}

Nên:
SELECT ... WHERE id = $1
```