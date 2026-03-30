import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { openDb } from '../db.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey', {
        expiresIn: '30d',
    });
};

// @route   POST /api/users/signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const db = await openDb();
        const userExists = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await db.run(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        const user = await db.get('SELECT id, name, email, isAdmin FROM users WHERE id = ?', [result.lastID]);

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await openDb();
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    res.json(req.user);
});

// @route   GET /api/users
// @desc    Get all users explicitly for admin dashboards
router.get('/', protect, admin, async (req, res) => {
    try {
        const db = await openDb();
        const users = await db.all('SELECT id, name, email, isAdmin, createdAt FROM users ORDER BY createdAt DESC');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching global users', error: error.message });
    }
});

export default router;
