const mongoose = require('mongoose');
const tacheSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
        trim: true   
    },
    description: {
        type: String,
        required: true
    },
    statut: {
        type: String,
        required: true,
        enum: ['todo', 'doing', 'done'],
        default: 'todo'
    },
    deadline: {
        type: Date,
        required: true
    },
    projetAssocie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projet', //reference for project model
        required: true
    },
    utilisateurAssigné: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //reference for user model
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }


});
const Tache = mongoose.model('Tache', tacheSchema);

module.exports = Tache;