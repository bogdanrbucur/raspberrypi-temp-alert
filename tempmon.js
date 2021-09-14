const fs = require("fs");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

// Environment variables stored in .env
const systemEmail = process.env.SCRIPT_EMAIL_USER;
const systemPass = process.env.SCRIPT_EMAIL_PASS;
const alertedEmail = process.env.ALERTED_EMAIL;

// Define your own thresholds
const highTemp = 55;
const criticalTemp = 78;

// Login to email service
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: systemEmail,
    password: systemPass,
  },
  logger: true,
  debug: false,
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
    console.log(`temp is critical ${temp}`);

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
    console.log(`temp is high ${temp}`);

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
