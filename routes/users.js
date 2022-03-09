const router = require('express').Router();
const {
  getUsers,
  sendUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserMe,
} = require('../controllers/users');

const validateRegisterUser = require('../middlewares/validationUser');

const auth = require('../middlewares/auth');

router.get('/users', auth, getUsers);

router.patch('/users/me', auth, validateRegisterUser, updateProfile);

router.patch('/users/me/avatar', auth, validateRegisterUser, updateAvatar);

router.get('/users/me', auth, validateRegisterUser, getUserMe);

router.get('/users/:id', auth, validateRegisterUser, sendUser);

router.post('/signup', validateRegisterUser, createUser);

router.post('/signin', validateRegisterUser, login);

module.exports = router;
