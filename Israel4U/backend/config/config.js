require('dotenv').config();

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://misterlir:WTcOJiFBMK1cBkqU@israel4u-cluster.vcchsa5.mongodb.net/',
    jwtSecret: process.env.JWT_SECRET || 'israel4u-secret-key',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS
}; 