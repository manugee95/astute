import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: "astutehcc.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Appointment Booking Endpoint
app.post("/api/book-appointment", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      appointmentDate,
      appointmentTime,
      captchaToken,
    } = req.body;

    // Validate reCAPTCHA token
    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET,
          response: captchaToken,
        },
      }
    );

    if (!recaptchaResponse.data.success || recaptchaResponse.data.score < 0.5) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    // Email Content
    const mailOptions = {
      from: `"Astute Healthcare Clinic" <${EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: "New Appointment Booking",
      html: `
        <div style="text-align: left;">
          <p>A new appointment has been booked. Here are the details: </p>
          <p><b>Name:</b> ${fullName}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Date:</b> ${appointmentDate}</p>
          <p><b>Time:</b> ${appointmentTime}</p>
        </div>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    console.log("Appointment booked and email sent:", {
      fullName,
      email,
      phone,
      appointmentDate,
      appointmentTime,
    });

    res.status(200).json({
      message: "Appointment booked successfully! Email sent to admin.",
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
