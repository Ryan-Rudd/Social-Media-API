const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
require('dotenv').config();

// Create a transporter object using SMTP or another email service
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Example: 'smtp.gmail.com'
    port: process.env.SMTP_PORT || 587, // Standard ports for email
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // Your email or SMTP username
        pass: process.env.SMTP_PASS  // Your email or SMTP password
    }
});

/**
 * Sends a password reset email.
 * @param {string} email - The recipient's email address.
 * @param {string} resetLink - The password reset link.
 */
const sendPasswordResetEmail = async (email, resetLink) => {
    const mailOptions = {
        from: process.env.SMTP_USER, // Sender address (from your email account)
        to: email, // Receiver's email
        subject: 'Password Reset Request', // Subject line
        html: `<p>You have requested a password reset. Click the link below to reset your password:</p>
               <a href="${resetLink}">Reset Password</a>
               <p>If you did not request this, please ignore this email.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Password reset email sent to: ${email}`);
    } catch (error) {
        logger.error(`Failed to send password reset email to ${email}: ${error.message}`);
        throw new Error('Error sending email');
    }
};

module.exports = {
    sendPasswordResetEmail
};

// Example usage (remove or move to a different file for actual implementation)
sendPasswordResetEmail('rsrudd@gmail.com', "123");
