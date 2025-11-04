const express = require('express');
const router = express.Router();

// Contact form submission endpoint
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and message are required fields'
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid email address'
            });
        }
        
        // Log the contact form submission
        console.log('📧 Contact form submission received:');
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Subject: ${subject || 'No subject'}`);
        console.log(`Message: ${message}`);
        console.log(`Timestamp: ${new Date().toISOString()}`);
        console.log('---');
        
        // In a real application, you would:
        // 1. Save to database
        // 2. Send email notification
        // 3. Send auto-reply to user
        
        // For now, we'll just return success
        res.json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.'
        });
        
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error. Please try again later.'
        });
    }
});

// Get contact information (optional endpoint)
router.get('/info', (req, res) => {
    res.json({
        email: 'contact@medtechai.net',
        phone: '+1 123 456 7890',
        address: 'MedTechAI Headquarters',
        hours: 'Monday - Friday: 9:00 AM - 6:00 PM'
    });
});

module.exports = router;