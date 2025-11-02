// index.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../'));

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de gestión de tareas" });
});

// Base de datos en memoria (temporal)
let tasks = [];
let nextId = 1;

// ✅ Obtener todas las tareas (con filtro opcional)
app.get("/tasks", (req, res) => {
  const { status } = req.query;
  if (status) {
    const filtered = tasks.filter((t) => t.status === status);
    return res.json(filtered);
  }
  res.json(tasks);
});

// ✅ Obtener una tarea por ID
app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
});

// ✅ Crear nueva tarea
app.post("/tasks", (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  const newTask = { id: nextId++, title, description, status: "todo" };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// ✅ Actualizar tarea completa (PUT)
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, status } = req.body;
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) return res.status(404).json({ error: "Task not found" });

  tasks[index] = { id, title, description, status };
  res.json(tasks[index]);
});

// ✅ Cambiar solo el estado (PATCH)
app.patch("/tasks/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const task = tasks.find((t) => t.id === id);

  if (!task) return res.status(404).json({ error: "Task not found" });

  const validStatus = ["todo", "doing", "done"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  task.status = status;
  res.json(task);
});

// ✅ Eliminar tarea
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) return res.status(404).json({ error: "Task not found" });

  tasks.splice(index, 1);
  res.json({ message: "Task deleted successfully" });
});

// ✅ Resumen de tareas
app.get("/tasks/summary", (req, res) => {
  const summary = { todo: 0, doing: 0, done: 0 };
  tasks.forEach((t) => summary[t.status]++);
  res.json(summary);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
