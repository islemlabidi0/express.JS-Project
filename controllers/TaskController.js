const Tache = require('../models/tacheModel');
const Project = require('../models/ProjectModel');
const User = require('../models/UserModel');

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
        .select("titre statut")
        .populate("utilisateurAssigné", "name")
        .populate("projetAssocie", "projectName");

      return res.json(tasks);
    }

    // PROJECT OWNER: ynjm ychouf les tasks mt3 l project mt3ou
    if (project.proprietaire.toString() === req.user.id) {
      const tasks = await Tache.find({ projetAssocie: projectID })
        .select("titre statut")
        .populate("utilisateurAssigné", "name")
        .populate("projetAssocie", "projectName");

      return res.json(tasks);
    }

    // NORMAL USER: ynjm ychouf les tasks mt3ou 
    const tasks = await Tache.find({
      projetAssocie: projectID,
      utilisateurAssigné: req.user.id
    })
        .select("titre statut")
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
//create task 
const createTask = async(req,res) => {
    try{
        const{titre, description , deadline , projetAssocie , utilisateurAssigné} = req.body;

        //netakdou eli fields lkol mawjoudin 
        if (!titre || !description || !deadline || !projetAssocie ){
            return res.status(400).json({message: "Missing required fields"});
        }

        //netakdou ken l project mawjoud fl BD 
        const project = await Project.findById(projetAssocie);
        if(!project){
            return res.status(404).json({message: "Project not found"});
        }
        // manager ekhw ynjm yaffecti task l user
        let UserAssigne = null;
        if (req.user.role === "manager") {
            // Manager lezm y7ot useer assigné
            if (!utilisateurAssigné) {
                return res.status(400).json({ message: "Manager must assign a user to the task" });
            }
            // nchoufou ken l user assigné mawjoud fl DB
            UserAssigne = await User.findById(utilisateurAssigné);
            if (!UserAssigne) {
                return res.status(404).json({ message: "Assigned user not found" });
            }
        } else {
            // Non-manager: lezm user assigné mouch mawjouda
            if (utilisateurAssigné) {
                return res.status(403).json({ message: "Only a manager can assign a user to a task" });
            }
        }
        //deadline validation : lezm ykoun >=today
        const today = new Date();
        const deadlineDate = new Date(deadline);

        if(isNaN(deadlineDate.getTime())){
            return res.status(400).json({message: "Invalid deadline format"});
        }
        if(deadlineDate < today){
            return res.status(400).json({message: "Deadline cannot be in the past"});
        }
        // Check permissions
        // Manager can create tasks for any project
        // Project owner can create tasks ONLY in his project
        if (req.user.role !== "manager" && project.proprietaire.toString() !== req.user.id) {
        return res.status(403).json({
            message: "Access denied: Only managers or project owners can create tasks"
        });
        }

        // netaakdou ken task déjà mawjouda f nafes l project 
        const existingTask = await Tache.findOne({
            titre: titre,
            projetAssocie: projetAssocie
        });

        if (existingTask) {
            return res.status(400).json({ message: "A task with this title already exists in this project" });
        }

        // Create the task
        const newTask = await Tache.create({
        titre,
        description,
        deadline: deadlineDate,
        projetAssocie,
        utilisateurAssigné: UserAssigne ? UserAssigne._id : null
        });

        res.status(201).json({
        message: "Task created successfully",
        task: newTask
        });

    } catch (error) {
        if (error.kind === "ObjectId") {
        return res.status(400).json({ message: "Invalid ID format" });
        }
        res.status(500).json({ message: error.message });
    }
}

//update task 
const UpdateTask = async (req,res) => {
    try{
        const { id} = req.params;
        const {statut, deadline, utilisateurAssigné} = req.body;

        //nlawjou 3al task fl BD 
        const task = await Tache.findById(id);
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        const project = await Project.findById(task.projetAssocie);
        //ken l manager , user eli 3ml l project w user assigné ynjmou yupdatiw
        if(req.user.role !== "manager" && project.proprietaire.toString() !== req.user.id &&
        (!task.utilisateurAssigné || task.utilisateurAssigné.toString() !== req.user.id)){
            return res.status(403).json({message: "Access denied : you cannot update this task"});
        }
        //ken l manager ynjm updati l user aasigné
        if(utilisateurAssigné){
            if(req.user.role !== "manager"){
                return res.status(403).json({message: "Only a manager can assign a user to a task"});
            }
            //netaakdou ken l user assigné mawjoud fl DB 
            const user = await User.findById(utilisateurAssigné);
            if(!user){
                return res.status(404).json({message: "Assigned user not found"});
            }
            task.utilisateurAssigné = utilisateurAssigné;
        }
        //update deadline
        if(deadline){
            //deadline validation : lezm ykoun >=today
            const today = new Date();
            const deadlineDate = new Date(deadline);

            if(isNaN(deadlineDate.getTime())){
                return res.status(400).json({message: "Invalid deadline format"});
            }
            if(deadlineDate < today){
                return res.status(400).json({message: "Deadline cannot be in the past"});
            }
            task.deadline = deadlineDate;
        }
        // Update statut: anyone can update
        if (statut) {
            const validStatus = ['todo', 'doing', 'done'];
            if (!validStatus.includes(statut)) {
                return res.status(400).json({ message: `Statut must be one of: ${validStatus.join(', ')}` });
            }
            task.statut = statut;
        }
        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        });
    }catch(error){
        if(error.kind === "ObjectId"){
            return res.status(400).json({message: "Invalid ID format"});
        }
        res.status(500).json({message: error.message});
    }
}

const deleteTask = async (req,res) => {
    try{
        const { id } = req.params;

        //nlawjoud 3ala task
        const task = await Tache.findById(id);
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        const project = await Project.findById(task.projetAssocie);
        
        //only manager can delete task
        if(req.user.role !== "manager"){
            return res.status(403).json({message: "Access denied : you cannot delete this task"});
        }
        //nfas5ou task ml DB
        await task.deleteOne();

        res.status(200).json({message: "Task deleted successfully"});


    }catch(error){
        if(error.kind === "ObjectId"){
            return res.status(400).json({message: "Invalid ID format"});
        }
        res.status(500).json({message: error.message});
    }
}

const GetTaskById = async (req,res) => {
    try{
        const { id } = req.params;

        //nlawjou 3ala task
        const task = await Tache.findById(id)
            .populate('projetAssocie', 'ProjectName description proprietaire statut ')
            .populate('utilisateurAssigné','name email role');

        if (!task){
            return res.status(404).json({message: "Task not found"});
        }
        //nthabtou ml permission ynjmou ken l user eli 3ml l project wl manager wl user assigné ychoufou task details
        const project = await Project.findById(task.projetAssocie._id);
        if(
            req.user.role !== "manager" && project.proprietaire.toString() !== req.user.id &&
            (!task.utilisateurAssigné || task.utilisateurAssigné._id.toString() !== req.user.id)){
                return res.status(403).json({message: "Access denied : you cannot view this task"});
        }
        res.status(200).json(task);     
    }catch(error){
        if(error.kind === 'ObjectId'){
            return res.status(400).json({message: "Invalid task ID format"});
        }
        res.status(500).json({message: error.message});
    }
}

// SORT TASKS
const SortTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { sort } = req.query;

    // Sorting option
    let sortOption = {};
    if (sort) {
      sortOption[sort.replace("-", "")] = sort.startsWith("-") ? -1 : 1;
    }

    //MANAGER ynjm y3ml sort ll tasks lkol
    if (role === "manager") {
      const tasks = await Tache.find().sort(sortOption)
        .populate("utilisateurAssigné", "name")
        .populate("projetAssocie", "projectName");

         if (tasks.length === 0) {
        return res.status(200).json({ message: "No tasks found" });
      }

      return res.status(200).json(tasks);
    }

    // PROJECT OWNER ynjm y3ml sort ken l tasks eli howa propriétaire fl project 
    const ownerProjects = await Project.find({ proprietaire: userId }).select("_id");
    const ownerProjectIds = ownerProjects.map(p => p._id);

    // UTILISATEUR ASSIGNÉ y3ml sort ken l tasks mt3ou
    const tasks = await Tache.find({
      $or: [
        { utilisateurAssigné: userId },      // tasks assigned to the user
        { projetAssocie: { $in: ownerProjectIds } } // tasks of his owned projects
      ]
    })
      .sort(sortOption)
      .populate("utilisateurAssigné", "name")
      .populate("projetAssocie", "projectName");

    if (tasks.length === 0) {
        return res.status(200).json({ message: "No tasks found" });
    }

    return res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const SearchTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query 'q' is required" });
    }

    // nlawjou f titre , description , statut
    const searchConditions = {
      $or: [
        { titre: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { statut: { $regex: q, $options: "i" } }
      ]
    };

    let finalFilter = { ...searchConditions };

    // manager ynjm ylawej f ayy project
    if (role === "manager") {
      const tasks = await Tache.find(finalFilter)
        .populate("utilisateurAssigné", "name")
        .populate("projetAssocie", "projectName");

      if (tasks.length === 0) {
        return res.status(404).json({ message: "No tasks found" });
      }

      return res.status(200).json(tasks);
    }

    // project owner , ken f les projects eli how propriétaire fihom
    const ownerProjects = await Project.find({ proprietaire: userId }).select("_id");
    const ownerProjectIds = ownerProjects.map(p => p._id);

    //UTILISATEUR ASSIGNÉ ylawej ken f tasks mt3ou
    finalFilter = {
      $and: [
        searchConditions,
        {
          $or: [
            { utilisateurAssigné: userId },
            { projetAssocie: { $in: ownerProjectIds } }
          ]
        }
      ]
    };

    const tasks = await Tache.find(finalFilter)
      .populate("utilisateurAssigné", "name")
      .populate("projetAssocie", "projectName");

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    return res.status(200).json(tasks);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports = { getTasksByProject , createTask, UpdateTask, deleteTask, GetTaskById, SortTasks, SearchTasks};
