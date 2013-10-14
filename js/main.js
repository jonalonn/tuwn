$( document ).ready(function() {
});

var testCoordinates=[17.9919036,59.2985901]
var coordinate1={
  longitude:'17.9919036',
  latitude:'59.2985901',
  type: 'techno1.wav'
}
var coordinate2={
  longitude:'17.9916759',
  latitude:'59.2987967',
  type: 'techno2.wav'
}
var coordinate3={
  longitude:'17.991968241047843',
  latitude:'59.298788792444389',
  type: 'techno3.wav'
}

var coordinateArray=[coordinate1,coordinate2,coordinate3]

var int=self.setInterval(function(){getLocation()},1000);

function getLocation()
{  
  navigator.geolocation.getCurrentPosition(showPosition);
}
var previousPosition=[];
var currentPosition=[];
function showPosition(position)
{
  previousPosition=currentPosition
  document.getElementById('longval2').value=position.coords.longitude;   
  document.getElementById('latval2').value=position.coords.latitude; 
  currentPosition=[position.coords.longitude,position.coords.latitude]
  if(currentPosition[0]!==previousPosition[0]){
    for(var i=0;i<coordinateArray.length;i++){
      var idName="distance"+i
      var distance= getDistance(currentPosition[0],currentPosition[1],coordinateArray[i].longitude,coordinateArray[i].latitude)
      console.log(i)
      if(distance<15){
        document.getElementById(idName).value=distance; 
        document.getElementById('result').value="DET FUNKAR"; 
        var audio=new Audio('sounds/'+coordinateArray[i].type);;
        audio.play();
      }
      else{
        document.getElementById(idName).value=distance; 
      }
    }
  }
}
/*$(document).on("mouseover", "#images img", function() {
  var imageClass=$(this).attr("class");
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
