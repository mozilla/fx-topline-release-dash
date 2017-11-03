const express = require('express');
const app = express();
const request = require('request');
const path = require('path');

const DATA_FORMAT = 'json';
const API_KEY = process.env.API_KEY;
//const url = `https://sql.telemetry.mozilla.org/api/queries/3648/results.${DATA_FORMAT}?api_key=${API_KEY}`;
const dataSources = require('./src/dataURIs.json')

const urls = Object.keys(dataSources)
let data;

function updateData() {
  console.log('updating...');

  urls.forEach(url=>{
    request(dataSources[url], function(error, response, body) {
    if (error) {
      console.log(error);
      return;
    }
    try {
      data = JSON.parse(body);
    } catch (e) {
      console.error(e);
    }
  });
  })
}

setInterval(updateData, 5 * 60 * 1000);
updateData();

app.use(express.static('static'));

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/data', function(request, response) {
  response.json(data);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log(`app is listening on port ${listener.address().port}.`);
});
