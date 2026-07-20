console.log("Bắt đầu gọi API...");

//giả lập gọi API mất 3 giây
setTimeout(() => {
    console.log("Nhận kết quả API thành công!");
}, 3000);

console.log("Dòng code tiếp theo vẫn chạy bình thường mà không bị block!");
