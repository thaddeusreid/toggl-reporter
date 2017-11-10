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

const readableDuration = (ms) => {
  const hMDurOfTag = duration(ms);
  return `${hMDurOfTag.hours()}:${hMDurOfTag.minutes()}`;
};

const printDataDescriptions = (data) => {
  data.forEach(({ description, dur, tags }) => {
    const tagStr = !tags ? 'general' : tags.join('/');
    logger.info(`${description} -- [${tagStr}](${readableDuration(dur)})`);
  });
};

const printDurationForTags = (data) => {
  const tags = ['']; // empty tag is categorized as 'general'

  // extract tag names from data and remove repeated tags
  tags.push(...uniq(flatten(pluck(data, 'tags'))));

  // calculate total duration for each tag
  tags.forEach((tag) => {
    const dataWithTag = tag ?
      filter(data, d => contains(d.tags, tag)) : filter(data, d => d.tags.length === 0);

    const tagName = !tag ? 'general' : tag;
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
    printDurationForTags(data);

    printDataDescriptions(data);
  } else {
    logger.info('did not get any data :()');
  }
});
