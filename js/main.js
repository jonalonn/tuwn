$( document ).ready(function() {
});

var coordinate1={
  latitude:'59.33770', 
  longitude:'18.02597',
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

var coordinate4={
  longitude:'17.9919036',
  latitude:'59.2985901',
  type: 'techno4.wav'
}

var coordinateArray=[coordinate1,coordinate2,coordinate3,coordinate4];
var mapOnSite=true
var myLatLng;
var previousPosition=[];
var currentPosition=[]; 
var map;
// var userMarker;
// var userMarkerImage = {
//   url: 'images/headphones.png',
//   // This marker is 20 pixels wide by 32 pixels tall.
//   size: new google.maps.Size(32, 32),
//   // The origin for this image is 0,0.
//   origin: new google.maps.Point(0,0),
//   // The anchor for this image is the base of the flagpole at 0,32.
//   anchor: new google.maps.Point(0, 32)
// };

var int=self.setInterval(function(){getLocation()},1000);

function getLocation()
{  
  navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position)
{
  previousPosition=currentPosition
  currentPosition=[position.coords.latitude,position.coords.longitude]
  myLatLng = new google.maps.LatLng(currentPosition[0], currentPosition[1]);
  
  if(mapOnSite){
    initialize(myLatLng);

              var image = new google.maps.MarkerImage(
              'images/bluedot.png',
              null, // size
              null, // origin
              new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
              new google.maps.Size( 15, 15 ) // scaled size (required for Retina display icon)
            );

            // then create the new marker
            myMarker = new google.maps.Marker({
              flat: true,
              icon: image,
              map: map,
              optimized: false,
              position: myLatLng,
              title: 'This is you mofo',
              visible: true
            });

  }
  if(currentPosition[0]!==previousPosition[0] || currentPosition[1]!==previousPosition[1]){
            map.setCenter(myLatLng)
            myMarker.setPosition(myLatLng);

          }

   // map.setCenter(myLatLng)
   // myMarker.setPosition(myLatLng)
    for(var i=0;i<coordinateArray.length;i++){
      var idName="distance"+i
      var distance= getDistance(currentPosition[1],currentPosition[0],coordinateArray[i].longitude,coordinateArray[i].latitude)
      // console.log(distance)
      if(distance<5){
        // Audiofunction goes here
        audio.playAll();
        // var audio=new Audio('sounds/'+coordinateArray[i].type);;
        // audio.play();
      }
      }
    }



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
  //console.log(d)
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

//function initialize(userPosition) {
//  mapOnSite=false
//  var mapOptions = {
//    center: userPosition,
//    zoom: 20,
//    mapTypeId: google.maps.MapTypeId.ROADMAP
//  };
//  map = new google.maps.Map(document.getElementById("map-canvas"),
//      mapOptions);
//  userMarker = new google.maps.Marker({
//      position: userPosition,
//      map: map,
//      icon: userMarkerImage
//    });
//
//  for (var i = 0; i < coordinateArray.length; i++) {
//        var data = coordinateArray[i]
//        var marker = new google.maps.Marker({
//            position: new google.maps.LatLng (data.latitude, data.longitude),
//            map: map
//        });
//    }
//
//}
var MY_MAPTYPE_ID = 'custom_style';

function initialize(userPosition) {
  mapOnSite=false;
  var featureOpts = [
    {
      stylers: [
        { hue: '#dbece8' },
        { visibility: 'simplified' },
        { gamma: 0.5 },
        { weight: 0.5 }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
    ]
    },
    {
      elementType: 'labels',
      stylers: [
        { visibility: 'off' }
      ]
    },
    {
      featureType: 'water',
      stylers: [
        { color: '#b0e1d6' }
      ]
    }
  ];

  var mapOptions = {
    zoom: 20,
    center: userPosition,
    disableDefaultUI: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    },
    mapTypeId: MY_MAPTYPE_ID
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  // userMarker = new google.maps.Marker({
  //   position: userPosition,
  //   map: map,
  //   icon: userMarkerImage 
  // });

for (var i = 0; i < coordinateArray.length; i++) {
      var data = coordinateArray[i]
      var marker = new google.maps.Marker({
          position: new google.maps.LatLng (data.latitude, data.longitude),
          map: map
      });

  var styledMapOptions = {
    name: 'Custom Style'
  };

  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

  map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
}
}