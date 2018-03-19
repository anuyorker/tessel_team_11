'use strict';

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic climate example logs a stream
of temperature and humidity to the console.
*********************************************/

var tessel = require('tessel');
var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port['A']);

climate.on('ready', function() {
  console.log('Connected to climate module');

  // Loop forever
  setImmediate(function loop() {
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
        setTimeout(loop, 10000);
      });
    });
  });
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});

module.exports = climate;
