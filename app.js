const API_URL = "http://120.46.23.151:3000/students"; // 后端 API 地址

// DOM 元素
const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("searchButton");
// 初始化页面
document.addEventListener("DOMContentLoaded", fetchStudents);

// 获取所有学生信息
async function fetchStudents() {
  try {
    const response = await fetch(API_URL);
    const students = await response.json();
    renderStudentTable(students);
  } catch (error) {
    console.error("获取学生信息失败:", error);
  }
}

function renderStudentTable(students) {
    studentTable.innerHTML = "";

    students.sort((a, b) => a.id - b.id);
  
    students.forEach((student) => {
      const row = document.createElement("tr");
      row.setAttribute('data-id', student.id); // 添加 data-id 用于定位行
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.age}</td>
        <td>${student.gender}</td>
        <td>${student.major}</td>
        <td>
          <button onclick="editStudent(${student.id})">编辑</button>
          <button onclick="deleteStudent(${student.id})">删除</button>
        </td>
      `;
      studentTable.appendChild(row);
    });
  }
  

// 根据学生 ID 或姓名查找学生
searchButton.addEventListener("click", async () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm === "") return;
    try {
      const response = await fetch(API_URL);
      const students = await response.json();
      const student = students.find(s => 
        s.id.toString() === searchTerm || s.name.toLowerCase() === searchTerm
      );    
      if (student) {
        editStudent(student.id);  
        const rows = studentTable.querySelectorAll('tr');
        rows.forEach(row => {
          if (row.getAttribute('data-id') === student.id.toString()) {
            row.style.backgroundColor = "#f0f0f0"; 
            setTimeout(() => row.style.backgroundColor = "", 2000); 
          }
        });
      } else {
        alert("没有找到匹配的学生！");
      }
    } catch (error) {
      console.error("查找学生失败:", error);
    }
  });

// 添加或更新学生信息
studentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = document.getElementById("studentId").value;
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const major = document.getElementById("major").value;

  const student = { name, age, gender, major };

  try {
    if (id) {
      // 更新学生信息
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
    } else {
      // 添加学生信息
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
    }
    fetchStudents();
    studentForm.reset();
    document.getElementById("saveButton").innerText = "添加";
  } catch (error) {
    console.error("保存学生信息失败:", error);
  }
});

// 编辑学生信息
async function editStudent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const student = await response.json();
    document.getElementById("studentId").value = student.id;
    document.getElementById("name").value = student.name;
    document.getElementById("age").value = student.age;
    document.getElementById("gender").value = student.gender;
    document.getElementById("major").value = student.major;
    document.getElementById("saveButton").innerText = "保存编辑";
  } catch (error) {
    console.error("编辑学生信息失败:", error);
  }
}

// 删除学生信息
async function deleteStudent(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchStudents();
  } catch (error) {
    console.error("删除学生信息失败:", error);
  }
}