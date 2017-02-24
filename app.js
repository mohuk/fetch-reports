const db = require('./db');
const projectModel = require('./models/project');
const reportModel = require('./models/report');
const queries = require('./config/queries');
const rp = require('request-promise');
const lodash = require('lodash');

db.connect();

projectModel.find({id: 32}).lean()
  .then((res) => {
    return Promise.all(lodash.flattenDeep(res.map((project) => getReports(project.id, project.currentIndex))));
  })
  .then((reports) => {
    db.disconnect();
  })
  .catch((error) => {
    console.log(`Error: ${error.stack}`)
    db.disconnect();
  });


function getReports(id, currentIndex){
  return prepareReportUris(id, currentIndex).map(queryObj => {
    let options = {
      uri: queryObj.uri,
      json: true
    };
    console.log(`Getting from ${options.uri}`);
    return rp(options)
      .then((response) => {
        let data = {};
        data[queryObj.name] = response;
        console.log(`Received report ${options.uri}`, data);
        return reportModel.findOneAndUpdate({
          _id: { id: id, reportIndex: queryObj.reportIndex }}, data, { upsert: true }).exec();
      })
  });
}

function prepareReportUris(id, currentIndex){
  let uris = [];
  for(let i=1; i <= currentIndex; i++){
    let reportQueries = queries.queries.map((queryName) => {
      return {
        name: queryName,
        reportIndex: i,
        uri: `${queries.baseRoute}/${id}/${queryName}?reportIndex=${i}`
      };
    });
    uris = uris.concat(reportQueries);
  }
  return uris;
}
