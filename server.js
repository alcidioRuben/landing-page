const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://connect.facebook.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://connect.facebook.net"],
            frameSrc: ["'self'", "https://www.youtube.com"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

// Compression middleware
app.use(compression());

// Cache static files for better performance
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
        }
        if (path.endsWith('.js')) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
        }
        if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg')) {
            res.setHeader('Cache-Control', 'public, max-age=604800');
        }
    }
}));

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AMSync Ads server running on port ${PORT}`);
    console.log(`📱 Access: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
