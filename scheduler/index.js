const schedule = require('node-schedule');

const cronRule = new schedule.RecurrenceRule();
// Heroku server is at GMT + 00:00
cronRule.hour = 12; // local time is -5:00, so this should go off at 7:31
cronRule.minute = 31;

module.exports = {
  cronRule,
};
