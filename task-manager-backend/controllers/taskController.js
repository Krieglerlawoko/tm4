const Task = require('../models/Task');

// Create Task
const createTask = async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.update(req.body, { where: { id: req.params.id } });
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    await Task.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
