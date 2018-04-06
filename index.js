require('dotenv').config();
const {
  contains,
  filter,
  flatten,
  pluck,
  reduce,
  uniq,
} = require('underscore');
const { duration } = require('moment');

const toggl = require('./lib/toggl');
const logger = require('./lib/logger');

const UNTAGGED_NAME = 'general';

/**
 * @method readableDuration
 * @param ms an integer of milliseconds
 *
 * converts millisecond value to string of <hours:minutes>
 */
const readableDuration = (ms) => {
  const hMDurOfTag = duration(ms);
  // return `${hMDurOfTag.hours()}:${hMDurOfTag.minutes()}`;
  const asHours = hMDurOfTag.asHours();
  return Math.round(asHours * 10) / 10;
};

/**
 * @method printDataDescriptions
 * @param data an array of Toggl time entries
 *
 * print the descriptive title of each time entry, with corresponding tag names and duration
 */
const printDataDescriptions = (data) => {
  data.forEach(({ description, dur, tags }) => {
    const tagStr = tags.length === 0 ? UNTAGGED_NAME : tags.join('/');
    logger.info(`${description} -- [${tagStr}](${readableDuration(dur)})`);
  });
};

/**
 * @method printDurationForTags
 * @param data an array of Toggl time entries
 *
 * calculate time for the entries organized by tag names.
 */
const printDurationForTags = (data) => {
  const tags = ['']; // empty tag is categorized as 'general'

  // extract tag names from data and remove repeated tags
  tags.push(...uniq(flatten(pluck(data, 'tags'))));

  // calculate total duration for each tag
  tags.forEach((tag) => {
    const dataWithTag = tag ?
      filter(data, d => contains(d.tags, tag)) : filter(data, d => d.tags.length === 0);

    const tagName = !tag ? UNTAGGED_NAME : tag;
    const msDurOfTag = reduce(dataWithTag, (memo, d) => memo + d.dur, 0);
    const durationString = readableDuration(msDurOfTag);

    logger.info(`${tagName}: ${durationString}`);
  });
};

/**
 * @app
 * fetch detailed report data, then log useful information back to the console
 */
const options = {
  user_agent: process.env.TR_OPT_USER_AGENT,
  workspace_id: process.env.TR_OPT_WORKSPACE_ID,
  project_ids: process.env.TR_OPT_PROJECT_IDS,
  page: 1,
};
toggl.detailedReport(options, (err, { data }) => {
  if (err) throw err;
  if (data) {
    printDataDescriptions(data);
    logger.info('\n-----\n');
    printDurationForTags(data);
  } else {
    logger.info('did not get any data :()');
  }
});
