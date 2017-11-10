const TogglClient = require('toggl-api');

const apiToken = process.env.TR_TOGGL_API_TOKEN;
const toggl = new TogglClient({ apiToken });

module.exports = toggl;
