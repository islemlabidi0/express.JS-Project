const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/UserController.js');
const validateUser = require('../validateUser.js');
const { updateUser } = require('../controllers/UserController.js');
const { deleteUser } = require('../controllers/UserController.js');
const { getAllUsers } = require('../controllers/UserController.js')

router.post('/users', validateUser ,createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id',deleteUser);
router.get('/users', getAllUsers);

module.exports = router;