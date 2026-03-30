import jwt from 'jsonwebtoken';
import { openDb } from '../db.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');

            const db = await openDb();
            const user = await db.get('SELECT id, name, email, isAdmin FROM users WHERE id = ?', [decoded.id]);

            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user failed' });
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin === 1) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};
