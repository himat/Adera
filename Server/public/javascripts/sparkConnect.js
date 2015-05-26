function getTimeStamp(){
		var currentDate = new Date();
		var timeStamp = (currentDate.getMonth()+1) + "/" + currentDate.getDate()
		+ "/" + currentDate.getFullYear() + " @ " 
		+ currentDate.getHours() + ":" 
		+ currentDate.getMinutes() + ":" + currentDate.getSeconds();
		
		return timeStamp;
}

var dataUpdate;

function sendPillUpdate(coreID) {
    var coreName;
    if (coreID === '53ff6c066667574825460967')
        coreName = 'aderaPlaid';
    else //54ff6d066667515111461467
        coreName = 'aderaBlue';

    // Use AJAX to post the object to our dataupdate service
    $.ajax({
        type: 'POST',
        data: dataUpdate,
        url: '/users/' + coreName,
        dataType: 'JSON'
    }).done(function (response) {
        // Check for successful (blank) response
        if (response.msg === '') {
            // Update the table
            populateTable(coreName);

        } else {

            // If something goes wrong, alert the error message that our service returns
            alert('Error: ' + response.msg);

        }
    });
}

var raspberryPi = true;

if(raspberryPi) {
    console.log("RASPBERRY PI MODE ENABLED");
    
    var ID_aderaPlaid = "54ff6d066667515111461467", ID_aderaBlue="53ff6c066667574825460967";
    var accessToken = "31f6d1bb72071b4025c220f882b5a95a35f396d8";
    var eventSourcePlaid = new EventSource("https://api.spark.io/v1/devices/" + ID_aderaPlaid + "/events/?access_token=" + accessToken);
    var eventSourceBlue = new EventSource("https://api.spark.io/v1/devices/" + ID_aderaBlue + "/events/?access_token=" + accessToken);
    
    var eventSourceAll = new EventSource("https://api.spark.io/v1/devices/events/?access_token=" + accessToken);
    
    eventSourceAll.addEventListener('open', function(e) {
        console.log("Opened!"); 
        alert("Opened!");
    },false);
    
    eventSourceAll.addEventListener('error', function(e) {
        console.log("Errored!"); 
        alert("Errored!");
    },false);
    
    eventSourceAll.addEventListener('apxPillCount', function(e) {
        var parsedData = JSON.parse(e.data);
		var pillCount = parsedData.data;
        console.log("pill count: " + pillCount);
        console.log("core id: " + parsedData.coreid);
        
        dataUpdate = {
                    'TimeStamp' : getTimeStamp(),
                    'pills' : pillCount 
                }
                
        sendPillUpdate(parsedData.coreid);
        
        
    }, false);
    
}
else {//computer 
    
    console.log("GENERAL MODE ENABLED");

    spark.on('login', function() {
        console.log("logged in to spark api");
        


        //Get updates for every event from our devices
        spark.getEventStream(false, 'mine', function(data) {
            var rawData = JSON.stringify(data);
            console.log("event stream event: " + rawData + "\n");
            var data = JSON.parse(rawData);
            console.log("core id: " + data.coreid);
            if(data.name === "apxPillCount")
            {
                console.log("pill count: " + data.data);
                //alert("pill count: " + data.data);

                dataUpdate = {
                    'TimeStamp' : getTimeStamp(),
                    'pills' : data.data 
                }
                
                sendPillUpdate(data.coreid);

                
            }

        });

    });
}

//Login to the spark api
spark.login({accessToken: '31f6d1bb72071b4025c220f882b5a95a35f396d8'});

/* The event data that comes in

event stream event: {"data":"1","ttl":"60","published_at":"2015-05-23T23:58:48.826Z","coreid":"53ff6c066667574825460967","name":"capOn"}


event stream event: {"data":"0","ttl":"60","published_at":"2015-05-23T23:58:48.830Z","coreid":"53ff6c066667574825460967","name":"apxPillCount"}

*/

