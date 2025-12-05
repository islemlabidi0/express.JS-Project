const express = require('express');
const router = express.Router();
const { getTasksByProject } = require('../controllers/TaskController');
const authMiddleware = require('../middlewares/auth');
const { createTask } = require('../controllers/TaskController');

router.get('/:projectID', authMiddleware, getTasksByProject);
router.post('/create', authMiddleware, createTask);
module.exports = router;