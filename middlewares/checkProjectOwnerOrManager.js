const Project = require('../models/ProjectModel');

module.exports = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    // If manager → always allowed
    if (req.user.role === 'manager') {
      req.project = project;
      return next();
    }

    // USER → must be owner
    if (project.proprietaire.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied : Not your project" });
    }

    req.project = project;
    next();

  } catch (err) {
    res.status(500).json({ message: "Error checking project owner" });
  }
};
