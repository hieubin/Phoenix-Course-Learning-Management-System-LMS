
# Toàn vẹn dữ liệu với `ON DELETE`

Khi một **bản ghi ở bảng cha (Parent)** bị xóa, Database phải quyết định sẽ xử lý các bản ghi ở **bảng con (Child)** như thế nào. Hành vi này được cấu hình bằng `ON DELETE`.

---

## 1. `ON DELETE CASCADE`

### Khái niệm

Khi Parent bị xóa thì **mọi Child liên quan cũng bị xóa tự động**.

### Ví dụ

```sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    title TEXT,
    course_id INT REFERENCES courses(id)
        ON DELETE CASCADE
);
```

Giả sử:

```
courses
---------
1 | NodeJS

lessons
---------
1 | Intro | 1
2 | HTTP  | 1
```

Thực hiện:

```sql
DELETE FROM courses
WHERE id = 1;
```

Kết quả:

```
courses
---------
0 rows

lessons
---------
0 rows
```

### Khi nào dùng?

Dùng khi dữ liệu Child **không có ý nghĩa nếu Parent không còn**.

Ví dụ:

* Course → Lesson
* Order → OrderItem

---

## 2. `ON DELETE SET NULL`

### Khái niệm

Khi Parent bị xóa thì Child **không bị xóa**, chỉ gán Foreign Key thành `NULL`.

### Ví dụ

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT,
    category_id INT REFERENCES categories(id)
        ON DELETE SET NULL
);
```

Giả sử:

```
categories
-----------
1 | Programming

products
-----------
1 | NodeJS Book | 1
```

Sau khi:

```sql
DELETE FROM categories
WHERE id = 1;
```

Kết quả:

```
products
-----------
1 | NodeJS Book | NULL
```

### Khi nào dùng?

Dùng khi Child vẫn có ý nghĩa nếu Parent bị xóa.

Ví dụ:

* Product → Category
* Post → User

---

## 3. `ON DELETE RESTRICT` / `NO ACTION`

### Khái niệm

Nếu Child còn tham chiếu Parent thì **không cho phép xóa Parent**.

Ví dụ:

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id)
        ON DELETE RESTRICT
);
```

Nếu chạy:

```sql
DELETE FROM students
WHERE id = 1;
```

Database sẽ báo lỗi nếu vẫn còn dữ liệu trong `enrollments`.

### Khi nào dùng?

Khi muốn bảo vệ dữ liệu và tránh xóa nhầm.

---

# So sánh

| ON DELETE            | Kết quả                                    |
| -------------------- | ------------------------------------------ |
| CASCADE              | Xóa Parent → Xóa luôn Child                |
| SET NULL             | Xóa Parent → FK của Child = NULL           |
| RESTRICT / NO ACTION | Không cho xóa Parent nếu Child còn tồn tại |

---

# Chọn sai có thể gây mất dữ liệu

## Ví dụ LMS

```
Course
   │
   ├── Lesson
   ├── Quiz
   └── Assignment
```

Nếu đặt:

```sql
ON DELETE CASCADE
```

Khi Admin xóa một Course thì Lesson, Quiz và Assignment cũng bị xóa theo.

Nếu đây là dữ liệu cần lưu lại thì sẽ gây mất dữ liệu nghiêm trọng.

Trong trường hợp này, nhiều hệ thống sẽ chọn `RESTRICT` để buộc người quản trị xử lý các dữ liệu liên quan trước.

---

## Ví dụ Bookstore

```
Category
   │
   └── Product
```

Nếu Product vẫn có thể tồn tại mà chưa được phân loại thì nên dùng:

```sql
ON DELETE SET NULL
```

Khi xóa Category, Product vẫn còn, chỉ mất liên kết đến Category.

---

# DDL minh họa

```sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    title TEXT,
    course_id INT REFERENCES courses(id)
        ON DELETE CASCADE
);

-- CASCADE:
-- Lesson không còn ý nghĩa nếu Course bị xóa.

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT,
    category_id INT REFERENCES categories(id)
        ON DELETE SET NULL
);

-- SET NULL:
-- Product vẫn tồn tại nếu Category bị xóa.
```

---

# Script demo

```sql
-- CASCADE

INSERT INTO courses(name)
VALUES ('NodeJS');

INSERT INTO lessons(title, course_id)
VALUES ('Intro', 1);

DELETE FROM courses
WHERE id = 1;

SELECT * FROM lessons;
-- Không còn dữ liệu


-- SET NULL

INSERT INTO categories(name)
VALUES ('Programming');

INSERT INTO products(name, category_id)
VALUES ('Clean Code', 1);

DELETE FROM categories
WHERE id = 1;

SELECT * FROM products;
-- category_id = NULL
```
