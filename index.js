const axios = require("axios");
const fs = require("fs");

// read files
const emails = fs.readFileSync("emails.txt", "utf-8").split("\n");
const subject = fs.readFileSync("subject.txt", "utf-8").trim();
const message = fs.readFileSync("message.txt", "utf-8").trim();

// sent log
const sent = fs.existsSync("sent.txt")
  ? fs.readFileSync("sent.txt", "utf-8").split("\n")
  : [];

// delay random (anti spam)
function randomDelay() {
  return Math.floor(Math.random() * (60000 - 20000)) + 20000; // 20–60 sec
}

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

    // save sent
    fs.appendFileSync("sent.txt", toEmail + "\n");

  } catch (err) {
    console.log("❌ Failed:", toEmail);
  }
}

async function start() {
  for (let email of emails) {
    email = email.trim();
    if (!email) continue;

    // ❌ skip duplicate
    if (sent.includes(email)) {
      console.log("⏭️ Skipped:", email);
      continue;
    }

    await sendMail(email);

    // 🔥 random delay (anti spam)
    await new Promise(r => setTimeout(r, randomDelay()));
  }
}

start();
