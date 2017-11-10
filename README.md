# toggl-reporter
generate weekly reports of my [toggl](https://toggl.com/) entries.

utilizes `toggl-api` which is a wrapper for the official HTTP Toggl API. [report docs](https://github.com/toggl/toggl_api_docs/blob/master/reports.md) are useful!

i use this tool at the end of my work week to: 

* review recorded time entries
* calculate total time spent for a given `tag` and `untagged` entries

## setup
duplicate `sample.env` and provide the requisite information

* TR_TOGGL_API_TOKEN: Toggl API Token
* TR_OPT_USER_AGENT: Toggl email address
* TR_OPT_WORKSPACE_ID: Toggl Workspace ID
* TR_OPT_PROJECT_IDS: List of Toggl Project IDs separated by comma

## todo
* test
* add more reporting options
