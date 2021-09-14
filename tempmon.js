const fs = require("fs");
const nodemailer = require('nodemailer');
const dotenv = require("dontenv").config();

let systemEmail = process.env.SCRIPT_EMAIL_USER;
let systemPass = process.env.SCRIPT_EMAIL_PASS;
let alertedEmail = process.env.ALERTED_EMAIL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: systemEmail,
    pass: systemPass
  }
});

const mailOptions = {
  from: systemEmail,
  to: alertedEmail,
  subject: 'Raspberry Pi Temp. Alert',
  text: 'CPU temp. above'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});