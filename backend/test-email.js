require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.ADMIN_EMAIL,
  subject: 'Test Email - Campus Resource Management',
  html: '<h1>Test Email</h1><p>If you receive this, email is working!</p>'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('❌ Error sending email:', error);
  } else {
    console.log('✅ Email sent successfully:', info.response);
  }
});
