# Database Overview

## 1. Vì sao không nên dùng JSON file cho Web App thật?

Ở Day 3–4, dữ liệu có thể được lưu trong file JSON:

```text
data/
└── syllabus.json
```

Cách này phù hợp để học và làm mock data, nhưng không phù hợp với Web App production.

Ví dụ nếu dùng:

```text
data/books.json
```

để lưu hàng nghìn dữ liệu thì sẽ gặp nhiều vấn đề.

### 1.1. Concurrent Write

Khi có hàng nghìn người dùng cùng lúc ghi dữ liệu vào file, nhiều Request có thể cùng đọc/ghi một file.

Ví dụ:

```text
User A ──┐
User B ──┼──> books.json
User C ──┘
```

File JSON không được thiết kế để xử lý nhiều thao tác ghi đồng thời như Database.

Có thể xảy ra:

- Chậm.
- File bị lock.
- Ghi đè dữ liệu.
- Mất dữ liệu.
- Race condition.

---

### 1.2. Race Condition

Race condition xảy ra khi nhiều Request cùng thao tác với một dữ liệu và kết quả phụ thuộc vào thứ tự thực hiện.

Ví dụ:

```text
Ban đầu: courses = 10

Request A đọc: 10
Request B đọc: 10

A thêm course → 11
B thêm course → 11
```

Đáng lẽ kết quả phải là:

```text
12 courses
```

nhưng có thể chỉ còn:

```text
11 courses
```

Do hai Request cùng đọc giá trị cũ rồi ghi đè kết quả của nhau.

---

### 1.3. Khó Query và Filter

JSON file không cung cấp hệ thống query mạnh như Database.

Ví dụ cần tìm:

```text
Tất cả sinh viên đăng ký khóa Node.js
```

Hoặc:

```text
Tất cả khóa học của một instructor
```

Với Database có thể query trực tiếp.

Ví dụ SQL:

```sql
SELECT *
FROM courses
WHERE name = 'Node.js';
```

Với JSON file, thường phải đọc cả file vào RAM rồi dùng JavaScript để tìm kiếm.

---

### 1.4. Không có Transaction đúng nghĩa

Database hỗ trợ Transaction để đảm bảo một nhóm thao tác:

```text
Tất cả thành công
       hoặc
Tất cả rollback
```

Ví dụ LMS tạo enrollment:

```text
1. Tạo enrollment
2. Cập nhật số lượng học viên
3. Ghi lịch sử đăng ký
```

Nếu bước 2 thất bại thì Database có thể rollback transaction.

JSON file không cung cấp cơ chế transaction mạnh như Database.

---

## 2. SQL và NoSQL

Hai nhóm Database phổ biến:

```text
SQL
├── PostgreSQL
└── MySQL

NoSQL
├── MongoDB
└── Redis
```

---

## 3. SQL Database

SQL Database lưu dữ liệu dưới dạng **table**.

Ví dụ:

```text
users
courses
enrollments
```

Các bảng có thể liên kết với nhau bằng Relationship.

Ví dụ:

```text
users
  |
  | user_id
  v
enrollments
  |
  | course_id
  v
courses
```

### Đặc điểm

SQL phù hợp khi:

- Dữ liệu có cấu trúc rõ ràng.
- Có nhiều Relationship.
- Cần Transaction.
- Cần query/filter phức tạp.
- Cần đảm bảo tính toàn vẹn dữ liệu.

Ví dụ LMS:

```text
users
courses
enrollments
grades
```

Đây là domain có nhiều Relationship nên SQL như PostgreSQL hoặc MySQL rất phù hợp.

---

## 4. NoSQL Database

NoSQL không bắt buộc dữ liệu phải được tổ chức theo table/relationship giống SQL.

Ví dụ MongoDB lưu dữ liệu dạng document:

```json
{
  "name": "Node.js Core",
  "instructor": "Hieu",
  "lessons": 10
}
```

### Đặc điểm

NoSQL phù hợp khi:

- Schema cần linh hoạt.
- Dữ liệu có cấu trúc thay đổi.
- Cần scale ngang dễ.
- Không cần quá nhiều Relationship phức tạp.

Ví dụ:

### MongoDB

Có thể dùng để lưu dữ liệu Course có cấu trúc linh hoạt:

```text
Course
├── name
├── description
├── lessons
├── tags
└── metadata
```

### Redis

Redis thường phù hợp với:

- Cache.
- Session.
- Dữ liệu cần truy cập rất nhanh.

Ví dụ LMS:

```text
Redis
└── Cache danh sách khóa học phổ biến
```

---

## 5. SQL vs NoSQL

| Tiêu chí | SQL | NoSQL |
|---|---|---|
| Cấu trúc | Table, Row, Column | Document / Key-Value... |
| Schema | Thường cố định, rõ ràng | Linh hoạt hơn |
| Relationship | Mạnh | Thường hạn chế hơn tùy loại |
| Query | SQL mạnh | Tùy Database |
| Transaction | Mạnh | Tùy hệ thống |
| Phù hợp | Dữ liệu có quan hệ | Dữ liệu linh hoạt, scale lớn |
| Ví dụ | PostgreSQL, MySQL | MongoDB, Redis |

### Chọn Database nào cho LMS?

Nếu LMS có:

```text
Users
Courses
Enrollments
Grades
Payments
```

và các dữ liệu có nhiều Relationship:

```text
User ↔ Enrollment ↔ Course
```

thì **PostgreSQL/MySQL** là lựa chọn phù hợp.

Nếu cần:

```text
Cache
Session
Dữ liệu truy cập rất nhanh
```

thì có thể dùng **Redis** kết hợp với SQL Database.

---

# 6. Primary Key

**Primary Key (PK)** là khóa chính dùng để xác định duy nhất một record trong bảng.

Ví dụ bảng `users`:

| id | name | email |
|---:|---|---|
| 1 | Hieu | hieu@example.com |
| 2 | Nam | nam@example.com |

Ở đây:

```text
id = Primary Key
```

Không thể có hai User cùng một `id`.

---

# 7. Foreign Key

**Foreign Key (FK)** là một cột dùng để tham chiếu đến Primary Key của bảng khác.

Ví dụ:

```text
users
---------
id (PK)
name
```

và:

```text
enrollments
------------
id (PK)
user_id (FK)
course_id (FK)
```

`user_id` tham chiếu đến:

```text
users.id
```

`course_id` tham chiếu đến:

```text
courses.id
```

---

# 8. Relationship trong LMS

LMS có ba bảng cơ bản:

### users

```text
users
----------------
id (PK)
name
email
```

### courses

```text
courses
----------------
id (PK)
name
description
```

### enrollments

```text
enrollments
----------------
id (PK)
user_id (FK)
course_id (FK)
enrolled_at
```

Relationship:

```text
users                    courses
  |                         |
  | 1                       | 1
  |                         |
  |                         |
  +------< enrollments >----+
              |
              |
          user_id (FK)
          course_id (FK)
```

Có thể hiểu đơn giản:

```text
User 1 ──────< Enrollment >────── Course 1
```

Một User có thể đăng ký nhiều Course.

Một Course cũng có thể có nhiều User.

Do đó `enrollments` đóng vai trò bảng trung gian.

---

# 9. Ví dụ dữ liệu

### users

```text
id | name
---|------
1  | Hieu
2  | Nam
```

### courses

```text
id | name
---|-------------
1  | Node.js
2  | Express.js
```

### enrollments

```text
id | user_id | course_id
---|---------|----------
1  | 1       | 1
2  | 1       | 2
3  | 2       | 1
```

Có nghĩa:

```text
Hieu → Node.js
Hieu → Express.js
Nam  → Node.js
```

---

# 10. Vì sao cần Relationship?

Nếu không có Relationship, dữ liệu dễ bị lặp.

Ví dụ lưu trực tiếp:

```text
user_name
course_name
course_instructor
```

thì cùng một thông tin Course có thể bị lặp lại ở rất nhiều record.

Relationship giúp:

- Giảm dữ liệu trùng lặp.
- Đảm bảo dữ liệu nhất quán.
- Dễ query dữ liệu liên quan.
- Xác định rõ User nào đăng ký Course nào.
- Database có thể kiểm soát tính toàn vẹn bằng Foreign Key.

---

# 11. Tổng kết

```text
JSON File
   ↓
Phù hợp cho:
- Lab
- Mock data
- Dữ liệu nhỏ

Database
   ↓
Phù hợp cho:
- Web App thật
- Nhiều người dùng
- Concurrent requests
- Query phức tạp
- Transaction
- Relationship
```

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
                |
             courses
```

**Primary Key** xác định duy nhất một record.

**Foreign Key** tạo liên kết giữa các bảng.

**SQL** phù hợp với LMS có nhiều Relationship và Transaction.

**NoSQL** phù hợp với dữ liệu linh hoạt hoặc các trường hợp như cache/session tùy loại hệ thống.