const express = require('express');
const router = express.Router();
const { createUser } = require('./UserController.js');
const validateUser = require('./validateUser.js');
const { updateUser } = require('./UserController.js');
const { deleteUser } = require('./UserController.js');

router.post('/users', validateUser ,createUser);
router.put('/users/:id', validateUser, updateUser);
router.delete('/users/:id',deleteUser);

module.exports = router;