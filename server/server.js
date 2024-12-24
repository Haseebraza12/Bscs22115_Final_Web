const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//const taskRoutes = require('./routes/tasks');
//const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

//pp.use('/api/auth', authRoutes);
//app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});