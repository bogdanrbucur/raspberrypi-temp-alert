# RaspberryPi Temperature Alert

Simple Node.js script to check the CPU temperature and send an email alert if above set thresholds.

Inspired by Leonardo Gentile's [Python script](https://gist.github.com/LeonardoGentile/7a5330e6bc55860feee5d0dd79e7965d) for the same thing.

Prerequisites:

- Node.js:
  `sudo apt install nodejs`
- NPM dependencies:
  run `npm i` in the script folder
- Rename .`env.example` to `.env` and update it
