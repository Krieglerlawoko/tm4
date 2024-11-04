const express = require('express');
const { createTask, getTasks, updateTask, deleteTask, authenticateToken } = require('../controllers/taskController');
const router = express.Router();

router.post('/', authenticateToken, createTask);
router.get('/', authenticateToken, getTasks);
router.put('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);

module.exports = router;
