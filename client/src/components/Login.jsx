router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log('Login attempt for username:', username);
  
      // Input validation
      if (!username || !password) {
        console.log('Missing credentials');
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      // Find user
      const user = await User.findOne({ username });
      console.log('User found:', !!user);
  
      if (!user) {
        console.log('User not found');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
  
      if (!isMatch) {
        console.log('Password mismatch');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Create token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '24h' }
      );
  
      console.log('Login successful for user:', username);
      
      res.json({
        token,
        user: {
          userId: user._id,
          username: user.username,
          email: user.email
        }
      });
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  });