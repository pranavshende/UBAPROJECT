const express = require('express');
const router = express.Router();
const passport = require('passport');
const upload = require('../config/upload');
const {
  register,
  login,
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  getProfile
);

router.patch(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  updateProfile
);
router.patch(
  '/profile/photo',
  passport.authenticate('jwt', { session: false }),
  upload.single('photo'),
  uploadProfilePhoto
);
module.exports = router;
