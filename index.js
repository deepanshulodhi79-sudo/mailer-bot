const nodemailer = require("nodemailer");

async function sendMail() {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 465,           // FIXED
      secure: true,        // FIXED (important)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "Test Mail 🚀",
      text: "Mail working successfully!",
    });

    console.log("✅ Email sent!");
  } catch (err) {
    console.log("❌ Error:", err);
  }
}

// 🔁 Har 5 minute me mail
setInterval(sendMail, 300000);

// 🚀 Start hote hi ek mail bhej de
sendMail();
