const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../utils/database');
const authService = require('../services/authService');
const passport = require('../middleware/oauth');
const logger = require('../utils/logger');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: doctor.smith
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        
        const user = await db.findUser(username);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Verify password with bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { 
                userId: user.id, 
                username: user.username, 
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '8h' }
        );
        
        // Log successful login
        await db.query(
            `INSERT INTO audit_log (user_id, action, table_name, ip_address)
             VALUES ($1, 'login', 'users', $2)`,
            [user.id, req.ip]
        );
        
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                firstName: user.first_name,
                lastName: user.last_name,
                licenseNumber: user.license_number
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role, firstName, lastName, licenseNumber, phone } = req.body;
        
        // Validation
        if (!username || !email || !password || !role || !firstName || !lastName) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }
        
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }
        
        const validRoles = ['admin', 'pharmacist', 'doctor', 'patient'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        
        // Check if user already exists
        const existingUser = await db.findUser(username);
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        
        // Check email
        const emailCheck = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(409).json({ error: 'Email already registered' });
        }
        
        // Create user
        const newUser = await db.createUser({
            username,
            email,
            password,
            role,
            firstName,
            lastName,
            licenseNumber,
            phone
        });
        
        // If patient, create patient record
        if (role === 'patient') {
            await db.query(
                `INSERT INTO patients (user_id, date_of_birth, gender) 
                 VALUES ($1, '1990-01-01', 'other')`,
                [newUser.id]
            );
        }
        
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /api/auth/verify-token
router.post('/verify-token', async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token required' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-this-in-production');
        
        // Check if user still exists and is active
        const user = await db.query('SELECT * FROM users WHERE id = $1 AND is_active = true', [decoded.userId]);
        
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// POST /api/auth/2fa/setup
router.post('/2fa/setup', async (req, res) => {
    try {
        const userId = req.user?.id; // Assuming user is authenticated via middleware
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const secret = await authService.generate2FASecret(userId);
        res.json(secret);
    } catch (error) {
        logger.errorLog('2FA setup error', error);
        res.status(500).json({ error: 'Failed to setup 2FA' });
    }
});

// POST /api/auth/2fa/enable
router.post('/2fa/enable', async (req, res) => {
    try {
        const { token } = req.body;
        const userId = req.user?.id;

        if (!userId || !token) {
            return res.status(400).json({ error: 'Token required' });
        }

        const result = await authService.enable2FA(userId, token);
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        logger.errorLog('2FA enable error', error);
        res.status(500).json({ error: 'Failed to enable 2FA' });
    }
});

// POST /api/auth/2fa/disable
router.post('/2fa/disable', async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user?.id;

        if (!userId || !password) {
            return res.status(400).json({ error: 'Password required' });
        }

        const result = await authService.disable2FA(userId, password);
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        logger.errorLog('2FA disable error', error);
        res.status(500).json({ error: 'Failed to disable 2FA' });
    }
});

// POST /api/auth/2fa/verify
router.post('/2fa/verify', async (req, res) => {
    try {
        const { userId, token } = req.body;

        if (!userId || !token) {
            return res.status(400).json({ error: 'User ID and token required' });
        }

        const result = await authService.verify2FAToken(userId, token);
        res.json(result);
    } catch (error) {
        logger.errorLog('2FA verify error', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// GET /api/auth/2fa/backup-codes
router.get('/2fa/backup-codes', async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const codes = await authService.generateBackupCodes(userId);
        res.json(codes);
    } catch (error) {
        logger.errorLog('Backup code generation error', error);
        res.status(500).json({ error: 'Failed to generate backup codes' });
    }
});

// POST /api/auth/2fa/verify-backup
router.post('/2fa/verify-backup', async (req, res) => {
    try {
        const { userId, code } = req.body;

        if (!userId || !code) {
            return res.status(400).json({ error: 'User ID and code required' });
        }

        const result = await authService.verifyBackupCode(userId, code);
        res.json(result);
    } catch (error) {
        logger.errorLog('Backup code verification error', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Google OAuth routes
// GET /api/auth/google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// GET /api/auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_failed' }),
    async (req, res) => {
        try {
            const user = req.user;
            
            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: user.id,
                    username: user.username,
                    role: user.role,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '8h' }
            );

            // Log successful OAuth login
            logger.securityLog('OAuth login successful', {
                userId: user.id,
                provider: 'google',
                ip: req.ip
            });

            // Redirect to frontend with token
            res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
        } catch (error) {
            logger.errorLog('Google OAuth callback error', error);
            res.redirect('/login?error=oauth_failed');
        }
    }
);

// GET /api/auth/oauth/providers
router.get('/oauth/providers', (req, res) => {
    res.json({
        providers: [
            {
                name: 'google',
                enabled: !!process.env.GOOGLE_CLIENT_ID,
                url: '/api/auth/google'
            },
            {
                name: 'microsoft',
                enabled: false, // To be implemented
                url: '/api/auth/microsoft'
            },
            {
                name: 'apple',
                enabled: false, // To be implemented
                url: '/api/auth/apple'
            }
        ]
    });
});

module.exports = router;