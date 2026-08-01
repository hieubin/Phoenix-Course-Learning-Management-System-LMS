# HTTP Methods: GET, POST, PUT, DELETE & Idempotency

## 1. Mục đích của từng method trong thiết kế API

| Method | Mục đích |
|---|---|
| **GET** | Đọc/lấy dữ liệu về một tài nguyên hoặc danh sách tài nguyên. Không được phép làm thay đổi state ở server. |
| **POST** | Tạo mới một tài nguyên, hoặc thực hiện một hành động không map trực tiếp vào CRUD (ví dụ: submit assignment, trigger một job). Mỗi lần gọi thường tạo ra một bản ghi/kết quả mới. |
| **PUT** | Cập nhật (thay thế toàn bộ) một tài nguyên đã biết địa chỉ (đã có id), hoặc tạo tài nguyên đó nếu chưa tồn tại tại đúng vị trí đó. |
| **DELETE** | Xóa một tài nguyên cụ thể khỏi hệ thống. |

Nói ngắn gọn: **GET = đọc, POST = tạo mới (không xác định trước id), PUT = ghi đè toàn bộ vào một vị trí đã xác định, DELETE = xóa**.

---

## 2. Idempotent là gì? (giải thích theo cách hiểu của mình)

Idempotent nghĩa là: **gọi hành động đó 1 lần hay gọi 100 lần liên tiếp, thì kết quả cuối cùng ở server vẫn giống hệt như chỉ gọi 1 lần** (state không bị "cộng dồn" hay thay đổi thêm sau lần gọi đầu tiên).

Ví dụ đời thường: nhấn nút "tắt đèn" — dù bấm 1 lần hay bấm liên tục 10 lần, đèn vẫn ở trạng thái "tắt", không có gì khác biệt. Ngược lại, "rót thêm 1 cốc nước vào bình" mà làm 10 lần thì bình sẽ có 10 cốc nước — đây **không** phải hành động idempotent.

Áp vào API: nếu gọi cùng một request nhiều lần mà **state cuối cùng trên server không đổi khác** so với chỉ gọi 1 lần, thì request đó idempotent.

---

## 3. Vì sao GET, PUT idempotent còn POST thì không

- **GET là idempotent** vì nó chỉ đọc dữ liệu, không ghi/sửa gì cả. Gọi `GET /courses/123` một lần hay 100 lần thì dữ liệu khóa học `123` ở server vẫn y nguyên, không bị ảnh hưởng.

- **PUT là idempotent** vì nó **thay thế toàn bộ** tài nguyên tại một vị trí (id) đã xác định bằng một bộ dữ liệu cụ thể. Gọi `PUT /courses/123` với cùng một body 1 lần hay nhiều lần, kết quả cuối cùng là khóa học `123` luôn có đúng nội dung được gửi trong body đó — lần gọi thứ 2, thứ 3 không tạo ra thay đổi gì thêm so với lần gọi đầu.

- **POST không idempotent** vì mục đích của nó thường là **tạo mới** một tài nguyên mà server tự sinh ra id/danh tính riêng. Mỗi lần gọi `POST /courses` với cùng body sẽ tạo ra **một bản ghi mới khác** (id khác), nên gọi 3 lần sẽ có 3 khóa học được tạo ra thay vì 1 — state thay đổi tăng dần theo số lần gọi.

---

## 4. Ví dụ minh họa với API LMS

### GET /courses
```
GET /api/courses
```
- Lấy danh sách khóa học hiện có.
- Gọi 1 lần hay 10 lần: **danh sách khóa học không đổi**, không có tác dụng phụ nào lên server. → Idempotent (và an toàn - "safe").

### POST /courses
```
POST /api/courses
Content-Type: application/json

{ "title": "React Fundamentals", "instructorId": "t_01" }
```
- Tạo một khóa học mới.
- Gọi lần 1 → tạo khóa học id `c_001`.
- Gọi lại **y hệt** request này lần 2 → tạo thêm khóa học **mới** id `c_002` với cùng nội dung.
- Gọi 3 lần → có **3 khóa học khác nhau** trong hệ thống, dù nội dung giống nhau. → **Không idempotent**, vì state (số lượng bản ghi) tăng dần theo số lần gọi.

### PUT /courses/:id
```
PUT /api/courses/c_001
Content-Type: application/json

{ "title": "React Fundamentals - Updated", "instructorId": "t_01" }
```
- Cập nhật (ghi đè toàn bộ) khóa học `c_001` bằng nội dung mới.
- Gọi lần 1 → khóa học `c_001` có title "React Fundamentals - Updated".
- Gọi lại y hệt lần 2, lần 3... → khóa học `c_001` vẫn có đúng nội dung đó, **không có gì thay đổi thêm** so với sau lần gọi đầu tiên. → **Idempotent**.

### DELETE /courses/:id
```
DELETE /api/courses/c_001
```
- Xóa khóa học `c_001`.
- Gọi lần 1 → khóa học `c_001` bị xóa (thường trả về `200`/`204`).
- Gọi lại lần 2 → khóa học đó đã không còn tồn tại, server có thể trả `404`, nhưng **state cuối cùng vẫn là: khóa học `c_001` không tồn tại** — giống hệt kết quả sau lần gọi đầu. → **Idempotent** (dù response code có thể khác nhau giữa các lần gọi, nhưng effect/state trên server là như nhau).

---

## Tổng kết nhanh

| Method | Tác dụng | Idempotent? | Ví dụ LMS |
|---|---|---|---|
| GET | Đọc dữ liệu | ✅ Có | `GET /courses` |
| POST | Tạo mới | ❌ Không | `POST /courses` |
| PUT | Cập nhật/ghi đè toàn bộ | ✅ Có | `PUT /courses/:id` |
| DELETE | Xóa | ✅ Có | `DELETE /courses/:id` |