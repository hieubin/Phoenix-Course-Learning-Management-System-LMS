import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ============================================================
// TẠO LẠI __filename VÀ __dirname TRONG ESM
// ============================================================

// Trong ESM, __dirname và __filename không tồn tại mặc định.
// import.meta.url chứa URL của file module hiện tại.
// fileURLToPath() chuyển URL thành đường dẫn file của hệ điều hành.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ============================================================
// LẤY ĐƯỜNG DẪN ĐẾN FILE SYLLABUS
// ============================================================

const filePath = path.join(__dirname, "../../data/syllabus.json");

console.log("Đường dẫn file:", filePath);

/*
Không nên dùng:
__dirname + '/data/syllabus.json'

Vì cách nối chuỗi thủ công có thể gây vấn đề về dấu phân cách
đường dẫn giữa các hệ điều hành.

path.join() sẽ tự động xử lý dấu phân cách đường dẫn phù hợp
với hệ điều hành.
*/


// ============================================================
// LẦN 1: ĐỌC FILE ĐỒNG BỘ
// ============================================================

const dataSync = fs.readFileSync(filePath, "utf8");

console.log("Dữ liệu đọc bằng readFileSync:");
console.log(dataSync);

/*
readFileSync() là hàm đồng bộ.

Nếu API có 1000 sinh viên truy cập cùng lúc và tất cả request
đều sử dụng readFileSync(), Event Loop có thể bị block.

Các request khác phải chờ thao tác đọc file hoàn thành,
làm server phản hồi chậm và giảm hiệu năng.
*/


// ============================================================
// LẦN 2: ĐỌC FILE BẤT ĐỒNG BỘ
// ============================================================

async function readSyllabus() {
  try {
    const dataAsync = await fs.promises.readFile(filePath, "utf8");

    console.log("Dữ liệu đọc bằng fs.promises.readFile:");
    console.log(dataAsync);
  } catch (error) {
    console.error("Lỗi khi đọc file:", error.message);
  }
}

readSyllabus();