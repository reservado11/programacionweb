const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Datos de prueba en memoria
let tasks = [
  { id: 1, title: 'Tarea inicial', description: 'Ejemplo', status: 'todo' }
];

// Endpoint base
app.get('/', (req, res) => {
  res.send('✅ API de Gestión de Tareas funcionando correctamente');
});

// GET /tasks - listar todas las tareas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST /tasks - crear nueva tarea
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'title y description son requeridos' });
  }
  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    status: 'todo'
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id - actualizar tarea
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === parseInt(id));
  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  const { title, description, status } = req.body;
  task.title = title || task.title;
  task.description = description || task.description;
  task.status = status || task.status;

  res.json(task);
});

// DELETE /tasks/:id - eliminar tarea
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  tasks.splice(index, 1);
  res.json({ message: 'Tarea eliminada correctamente' });
});

// Servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
