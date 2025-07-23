require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Only imported once
const rateLimit = require('express-rate-limit');

const app = express();

// ✅ CORS setup to allow requests only from your Netlify site
app.use(cors({
  origin: 'https://abhiprotfolio.netlify.app'
}));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- Middleware Setup ---

// 1. CORS (Cross-Origin Resource Sharing)
// This is essential to allow your frontend (even if running locally)
// to make requests to this backend server.
app.use(cors());

// 2. Body Parser
// To correctly parse incoming request bodies.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 3. Rate Limiter
// This protects your form from spam and brute-force attacks by limiting
// the number of submissions an IP address can make in a set time.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP. Please try again after 15 minutes.',
});

// --- Nodemailer Transporter Configuration ---

// IMPORTANT SECURITY NOTE: For Gmail, it's highly recommended to use an "App Password"
// instead of your regular account password, especially if you have 2-Factor Authentication enabled.
// You can generate one here: Google Account > Security > 2-Step Verification > App Passwords.
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com', // Brevo SMTP server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your Brevo account email
    pass: process.env.EMAIL_PASS, // Your Brevo master password
  },
});

// --- API Route for Form Submission ---

app.post('/submit-consultation', limiter, (req, res) => {
  const { name, email, service, birthdate, birthplace, message } = req.body;

  // --- Enhanced Server-Side Validation ---
  // 1. Check for missing required fields
  if (!name || !email || !service || !birthdate || !birthplace) {
    return res.status(400).json({ success: false, message: 'Missing required fields. Please ensure all fields are filled.' });
  }

  // 2. Validate email format using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }


  // --- Email Content Preparation ---
  const mailOptions = {
    from: `"Abhishek Gupta | Website" <theansh63@gmail.com>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: email, // Set the 'reply-to' field to the user's email for easy responding
    subject: `New Consultation Request - ${name}`,
    html: `
      <h2>New Vedic Astrology Consultation Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Service Requested:</strong> ${service}</p>
      <p><strong>Birth Date & Time:</strong> ${birthdate}</p>
      <p><strong>Birth Place:</strong> ${birthplace}</p>
      <p><strong>Questions:</strong></p>
      <p>${message || 'No specific questions were provided.'}</p>
      <hr>
      <p>Received at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    `,
  };

  // --- Send Email ---
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email sending error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send your request due to a server error. Please try again later.',
      });
    }
    
    console.log(`Consultation request sent: ${info.messageId}`);
    res.status(200).json({
      success: true,
      message: 'Thank you for your consultation request! Abhishek will contact you within 24 hours.',
    });
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
