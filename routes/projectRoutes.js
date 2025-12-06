const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const validateProject = require('../middlewares/validateProject');
const checkProjectOwnerOrManager = require('../middlewares/checkProjectOwnerOrManager');
const validateUpdateProject = require('../middlewares/validateUpdateProject');

const projectCtrl = require('../controllers/ProjectController');

// Create project
router.post('/', auth, validateProject, projectCtrl.createProject);

// Get projects 
router.get('/', auth, projectCtrl.getProjects);

// Search projects
router.get('/search', auth, projectCtrl.searchProjects);

// Get a single project
router.get('/:id', auth, checkProjectOwnerOrManager,projectCtrl.getProjectById);


// Update project
router.put('/:id', auth, checkProjectOwnerOrManager, validateUpdateProject, projectCtrl.updateProject);


// Delete project
router.delete('/:id', auth, checkProjectOwnerOrManager, projectCtrl.deleteProject);

module.exports = router;
