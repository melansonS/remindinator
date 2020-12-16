const schedule = require('node-schedule');

const cronRule = new schedule.RecurrenceRule();
// TODO: set real job time
cronRule.hour = 11;
cronRule.minute = 32;

module.exports = {
  cronRule,
};
