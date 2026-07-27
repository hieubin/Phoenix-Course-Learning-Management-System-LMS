// ============================================================
// LẦN 1: CALLBACK - CALLBACK HELL
// ============================================================

function getUser(callback) {
  setTimeout(() => {
    // Giả lập lấy thông tin User từ Database
    const user = {
      id: 1,
      name: "Hieu Nguyen Duc",
    };

    callback(null, user);
  }, 1000);
}

function getCourses(userId, callback) {
  setTimeout(() => {
    // Giả lập lấy danh sách khóa học của User từ Database
    const courses = [
      { id: 101, name: "Node.js Core" },
      { id: 102, name: "JavaScript" },
    ];

    callback(null, courses);
  }, 1000);
}

function getGrades(userId, callback) {
  setTimeout(() => {
    // Giả lập lấy điểm của User từ Database
    const grades = [
      { courseId: 101, grade: 9 },
      { courseId: 102, grade: 8 },
    ];

    callback(null, grades);
  }, 1000);
}

// Gọi 3 hàm lồng nhau bằng Callback
getUser((error, user) => {
  if (error) {
    console.error("Lỗi khi lấy User:", error);
    return;
  }

  console.log("User:", user);

  getCourses(user.id, (error, courses) => {
    if (error) {
      console.error("Lỗi khi lấy Courses:", error);
      return;
    }

    console.log("Courses:", courses);

    getGrades(user.id, (error, grades) => {
      if (error) {
        console.error("Lỗi khi lấy Grades:", error);
        return;
      }

      console.log("Grades:", grades);
    });
  });
});

/*
Callback Hell:
Các callback bị lồng vào nhau nhiều tầng để đảm bảo tác vụ
sau chỉ chạy khi tác vụ trước hoàn thành.

Khi số lượng tác vụ tăng lên, code sẽ bị thụt lề sâu,
khó đọc, khó debug và khó maintain (bảo trì).
*/


// ============================================================
// LẦN 2: PROMISE
// ============================================================

function getUserPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = {
        id: 1,
        name: "Hieu Nguyen Duc",
      };

      resolve(user);
    }, 1000);
  });
}

function getCoursesPromise(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const courses = [
        { id: 101, name: "Node.js Core" },
        { id: 102, name: "JavaScript" },
      ];

      resolve(courses);
    }, 1000);
  });
}

function getGradesPromise(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const grades = [
        { courseId: 101, grade: 9 },
        { courseId: 102, grade: 8 },
      ];

      resolve(grades);
    }, 1000);
  });
}


// ============================================================
// LẦN 3: ASYNC/AWAIT + TRY/CATCH
// ============================================================

async function loadLMSData() {
  try {
    // Gọi getUser() và chờ kết quả
    const user = await getUserPromise();
    console.log("User:", user);

    // Sau khi có User mới lấy Courses
    const courses = await getCoursesPromise(user.id);
    console.log("Courses:", courses);

    // Sau khi có Courses mới lấy Grades
    const grades = await getGradesPromise(user.id);
    console.log("Grades:", grades);

  } catch (error) {
    // Bắt lỗi nếu một trong các Promise bị reject
    console.error("Đã xảy ra lỗi:", error.message);
  }
}

// Chạy chương trình
loadLMSData();