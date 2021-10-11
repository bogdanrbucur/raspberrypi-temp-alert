const fs = require("fs");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// Environment variables stored in .env
const systemEmail = process.env.SCRIPT_EMAIL_USER;
const alertedEmail = process.env.ALERTED_EMAIL;
const refreshToken = process.env.REFRESH_TOKEN;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Define your own thresholds
const highTemp = 68;
const criticalTemp = 78;

// OAuth2 info
const oauth2Client = new OAuth2(
  clientId, // ClientID
  clientSecret, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: refreshToken,
});
const accessToken = oauth2Client.getAccessToken();

// Login to email service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "systemalert9@gmail.com",
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
    accessToken: accessToken,
  },
  logger: false,
});

// Function to read the temperature from the file
async function getTemp() {
  return new Promise(async (resolve, reject) => {
    fs.readFile(
      "/sys/class/thermal/thermal_zone0/temp",
      "utf8",
      function (err, data) {
        if (err) {
          reject(err);
        }
        // Format the value from the file
        resolve((parseFloat(data) / 1000).toFixed(1));
      }
    );
  });
}

async function tempMon() {
  // Get the CPU temperature
  let temp = await getTemp();

  // Check if it's critical
  if (temp > criticalTemp) {
    console.log(`CPU temp critical ${temp} C.`);

    // Build the email
    const mailOptions = {
      from: systemEmail,
      to: alertedEmail,
      subject: "Warning! Raspberry Pi temp. critical",
      text: `CPU temperature critical: ${temp} C.`,
    };
    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Could also shut down the Raspberry Pi here

    // Check if the temperature is high
  } else if (temp > highTemp) {
    console.log(`CPU temp high ${temp} C.`);

    // Build the email
    const mailOptions = {
      from: systemEmail,
      to: alertedEmail,
      subject: "Warning! Raspberry Pi temp. high",
      text: `CPU temperature high: ${temp} C.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}

// Call the function to check the temperature and send the emails
tempMon();
