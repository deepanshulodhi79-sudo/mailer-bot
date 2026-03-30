const axios = require("axios");
const fs = require("fs");

// read files
const emails = fs.readFileSync("emails.txt", "utf-8").split("\n");
const subjects = fs.readFileSync("subject.txt", "utf-8").split("\n");

// multiple messages
const messages = [
  fs.readFileSync("message.txt", "utf-8"),
  fs.readFileSync("message2.txt", "utf-8")
];

// sent log
const sent = fs.existsSync("sent.txt")
  ? fs.readFileSync("sent.txt", "utf-8").split("\n")
  : [];

// random subject
function getRandomSubject() {
  return subjects[Math.floor(Math.random() * subjects.length)].trim();
}

// random message
function getRandomMessage() {
  return messages[Math.floor(Math.random() * messages.length)];
}

// random delay (20–60 sec)
function randomDelay() {
  return Math.floor(Math.random() * (60000 - 20000)) + 20000;
}

async function sendMail(toEmail) {
  try {
    await axios.post(
      "https://api.mailgun.net/v3/mg.clientboost.in/messages",
      new URLSearchParams({
        // 🔥 HUMAN NAME + REAL EMAIL
        from: "Dipanshu Lodhi <hello@clientboost.in>",

        // 🔥 reply system (ImproveMX)
        "h:Reply-To": "hello@clientboost.in",

        to: toEmail,
        subject: getRandomSubject(),
        text: getRandomMessage(),
      }),
      {
        auth: {
          username: "api",
          password: process.env.MAILGUN_API_KEY,
        },
      }
    );

    console.log("✅ Sent:", toEmail);

    // save sent email
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

    // ⏳ anti-spam delay
    await new Promise(r => setTimeout(r, randomDelay()));
  }
}

start();
