const nodemailer = require('nodemailer');

// Create email transporter (using Gmail for demo)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Send email to admin when new booking is created
exports.notifyAdminNewBooking = async (bookingDetails) => {
  const { userName, userEmail, resourceName, bookingDate, timeSlot } = bookingDetails;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || 'admin@campus.com',
    subject: '🔔 New Booking Request - Campus Resource Management',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #667eea;">📅 New Booking Request</h2>
          <p>A new booking request has been submitted and requires your approval.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>👤 User:</strong> ${userName} (${userEmail})</p>
            <p><strong>🏢 Resource:</strong> ${resourceName}</p>
            <p><strong>📅 Date:</strong> ${new Date(bookingDate).toLocaleDateString()}</p>
            <p><strong>⏰ Time:</strong> ${timeSlot}</p>
            <p><strong>📊 Status:</strong> <span style="color: #f57c00;">PENDING</span></p>
          </div>
          
          <p style="color: #666;">Please log in to the admin dashboard to approve or reject this booking.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification email sent successfully to:', process.env.ADMIN_EMAIL);
    return true;
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error.message);
    return false;
  }
};

// Send email to user when booking is approved
exports.notifyUserApproval = async (bookingDetails) => {
  const { userName, userEmail, resourceName, bookingDate, timeSlot } = bookingDetails;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: '✅ Booking Approved - Campus Resource Management',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #4CAF50;">✅ Booking Approved!</h2>
          <p>Great news! Your booking request has been approved.</p>
          
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <p><strong>👤 Name:</strong> ${userName}</p>
            <p><strong>🏢 Resource:</strong> ${resourceName}</p>
            <p><strong>📅 Date:</strong> ${new Date(bookingDate).toLocaleDateString()}</p>
            <p><strong>⏰ Time:</strong> ${timeSlot}</p>
            <p><strong>📊 Status:</strong> <span style="color: #4CAF50; font-weight: bold;">APPROVED</span></p>
          </div>
          
          <p style="color: #666;">Your booking is confirmed. Please arrive on time.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ User approval email sent successfully to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending user approval email:', error.message);
    return false;
  }
};

// Send email to user when booking is rejected
exports.notifyUserRejection = async (bookingDetails) => {
  const { userName, userEmail, resourceName, bookingDate, timeSlot, rejectionReason } = bookingDetails;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: '❌ Booking Rejected - Campus Resource Management',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #f44336;">❌ Booking Rejected</h2>
          <p>Unfortunately, your booking request has been rejected.</p>
          
          <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f44336;">
            <p><strong>👤 Name:</strong> ${userName}</p>
            <p><strong>🏢 Resource:</strong> ${resourceName}</p>
            <p><strong>📅 Date:</strong> ${new Date(bookingDate).toLocaleDateString()}</p>
            <p><strong>⏰ Time:</strong> ${timeSlot}</p>
            <p><strong>📊 Status:</strong> <span style="color: #f44336; font-weight: bold;">REJECTED</span></p>
          </div>
          
          ${rejectionReason ? `
            <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>📝 Reason:</strong></p>
              <p style="color: #666;">${rejectionReason}</p>
            </div>
          ` : ''}
          
          <p style="color: #666;">You can submit a new booking request if needed.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ User rejection email sent successfully to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending user rejection email:', error.message);
    return false;
  }
};
