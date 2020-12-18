const schedule = require('node-schedule');

const cronRule = new schedule.RecurrenceRule();
// TODO: set real job time
cronRule.hour = 5;
cronRule.minute = 45;

module.exports = {
  cronRule,
};
