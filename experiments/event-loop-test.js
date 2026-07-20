console.log("1. Code đồng bộ - Bắt đầu");

setTimeout(() => {
    console.log("4. Macrotask - setTimeout (0ms)");
}, 0);

process.nextTick(() => {
    console.log("2. Microtask - process.nextTick");
});

Promise.resolve().then(() => {
    console.log("3 Microtask - Promise.then");
});

console.log("5. Code đồng bộ - Kết thúc");