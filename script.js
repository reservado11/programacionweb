const API = "http://localhost:3000/tasks";
const columns = {
  todo: document.querySelector("#todo ul"),
  doing: document.querySelector("#doing ul"),
  done: document.querySelector("#done ul"),
};

async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();

  for (const col in columns) columns[col].innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${task.title}</strong><br>${task.description}<br>
      <small>${task.status}</small><br>
      <button onclick="changeStatus('${task.id}', 'todo')">Todo</button>
      <button onclick="changeStatus('${task.id}', 'doing')">Doing</button>
      <button onclick="changeStatus('${task.id}', 'done')">Done</button>
      <button onclick="deleteTask('${task.id}')">🗑</button>
    `;
    columns[task.status].appendChild(li);
  });
}

async function addTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadTasks();
}

async function changeStatus(id, status) {
  await fetch(`${API}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  loadTasks();
}

document.getElementById("addBtn").addEventListener("click", addTask);
loadTasks();
