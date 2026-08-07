# Prisma Init

## 1. Cài đặt Prisma

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

---

## 2. Sau `npx prisma init` có những gì?

```
project/
│
├── prisma/
│   └── schema.prisma
│
├── .env
│
├── package.json
│
└── node_modules/
```

---

## Vai trò của từng file

### `prisma/`

Thư mục chứa toàn bộ file liên quan đến Prisma.

---

### `prisma/schema.prisma`

Đây là file quan trọng nhất của Prisma.

Dùng để khai báo:

- Database Provider (PostgreSQL, MySQL...)
- Chuỗi kết nối Database
- Các Model (bảng)
- Quan hệ giữa các Model
- Prisma Client

Ví dụ:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

### `.env`

Chứa các biến môi trường.

Quan trọng nhất là:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/lms_day8"
```

Prisma sẽ đọc biến `DATABASE_URL` để kết nối đến PostgreSQL.

> Không commit file `.env` lên Git vì chứa username và password. Mặc định `.env` đã được thêm vào `.gitignore`.

---

### `package.json`

Sau khi cài Prisma sẽ có thêm:

- `prisma`: Prisma CLI.
- `@prisma/client`: Thư viện để ứng dụng Node.js giao tiếp với Database.

---

## Tóm tắt

| Thành phần | Vai trò |
|------------|----------|
| prisma/ | Chứa file cấu hình Prisma |
| schema.prisma | Khai báo Model, Relationship và Database |
| .env | Lưu DATABASE_URL |
| prisma | CLI tạo Migration, Generate Client |
| @prisma/client | Thư viện thao tác Database |