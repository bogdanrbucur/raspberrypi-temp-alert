# RaspberryPi Temperature Alert

Simple Node.js script to check the Raspberry Pi's CPU temperature and send an email alert if above set thresholds. The script and instructions provided are for using Gmail with OAuth2. I found no other way to send emails with Gmail, but using this script and provided instructions to set up OAuth2 works.

Inspired by Leonardo Gentile's [Python script](https://gist.github.com/LeonardoGentile/7a5330e6bc55860feee5d0dd79e7965d) for the same thing.

Follow [these excellent instructions](https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1) to set up OAuth2 on your Gmail account to be able to send emails using nodemailer.

Prerequisites:

- Node.js:
  `sudo apt install nodejs`
- NPM dependencies: [nodemailer](https://nodemailer.com/smtp/oauth2/), [googleapis](https://www.npmjs.com/package/googleapis), [dotenv](https://www.npmjs.com/package/dotenv)

  run `npm i` in the script folder
- Rename .`env.example` to `.env` and update it using client ID, client secret and refresh token obtained using above instructions.
- Add the job to crontab using `sudo crontab -e` and adding the line `*/30 * * * * node /home/user/app/tempmon.js` to run the job every 30 minutes. Don't forget to add a blank line in crontab at the end
