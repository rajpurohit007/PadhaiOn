const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send institution credentials email
const sendCredentialsEmail = async (email, institutionName, username, password) => {
  const mailOptions = {
    from: `"PadhaiOn" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Welcome to PadhaiOn - Your Institution Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to PadhaiOn!</h2>
        <p>Dear ${institutionName},</p>
        <p>Your institution enrollment request has been approved! You can now login to your dashboard and manage your institution profile.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Login Credentials:</h3>
          <p><strong>Username/Email:</strong> ${username}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p><strong>Login URL:</strong> <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login">${process.env.CLIENT_URL || 'http://localhost:5173'}/login</a></p>
        </div>
        
        <p style="color: #dc2626;"><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
        
        <p>If you have any questions, feel free to contact our support team.</p>
        
        <p>Best regards,<br>The PadhaiOn Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
};

// Send consultation approval email
const sendConsultationEmail = async (email, name, consultationDetails) => {
  const mailOptions = {
    from: `"PadhaiOn" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Consultation Approved - PadhaiOn",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Your Consultation Has Been Approved!</h2>
        <p>Dear ${name},</p>
        <p>Great news! Your consultation request has been approved.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Consultation Details:</h3>
          <p><strong>Date:</strong> ${consultationDetails.scheduledDate}</p>
          <p><strong>Time:</strong> ${consultationDetails.scheduledTime}</p>
          <p><strong>Type:</strong> ${consultationDetails.consultationType}</p>
          <p><strong>Mode:</strong> ${consultationDetails.meetingType}</p>
          ${consultationDetails.meetingType === "online" ? `<p><strong>Meeting Link:</strong> <a href="${consultationDetails.meetingLink}">${consultationDetails.meetingLink}</a></p>` : `<p><strong>Location:</strong> ${consultationDetails.meetingLocation}</p>`}
          ${consultationDetails.message ? `<p><strong>Notes:</strong> ${consultationDetails.message}</p>` : ''}
        </div>
        
        <p>Please be on time for your consultation. If you need to reschedule, please contact us at least 24 hours in advance.</p>
        
        <p>Best regards,<br>The PadhaiOn Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendCredentialsEmail,
  sendConsultationEmail,
};