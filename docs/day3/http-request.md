# HTTP Request — Cấu trúc & Cách truyền dữ liệu

## 1. Các thành phần chính của một HTTP Request

Một HTTP Request gồm 4 phần chính:

```
POST /api/courses/123/enrollments HTTP/1.1        ← Request Line
Host: lms.example.com                              ← Headers
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json
Accept: application/json

{                                                   ← Body
  "userId": "u_456",
  "courseId": "c_123"
}
```

| Thành phần | Mô tả |
|---|---|
| **Method** | Hành động muốn thực hiện: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`... |
| **URL / Path** | Địa chỉ tài nguyên, gồm domain, path, và có thể kèm query string. Ví dụ: `https://lms.example.com/api/courses?category=backend` |
| **HTTP Version** | Ví dụ `HTTP/1.1`, `HTTP/2` |
| **Headers** | Metadata của request: `Authorization`, `Content-Type`, `Accept`, `User-Agent`... |
| **Body** | Dữ liệu gửi kèm (thường dùng với `POST`, `PUT`, `PATCH`), định dạng phổ biến: JSON, form-data |

---

## 2. Phân biệt Query Params / Route Params / Request Body

### Query Parameters
- **Mục đích:** Lọc, sắp xếp, phân trang, tìm kiếm — dữ liệu **không bắt buộc** và mang tính **tùy chọn/bổ trợ**.
- **Vị trí:** Nằm sau dấu `?` trong URL, dạng `key=value`, nối nhau bằng `&`.
- **Đặc điểm:** Không định danh riêng một tài nguyên cụ thể, mà mô tả cách lọc/thao tác trên tập tài nguyên.

### Route / Path Parameters
- **Mục đích:** **Định danh chính xác** một tài nguyên cụ thể trong hệ thống phân cấp URL.
- **Vị trí:** Là một phần của path, thường đặt tên dạng `:id` hoặc `{id}` khi định nghĩa route.
- **Đặc điểm:** Luôn **bắt buộc** phải có để route match đúng endpoint.

### Request Body
- **Mục đích:** Gửi dữ liệu **có cấu trúc, dung lượng lớn** để server tạo mới hoặc cập nhật tài nguyên.
- **Vị trí:** Nằm trong phần thân (body) của request, sau headers, thường là JSON.
- **Đặc điểm:** Không xuất hiện trên URL nên phù hợp để gửi dữ liệu nhạy cảm hoặc phức tạp (object, array, file...).

---

## 3. Ví dụ cụ thể trong ngữ cảnh LMS

### Ví dụ 1 — Query Parameters: Tìm khóa học
```
GET /api/courses?keyword=react&category=frontend&page=2&limit=10
```
- Tìm các khóa học có từ khóa "react", thuộc category "frontend", lấy trang 2, mỗi trang 10 kết quả.
- Đây là các điều kiện lọc **tùy chọn**, không có thì server trả về danh sách mặc định (không filter, page 1).

### Ví dụ 2 — Route/Path Parameters: Lấy chi tiết user
```
GET /api/users/456
```
- `456` là `userId` — định danh **duy nhất** người dùng cần lấy thông tin.
- Route định nghĩa: `GET /api/users/:userId` → thiếu tham số này thì không thể xác định lấy user nào, request sẽ không match route.

### Ví dụ 3 — Request Body: Tạo enrollment (đăng ký khóa học)
```
POST /api/enrollments
Content-Type: application/json

{
  "userId": "u_456",
  "courseId": "c_123",
  "enrolledAt": "2026-08-01T10:00:00Z"
}
```
- Dữ liệu cần thiết để tạo bản ghi enrollment mới (ai đăng ký khóa học nào, thời điểm nào) được gửi trong body vì đây là dữ liệu có cấu trúc, không phù hợp nhét vào URL.

---

## Bảng so sánh tổng hợp

| Tiêu chí | Query Parameters | Route/Path Parameters | Request Body |
|---|---|---|---|
| **Mục đích** | Lọc, tìm kiếm, sắp xếp, phân trang (tùy chọn) | Định danh chính xác 1 tài nguyên cụ thể (bắt buộc) | Gửi dữ liệu tạo mới/cập nhật tài nguyên |
| **Vị trí truyền** | Sau dấu `?` trong URL (`?key=value&...`) | Là một phần của URL path (`/resource/:id`) | Trong phần thân (body) của HTTP request |
| **Ví dụ LMS** | `GET /api/courses?category=backend&page=1` — tìm khóa học | `GET /api/users/456` — lấy chi tiết user có id 456 | `POST /api/enrollments` với body `{ "userId": "u_456", "courseId": "c_123" }` — tạo enrollment |
| **Method thường dùng** | `GET` | `GET`, `PUT`, `PATCH`, `DELETE` | `POST`, `PUT`, `PATCH` |
| **Bắt buộc?** | Thường không bắt buộc | Bắt buộc để match route | Bắt buộc với các thao tác tạo/sửa dữ liệu |