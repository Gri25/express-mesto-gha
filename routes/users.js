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

const validationPatchProfile = require('../middlewares/validationPatchProfile');
const validationPatchAvatar = require('../middlewares/validationPatchAvatar');
const validationId = require('../middlewares/validationId');

const auth = require('../middlewares/auth');

router.get('/users', auth, getUsers);

router.patch('/users/me', auth, validationPatchProfile, updateProfile);

router.patch('/users/me/avatar', auth, validationPatchAvatar, updateAvatar);

router.get('/users/me', auth, getUserMe);

router.get('/users/:id', auth, validationId, sendUser);

router.post('/signup', validationPatchProfile, createUser);

router.post('/signin', validationPatchProfile, login);

module.exports = router;
