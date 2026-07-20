console.log("Tác vụ nặng bắt đầu...");

const start = Date.now();

//giả lập tác vụ nặng chạy khoảng 4 giây
while (Date.now() - start < 4000) {
    Math.sqrt(Math.random() * 1000000);
}

console.log("Tác vụ nặng kết thúc!");
console.log("Dòng code tiếp theo");
