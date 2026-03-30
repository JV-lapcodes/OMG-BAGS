import express from 'express';
import Stripe from 'stripe';
import { protect, admin } from '../middleware/authMiddleware.js';
import { openDb } from '../db.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_remove_before_push');

// @route   POST /api/orders/payment-intent
router.post('/payment-intent', protect, async (req, res) => {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const amountInCents = Math.round(total * 100);

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'inr',
            payment_method_types: ['card']
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ message: 'Stripe Error', error: error.message });
    }
});

// @route   POST /api/orders
// @desc    Create new order instance definitively mapping to Stripe success
router.post('/', protect, async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        const db = await openDb();

        const result = await db.run(
            `INSERT INTO orders (user_id, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice, isPaid, paidAt) 
       VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)`,
            [req.user.id, JSON.stringify(shippingAddress), paymentMethod || 'Stripe', taxPrice, shippingPrice, totalPrice]
        );

        const createdOrderId = result.lastID;

        const stmt = await db.prepare('INSERT INTO order_items (order_id, product_id, name, qty, price, image) VALUES (?, ?, ?, ?, ?, ?)');
        for (const item of orderItems) {
            await stmt.run(createdOrderId, item.id, item.name, item.quantity, item.price, item.image);
        }
        await stmt.finalize();

        res.status(201).json({ message: 'Order created', orderId: createdOrderId });
    } catch (error) {
        res.status(500).json({ message: 'Server error saving order', error: error.message });
    }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders payload
router.get('/myorders', protect, async (req, res) => {
    try {
        const db = await openDb();
        const orders = await db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY createdAt DESC', [req.user.id]);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching orders', error: error.message });
    }
});

// @route   GET /api/orders
// @desc    Get all orders securely globally
router.get('/', protect, admin, async (req, res) => {
    try {
        const db = await openDb();
        const orders = await db.all(`
      SELECT orders.*, users.name as userName 
      FROM orders 
      JOIN users ON orders.user_id = users.id 
      ORDER BY orders.createdAt DESC
    `);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching all orders', error: error.message });
    }
});

export default router;
