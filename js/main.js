var mapOnSite=true
var myLatLng;
var previousPosition=[];
var currentPosition=[]; 
var currentMarkersShown=[];
var previousMarkersShown=[];
var map;
var service;
var infowindow;
var myMarker;
var amountOfMarkersWithAnIndex=[0,0,0,0,0,0,0,0,0,0];
var markerClicked=false


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
    map.setCenter(myLatLng)
    var userMarkerImage = new google.maps.MarkerImage(
      'images/bluedot.png',
              null, // size
              null, // origin
              new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
              new google.maps.Size( 15, 15 ) // scaled size (required for Retina display icon)
              );

            // then create the new marker
            myMarker = new google.maps.Marker({
              flat: true,
              icon: userMarkerImage,
              map: map,
              optimized: false,
              position: myLatLng,
              title: 'This is you mofo',
              visible: true
            });
            mapOnSite=false;
          }
          if(currentPosition[0]!==previousPosition[0] || currentPosition[1]!==previousPosition[1]){
            myMarker.setPosition(myLatLng);
          }

 /*  // map.setCenter(myLatLng)
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
    }*/
  }

  function initialize(csvResults) {
    var allMarkers=[];
    var centerOfStockholm=new google.maps.LatLng(59.3322064,18.0640027)
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
      zoom: 15,
      center: centerOfStockholm,
      disableDefaultUI: true,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
      },
      mapTypeId: MY_MAPTYPE_ID
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

    var styledMapOptions = {
      name: 'Custom Style'
    };

    var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

    map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

 /* var request = {
    location: centerOfStockholm,
    radius: '100000',
    types: ['hospital'],
  };

service = new google.maps.places.PlacesService(map);
service.nearbySearch(request, function(results,status,pagination){
          console.log(results)

  if (status != google.maps.places.PlacesServiceStatus.OK) {
    return;
  }
  for (var i = 0; i < results.length; i++) {
    var place = results[i];
    var marker = new google.maps.Marker(
        position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
        map: map
      }
    )
  }
  if(pagination.hasNextPage){
    pagination.nextPage();
  }
}); */
var locationMarkerImage;
for (var i = 0; i < csvResults.length; i++) {
  if(csvResults[i][1]){
   //   console.log('images/circle'+csvResults[i][0]+'.png')

    locationMarkerImage = new google.maps.MarkerImage(
      'images/circle'+csvResults[i][0]+'.png',
            null, // size
            null, // origin
            new google.maps.Point( 8, 8 ), // anchor (move to center of marker)
            new google.maps.Size( 50, 50 ) // scaled size (required for Retina display icon)
            )


    var marker = new google.maps.Marker(
    {
      position: new google.maps.LatLng(csvResults[i][2],csvResults[i][1]),
      map: map,
      flat: true, 
      optimized: false,
      title: csvResults[i][0],
      icon: locationMarkerImage
    }
    )
    allMarkers.push(marker);

  }
  google.maps.event.addListener(marker, 'click', function() {
    if(!markerClicked){
      audio.stop(this.title);
      markerClicked=true;
    }
    if(markerClicked){
      audio.play(this.title)
      markerClicked=false;
    }
  });
}

google.maps.event.addListener(map, 'bounds_changed', getMarkersShown) 

function getMarkersShown(){
  if(!mapOnSite){
    previousMarkersShown=currentMarkersShown;
    for(var i = allMarkers.length, bounds = map.getBounds(); i--;) {
      if(bounds.contains(allMarkers[i].getPosition())){
        if($.inArray(allMarkers[i],currentMarkersShown)==-1){
          currentMarkersShown.push(allMarkers[i])
          amountOfMarkersWithAnIndex[allMarkers[i].title]+=1
        }

        if(amountOfMarkersWithAnIndex[allMarkers[i].title]==1&&!markerClicked){
          audio.play(allMarkers[i].title)
        }

      }
      else if($.inArray(allMarkers[i],previousMarkersShown)!==-1){
        amountOfMarkersWithAnIndex[allMarkers[i].title]-=1
        for(var k = currentMarkersShown.length - 1; k >= 0; k--) {
          if(currentMarkersShown[k] === allMarkers[i]) {
            currentMarkersShown.splice(k,1);
          }
        }

      }

    }
  //    }
  //    else{
  //      audio.play(allMarkers[i].title)
  //    }
//      console.log(amountOfMarkersWithAnIndex)
  //    
    //  if($.inArray(allMarkers[i],previousMarkersShown)==-1){
  //       audio.play(allMarkers[i].title);
      //  }
        // var audio=new Audio('sounds/'+allMarkers[i].title);;
        // debugger


    //else{

   //   if($.inArray(allMarkers[i],previousMarkersShown)!==-1&&amountOfMarkersWithAnIndex[allMarkers[i].title]!==0){
     //   amountOfMarkersWithAnIndex[allMarkers[i].title]-=1

      //}
    }
    for(var j=1;j<7;j++){
      if(amountOfMarkersWithAnIndex[j]==0){
        audio.stop(j)
      }
    }

  }
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
google.maps.event.addDomListener(window, 'load', initialize);

getCSV()

function getCSV(){
  var CSVArray=[];
  var tunnelbana = $.get("data/Tunnelbana.csv");
  var bio = $.get("data/Bio.csv");
  var bussar = $.get("data/Bussar.csv");
  var thai = $.get("data/Thai.csv");
  var mekonomen = $.get("data/Mekonomen.csv");
  var bestWestern = $.get("data/best_western.csv");
  var dans = $.get("data/dans.csv");
  var cafeer = $.get("data/cafeer.csv");
  var bagerier = $.get("data/Bagerier.csv");



  $.when(tunnelbana, bio, bussar, thai, mekonomen, bestWestern, dans, cafeer, bagerier).done(function(a, b, c, d, e, f, g, h, i) {
    CSVArray = CSVArray.concat(CSVToArray(a, '1'));
    CSVArray = CSVArray.concat(CSVToArray(b, '2'));
    CSVArray = CSVArray.concat(CSVToArray(c, '3'));
    CSVArray = CSVArray.concat(CSVToArray(d, '4'));
    CSVArray = CSVArray.concat(CSVToArray(e, '5'));
    CSVArray = CSVArray.concat(CSVToArray(f, '6'));
    CSVArray = CSVArray.concat(CSVToArray(g, '7'));
    CSVArray = CSVArray.concat(CSVToArray(h, '8'));
    CSVArray = CSVArray.concat(CSVToArray(i, '9'));



    initialize(CSVArray)
  });
}

function CSVToArray( strData, itemSound, strDelimiter ){
  strDelimiter = (strDelimiter || ",");

  var objPattern = new RegExp(
    (
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
       "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
    );

  var arrData=[[]];

  var arrMatches = null;
  
  while (arrMatches = objPattern.exec( strData )){

    var strMatchedDelimiter = arrMatches[ 1 ];

    if (
      strMatchedDelimiter.length &&
      (strMatchedDelimiter != strDelimiter)
      ){

      arrData.push( [] ); 
    arrData[ arrData.length - 1 ].push(itemSound)

  }


  if (arrMatches[ 2 ]){

    var strMatchedValue = arrMatches[ 2 ].replace(
      new RegExp( "\"\"", "g" ),
      "\""
      );

  } else {

    var strMatchedValue = arrMatches[ 3 ];
  }

  arrData[ arrData.length - 1 ].push( strMatchedValue);
}
return(arrData)
}
