import express from 'express';
import { findUserByUsername, validatePassword, generateToken, createUser } from '../utils/users';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

interface LoginRequest {
  username: string;
  password: string;
}

router.post('/login', (req, res) => {
  try {
    const { username, password }: LoginRequest = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = findUserByUsername(username);

    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    if (!validatePassword(password, user.password)) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      department: user.department,
      phone: user.phone
    };

    const token = generateToken(userWithoutPassword);

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', (req, res) => {
  try {
    const { username, password, full_name, role = 'nurse', department, phone } = req.body;

    if (!username || !password || !full_name) {
      return res.status(400).json({ error: 'Username, password, and full name are required' });
    }

    const existingUser = findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newUser = createUser({
      username,
      password,
      full_name,
      role,
      department,
      phone
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        full_name: newUser.full_name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', authenticateToken, (req, res) => {
  try {
    // In a stateless JWT system, logout is handled on the frontend
    // by removing the token from storage
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = (req as any).user;
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;