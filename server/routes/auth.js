const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Si
router.post('/signup', async (req, res) => {
  try {
    console.log('📝 Signup request received:', req.body);
    
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();
    console.log('✅ User created successfully:', user._id);

    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('🔑 Login attempt for:', req.body.username);
    
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Invalid password for:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    console.log('✅ Login successful:', username);

    res.json({
      token,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;