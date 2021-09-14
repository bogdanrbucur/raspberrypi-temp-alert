const fs = require("fs");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

let systemEmail = process.env.SCRIPT_EMAIL_USER;
let systemPass = process.env.SCRIPT_EMAIL_PASS;
let alertedEmail = process.env.ALERTED_EMAIL;

console.log(systemEmail);
console.log(systemPass);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: systemEmail,
    password: systemPass,
  },
});

const mailOptions = {
  from: systemEmail,
  to: alertedEmail,
  subject: "Raspberry Pi Temp. Alert",
  text: "CPU temp. above",
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});

function getTemp() {
  fs.readFile(
    "/sys/class/thermal/thermal_zone0/temp",
    "utf8",
    function (err, data) {
      if (err) {
        return console.log(err);
      }
      console.log(`${(parseFloat(data) / 1000).toFixed(1)} C`);
      return `${(parseFloat(data) / 1000).toFixed(1)} C`;
    }
  );
}

getTemp();
