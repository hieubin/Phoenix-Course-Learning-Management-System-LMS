# Prisma Migrations

## 1. `prisma migrate dev` làm gì?

Lệnh:

```bash
npx prisma migrate dev --name init_relations
```

dùng trong môi trường development để đồng bộ `schema.prisma` với PostgreSQL.

Quy trình:

```text
schema.prisma
      ↓
Prisma phát hiện thay đổi
      ↓
Tạo migration SQL
      ↓
prisma/migrations/
      ↓
Chạy SQL lên PostgreSQL
```

Migration giúp Database có cấu trúc giống với `schema.prisma`.

---

## 2. Migration được tạo ở đâu?

Sau khi chạy lệnh, Prisma tạo thư mục:

```text
prisma/
├── schema.prisma
└── migrations/
    └── <timestamp>_init_relations/
        └── migration.sql
```

Ví dụ:

```text
prisma/migrations/
└── 20260807120000_init_relations/
    └── migration.sql
```

File `migration.sql` chứa các câu SQL dùng để thay đổi Database.

Ví dụ:

```sql
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
```

Migration phải được commit vào Git.

---

## 3. `migrate dev` và `migrate deploy`

### Development

Dùng:

```bash
npx prisma migrate dev
```

Mục đích:

- Phát triển local.
- Phát hiện thay đổi trong `schema.prisma`.
- Tạo migration mới.
- Chạy migration vào Database development.
- Có thể dùng Prisma để kiểm tra và cập nhật schema.

### Production

Dùng:

```bash
npx prisma migrate deploy
```

Mục đích:

- Chạy các migration đã tồn tại lên production.
- Không tự tạo migration mới từ schema.
- Không dùng workflow development để thay đổi Database production.

### Khác biệt cốt lõi

```text
Development:

schema.prisma
      ↓
migrate dev
      ↓
Tạo migration + chạy migration
```

```text
Production:

migration.sql đã được review/commit
      ↓
migrate deploy
      ↓
Chạy migration lên PostgreSQL
```

Vì vậy:

```text
migrate dev    → tạo và áp dụng migration
migrate deploy → chỉ áp dụng migration đã có
```

---

## 4. Quy trình thêm cột mới

Ví dụ cần thêm `phone` vào model `User`.

### Bước 1: Sửa `schema.prisma`

Ví dụ:

```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  phone String?
}
```

### Bước 2: Tạo migration

Chạy:

```bash
npx prisma migrate dev --name add_user_phone
```

Prisma sẽ tạo:

```text
prisma/migrations/
└── <timestamp>_add_user_phone/
    └── migration.sql
```

Migration có thể chứa:

```sql
ALTER TABLE "User"
ADD COLUMN "phone" TEXT;
```

### Bước 3: Kiểm tra

Kiểm tra Database để đảm bảo cột `phone` đã được thêm.

---

## 5. Không ALTER TABLE thủ công rồi quên cập nhật schema

Không nên làm:

```text
pgAdmin / DBeaver
       ↓
ALTER TABLE User ...
       ↓
Database thay đổi
       ↓
schema.prisma không thay đổi
```

Khi đó Database và Prisma schema có thể bị lệch nhau.

Quy trình đúng:

```text
Sửa schema.prisma
       ↓
prisma migrate dev
       ↓
Tạo migration.sql
       ↓
Chạy migration
       ↓
Commit schema + migration
```

---

## 6. Source of Truth

Trong project, cần commit cả:

```text
prisma/
├── schema.prisma
└── migrations/
    └── .../
        └── migration.sql
```

Không commit password hoặc secret trong `.env`.

Migration SQL là lịch sử thay đổi cấu trúc Database và cần được lưu trong Git để các môi trường khác có thể áp dụng cùng một thay đổi.

---

## 7. Quy trình chuẩn

```text
Developer sửa schema.prisma
          ↓
migrate dev --name <meaningful_name>
          ↓
Prisma tạo migration
          ↓
migration.sql
          ↓
Review
          ↓
git commit
          ↓
Production
          ↓
migrate deploy
```

Ví dụ:

```bash
npx prisma migrate dev --name add_user_phone
```

Sau khi code được deploy:

```bash
npx prisma migrate deploy
```