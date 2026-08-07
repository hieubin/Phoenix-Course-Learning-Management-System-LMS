# ORM Overview

## 1. ORM là gì?

**ORM (Object Relational Mapping)** là công cụ giúp **ánh xạ (map) bảng trong Database thành Object/Class trong code**, nhờ đó lập trình viên thao tác với dữ liệu bằng JavaScript/TypeScript thay vì tự viết nhiều câu lệnh SQL.

Ví dụ:

Raw SQL

```sql
SELECT * FROM books;
```

Prisma

```ts
const books = await prisma.book.findMany();
```

Prisma sẽ tự sinh câu lệnh SQL phù hợp và gửi xuống PostgreSQL.

---

## Vì sao cần ORM?

ORM giúp:

* Giảm lượng SQL phải viết.
* Code dễ đọc và dễ bảo trì.
* Hỗ trợ kiểm tra kiểu dữ liệu (Type Safety).
* Dễ làm việc với quan hệ giữa các bảng.
* Tăng năng suất phát triển.

---

# 2. Raw SQL (`pg`) vs ORM (Prisma/TypeORM)

| Tiêu chí           | Raw SQL (`pg`)        | ORM                                    |
| ------------------ | --------------------- | -------------------------------------- |
| Cách làm việc      | Tự viết SQL           | Gọi API của ORM                        |
| Dễ học             | Cần biết SQL          | Dễ hơn với người mới                   |
| Kiểm soát truy vấn | Rất cao               | Thấp hơn                               |
| Hiệu năng          | Cao nhất              | Thấp hơn một chút do có lớp trung gian |
| CRUD               | Viết nhiều SQL        | Viết rất nhanh                         |
| Query phức tạp     | Linh hoạt hơn         | Đôi khi khó biểu diễn                  |
| Bảo trì            | Khó hơn khi dự án lớn | Dễ đọc và dễ bảo trì                   |

### Kết luận

* **Raw SQL** phù hợp khi cần tối ưu hiệu năng hoặc truy vấn phức tạp.
* **ORM** phù hợp với hầu hết dự án vì giúp phát triển nhanh và giảm lỗi.

---

# 3. Prisma sơ lược

## `schema.prisma` dùng để làm gì?

`schema.prisma` là file mô tả toàn bộ cấu trúc Database trong Prisma.

Nó khai báo:

* Database kết nối đến đâu.
* Các Model (bảng).
* Quan hệ giữa các Model.
* Cấu hình Prisma Client.

Ví dụ:

```prisma
model Book {
  id     Int    @id @default(autoincrement())
  title  String
  author String
}
```

Prisma sẽ dựa vào file này để sinh Prisma Client và tạo Migration.

---

## Migration là gì?

Migration là **lịch sử các thay đổi cấu trúc Database** được lưu bằng mã nguồn.

Ví dụ:

* Tạo bảng.
* Thêm cột.
* Xóa cột.
* Thêm Foreign Key.

Mỗi thay đổi sẽ tạo một file Migration để mọi môi trường (local, staging, production) đều cập nhật giống nhau.

---

## Vì sao không sửa bảng trực tiếp trên DBeaver/pgAdmin?

Trong dự án thực tế, nếu sửa trực tiếp trên GUI:

* Đồng đội không biết bạn đã thay đổi gì.
* Database giữa các môi trường dễ bị lệch.
* Không có lịch sử thay đổi.
* Khó rollback khi có lỗi.
* Khó triển khai lên Production.

Vì vậy, mọi thay đổi cấu trúc Database nên được thực hiện bằng **Migration**, giúp toàn bộ nhóm và các môi trường luôn đồng bộ.

---

# Tóm tắt

* **ORM** giúp làm việc với Database thông qua Object/Class thay vì viết nhiều SQL.
* **Raw SQL** cho khả năng kiểm soát và tối ưu cao hơn, **ORM** giúp phát triển nhanh và dễ bảo trì.
* **`schema.prisma`** là nơi định nghĩa cấu trúc Database và quan hệ giữa các Model.
* **Migration** giúp quản lý mọi thay đổi của Database bằng mã nguồn thay vì chỉnh sửa thủ công trên DBeaver hoặc pgAdmin.
