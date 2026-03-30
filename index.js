const axios = require("axios");
const fs = require("fs");

// read files (STRICT - no fallback)
const emails = fs.readFileSync("emails.txt", "utf-8").split("\n");

const subjects = fs.readFileSync("subject.txt", "utf-8")
  .split("\n")
  .map(s => s.trim())
  .filter(s => s !== "");

const messages = [
  fs.readFileSync("message.txt", "utf-8").trim(),
  fs.readFileSync("message2.txt", "utf-8").trim()
].filter(m => m !== "");

// sent log
const sent = fs.existsSync("sent.txt")
  ? fs.readFileSync("sent.txt", "utf-8").split("\n")
  : [];

// random helpers
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDelay() {
  return Math.floor(Math.random() * (60000 - 20000)) + 20000;
}

async function sendMail(toEmail) {
  try {
    const subject = getRandom(subjects);
    const message = getRandom(messages);

    // ❌ agar empty ho to skip
    if (!subject || !message) {
      console.log("❌ Skipped (empty content):", toEmail);
      return;
    }

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
    console.log("❌ Failed:", toEmail, err.response?.data || err.message);
  }
}

async function start() {
  for (let email of emails) {
    email = email.trim();
    if (!email) continue;

    if (sent.includes(email)) {
      console.log("⏭️ Skipped:", email);
      continue;
    }

    await sendMail(email);

    await new Promise(r => setTimeout(r, randomDelay()));
  }
}

start();
