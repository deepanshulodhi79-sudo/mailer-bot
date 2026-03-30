const axios = require("axios");
const fs = require("fs");

// 👉 email list file
const emails = fs.readFileSync("emails.txt", "utf-8").split("\n");

// 👉 mail send function
async function sendMail(toEmail) {
  try {
    await axios.post(
      "https://api.mailgun.net/v3/mg.clientboost.in/messages",
      new URLSearchParams({
        from: "ClientBoost <postmaster@mg.clientboost.in>",

        // 🔥 IMPORTANT (reply idhar aayega)
        "h:Reply-To": "hello@clientboost.in",

        to: toEmail,
        subject: "Quick question",

        text: `Hi,

I came across your business and wanted to ask something quick.

Are you currently looking to get more customers this month?

If yes, I can share something simple that’s working right now.

Let me know.

Thanks`,
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
    console.log("❌ Failed:", toEmail, err.message);
  }
}

// 👉 main loop
async function start() {
  for (let i = 0; i < emails.length; i++) {
    let email = emails[i].trim();
    if (!email) continue;

    await sendMail(email);

    // ⏳ delay (safe sending)
    await new Promise(r => setTimeout(r, 30000)); // 30 sec
  }
}

start();
