const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        unique: true,
        trim: true   
    },
    description: {
        type: String,
        required: true
    },
    proprietaire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //reference for user model
        required: true
    },
    statut: {
        type: String,
        required: true,
        enum: ['en cours', 'terminé', 'en pause'],
        default: 'en cours'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Project = mongoose.model('Projet', projectSchema);

module.exports = Project;