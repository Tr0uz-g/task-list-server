const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());


app.use((req, res, next) => {
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  if (!validMethods.includes(req.method)) {
    res.status(400).json({ message: 'Método HTTP no válido' });
  } else {
    next();
  }
});

app.use('/tasks', (req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') && Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'Cuerpo de la solicitud vacío' });
  } else if (req.method === 'POST' && (!req.body.title || req.body.completed === undefined)) {
    res.status(400).json({ message: 'Información no válida o atributos faltantes para crear tareas' });
  } else if (req.method === 'PUT' && (!req.body.title || req.body.completed === undefined)) {
    res.status(400).json({ message: 'Información no válida o atributos faltantes para actualizar tareas' });
  } else {
    next();
  }
});


const tasksRouter = express.Router();

tasksRouter.get('/', (req, res) => {
  res.json(tasks);
});

tasksRouter.post('/', (req, res) => {
  const newTask = req.body;
  tasks.push(newTask);
  res.status(201).json(newTask);
});

tasksRouter.get('/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

tasksRouter.put('/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedTask = req.body;
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

tasksRouter.delete('/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Tarea no encontrada' });
  }
});

app.use('/tasks', tasksRouter);

app.use('/tasks/:id', (req, res, next) => {
  if (isNaN(parseInt(req.params.id))) {
    res.status(400).json({ message: 'Parámetro ID no válido' });
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
