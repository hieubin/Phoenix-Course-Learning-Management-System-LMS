-- =========================================
-- CREATE - Thêm 1 cuốn sách
-- =========================================

INSERT INTO books (title, author, price)
VALUES ('Node.js Core', 'Nguyen Duc Hieu', 199.99);


-- =========================================
-- READ - Lấy toàn bộ sách
-- =========================================

SELECT *
FROM books;


-- =========================================
-- READ - Tìm sách theo ID
-- =========================================

SELECT *
FROM books
WHERE id = 1;


-- =========================================
-- UPDATE - Cập nhật price
-- =========================================

UPDATE books
SET price = 249.99
WHERE id = 1;


-- =========================================
-- DELETE - Xóa 1 cuốn sách
-- =========================================

DELETE FROM books
WHERE id = 1;