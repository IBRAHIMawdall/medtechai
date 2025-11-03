const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const { authenticate, optionalAuth } = require('../middleware/auth');

// GET /api/shop/products - List all products
router.get('/products', optionalAuth, async (req, res) => {
    try {
        const { page = 1, limit = 24, category, subcategory, featured, search, sort = 'created_at DESC' } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT p.*, 
                   COALESCE(AVG(pr.rating), 0) as avg_rating,
                   COUNT(DISTINCT pr.id) as review_count
            FROM products p
            LEFT JOIN product_reviews pr ON p.id = pr.product_id
            WHERE p.is_active = true
        `;
        
        const params = [];
        let paramCount = 1;

        if (category) {
            query += ` AND p.category = $${paramCount++}`;
            params.push(category);
        }

        if (subcategory) {
            query += ` AND p.subcategory = $${paramCount++}`;
            params.push(subcategory);
        }

        if (featured === 'true') {
            query += ` AND p.is_featured = true`;
        }

        if (search) {
            query += ` AND (p.name ILIKE $${paramCount++} OR p.description ILIKE $${paramCount++} OR p.tags::text ILIKE $${paramCount})`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ` GROUP BY p.id ORDER BY ${sort}`;
        
        // Get total count with separate query
        let countQuery = `
            SELECT COUNT(DISTINCT p.id) as total
            FROM products p
            LEFT JOIN product_reviews pr ON p.id = pr.product_id
            WHERE p.is_active = true
        `;
        let countParams = [];
        let countParamCount = 1;
        
        if (category) {
            countQuery += ` AND p.category = $${countParamCount++}`;
            countParams.push(category);
        }
        if (subcategory) {
            countQuery += ` AND p.subcategory = $${countParamCount++}`;
            countParams.push(subcategory);
        }
        if (featured === 'true') {
            countQuery += ` AND p.is_featured = true`;
        }
        if (search) {
            const searchTerm = `%${search}%`;
            countQuery += ` AND (p.name ILIKE $${countParamCount++} OR p.description ILIKE $${countParamCount++} OR p.tags::text ILIKE $${countParamCount})`;
            countParams.push(searchTerm, searchTerm, searchTerm);
        }
        
        const totalResult = await db.query(countQuery, countParams);
        const total = parseInt(totalResult.rows[0]?.total || 0);

        query += ` LIMIT $${paramCount++} OFFSET $${paramCount}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        
        res.json({
            products: result.rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /api/shop/products/:id - Get single product
router.get('/products/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const productQuery = `
            SELECT p.*,
                   COALESCE(AVG(pr.rating), 0) as avg_rating,
                   COUNT(DISTINCT pr.id) as review_count
            FROM products p
            LEFT JOIN product_reviews pr ON p.id = pr.product_id
            WHERE p.id = $1 AND p.is_active = true
            GROUP BY p.id
        `;
        
        const product = await db.query(productQuery, [id]);

        if (product.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Get reviews
        const reviewsQuery = `
            SELECT pr.*, u.first_name, u.last_name
            FROM product_reviews pr
            JOIN users u ON pr.user_id = u.id
            WHERE pr.product_id = $1
            ORDER BY pr.created_at DESC
            LIMIT 10
        `;
        const reviews = await db.query(reviewsQuery, [id]);

        // Get related products
        const relatedQuery = `
            SELECT p.*
            FROM products p
            WHERE p.category = $1 AND p.id != $2 AND p.is_active = true
            ORDER BY RANDOM()
            LIMIT 4
        `;
        const related = await db.query(relatedQuery, [product.rows[0].category, id]);

        res.json({
            product: product.rows[0],
            reviews: reviews.rows,
            related: related.rows
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// GET /api/shop/categories - Get all categories
router.get('/categories', async (req, res) => {
    try {
        const query = `
            SELECT category, COUNT(*) as count
            FROM products
            WHERE is_active = true
            GROUP BY category
            ORDER BY category
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// GET /api/shop/featured - Get featured products
router.get('/featured', async (req, res) => {
    try {
        const query = `
            SELECT p.*,
                   COALESCE(AVG(pr.rating), 0) as avg_rating,
                   COUNT(DISTINCT pr.id) as review_count
            FROM products p
            LEFT JOIN product_reviews pr ON p.id = pr.product_id
            WHERE p.is_featured = true AND p.is_active = true
            GROUP BY p.id
            ORDER BY p.created_at DESC
            LIMIT 12
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching featured products:', error);
        res.status(500).json({ error: 'Failed to fetch featured products' });
    }
});

// CART OPERATIONS

// GET /api/shop/cart - Get user's cart
router.get('/cart', authenticate, async (req, res) => {
    try {
        const query = `
            SELECT ci.*, p.name, p.base_price, p.sale_price, p.images, p.stock_quantity
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = $1
            ORDER BY ci.created_at DESC
        `;
        const result = await db.query(query, [req.userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// POST /api/shop/cart - Add to cart
router.post('/cart', authenticate, async (req, res) => {
    try {
        const { product_id, quantity = 1 } = req.body;

        // Check if product exists and is active
        const productCheck = await db.query(
            'SELECT * FROM products WHERE id = $1 AND is_active = true',
            [product_id]
        );

        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check stock
        if (productCheck.rows[0].stock_quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        // Insert or update cart item
        const query = `
            INSERT INTO cart_items (user_id, product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, product_id)
            DO UPDATE SET quantity = cart_items.quantity + $3, updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `;
        const result = await db.query(query, [req.userId, product_id, quantity]);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
});

// PUT /api/shop/cart/:id - Update cart item
router.put('/cart/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const query = `
            UPDATE cart_items
            SET quantity = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        const result = await db.query(query, [quantity, id, req.userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Failed to update cart' });
    }
});

// DELETE /api/shop/cart/:id - Remove from cart
router.delete('/cart/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            DELETE FROM cart_items
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `;
        const result = await db.query(query, [id, req.userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
});

// WISHLIST OPERATIONS

// GET /api/shop/wishlist - Get wishlist
router.get('/wishlist', authenticate, async (req, res) => {
    try {
        const query = `
            SELECT w.*, p.*
            FROM wishlists w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = $1
            ORDER BY w.created_at DESC
        `;
        const result = await db.query(query, [req.userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

// POST /api/shop/wishlist - Add to wishlist
router.post('/wishlist', authenticate, async (req, res) => {
    try {
        const { product_id } = req.body;

        const query = `
            INSERT INTO wishlists (user_id, product_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, product_id) DO NOTHING
            RETURNING *
        `;
        const result = await db.query(query, [req.userId, product_id]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Already in wishlist' });
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
});

// DELETE /api/shop/wishlist/:id - Remove from wishlist
router.delete('/wishlist/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            DELETE FROM wishlists
            WHERE product_id = $1 AND user_id = $2
        `;
        await db.query(query, [id, req.userId]);

        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
});

// ORDERS

// GET /api/shop/orders - Get user orders
router.get('/orders', authenticate, async (req, res) => {
    try {
        const query = `
            SELECT o.*, 
                   JSON_AGG(
                       JSON_BUILD_OBJECT(
                           'id', oi.id,
                           'product_id', oi.product_id,
                           'product_name', oi.product_name,
                           'quantity', oi.quantity,
                           'unit_price', oi.unit_price,
                           'subtotal', oi.subtotal
                       )
                   ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `;
        const result = await db.query(query, [req.userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// POST /api/shop/checkout - Create order
router.post('/checkout', authenticate, async (req, res) => {
    try {
        const { shipping_info, payment_method } = req.body;

        // Get cart items
        const cartQuery = `
            SELECT ci.*, p.base_price, p.sale_price, p.stock_quantity
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = $1
        `;
        const cartItems = await db.query(cartQuery, [req.userId]);

        if (cartItems.rows.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Calculate totals
        let subtotal = 0;
        for (const item of cartItems.rows) {
            const price = item.sale_price || item.base_price;
            subtotal += price * item.quantity;
        }

        const tax = subtotal * 0.08; // 8% tax
        const shipping = 5.99; // Fixed shipping
        const total = subtotal + tax + shipping;

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create order
        const orderQuery = `
            INSERT INTO orders (
                order_number, user_id, shipping_name, shipping_address, shipping_city,
                shipping_state, shipping_zip, shipping_country, shipping_phone,
                subtotal, tax, shipping_cost, total, payment_method, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'pending')
            RETURNING *
        `;
        const order = await db.query(orderQuery, [
            orderNumber, req.userId, shipping_info.name, shipping_info.address,
            shipping_info.city, shipping_info.state, shipping_info.zip,
            shipping_info.country || 'US', shipping_info.phone,
            subtotal, tax, shipping, total, payment_method
        ]);

        // Create order items
        for (const item of cartItems.rows) {
            const price = item.sale_price || item.base_price;
            await db.query(
                `INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, subtotal)
                 VALUES ($1, $2, (SELECT name FROM products WHERE id = $2), 
                        (SELECT sku FROM products WHERE id = $2), $3, $4, $5)`,
                [order.rows[0].id, item.product_id, item.quantity, price, price * item.quantity]
            );

            // Update inventory
            await db.query(
                'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
                [item.quantity, item.product_id]
            );
        }

        // Clear cart
        await db.query('DELETE FROM cart_items WHERE user_id = $1', [req.userId]);

        res.status(201).json({
            order: order.rows[0],
            message: 'Order placed successfully'
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

module.exports = router;

