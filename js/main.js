$( document ).ready(function() {
});

var testCoordinates=[17.9919036,59.2985901]

var int=self.setInterval(function(){getLocation()},1000);
var currentPosition=[];
var previousPosition=[];

function getLocation()
{  
  navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position)
{
 document.getElementById('longval2').value=position.coords.longitude;   
 document.getElementById('latval2').value=position.coords.latitude; 
 currentPosition=[position.coords.longitude,position.coords.latitude]
 
 if(getDistance(currentPosition[0],currentPosition[1],testCoordinates[0],testCoordinates[1])<5)
 {
    document.getElementById('result').value="DET FUNKAR"; 
 }
}


/*$(document).on("mouseover", "#images img", function() {
  var imageClass=$(this).attr("class");
  var audio=new Audio("wood/wood"+imageClass+".ogg");;
  audio.play();
});*/

function getDistance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
  Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
  Math.sin(dLon/2) * Math.sin(dLon/2)
  ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c*1000; // Distance in m
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
