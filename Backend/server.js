require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('./config/passport');


const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(passport.initialize());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'));

app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

