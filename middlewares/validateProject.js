module.exports = (req, res, next) => {
  const { projectName, description, statut } = req.body;

  if (!projectName) 
    return res.status(400).json({ message: "projectName is required" });

  if (!description)
    return res.status(400).json({ message: "description is required" });

  if (statut && !['en cours', 'terminé', 'en pause'].includes(statut))
    return res.status(400).json({ message: "Invalid statut value" });

  next();
};
