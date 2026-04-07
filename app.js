const express = require('express');
const os = require('os');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// schema
const TaskSchema = new mongoose.Schema({
  name: String,
  status: String
});

const Task = mongoose.model('Task', TaskSchema);

// route
app.get('/', (req, res) => {
  res.json({
    app: 'Lab 8',
    node: process.version,
    host: os.hostname(),
  });
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();

  const grouped = tasks.reduce((acc, task) => {
    acc[task.status] = acc[task.status] || [];
    acc[task.status].push(task);
    return acc;
  }, {});

  res.json(grouped);
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});