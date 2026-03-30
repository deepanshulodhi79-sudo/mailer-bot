const axios = require("axios");
const fs = require("fs");

// safe read
function readFileSafe(file, fallback = "") {
  try {
    return fs.readFileSync(file, "utf-8");
  } catch {
    return fallback;
  }
}

// data read
const emails = readFileSafe("emails.txt").split("\n");
const subjects = readFileSafe("subject.txt", "Quick question").split("\n");

const messages = [
  readFileSafe("message.txt", "Hi,\nJust a quick question."),
  readFileSafe("message2.txt", "Hi,\nAre you open to more clients?")
];

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
    await axios.post(
      "https://api.mailgun.net/v3/mg.clientboost.in/messages",
      new URLSearchParams({
        // ✅ FIXED FROM (Mailgun allowed)
        from: "Dipanshu Lodhi <postmaster@mg.clientboost.in>",

        // ✅ reply idhar aayega (ImproveMX → Gmail)
        "h:Reply-To": "hello@clientboost.in",

        to: toEmail,
        subject: getRandom(subjects),
        text: getRandom(messages),
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

    // ❌ duplicate skip
    if (sent.includes(email)) {
      console.log("⏭️ Skipped:", email);
      continue;
    }

    await sendMail(email);

    // ⏳ delay (anti spam)
    await new Promise(r => setTimeout(r, randomDelay()));
  }
}

start();
