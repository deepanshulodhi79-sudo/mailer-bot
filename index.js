const axios = require("axios");
const fs = require("fs");

// files read karo
const emails = fs.readFileSync("emails.txt", "utf-8").split("\n");
const subject = fs.readFileSync("subject.txt", "utf-8");
const message = fs.readFileSync("message.txt", "utf-8");

async function sendMail(toEmail) {
  try {
    await axios.post(
      "https://api.mailgun.net/v3/mg.clientboost.in/messages",
      new URLSearchParams({
        from: "Dipanshu Lodhi <postmaster@mg.clientboost.in>",
        "h:Reply-To": "hello@clientboost.in",
        to: toEmail,
        subject: subject,
        text: message,
      }),
      {
        auth: {
          username: "api",
          password: process.env.MAILGUN_API_KEY,
        },
      }
    );

    console.log("✅ Sent:", toEmail);
  } catch (err) {
    console.log("❌ Failed:", toEmail);
  }
}

async function start() {
  for (let i = 0; i < emails.length; i++) {
    let email = emails[i].trim();
    if (!email) continue;

    await sendMail(email);

    await new Promise(r => setTimeout(r, 30000)); // delay
  }
}

start();
