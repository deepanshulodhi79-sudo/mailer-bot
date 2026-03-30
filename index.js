const axios = require("axios");
const fs = require("fs");

// safe read
function readFileSafe(file, fallback = "") {
  try {
    const data = fs.readFileSync(file, "utf-8").trim();
    return data || fallback;
  } catch {
    return fallback;
  }
}

// read data
const emails = readFileSafe("emails.txt").split("\n");

const subjects = readFileSafe("subject.txt", "Quick question")
  .split("\n")
  .filter(s => s.trim() !== "");

const messages = [
  readFileSafe("message.txt", "Hi,\nJust a quick question."),
  readFileSafe("message2.txt", "Hi,\nAre you open to more clients?")
].filter(m => m.trim() !== "");

// sent log
const sent = readFileSafe("sent.txt").split("\n");

// helpers
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)].trim();
}

function randomDelay() {
  return Math.floor(Math.random() * (60000 - 20000)) + 20000;
}

async function sendMail(toEmail) {
  try {
    const subject = getRandom(subjects);
    const message = getRandom(messages);

    await axios.post(
      "https://api.mailgun.net/v3/mg.clientboost.in/messages",
      new URLSearchParams({
        from: "Dipanshu Lodhi <postmaster@mg.clientboost.in>",
        "h:Reply-To": "hello@clientboost.in",
        to: toEmail,
        subject: subject,
        text: message, // 🔥 NEVER EMPTY NOW
      }),
      {
        auth: {
          username: "api",
          password: process.env.MAILGUN_API_KEY,
        },
      }
    );

    console.log("✅ Sent:", toEmail);
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
