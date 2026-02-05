const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.json({ msg: 'User registered successfully' });
};

// LOGIN
exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ msg: info?.msg || 'Login failed' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  })(req, res, next);
};

// GET LOGGED-IN USER PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
// UPDATE LOGGED-IN USER PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      phone: req.body.phone,
      village: req.body.village,
      landSize: req.body.landSize,
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Profile update failed' });
  }
};
// UPLOAD PROFILE PHOTO
exports.uploadProfilePhoto = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: req.file.path },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Photo upload failed' });
  }
};
const handleLogin = async () => {
  try {
    const res = await fetch('http://192.168.1.2:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const text = await res.text(); // 👈 IMPORTANT
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', text);

    const data = JSON.parse(text);

    if (!res.ok) {
      Alert.alert('Login failed', data.msg || 'Error');
      return;
    }

    await AsyncStorage.setItem('token', data.token);
    onLoginSuccess();

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    Alert.alert('Error', 'Network or server error');
  }
};

