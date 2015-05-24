function getTimeStamp(){
		var currentDate = new Date();
		var timeStamp = (currentDate.getMonth()+1) + "/" + currentDate.getDate()
		+ "/" + currentDate.getFullYear() + " @ " 
		+ currentDate.getHours() + ":" 
		+ currentDate.getMinutes() + ":" + currentDate.getSeconds();
		
		return timeStamp;
}

spark.on('login', function() {
    console.log("logged in to spark api");
    
    
    //Get updates for every event from our devices
    spark.getEventStream(false, 'mine', function(data) {
        var rawData = JSON.stringify(data)
        console.log("event stream event: " + rawData + "\n");
        var data = JSON.parse(rawData);
        console.log("core id: " + data.coreid);
        if(data.name === "apxPillCount")
        {
            console.log("pill count: " + data.data);
            
            var dataUpdate = {
                'TimeStamp' : getTimeStamp(),
                'pills' : data.data 
            }
            
            var corePostName;
            if(data.coreid === '53ff6c066667574825460967')
                corePostName = 'newPlaid';
            else
                corePostName = 'newBlue';
            
             // Use AJAX to post the object to our dataupdate service
            $.ajax({
                type: 'POST',
                data: dataUpdate,
                url: '/users/'+corePostName,
                dataType: 'JSON'
            }).done(function( response ) {
                // Check for successful (blank) response
                if (response.msg === '') {
                    // Update the table
                    populateTable();

                }
                else {

                    // If something goes wrong, alert the error message that our service returns
                    alert('Error: ' + response.msg);

                }
            });
        }
        
    });
    
});
         
//Login to the spark api
spark.login({accessToken: '31f6d1bb72071b4025c220f882b5a95a35f396d8'});

/* The event data that comes in

event stream event: {"data":"1","ttl":"60","published_at":"2015-05-23T23:58:48.826Z","coreid":"53ff6c066667574825460967","name":"capOn"}


event stream event: {"data":"0","ttl":"60","published_at":"2015-05-23T23:58:48.830Z","coreid":"53ff6c066667574825460967","name":"apxPillCount"}

*/

