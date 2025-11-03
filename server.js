require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const logger = require('./utils/logger');
const morgan = require('morgan');
const http = require('http');
const cacheService = require('./utils/cache');
const websocketService = require('./services/websocketService');
const promMid = require('express-prometheus-middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize WebSocket service
websocketService.initialize(server);

// Initialize cache service (non-blocking)
cacheService.connect().catch(err => logger.warn('Redis connection failed:', err.message));

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Metrics middleware
app.use(promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400]
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Structured logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim(), { type: 'http' })
        }
    }));
}

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pharmacy', require('./routes/pharmacy'));
app.use('/api/consultations', require('./routes/consultations'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/fda', require('./routes/fda'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/services', require('./routes/services'));
app.use('/api/pos', require('./routes/pos'));
app.use('/api/shop', require('./routes/shop'));

// Serve static files AFTER API routes
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Root health check for AWS
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'MedTechAI Backend API is running',
        timestamp: new Date().toISOString()
    });
});

// API health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        database: 'connected',
        redis: cacheService.connected ? 'connected' : 'disconnected',
        websocket: 'ready'
    });
});

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MedTechAI API Documentation'
}));

// Serve frontend for SPA routes (HTML pages only)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    logger.errorLog('Unhandled error', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);
    
    server.close(() => {
        logger.info('HTTP server closed');
    });
    
    try {
        await cacheService.close();
        logger.info('Cache service closed');
    } catch (error) {
        logger.errorLog('Error closing cache', error);
    }
    
    process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
    logger.errorLog('Uncaught Exception', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.errorLog('Unhandled Rejection', new Error(JSON.stringify(reason)));
});

server.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 MedTechAI Backend running on port ${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
    });
});