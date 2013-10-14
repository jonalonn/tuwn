$( document ).ready(function() {

});
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
if(navigator.geolocation){

        var wpid = navigator.geolocation.watchPosition(success, error, {
            enableHighAccuracy: true, 
            maximumAge: 100, 
            timeout: 10000
        });

        function success(position){
          console.log("hej")
            console.log(position.coords.longitude+","+position.coords.latitude)
        }

        function error(error){
            switch(error.code){
                case 1:
                    alert('permission denied');
                    break;
                case 2:
                    alert('position unavailable');
                    break;
                case 3:
                    alert('timeout');
                    break;
                default:
                    alert('unknown error');
                    break;
            }
        }
    }


    var int=self.setInterval(function(){getLocation()},1000);
function getLocation()
  {
  
    navigator.geolocation.getCurrentPosition(showPosition);
    
  
  }
function showPosition(position)
  {
 document.getElementById('longval2').value=position.coords.longitude;   
 document.getElementById('latval2').value=position.coords.latitude; 
  }
