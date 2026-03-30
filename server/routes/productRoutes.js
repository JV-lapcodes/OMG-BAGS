import express from 'express';
import { openDb } from '../db.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/products
router.get('/', async (req, res) => {
    try {
        const db = await openDb();
        const products = await db.all('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const db = await openDb();
        const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/products
router.post('/', protect, admin, async (req, res) => {
    const { name, price, description, image, category, stock } = req.body;
    try {
        const db = await openDb();
        const result = await db.run(
            'INSERT INTO products (name, price, description, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)',
            [name, price, description, image, category, stock]
        );
        const createdProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   PUT /api/products/:id
router.put('/:id', protect, admin, async (req, res) => {
    const { name, price, description, image, category, stock } = req.body;
    try {
        const db = await openDb();
        const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);

        if (product) {
            await db.run(
                'UPDATE products SET name = ?, price = ?, description = ?, image = ?, category = ?, stock = ? WHERE id = ?',
                [name, price, description, image, category, stock, req.params.id]
            );
            const updatedProduct = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @route   DELETE /api/products/:id
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const db = await openDb();
        const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);

        if (product) {
            await db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
            res.json({ message: 'Product removed successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/products/seed
router.post('/seed', async (req, res) => {
    try {
        const db = await openDb();
        await db.exec('DELETE FROM products');

        const sampleProducts = [
            {
                name: 'Onyx Executive Backpack',
                description: 'A matte-black leather backpack perfect for the minimalist professional. Crafted with 100% genuine full-grain leather, featuring a padded 16-inch laptop sleeve, stealth water-resistant zippers, and structural integrity.',
                price: 12999,
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
                category: 'Backpacks',
                stock: 25
            },
            {
                name: 'Monolith Travel Duffel',
                description: 'Spacious premium duffel bag designed for modern travel. Features an ultra-durable carbon-fiber reinforced woven exterior, a dedicated ventilated shoe compartment, and high-tensile strength carrying handles.',
                price: 8499,
                image: 'https://images.unsplash.com/photo-1550837368-6594235de85c?w=800&q=80',
                category: 'Duffels',
                stock: 12
            },
            {
                name: 'Phantom Messenger Brief',
                description: 'Sleek professional messenger bag with an internal laptop compartment and quick-access magnetic clasps. Designed specifically for the modern commuter aiming for a slim, undetectable profile.',
                price: 6499,
                image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
                category: 'Messenger',
                stock: 15
            },
            {
                name: 'Noir Essential Tote',
                description: 'Simple, elegant, and completely unstructured tote bag for effortless everyday carry. Made from heavy-duty organic canvas dyed in absolute black, reinforced with double-stitched webbing handles.',
                price: 2999,
                image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
                category: 'Totes',
                stock: 30
            },
            {
                name: 'Graphite Hard-Shell Suitcase',
                description: 'A premium polycarbonate cabin-sized suitcase built to withstand immense pressure. Dual-spinner wheels, an integrated TSA-approved lock, and a compressive interior organization system.',
                price: 18999,
                image: 'https://images.unsplash.com/photo-1565026057447-bc90829ce004?w=800&q=80',
                category: 'Suitcase',
                stock: 8
            },
            {
                name: 'Obsidian Minimal Wallet',
                description: 'An ultra-slim, RFID-blocking minimalist wallet crafted from aircraft-grade aluminum. Holds up to 12 cards effortlessly while keeping a profile thinner than a smartphone.',
                price: 3499,
                image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&q=80',
                category: 'Wallet',
                stock: 50
            },
            {
                name: 'Carbon Sling Bag',
                description: 'An asymmetrical crossbody sling designed for rapid deployment in urban environments. Weatherproof external shell and hidden security pockets make it the ultimate daily companion.',
                price: 4599,
                image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
                category: 'Slings',
                stock: 18
            },
            {
                name: 'Stealth Tech Pouch',
                description: 'Compact organizational pouch for chargers, cables, and SSDs. Accordion-style interior layout ensures nothing tangles, ever.',
                price: 1999,
                image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
                category: 'Accessories',
                stock: 45
            },
            {
                name: 'Horizon Weekender',
                description: 'The ultimate canvas and leather trimmed weekend bag. Meets international carry-on size limits and features bottom-studded protection.',
                price: 11499,
                image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80',
                category: 'Duffels',
                stock: 10
            },
            {
                name: 'Apex Hiking Rucksack',
                description: 'A 45L high-capacity technical backpack. Absolute black with luminescent reflective trims, hydration bladder compatible, and an internal aluminum frame.',
                price: 15999,
                image: 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=800&q=80',
                category: 'Backpacks',
                stock: 7
            },
            {
                name: 'Void Leather Wallet',
                description: 'Classic bifold wallet redesigned with modern tolerances. Black calfskin leather, edge-painted finish, and 8 card slots with a split bill compartment.',
                price: 4999,
                image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
                category: 'Wallet',
                stock: 35
            },
            {
                name: 'Eclipse Crossbody',
                description: 'Small, circular profile bag for essentials only. Premium matte hardware and an adjustable quick-release strap.',
                price: 3999,
                image: 'https://images.unsplash.com/photo-1590739343058-00a442e6f477?w=800&q=80',
                category: 'Slings',
                stock: 22
            },
            {
                name: 'Vanguard Check-In Trunk',
                description: 'A massive 90L hard-shell check-in suitcase. Features an internal compression board, silent 360-degree wheels, and a scuff-resistant dark titanium exterior finish.',
                price: 26999,
                image: 'https://images.unsplash.com/photo-1581553680321-4fffae59fdd9?w=800&q=80',
                category: 'Suitcase',
                stock: 4
            },
            {
                name: 'Studio Tote Organizer',
                description: 'A structured, standing tote bag with a massive central compartment. Internal water bottle loops and a key tether make it highly functional for studio trips.',
                price: 5499,
                image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
                category: 'Totes',
                stock: 14
            },
            {
                name: 'Velocity Cycling Pack',
                description: 'Aerodynamic, rigid shell backpack for cyclists. Total waterproofing with welded seams and a low-profile roll-top closure.',
                price: 9999,
                image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
                category: 'Backpacks',
                stock: 12
            },
            {
                name: 'Aero Passport Holder',
                description: 'Sleek leather sleeve protecting your most important document. Features hidden slots for an emergency credit card and boarding pass.',
                price: 2499,
                image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
                category: 'Accessories',
                stock: 60
            },
            {
                name: 'Kinetics Gym Bag',
                description: 'Engineered entirely from recycled ocean plastics. Features anti-microbial lining, a wet-clothes divider, and a padded yoga mat strap.',
                price: 6499,
                image: 'https://images.unsplash.com/photo-1550837368-6594235de85c?w=800&q=80',
                category: 'Duffels',
                stock: 16
            },
            {
                name: 'Nexus Tech Briefcase',
                description: 'A rigid briefcase reimagined for the digital age. Fits up to an 18-inch laptop, complete with crush-proof geometry and heavy-duty latches.',
                price: 13499,
                image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
                category: 'Messenger',
                stock: 5
            },
            {
                name: 'Shadow Bumbag',
                description: 'A retro style modernized in absolute black nylon. Wear it across the chest or around the waist. Highly durable and ultra-lightweight.',
                price: 2999,
                image: 'https://images.unsplash.com/photo-1590739343058-00a442e6f477?w=800&q=80',
                category: 'Slings',
                stock: 40
            },
            {
                name: 'Titanium Carry-On Pro',
                description: 'The definitive business traveler suitcase. Features an external quick-access laptop hatch so you never have to open the main compartment at security.',
                price: 32999,
                image: 'https://images.unsplash.com/photo-1565026057447-bc90829ce004?w=800&q=80',
                category: 'Suitcase',
                stock: 3
            }
        ];

        const stmt = await db.prepare('INSERT INTO products (name, price, description, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)');
        for (const p of sampleProducts) {
            await stmt.run(p.name, p.price, p.description, p.image, p.category, p.stock);
        }
        await stmt.finalize();

        const createdProducts = await db.all('SELECT * FROM products');
        res.status(201).json(createdProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error seeding data', error: error.message });
    }
});

export default router;
