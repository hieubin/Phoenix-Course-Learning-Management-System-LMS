# PostgreSQL Setup

## 1. Database

Database sử dụng cho bài Day 6:

```text
Database: lms_day6
```

PostgreSQL được chạy local.

Thông tin kết nối:

```text
Host: localhost
Port: 5432
Database: lms_day6
User: postgres
```

Password thật **không được commit vào Git**.

---

## 2. GUI

Sử dụng pgAdmin để kết nối PostgreSQL.

Thông tin:

| Thành phần | Giá trị |
|---|---|
| Host | localhost |
| Port | 5432 |
| Database | lms_day6 |
| User | postgres |
| Password | Không commit vào Git |

---

## 3. Environment Variables

Tạo file `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lms_day6
DB_USER=postgres
DB_PASSWORD=your_password_here
```

`your_password_here` chỉ là placeholder.

Password thật chỉ được lưu trong file `.env`.

File `.env` phải được thêm vào `.gitignore`.

---

## 4. Kết nối bằng pgAdmin

Trong pgAdmin:

```text
Servers
└── PostgreSQL 18
    └── Databases
        └── lms_day6
```

Database `lms_day6` được sử dụng để thực hành PostgreSQL và CRUD.

---

## 5. Kiểm tra kết nối

Sau khi mở Query Tool của database `lms_day6`, chạy:

```sql
SELECT current_database();
```

Kết quả mong muốn:

```text
lms_day6
```

Có thể kiểm tra PostgreSQL version:

```sql
SELECT version();
```

Nếu query chạy thành công thì kết nối Database hoạt động bình thường.