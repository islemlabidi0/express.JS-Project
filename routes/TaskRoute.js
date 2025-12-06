const express = require('express');
const router = express.Router();
const { getTasksByProject } = require('../controllers/TaskController');
const authMiddleware = require('../middlewares/auth');
const { createTask } = require('../controllers/TaskController');
const { UpdateTask } = require('../controllers/TaskController');
const { deleteTask } = require('../controllers/TaskController');
const { GetTaskById } = require('../controllers/TaskController');

router.get('/:projectID', authMiddleware, getTasksByProject);
router.post('/create', authMiddleware, createTask);
router.put('/update/:id', authMiddleware, UpdateTask);
router.delete('/delete/:id', authMiddleware, deleteTask);
router.get('/task/:id', authMiddleware, GetTaskById);
module.exports = router;