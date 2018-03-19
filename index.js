'use strict';

// Climate dependencies
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');

var tessel = require('tessel');
var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port['A']);

// Camera dependencies
var av = require('tessel-av');
var os = require('os');
var http = require('http');
var port = 8000;
var camera = new av.Camera();

var exec = require('child_process').exec;

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'index.html')));

// app.get('/', (req, res, next) => {
//   res.json('hi');
//   // res.send('HI');
// })
exec(
  `curl -X POST --data-urlencode 'payload={"channel": "#team_11_hotaf", "username": "webhookbot", "text": "This is posted to #general and comes from a bot named webhookbot.", "icon_emoji": ":ghost:"}' https://hooks.slack.com/services/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`,
  function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  }
);
setInterval(exec(), 5000);

app.get('/', (req, res, next) => {


  climate.on('ready', function() {
    console.log('Connected to climate module');

    climate.readTemperature('f', function(err, temp) {
      if (err) console.log(err);
      climate.readHumidity(function(err, humid) {
        if (err) console.log(err);
        console.log(
          'Degrees:',
          temp.toFixed(4) + 'F',
          'Humidity:',
          humid.toFixed(4) + '%RH'
        );
      });

      climate.on('error', function(err) {
        console.log('error connecting module', err);
      });

      res.writeHead(200, { 'Content-Type': 'image/jpg' });
      camera.capture().pipe(res);
    });
  });
});

app.listen(port, () => {
  console.log(`I'm ligfdgdg dstening!`);
});

// module.exports = {
//   climate,
//   camera
// }
