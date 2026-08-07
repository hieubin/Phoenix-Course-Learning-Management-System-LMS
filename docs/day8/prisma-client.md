# Prisma Client

## 1. Prisma Client là gì?

Prisma Client là thư viện giúp Node.js làm việc với Database thông qua JavaScript/TypeScript.

Trong project, Prisma Client được tạo một lần và dùng lại:

```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

---

## 2. Mapping API ↔ Prisma Client

| Hành động | API | Prisma Client |
|---|---|---|
| Create | `POST /authors` | `prisma.author.create()` |
| Find Many | `GET /authors` | `prisma.author.findMany()` |
| Find Unique | `GET /authors/:id` | `prisma.author.findUnique()` |
| Update | `PUT /authors/:id` | `prisma.author.update()` |
| Delete | `DELETE /authors/:id` | `prisma.author.delete()` |

---

## 3. Create

```js
const author = await prisma.author.create({
  data: {
    name: "Hieu",
    email: "hieu@example.com",
  },
});
```

Tạo một Author mới trong Database.

---

## 4. Find Many

```js
const authors = await prisma.author.findMany();
```

Lấy danh sách tất cả Author.

---

## 5. Find Unique

```js
const author = await prisma.author.findUnique({
  where: {
    id: 1,
  },
});
```

Tìm một Author theo `id`.

---

## 6. Update

```js
const author = await prisma.author.update({
  where: {
    id: 1,
  },
  data: {
    name: "Nguyen Duc Hieu",
  },
});
```

Cập nhật Author có `id = 1`.

---

## 7. Delete

```js
await prisma.author.delete({
  where: {
    id: 1,
  },
});
```

Xóa Author có `id = 1`.

---

## 8. Eager Loading với `include`

Author có quan hệ với Book:

```text
Author 1 ─────── * Book
```

Để lấy Author và danh sách Book liên quan:

```js
const author = await prisma.author.findUnique({
  where: {
    id: 1,
  },
  include: {
    books: true,
  },
});
```

`include` giúp Prisma lấy thêm dữ liệu từ relation.

API:

```text
GET /authors/1
```

Có thể trả về:

```json
{
  "id": 1,
  "name": "Hieu",
  "email": "hieu@example.com",
  "books": [
    {
      "id": 1,
      "title": "Node.js Core",
      "price": 199.99
    }
  ]
}
```

Như vậy `GET /authors/:id` vừa lấy Author vừa lấy các Book liên quan.