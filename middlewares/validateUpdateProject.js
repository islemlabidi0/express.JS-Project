
module.exports = (req, res, next) => {
  const { projectName, description, statut, } = req.body;

  if (projectName && typeof projectName !== 'string') {
    return res.status(400).json({ message: 'projectName must be a string' });
  }

  if (description && typeof description !== 'string') {
    return res.status(400).json({ message: 'description must be a string' });
  }

  if (statut && !['en cours', 'terminé', 'en pause'].includes(statut)) {
    return res.status(400).json({ message: 'Invalid statut' });
  }

  next();
};
