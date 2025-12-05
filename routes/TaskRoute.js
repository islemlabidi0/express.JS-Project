const express = require('express');
const router = express.Router();
const { getTasksByProject } = require('../controllers/TaskController');
const authMiddleware = require('../middlewares/auth');

router.get('/:projectID', authMiddleware, getTasksByProject);

module.exports = router;