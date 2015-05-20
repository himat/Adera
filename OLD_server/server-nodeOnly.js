var spark = require('spark');

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
  
  //Get event for specific core
  spark.listDevices().then(function(devices){
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

//spark.login({ accessToken: '012345' });