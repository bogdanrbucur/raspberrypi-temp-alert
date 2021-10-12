const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
// Load .env from current folder, no matter the cwd
require("dotenv").config({ path: path.resolve(__dirname, './.env') }); 
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
try {
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
} catch (err) {
  console.log(err);
}

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
  try {
    // Get the CPU temperature
    let temp = await getTemp();

    console.log(`CPU temp: ${temp} C.`);

    // Check if it's critical
    if (temp > criticalTemp) {
      console.log(`CPU temp critical ${temp} C.`);

      // Build the email
      const mailOptions = {
        from: systemEmail,
        to: alertedEmail,
        subject: "Warning! Raspberry Pi temperature critical",
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
      //
      // Could also shut down the Raspberry Pi here or do some other stuff
      //

      // Check if the temperature is high
    } else if (temp > highTemp) {
      console.log(`CPU temp high ${temp} C.`);

      // Build the email
      const mailOptions = {
        from: systemEmail,
        to: alertedEmail,
        subject: "Warning! Raspberry Pi temperature high",
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
  } catch (err) {
    console.log(err);
  }
}

// Call the function to check the temperature and send the emails
tempMon();
