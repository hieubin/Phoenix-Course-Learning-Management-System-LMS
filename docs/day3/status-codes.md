# HTTP Status Codes trong thiết kế API (LMS)

| Mã | Ý nghĩa ngắn gọn | Ví dụ thực tế trong LMS |
|---|---|---|
| **200 OK** | Request thành công, server trả về dữ liệu/kết quả như mong đợi (dùng cho GET, PUT, hoặc các thao tác không tạo mới tài nguyên). | `GET /api/courses/123` — lấy chi tiết khóa học thành công, trả về thông tin khóa học. |
| **201 Created** | Request thành công **và** đã tạo ra một tài nguyên mới trên server. | `POST /api/courses` với dữ liệu hợp lệ — tạo khóa học mới thành công, trả về `201` kèm thông tin course vừa tạo (có `id` mới). |
| **400 Bad Request** | Request sai định dạng hoặc dữ liệu không hợp lệ (thiếu field bắt buộc, sai kiểu dữ liệu...) — lỗi từ phía client. | `POST /api/enrollments` nhưng thiếu `courseId` trong body, hoặc `startDate` gửi sai định dạng ngày → server trả `400` kèm thông báo field nào bị thiếu/sai. |
| **401 Unauthorized** | Client chưa xác thực (chưa đăng nhập) hoặc token không hợp lệ/hết hạn — server không biết "bạn là ai". | Gọi `GET /api/users/me` nhưng không gửi kèm `Authorization: Bearer <token>`, hoặc token đã hết hạn → trả về `401`. |
| **403 Forbidden** | Server đã biết bạn là ai (đã xác thực) nhưng bạn **không có quyền** thực hiện hành động này. | Một tài khoản **student** gọi `DELETE /api/courses/123` hoặc `POST /api/courses` để tạo khóa học — chỉ **admin/instructor** mới được phép → trả về `403`. |
| **404 Not Found** | Tài nguyên được yêu cầu không tồn tại trên server. | `GET /api/courses/999` nhưng khóa học có id `999` không tồn tại trong hệ thống → trả về `404`. |
| **500 Internal Server Error** | Lỗi phát sinh từ phía server (bug code, exception không được xử lý, mất kết nối database...) — không phải lỗi do client gửi sai. | `POST /api/enrollments` với dữ liệu hợp lệ nhưng server bị lỗi kết nối tới database khi lưu bản ghi → trả về `500`. |

---

## Ghi chú thêm

- **4xx** luôn là lỗi do **client** (request sai, thiếu quyền, thiếu xác thực...) — client cần sửa request rồi gọi lại.
- **5xx** luôn là lỗi do **server** — client không thể tự sửa được, cần backend team xử lý (xem log, fix bug).
- Phân biệt nhanh 401 vs 403:
  - **401** = "Tôi không biết bạn là ai" (chưa đăng nhập / token sai).
  - **403** = "Tôi biết bạn là ai rồi, nhưng bạn không được phép làm việc này" (đã đăng nhập nhưng thiếu quyền).