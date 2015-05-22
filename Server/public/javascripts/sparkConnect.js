var spark = require('spark')


spark.on('login', function() {
	console.log("logged in to spark api");
    populateTable();
    console.log(test.test);
    
  //Get updates for global test event
  spark.onEvent('event', function(data) {
    console.log("Event: " + data);
  });
    
    //Get updates for every event from our devices
    spark.getEventStream(false, 'mine', function(data) {
        console.log("event stream event: " + JSON.stringify(data) + "\n");
        //TODO: parse the data and output accordingly on site
    });
    
});
         
//Login to the spark api
spark.login({accessToken: '31f6d1bb72071b4025c220f882b5a95a35f396d8'});



