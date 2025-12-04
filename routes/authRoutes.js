const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/AuthentController');
const validateUser = require('../middlewares/validateUser');

router.post('/register', validateUser, authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/activate/:token', authCtrl.activate);

module.exports = router;