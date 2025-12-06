const Project = require('../models/ProjectModel');

// Create project lel user or el  manager
const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      projectName: req.body.projectName,
      description: req.body.description,
      statut: req.body.statut || 'en cours',
      //betbiaa yekhou id el san3ou(eli howa el user el 3amal login)
      proprietaire: req.user._id
    });

   res.status(201).json({
      message: "Project created successfully",
      project: project
    });

  } catch (err) {
    res.status(500).json({ message: "Error creating project", error: err });
  }
};

// Get all projects (with sorting)
const getProjects = async (req, res) => {
  try {
    let filter = {};
    let sort = {};

    // Sort option
    if (req.query.sort) {
      sort[req.query.sort] = 1;   // ASC by default
    }

    // Manager → all projects
    if (req.user.role === 'manager') {
      filter = {};
    } 
    // User → only his projects
    else {
      filter = { proprietaire: req.user._id };
    }

    const projects = await Project.find(filter)
      .populate('proprietaire', 'name login')
      .sort(sort);

    res.json(projects);

  } catch (err) {
    res.status(500).json({ message: "Error retrieving projects" });
  }
};

// 🔍 Search projects by name
const searchProjects = async (req, res) => {
  try {
    const name = req.query.name;

    if (!name) return res.status(400).json({ message: "Search term 'name' is required" });

    const filter = {
      projectName: { $regex: name, $options: 'i' } // case-insensitive
    };

    // User restriction
    if (req.user.role !== 'manager') {
      filter.proprietaire = req.user._id;
    }

    const projects = await Project.find(filter)
      .populate('proprietaire', 'name login');

    res.status(200).json({
      message: "Search results",
      results: projects
    });

  } catch (err) {
    res.status(500).json({ message: "Error searching projects", error: err.message });
  }
};

// get project eli heya :  voir projet par id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('proprietaire', 'name login');

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // houni ncheckiw el permissions itha manager bebitou ynajem ychouf el projeyet el kol w itha user ynajem ychouf leproject itha howa eli 3amlou
    if (req.user.role !== 'manager' && project.proprietaire._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied: Not your project" });
    }

    res.status(200).json({
      message: "Project retrieved successfully",
      project
    });

  } catch (err) {
    res.status(500).json({ message: "Error retrieving project", error: err.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const project = req.project; // injecté par checkProjectOwnerOrManager

    const { projectName, description, statut, proprietaire } = req.body;

    if (projectName) project.projectName = projectName;
    if (description) project.description = description;
    if (statut) project.statut = statut;

    // Seul le manager peut changer le propriétaire
    if (req.user.role === 'manager' && proprietaire) {
      project.proprietaire = proprietaire;
    }

    await project.save();
    res.status(200).json({
  message: "Project updated successfully",
  project
});


  } catch (err) {
    res.status(500).json({ message: "Error updating project", error: err.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting project" });
  }
};

module.exports = {
  createProject,
  getProjects,
  searchProjects,
  getProjectById,
  updateProject,
  deleteProject
  
};
