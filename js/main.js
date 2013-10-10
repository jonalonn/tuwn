$( document ).ready(function() {
function getLocation()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showPosition,showError);
    }
  else{
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position)
  {
  console.log("Latitude: " + position.coords.latitude + 
  " Longitude: " + position.coords.longitude)    
  }
function showError(error)
  {
  switch(error.code) 
    {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.")
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.")
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.")
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.")
      break;
    }
  }

  function calculateDistance(lat1, long1, lat2, long2) {
    // Translate to a distance
    var distance =
      Math.sin(lat1 * Math.PI) * Math.sin(lat2 * Math.PI) +
      Math.cos(lat1 * Math.PI) * Math.cos(lat2 * Math.PI) * Math.cos(Math.abs(long1 - long2) * Math.PI);

    // Return the distance in miles
    //return Math.acos(distance) * 3958.754;

    // Return the distance in meters
    return Math.acos(distance) * 6370981.162;
} // CalculateDistance


getLocation();
});