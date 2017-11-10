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

const options = {
  user_agent: process.env.TR_OPT_USER_AGENT,
  workspace_id: process.env.TR_OPT_WORKSPACE_ID,
  page: 1,
  project_ids: process.env.TR_OPT_PROJECT_IDS,
};

const getDurationForTags = (data) => {
  const tags = ['']; // empty tag is categorized as 'general'

  // extract tag names from data and remove repeated tags
  tags.push(...uniq(flatten(pluck(data, 'tags'))));

  // calculate total duration for each tag
  tags.forEach((tag) => {
    const dataWithTag = tag ?
      filter(data, d => contains(d.tags, tag)) : filter(data, d => d.tags.length === 0);

    const tagName = !tag ? 'general' : tag;
    const msDurOfTag = reduce(dataWithTag, (memo, d) => memo + d.dur, 0);
    const hMDurOfTag = duration(msDurOfTag);
    const durationString = `${hMDurOfTag.hours()}:${hMDurOfTag.minutes()}`;

    logger.info(`${tagName}: ${durationString}`);
  });
};

toggl.detailedReport(options, (err, { data }) => {
  if (err) throw err;
  if (data) {
    getDurationForTags(data);

    // print descriptive list of entries
  } else {
    logger.info('did not get any data :()');
  }
});
