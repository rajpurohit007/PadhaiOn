const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer"); // Import Nodemailer

// --- CONFIGURATION ---
// Create the transporter using credentials from .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // Accessing from .env
    pass: process.env.SMTP_PASS, // Accessing from .env
  },
});

// Get all contact messages (admin only)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching contacts",
      error: error.message,
    });
  }
});

// Create new contact message AND Send Email
router.post("/", async (req, res) => {
  try {
    // 1. Save to Database (Existing Logic)
    const contact = new Contact(req.body);
    await contact.save();

    // 2. Send Email Notification (Added Logic)
    const { name, email, phone, subject, message } = req.body;

    const mailOptions = {
      from: `"PadhaiOn Contact" <${process.env.EMAIL_USER}>`, // Sender
      to: "padhaion@gmail.com", // Recipient (Your Email)
      replyTo: email, // Allows you to hit reply to answer the user
      subject: `New Contact Inquiry: ${subject || "General Inquiry"}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #2563EB;">New Message from PadhaiOn</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
        </div>
      `,
    };

    // Send the mail
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Message sent successfully and email notification dispatched.",
      data: contact,
    });

  } catch (error) {
    console.error("Contact Error:", error);
    res.status(400).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
});

module.exports = router;