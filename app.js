const db = require('./db');
const projectModel = require('./models/project');
const reportModel = require('./models/report');
const queries = require('./config/queries');
const rp = require('request-promise');
const lodash = require('lodash');

db.connect();

projectModel.find().lean()
  .then((res) => {
    return Promise.all(lodash.flattenDeep(res.map((project) => getReports(project.id))));
  })
  .then((reports) => {
    db.disconnect();
  })
  .catch((error) => {
    console.log(`Error: ${error}`)
    db.disconnect();
  });


function getReports(id){
  return queries.queries.map((queryName) => {
    let options = {
      uri: `${queries.baseRoute}/${id}/${queryName}/`,
      json: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/56.0.2924.87 Safari/537.36'
      },
    };
    console.log(`Getting from ${options.uri}`);
    return rp(options)
      .then((response) => {
        let data = {};
        data[queryName] = response;
        return reportModel.findOneAndUpdate({ id: id }, data, { upsert: true }).exec();
      })
  });
}
