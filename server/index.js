const express = require('express');
const app = express();
const request = require('request');
const path = require('path');

const DATA_FORMAT = 'json';
const API_KEY = process.env.API_KEY;
const dataSources = require('../src/dataURIs.json');
const urls = Object.keys(dataSources);

let data = {};

function updateData() {
  console.log('updating...');

  urls.forEach(url => {
    request(dataSources[url].replace('${API_KEY}', API_KEY), function(error, response, body) {
      if (error) {
        console.error(`failed to load response for ${url}:`, error);
        return;
      }
      try {
        data[url] = JSON.parse(body);
      } catch (e) {
        console.error(`failed to parse response for ${url}:`, e);
      }
    });
  });
}

setInterval(updateData, 5 * 60 * 1000);
updateData();

app.use('/static', express.static('static'));

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/data/:series.json', function(request, response) {
  let series = request.params.series;
  if (series in data) {
    response.json(data[series]);
  } else {
    response.status(404);
    response.end();
  }
});

var listener = app.listen(process.env.PORT, function() {
  console.log(`app is listening on port ${listener.address().port}.`);
});
