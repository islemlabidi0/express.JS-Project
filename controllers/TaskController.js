const Tache = require('../models/tacheModel');
const Project = require('../models/ProjectModel');

// Read all tasks of a specific project
const getTasksByProject = async (req, res) => {
  try {
    const { projectID } = req.params;

    // nchoufou ken l project mawjoud
    const project = await Project.findById(projectID);
    if (!project) {
      return res.status(404).json({ message: "Project not found with this ID" });
    }

    // MANAGER: ynjm ychouf tous les tasks mt3 tous les projets
    if (req.user.role === "manager") {
      const tasks = await Tache.find({ projetAssocie: projectID })
        .populate("utilisateurAssigné", "name")
        .populate("projetAssocie", "projectName");

      return res.json(tasks);
    }

    // PROJECT OWNER: ynjm ychouf les tasks mt3 l project mt3ou
    if (project.proprietaire.toString() === req.user.id) {
      const tasks = await Tache.find({ projetAssocie: projectID })
        .populate("utilisateurAssigné", "name")
        .populate("projetAssocie", "projectName");

      return res.json(tasks);
    }

    // NORMAL USER: ynjm ychouf les tasks mt3ou 
    const tasks = await Tache.find({
      projetAssocie: projectID,
      utilisateurAssigné: req.user.id
    })
      .populate("utilisateurAssigné", "name")
      .populate("projetAssocie", "projectName");

    if (tasks.length === 0) {
      return res.status(200).json({ message: "No tasks assigned to you in this project" });
    }

    return res.json(tasks);

  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid project ID format" });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasksByProject };
