const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS
        }
    });
};

// Send email verification
const sendEmailVerification = async (email, code) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: config.EMAIL_USER,
            to: email,
            subject: 'Israel4U - Email Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">Welcome to Israel4U!</h2>
                    <p>Thank you for registering with Israel4U. Please use the following verification code to complete your registration:</p>
                    <div style="background-color: #3498db; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
                        ${code}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't register for Israel4U, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Email verification sent successfully');
    } catch (error) {
        console.error('Error sending email verification:', error);
        throw new Error('Failed to send verification email');
    }
};

// Send password reset email
const sendPasswordResetEmail = async (email, code) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: config.EMAIL_USER,
            to: email,
            subject: 'Israel4U - Password Reset',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">Password Reset Request</h2>
                    <p>You requested a password reset for your Israel4U account. Use the following code to reset your password:</p>
                    <div style="background-color: #e74c3c; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
                        ${code}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request a password reset, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

module.exports = {
    sendEmailVerification,
    sendPasswordResetEmail
}; 