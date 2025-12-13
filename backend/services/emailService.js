const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const BASE_STYLE = `
    font-family: Arial, sans-serif; 
    line-height: 1.6; 
    color: #333333; 
    max-width: 600px; 
    margin: 0 auto; 
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
`;
const HEADER_STYLE = `
    background-color: #2563eb; 
    color: #ffffff; 
    padding: 20px; 
    text-align: center;
`;
const BODY_STYLE = `
    padding: 30px 25px; 
    background-color: #ffffff;
`;
const CODE_BOX_STYLE = `
    background-color: #f3f4f6; 
    padding: 20px; 
    border-radius: 8px; 
    margin: 25px 0; 
    text-align: center;
`;
const CTA_BUTTON_STYLE = `
    display: inline-block;
    padding: 12px 25px;
    margin: 20px 0;
    background-color: #2563eb;
    color: #ffffff;
    text-decoration: none;
    border-radius: 6px;
    font-weight: bold;
`;
const sendVerificationOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"PadhaiOn Support" <${process.env.SMTP_USER}>`, // Use the authenticated SMTP_USER for correct sending
    to: email,
    subject: "Verify Your Email - PadhaiOn",
    html: `
      <div style="${BASE_STYLE}">
            <div style="${HEADER_STYLE}">
                <h1 style="margin: 0; font-size: 24px;">PadhaiOn Verification</h1>
            </div>
            <div style="${BODY_STYLE}">
                <h2 style="color: #2563eb; margin-top: 0;">Confirm Your Registration</h2>
                <p>Dear user,</p>
                <p>Thank you for registering with PadhaiOn. Please use the verification code below to confirm your email address and activate your account.</p>
                
                <div style="${CODE_BOX_STYLE}">
                    <h3 style="margin: 0 0 10px 0; color: #1f2937;">Your Verification Code:</h3>
                    <p style="font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 5px; margin: 0;">${otp}</p>
                    <p style="font-size: 12px; color: #4b5563; margin-top: 10px;">This code is valid for 10 minutes.</p>
                </div>
                
                <p>If you did not initiate this registration, please ignore this email.</p>
                
                <p style="margin-top: 30px;">Best regards,<br>The PadhaiOn Team</p>
            </div>
        </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Verification Email send error:", error);
    return { success: false, error: error.message };
  }
};

// Send institution credentials email
const sendCredentialsEmail = async (email, institutionName, username, password) => {
  const mailOptions = {
    from: `"PadhaiOn" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Welcome to PadhaiOn - Your Institution Account",
    html: `
      <div style="${BASE_STYLE}">
            <div style="${HEADER_STYLE}">
                <h1 style="margin: 0; font-size: 24px;">Account Approved: ${institutionName}</h1>
            </div>
            <div style="${BODY_STYLE}">
                <h2 style="color: #2563eb; margin-top: 0;">Your Institution Account is Ready!</h2>
                <p>Dear ${institutionName},</p>
                <p>We are excited to inform you that your enrollment request has been **approved!** You can now log in to your dashboard to manage your profile and courses.</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px dashed #cccccc;">
                  <h3 style="margin-top: 0; color: #1f2937;">Your Login Credentials:</h3>
                  <p style="margin: 5px 0;"><strong>Username/Email:</strong> <span style="font-weight: bold; color: #059669;">${username}</span></p>
                  <p style="margin: 5px 0;"><strong>Password:</strong> <span style="font-weight: bold; color: #059669;">${password}</span></p>
                </div>
                
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="${CTA_BUTTON_STYLE}">
                    Go to Dashboard
                </a>
                
                <p style="color: #dc2626; font-size: 14px;"><strong>Action Required:</strong> Please change your password immediately after your first login for security purposes.</p>
                
                <p style="margin-top: 30px;">Best regards,<br>The PadhaiOn Team</p>
            </div>
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
      <div style="${BASE_STYLE}">
            <div style="${HEADER_STYLE}">
                <h1 style="margin: 0; font-size: 24px;">Consultation Approved!</h1>
            </div>
            <div style="${BODY_STYLE}">
                <h2 style="color: #059669; margin-top: 0;">Your Appointment is Set!</h2>
                <p>Dear ${name},</p>
                <p>Your consultation request has been successfully **approved and scheduled** by our team.</p>
                
                <div style="background-color: #ecfdf5; border-left: 5px solid #059669; padding: 15px; border-radius: 4px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #059669;">Consultation Details:</h3>
                  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr><td style="padding: 5px 0; font-weight: bold; width: 30%;">Date:</td><td style="padding: 5px 0;">${consultationDetails.scheduledDate}</td></tr>
                    <tr><td style="padding: 5px 0; font-weight: bold;">Time:</td><td style="padding: 5px 0;">${consultationDetails.scheduledTime}</td></tr>
                    <tr><td style="padding: 5px 0; font-weight: bold;">Type:</td><td style="padding: 5px 0;">${consultationDetails.consultationType}</td></tr>
                    <tr><td style="padding: 5px 0; font-weight: bold;">Mode:</td><td style="padding: 5px 0;">${consultationDetails.meetingType}</td></tr>
                    ${consultationDetails.meetingType === "online" 
                      ? `<tr><td style="padding: 5px 0; font-weight: bold;">Link:</td><td style="padding: 5px 0;"><a href="${consultationDetails.meetingLink}" style="color: #2563eb;">Join Meeting</a></td></tr>` 
                      : `<tr><td style="padding: 5px 0; font-weight: bold;">Location:</td><td style="padding: 5px 0;">${consultationDetails.meetingLocation}</td></tr>`}
                  </table>
                  ${consultationDetails.message ? `<p style="margin-top: 10px; border-top: 1px solid #d1d5db; padding-top: 10px;"><strong>Notes:</strong> ${consultationDetails.message}</p>` : ''}
                </div>
                
                <p>Please be prepared for your consultation. We look forward to meeting with you.</p>
                
                <p style="margin-top: 30px;">Best regards,<br>The PadhaiOn Team</p>
            </div>
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
  sendVerificationOtpEmail,
  sendCredentialsEmail,
  sendConsultationEmail,
};