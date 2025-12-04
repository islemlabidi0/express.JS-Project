const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const validateUser = require('../middlewares/validateUser');
const validateUpdateUser = require('../middlewares/validateUpdateUser');
const validateUpdateUserUser = require('../middlewares/validateUpdateUser_user');
const userCtrl = require('../controllers/UserController');

// Routes for regular authenticated user
//me = “MOI”, c’est-à-dire l’utilisateur connecté lui-même.
//ahna deja aarfin user m token mte3ou so mch lezm el user yestaamel id so nestaamelou fi outheha el me
router.get('/me', auth, userCtrl.getMyProfile);
router.put('/me', auth, validateUpdateUserUser, userCtrl.updateMyProfile);
router.delete('/me', auth, userCtrl.deleteMyAccount);
// Routes for managers only
router.get('/', auth, role('manager'), userCtrl.getAllUsers);
router.post('/', auth, role('manager'), validateUser, userCtrl.createUser);
router.put('/:id', auth, role('manager'), validateUpdateUser, userCtrl.updateUser);
router.delete('/:id', auth, role('manager'), userCtrl.deleteUser);



module.exports = router;
