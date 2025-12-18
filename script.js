window.onload = function() {
    const input = document.getElementById("todoInput");
    const addBtn = document.getElementById("addBtn");
    const todoList = document.getElementById("todoList");
    const clearBtn = document.getElementById("clearBtn");

    // ดึงตัวแปรเสียงมาเก็บไว้
    const addSound = document.getElementById("addSound");
    const deleteSound = document.getElementById("deleteSound");
    const clearSound = document.getElementById("clearSound");

    addSound.volume = 0.2; // ลดระดับเสียงลง
    deleteSound.volume = 0.2; // ลดระดับเสียงลบลง
    clearSound.volume = 0.2; // ลดระดับเสียงลงทั้งหมด

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem("myNeonTasks")) || [];
        savedTasks.forEach(task => {
            createTaskElement(task.text, task.completed);
        });
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#todoList li").forEach(li => {
            tasks.push({
                text: li.querySelector("span").innerText,
                completed: li.classList.contains("done")
            });
        });
        localStorage.setItem("myNeonTasks", JSON.stringify(tasks));
    }

    function createTaskElement(text, isCompleted = false) {
        const li = document.createElement("li");
        if (isCompleted) li.classList.add("done");

        li.innerHTML = `
            <span>${text}</span>
            <button class="delete-btn"><i class="fa-solid fa-xmark"></i></button>
        `;

        li.onclick = function() {
            this.classList.toggle("done");
            addSound.currentTime = 0; // รีเซ็ตเสียงให้เริ่มใหม่ทันทีที่กด
            addSound.play(); // เล่นเสียงเบาๆ ตอนติ๊กงาน
            saveTasks();
        };

        li.querySelector(".delete-btn").onclick = function(e) {
            e.stopPropagation();
            deleteSound.currentTime = 0;
            deleteSound.play(); // เล่นเสียงตอนลบ
            li.remove();
            saveTasks();
        };

        todoList.appendChild(li);
    }

    addBtn.onclick = function() {
        if (input.value.trim() === "") {
            alert("พิมพ์อะไรสักหน่อยสิ!");
            return;
        }
        addSound.currentTime = 0;
        addSound.play(); // เล่นเสียงตอนเพิ่มรายการ
        createTaskElement(input.value.trim());
        saveTasks();
        input.value = "";
    };

    clearBtn.onclick = function() {
        if (todoList.children.length > 0) {
            if (confirm("จะล้างกระดานจริงๆ ใช่ไหม?")) {
                clearSound.play(); // เล่นเสียงตอนล้างทั้งหมด
                todoList.innerHTML = "";
                localStorage.removeItem("myNeonTasks");
            }
        }
    };

    loadTasks();
};