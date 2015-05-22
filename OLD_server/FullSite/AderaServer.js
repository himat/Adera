var spark = require('spark');
var http = require('http');
var express = require('express');

app = express();
app.use(express.static(__dirname + '/public'));
app.listen(8080);

var varCb = function(err, data) {
        if (err) {
          console.log('An error occurred while getting core attrs:', err);
        } else {
          console.log('Core attr retrieved successfully:', data);
		  console.log("Number of pills: " + data.result);
        }
      };

spark.on('login', function() {
	console.log("logged in");

  //Get updates for global test event
  spark.onEvent('event', function(data) {
    //console.log("Event: " + data);
  });
    
    spark.getEventStream(false, 'mine', function(data) {
        console.log("event stream event: " + JSON.stringify(data) + "\n");
    });
  
  //Get event for specific core
  spark.listDevices().then(function(devices){
      console.log(devices[0]);
      console.log(devices[1]);
    devices[1].onEvent('capOff', function(data) {
      console.log("Event: capOff");
    });
	
	 devices[1].onEvent('capOn', function(data) {
      console.log("Event: capOn");
    });
	
	 devices[1].onEvent('apxPillCount', function(data) {
	  console.log("Event pill count: " + data);
	  devices[1].getVariable('apxPillCount', varCb);
	  
	  //var parsedData = JSON.parse(varCb);
	  //console.log("Actual pill count: " + parsedData.result);
      
    });
	
	
	
  });

});

// Login as usual
spark.login({accessToken: '31f6d1bb72071b4025c220f882b5a95a35f396d8'});

/*
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8080);
*/

console.log('Server running on port 8080.');