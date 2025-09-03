const express = require('express');
const userService = require('../services/userService');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    // Try API first, fallback to local data
    let users;
    try {
      users = await userService.getAllUsers();
    } catch (apiError) {
      console.log('API failed, using local data:', apiError.message);
      users = userService.getUsers();
    }
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    let user;
    try {
      user = await userService.getUserById(req.params.id);
    } catch (apiError) {
      console.log('API failed, using local data:', apiError.message);
      user = userService.getUserById(req.params.id);
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, role } = req.body;

    // Check if user already exists
    const existingUsers = userService.getUsers();
    const userExists = existingUsers.some(u => u.username === username || u.email === email);
    
    if (userExists) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const user = userService.createUser({
      username,
      email,
      password,
      name,
      role: role || 'student',
      rating: role === 'student' ? 1200 : 0,
      rank: role === 'student' ? 'Newbie' : 'Educator',
      problemsSolved: 0,
      isOnline: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        rating: user.rating,
        rank: user.rank,
        problemsSolved: user.problemsSolved
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Find user by credentials
    const user = userService.getUserByCredentials(username, password, role);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last active
    userService.updateUser(user.id, {
      lastActive: new Date().toISOString(),
      isOnline: true
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        rating: user.rating,
        rank: user.rank,
        problemsSolved: user.problemsSolved
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { name, bio, skills, experience } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (bio) updates.bio = bio;
    if (skills) updates.skills = skills;
    if (experience) updates.experience = experience;

    const user = userService.updateUser(req.params.id, updates);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const result = userService.deleteUser(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router; 