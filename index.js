const axios = require("axios");

async function sendMail() {
  try {
    const res = await axios.post(
      "https://api.mailgun.net/v3/mg.clientboost.in/messages",
      new URLSearchParams({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: "Test Mail 🚀",
        text: "Mail working successfully!",
      }),
      {
        auth: {
          username: "api",
          password: process.env.MAILGUN_API_KEY,
        },
      }
    );

    console.log("✅ Email sent:", res.data);
  } catch (err) {
    console.log("❌ Error:", err.response?.data || err.message);
  }
}

// 5 min
setInterval(sendMail, 300000);

// start pe ek baar
sendMail();
