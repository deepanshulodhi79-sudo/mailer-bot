const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  auth: {
    user: "postmaster@mg.clientboost.in",
    pass: process.env.PASS
  }
});

async function sendMail() {
  await transporter.sendMail({
    from: "ClientBoost <postmaster@mg.clientboost.in>",
    to: "YOUR_EMAIL@gmail.com",
    subject: "Auto Mail 🚀",
    text: "System live hai 😈"
  });

  console.log("Mail sent");
}

setInterval(sendMail, 60000); // every 1 min
