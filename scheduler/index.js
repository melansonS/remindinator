const schedule = require('node-schedule');

const cronRule = new schedule.RecurrenceRule();
// Heroku server is at GMT + 00:00
// cronRule.hour = 12; // local time is -5:00, so this should go off at 7:15
// cronRule.minute = 15;
cronRule.hour = 19; 
cronRule.minute = 5;

module.exports = {
  cronRule,
};
