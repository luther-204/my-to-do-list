window.onload = function() {
    const input = document.getElementById("todoInput");
    const subInput = document.getElementById("subTaskInput");
    const addBtn = document.getElementById("addBtn");
    const todoList = document.getElementById("todoList");
    const clearBtn = document.getElementById("clearBtn");

    const globalVolume = 0.2; 

    function playTone(freq) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(globalVolume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) { console.log("Audio Error"); }
    }

    function createTaskElement(mainText, subText, completed) {
        const li = document.createElement("li");
        if (completed) li.classList.add("done");
        li.innerHTML = `
            <div class="task-content">
                <div class="main-task">${mainText}</div>
                ${subText ? `<div class="sub-task">${subText}</div>` : ''}
            </div>
            <button class="delete-btn"><i class="fa-solid fa-xmark"></i></button>
        `;
        li.onclick = () => { li.classList.toggle("done"); playTone(880); saveTasks(); };
        li.querySelector(".delete-btn").onclick = (e) => { 
            e.stopPropagation(); 
            playTone(440);
            li.remove(); 
            saveTasks(); 
        };
        todoList.appendChild(li);
    }

    function saveTasks() {
        const tasks = Array.from(document.querySelectorAll("#todoList li")).map(li => ({
            main: li.querySelector(".main-task").innerText,
            sub: li.querySelector(".sub-task") ? li.querySelector(".sub-task").innerText : "",
            completed: li.classList.contains("done")
        }));
        localStorage.setItem("myNeonTasksSub", JSON.stringify(tasks));
    }

    addBtn.onclick = () => {
        const mainText = input.value.trim();
        const subText = subInput.value.trim();
        if (!mainText) return;
        createTaskElement(mainText, subText, false);
        playTone(660);
        saveTasks();
        input.value = ""; subInput.value = "";
    };

    [input, subInput].forEach(el => {
        el.addEventListener("keypress", (e) => {
            if (e.key === "Enter") addBtn.click();
        });
    });

    clearBtn.onclick = () => {
        if (todoList.children.length > 0 && confirm("ล้างทั้งหมด?")) {
            playTone(220);
            todoList.innerHTML = "";
            localStorage.removeItem("myNeonTasksSub");
        }
    };

    const saved = JSON.parse(localStorage.getItem("myNeonTasksSub")) || [];
    saved.forEach(t => createTaskElement(t.main, t.sub, t.completed));
};
