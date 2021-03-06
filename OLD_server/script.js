function getTimeStamp(){
		var currentDate = new Date();
		var timeStamp = "Last Sync: " + (currentDate.getMonth()+1) + "/" + currentDate.getDate()
		+ "/" + currentDate.getFullYear() + " @ " 
		+ currentDate.getHours() + ":" 
		+ currentDate.getMinutes() + ":" + currentDate.getSeconds();
		
		return timeStamp;
	}
    function start() {
	
		var status = document.getElementById("status");
        var timestamp   = document.getElementById("timestamp");
		var thresholdStatus = document.getElementById("thresholdStatus");
		
        status.innerHTML = "Waiting for data...";
		document.getElementById("connect").style.visibility = "hidden";
        var deviceID = "53ff6c066667574825460967";//"54ff6d066667515111461467";
        var accessToken = "31f6d1bb72071b4025c220f882b5a95a35f396d8";
        var eventSource = new EventSource("https://api.spark.io/v1/devices/" + deviceID + "/events/?access_token=" + accessToken);
		

        eventSource.addEventListener('open', function(e) {
            console.log("Opened!"); },false);

        eventSource.addEventListener('error', function(e) {
            console.log("Errored!"); },false);

		eventSource.addEventListener('capOff', function(e) {
            var parsedData = JSON.parse(e.data);
			console.log(parsedData);
            
            //status.innerHTML = "Core: " + parsedData.coreid + " off";
			status.innerHTML = "Eloise's bottle is open.";
            status.style.fontSize = "85px";
			
			thresholdStatus.innerHTML = "";
			
			
            timestamp.innerHTML = "At timestamp " + getTimeStamp();
            timestamp.style.fontSize = "30px";
        }, false);
		
		eventSource.addEventListener('capOn', function(e) {
            var parsedData = JSON.parse(e.data);
            
			console.log("cap on");
            //status.innerHTML = "Core: " + parsedData.coreid + " uptime: " + parsedData.data + " (h:m:s)";
            //status.style.fontSize = "28px";
            //timestamp.innerHTML = "At timestamp " + parsedData.published_at;
            //timestamp.style.fontSize = "30px";
        }, false);
		
		eventSource.addEventListener('apxPillCount', function(e) {
            var parsedData = JSON.parse(e.data);
			var pillCount = parsedData.data;
            
			
            status.innerHTML = "There are approximately " + pillCount + " pills in Eloise's bottle.";
			if(pillCount > 100)
			{
				thresholdStatus.innerHTML = "Above threshold";
				thresholdStatus.style.color = "blue";
			}
			else if(pillCount > 80)
			{
				thresholdStatus.innerHTML = "Below 100 threshold";
				thresholdStatus.style.color = "#66CCFF";
			}
			else if(pillCount > 60)
			{
				thresholdStatus.innerHTML = "Below 80 threshold";
				thresholdStatus.style.color = "#E0F0FF";
			}
			else if(pillCount > 40)
			{
				thresholdStatus.innerHTML = "Below 60 threshold";
				thresholdStatus.style.color = "#FFE0E0";
			}
			else if(pillCount > 20)
			{
				thresholdStatus.innerHTML = "Below 40 threshold";
				thresholdStatus.style.color = "#FF6262";
			}
			else
			{
				thresholdStatus.innerHTML = "Below critical threshold";
				thresholdStatus.style.color = "red";
			}
			thresholdStatus.style.fontSize = "75px";
			
            status.style.fontSize = "85px";
            timestamp.innerHTML = "At timestamp " + getTimeStamp();
            timestamp.style.fontSize = "30px";
        }, false);
		
		/*eventSource.addEventListener('Uptime', function(e) {
            var parsedData = JSON.parse(e.data);
            var status = document.getElementById("uptime");
            var timestamp   = document.getElementById("tstamp");
            status.innerHTML = "Core: " + parsedData.coreid + " uptime: " + parsedData.data + " (h:m:s)";
            status.style.fontSize = "28px";
            timestamp.innerHTML = "At timestamp " + parsedData.published_at;
            timestamp.style.fontSize = "9px";
        }, false);*/
    }