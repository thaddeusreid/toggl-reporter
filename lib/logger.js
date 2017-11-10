/* eslint-disable no-console */
const logger = {
  error: (...messages) => console.error(...messages),
  info: (...messages) => console.log(...messages),
};
/* eslint-enable no-console */

module.exports = logger;
