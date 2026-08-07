# Database Overview

## 1. Vì sao không nên dùng JSON file cho Web App thật?

Ở các bài trước, dữ liệu có thể được lưu trong file JSON như `books.json`. Cách này phù hợp để làm lab hoặc mock data, nhưng không phù hợp với Web App production.

### Concurrent Write

Khi hàng nghìn người dùng cùng gửi request ghi dữ liệu, nhiều request có thể cùng đọc và ghi vào một file.

Điều này có thể gây:

- Chậm khi có nhiều request.
- Race condition.
- Ghi đè dữ liệu.
- Mất dữ liệu.
- Khó kiểm soát việc đồng bộ dữ liệu.

### Race Condition

Race condition xảy ra khi nhiều request cùng đọc và cập nhật dữ liệu tại cùng thời điểm.

Ví dụ:

```text
Ban đầu: 10 courses

Request A đọc: 10
Request B đọc: 10

A cập nhật → 11
B cập nhật → 11
```

Kết quả có thể là `11` thay vì `12` vì hai request đã ghi đè kết quả của nhau.

### Khó Query và Filter

JSON file không cung cấp hệ thống query mạnh như Database.

Ví dụ SQL:

```sql
SELECT *
FROM courses
WHERE name = 'Node.js';
```

Với JSON file, thường phải đọc toàn bộ file vào RAM rồi dùng JavaScript để tìm kiếm.

### Không có Transaction

Database hỗ trợ transaction để đảm bảo một nhóm thao tác được thực hiện an toàn.

Ví dụ LMS:

```text
1. Tạo enrollment
2. Cập nhật dữ liệu course
3. Ghi lịch sử đăng ký
```

Nếu một bước thất bại, transaction có thể rollback.

JSON file không cung cấp cơ chế transaction mạnh như Database.

---

## 2. SQL và NoSQL

### SQL

SQL Database lưu dữ liệu trong các bảng có cấu trúc rõ ràng.

Ví dụ LMS:

```text
users
courses
enrollments
grades
```

Các bảng có thể liên kết với nhau bằng Primary Key và Foreign Key.

Một số SQL Database:

- PostgreSQL
- MySQL

SQL phù hợp khi:

- Dữ liệu có cấu trúc rõ ràng.
- Có nhiều relationship.
- Cần transaction.
- Cần query và filter phức tạp.
- Cần đảm bảo tính toàn vẹn dữ liệu.

Ví dụ LMS:

```text
users
   ↓
enrollments
   ↓
courses
```

LMS có nhiều relationship nên PostgreSQL hoặc MySQL phù hợp.

---

## 3. NoSQL

NoSQL không nhất thiết lưu dữ liệu dưới dạng table và relationship như SQL.

Ví dụ MongoDB lưu dữ liệu dưới dạng document:

```json
{
  "name": "Node.js Core",
  "lessons": 10,
  "tags": ["nodejs", "backend"]
}
```

Một số NoSQL Database:

- MongoDB
- Redis

NoSQL phù hợp khi:

- Schema linh hoạt.
- Dữ liệu thay đổi thường xuyên.
- Cần scale theo chiều ngang.
- Không có quá nhiều relationship phức tạp.

### Ví dụ MongoDB trong LMS

Có thể lưu thông tin course có cấu trúc linh hoạt:

```text
Course
├── name
├── description
├── lessons
├── tags
└── metadata
```

### Ví dụ Redis trong LMS

Redis thường được sử dụng cho:

- Cache.
- Session.
- Dữ liệu cần truy cập rất nhanh.

Ví dụ:

```text
LMS
├── PostgreSQL → dữ liệu chính
└── Redis → cache/session
```

---

## 4. SQL vs NoSQL

| Tiêu chí | SQL | NoSQL |
|---|---|---|
| Cấu trúc | Table, Row, Column | Document / Key-Value... |
| Schema | Thường rõ ràng | Linh hoạt |
| Relationship | Mạnh | Tùy loại Database |
| Query | SQL mạnh | Tùy hệ thống |
| Transaction | Mạnh | Tùy hệ thống |
| Phù hợp | Dữ liệu có quan hệ | Dữ liệu linh hoạt |
| Ví dụ | PostgreSQL, MySQL | MongoDB, Redis |

### Ví dụ lựa chọn cho LMS

Nếu LMS có:

```text
Users
Courses
Enrollments
Grades
Payments
```

và có nhiều relationship:

```text
User ↔ Enrollment ↔ Course
```

thì PostgreSQL/MySQL phù hợp.

Nếu cần cache hoặc session:

```text
LMS
├── PostgreSQL → dữ liệu chính
└── Redis → cache/session
```

---

## 5. Primary Key

Primary Key (PK) là khóa chính dùng để xác định duy nhất một record trong bảng.

Ví dụ:

```text
users

id | name
---|------
1  | Hieu
2  | Nam
```

Ở đây `id` là Primary Key.

Mỗi user có một `id` duy nhất.

---

## 6. Foreign Key

Foreign Key (FK) là khóa ngoại dùng để tham chiếu đến Primary Key của bảng khác.

Ví dụ:

```text
users
----------------
id (PK)
name
```

```text
enrollments
----------------
id (PK)
user_id (FK)
course_id (FK)
```

`user_id` tham chiếu đến `users.id`.

`course_id` tham chiếu đến `courses.id`.

---

## 7. Relationship trong LMS

Một LMS có thể có:

### users

```text
id (PK)
name
email
```

### courses

```text
id (PK)
name
description
```

### enrollments

```text
id (PK)
user_id (FK)
course_id (FK)
enrolled_at
```

Relationship:

```text
users
  |
  | 1
  |
  | *
enrollments
  |
  | *
  |
  | 1
courses
```

Một user có thể đăng ký nhiều course.

Một course có thể có nhiều user.

Vì vậy `enrollments` là bảng trung gian giữa `users` và `courses`.

---

## 8. Vì sao cần Relationship?

Relationship giúp:

- Giảm dữ liệu trùng lặp.
- Đảm bảo dữ liệu nhất quán.
- Dễ query dữ liệu liên quan.
- Xác định user nào đăng ký course nào.
- Đảm bảo tính toàn vẹn dữ liệu bằng Foreign Key.

Ví dụ:

```text
User Hieu
   ↓
Enrollment
   ↓
Node.js Course
```

Database biết chính xác mối quan hệ giữa các dữ liệu này.

---

## 9. Tổng kết

JSON file phù hợp với:

- Lab.
- Mock data.
- Dữ liệu nhỏ.

Database phù hợp với:

- Web App thật.
- Nhiều người dùng.
- Concurrent requests.
- Query phức tạp.
- Transaction.
- Relationship.

Đối với LMS:

```text
users
   |
   | 1
   |
   | *
enrollments
   |
   | *
   |
   | 1
courses
```

- Primary Key: xác định duy nhất một record.
- Foreign Key: liên kết giữa các bảng.
- SQL: phù hợp với LMS có nhiều relationship và transaction.
- NoSQL: phù hợp với dữ liệu linh hoạt hoặc các trường hợp như cache/session.