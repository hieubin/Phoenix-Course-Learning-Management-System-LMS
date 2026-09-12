Vì sao POST /posts thiếu title vẫn trả 401 nếu không gửi token?
Vì chuỗi middleware chạy theo thứ tự: authMiddleware trước validateCreatePost.
Khi không có token, authMiddleware fail ngay và trả 401, nên request không còn đi vào validateCreatePost để kiểm tra title. Nói cách khác:

POST /posts
authMiddleware chạy trước
nếu thiếu token ⇒ dừng ngay ở 401
validateCreatePost không được gọi
Đây là nguyên tắc “auth trước validate”.

Vì sao validateCreatePost không cần check authorId?
Vì authorId không đến từ body của client. Nó được gán ở controller dựa trên người dùng đã xác thực:

req.user.id là user đang login
controller gọi postsService.createPost({ title, content, authorId: req.user.id })
Nên authorId là dữ liệu server-side, không phải dữ liệu user nhập. Nếu kiểm tra ở validator thì thừa và dễ sai vì client không nên quyết định author.

P2025 xảy ra ở tầng nào khi PUT post id ảo?
P2025 là lỗi của Prisma, xảy ra ở tầng service/database access layer, không phải tầng auth hay validation.
Khi PUT /posts/:id gọi postsService.updatePost(id, ...), service thường làm prisma.post.update(...) với id không tồn tại. Prisma ném P2025, rồi errorHandler chuyển nó thành 404 Resource not found.