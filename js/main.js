var mapOnSite=false
var markersShown=true
var myLatLng;
var previousPosition=[];
var currentPosition=[]; 
var currentMarkersShown=[];
var previousMarkersShown=[];
var map;
var service;
var myMarker;
var amountOfMarkersWithAnIndex=[0,0,0,0,0,0,0,0,0,0];
var markerClicked;
var allMarkers;
var amountOfMarkersClicked=0;
var element;
var musicType;
var error=false;
var centerOfStockholm=[59.3359156,17.9856157]

/*
  Slidemenu
*/
$( document ).ready(function() {
  var $body = document.body
  , $menu_trigger = $body.getElementsByClassName('about_button')[0];

  if ( typeof $menu_trigger !== 'undefined' ) {
    $menu_trigger.addEventListener('click', function() {
      $body.className = ( $body.className == 'menu-active' )? '' : 'menu-active';
    });
  }

});

getCSV()

function getCSV(){
  var CSVArray=[];
  var tunnelbana = $.get("data/Tunnelbana.csv");
  var sparvagnar = $.get("data/sparvagnar.csv");
  var bussar = $.get("data/busstationer.csv");
  var lidingobanan = $.get("data/Lidingobanan.csv");
  var tvarbana = $.get("data/Tvarbanan.csv");
  var roslagsbanan = $.get("data/Roslagsbanan.csv");
  var saltsjobanan = $.get("data/Saltsjobanan.csv");
  var nockebybanan = $.get("data/Nockebybanan.csv");
  var pendeltag = $.get("data/Pendeltag.csv");



  $.when(tunnelbana, sparvagnar, bussar, lidingobanan, tvarbana, roslagsbanan, saltsjobanan, nockebybanan, pendeltag).done(function(a, b, c, d, e, f, g, h, i) {
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

      arrData.push( [itemSound] ); 
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
  arrData.pop()
    if(itemSound==3){
      for (var i = arrData.length - 1; i >= 0; i--) {
        arrData[i][1]=arrData[i][3]
      }
    }
return(arrData)
}

 function initialize(csvResults) {
  allMarkers=[];
  var mapCenter=new google.maps.LatLng(59.3359156,17.9856157)
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
  var minZoomLevel = 11;
  var mapOptions = {
    zoom: 15,
    minZoom: 9,
    center: mapCenter,
    disableDefaultUI: true,
    backgroundColor: 'none',
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
//   var strictBounds = new google.maps.LatLngBounds(
//     new google.maps.LatLng(59.370599,17.929001), 
//     new google.maps.LatLng(59.266188,18.262711)
//   );
//   google.maps.event.addListener(map, 'dragend', function() {
//     if (strictBounds.contains(map.getCenter())) return;
//
//  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
//var c = map.getCenter(),
//         x = c.lng(),
//         y = c.lat(),
//         maxX = strictBounds.getNorthEast().lng(),
//         maxY = strictBounds.getNorthEast().lat(),
//         minX = strictBounds.getSouthWest().lng(),
//         minY = strictBounds.getSouthWest().lat();
//
//     if (x < minX) x = minX;
//     if (x > maxX) x = maxX;
//     if (y < minY) y = minY;
//     if (y > maxY) y = maxY;
//
//     map.setCenter(centerOfStockholm);
//   });
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
            new google.maps.Size( 15, 15 ) // scaled size (required for Retina display icon)
            )


   var marker = new google.maps.Marker(
   {
    position: new google.maps.LatLng(csvResults[i][2],csvResults[i][1]),
    map: map,
    flat: true, 
    optimized: false,
    title: csvResults[i][0],
    icon: locationMarkerImage,
    markerClicked: false,
    markerAnimated: false
  }
  )
   allMarkers.push(marker);

 }

 google.maps.event.addListener(marker, 'click', function() {
  var objectType;
  var objectTitle=this.title;
  switch(objectTitle){
    case '1':
      objectType="tunnelbana";
      break;
    case '2':
      objectType="sp&aring;rvagnar";
      break;
    case '3':
      objectType="busstation";
      break;
    case '4':
      objectType="Liding&ouml;banan";
      break;
    case '5':
      objectType="tv&auml;rbana";
      break;
    case '6':
      objectType="Roslagsbanan";
      break;
    case '7':
      objectType="Saltsj&ouml;banan";
      break;
    case '8':
      objectType="Nockebybanan";
      break;
    case '9':
      objectType="pendelt&aring;g";
      break;
    default:
      break;
  }
  $(".markerObject").hide().html(objectType).fadeIn(650);
  $(".markerObject").fadeOut(650);
  if(!this.markerClicked){
    audio.stop(this.title);
    this.markerClicked=true;
    $('div.gmnoprint[title="'+ objectTitle +'"]').removeClass('button' + objectTitle);
  }
  else{
    audio.play(this.title)
    this.markerClicked=false;
    $('div.gmnoprint[title="'+ objectTitle +'"]').addClass('button' + objectTitle);
  }
  for(var k = allMarkers.length - 1; k >= 0; k--) {
    if(allMarkers[k].title === this.title) {
      allMarkers[k].markerClicked=this.markerClicked;
      allMarkers[k].markerAnimated=this.markerClicked;
      if(this.markerClicked){
        amountOfMarkersClicked+=1
      }
      else{
        amountOfMarkersClicked-=1
      }
    }
  }
if(amountOfMarkersClicked==allMarkers.length-9){
  document.getElementById("button_playnow").value="play all"
}

if(amountOfMarkersClicked==0){
  document.getElementById("button_playnow").value="stop all"
}

});
}

var int=self.setInterval(function(){getLocation()},1000);

}
function geo_error(){
  error=true;
  showPosition(centerOfStockholm)
}

function getLocation()
{  
  error=false;
  navigator.geolocation.getCurrentPosition(showPosition,geo_error);
}
function showPosition(position)
{

  previousPosition=currentPosition
  if(error&&!mapOnSite){
    currentPosition=[position[0],position[1]]
  }
  else if(!error){
          $.getJSON( "http://maps.googleapis.com/maps/api/geocode/json?latlng="+59.3359156+","+17.9856157+"&sensor=true", function( data ) {
      var userCity=data.results[0].address_components[3].long_name
  //    console.log(userCity)
      if(userCity!=='Stockholms län'&&userCity!=="Stockholm County") {
    //    console.log("you're outside of Stockholm")
      } 
    });

    currentPosition=[position.coords.latitude,position.coords.longitude]
  }
  if(!mapOnSite){
    myLatLng = new google.maps.LatLng(currentPosition[0], currentPosition[1]);
    map.setCenter(myLatLng)
    mapOnSite=true;

    if(!error){
    var userMarkerImage = new google.maps.MarkerImage(
      'images/pin2.png',
              null, // size
              null, // origin
              new google.maps.Point( 10, 10 ), // anchor (move to center of marker)
              new google.maps.Size( 33, 43 ) // scaled size (required for Retina display icon)
              );

            // then create the new marker
            myMarker = new google.maps.Marker({
              flat: true,
              icon: userMarkerImage,
              map: map,
              optimized: false,
              position: myLatLng,
              title: 'This is you',
              visible: true,
            });
          }
        }
          
  if(currentPosition[0]!==previousPosition[0] || currentPosition[1]!==previousPosition[1]){
    myMarker.setPosition(myLatLng);
    myMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
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
google.maps.event.addListener(map, 'bounds_changed', getMarkersShown) 

getMarkersShown()

 }


function getMarkersShown(){
    previousMarkersShown=currentMarkersShown;
    for(var i = allMarkers.length, bounds = map.getBounds(); i--;) {
      if(bounds.contains(allMarkers[i].getPosition())){

        if($.inArray(allMarkers[i],currentMarkersShown)==-1){
          currentMarkersShown.push(allMarkers[i])
          
          amountOfMarkersWithAnIndex[allMarkers[i].title]+=1
        }

        if(amountOfMarkersWithAnIndex[allMarkers[i].title]==1&&!allMarkers[i].markerClicked){
          $('div.gmnoprint[title="'+ allMarkers[i].title +'"]').addClass('button' + allMarkers[i].title);
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
    
    for(var j=1;j<10;j++){
      if(amountOfMarkersWithAnIndex[j]==0){
        audio.stop(j)
      }
    }
  if(markersShown){
    $("#map-canvas").css("visibility","visible");
    $("#button_playnow").css("visibility","visible");
    $("#music_choice_button").css("visibility","visible");
    $(".about_button").css("visibility","visible");
    $(".spinner").css("visibility","hidden");
    setTimeout(function(){
      $("nav#slide-menu").css("visibility","visible");
    }, 2000);


    markersShown=false
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
// google.maps.event.addDomListener(window, 'load', initialize);


function buttonClick(){
  element=document.getElementById("button_playnow")
  if (element.value=="play all"){
    amountOfMarkersClicked=0
    element.value="stop all"
    for(var i=0;i<amountOfMarkersWithAnIndex.length;i++){
      $('div.gmnoprint[title="'+ i +'"]').addClass('button' + i);
      if(amountOfMarkersWithAnIndex[i]!==0){
        audio.play(i);
    }
      }
     for(var k = allMarkers.length - 1; k >= 0; k--) {
            allMarkers[k].markerClicked=false;
      }
  } 


  else{
    element.value="play all"
    audio.stopAll()
    amountOfMarkersClicked=allMarkers.length
    for(var i=0;i<allMarkers.length;i++){
      $('div.gmnoprint[title="'+ i +'"]').removeClass('button' + i);
      if(allMarkers[i].markerClicked!==undefined){
        allMarkers[i].markerClicked=true;


    }
      }
    }

      }

function musicChoice(){
  musicType=document.getElementById("music_choice_button")

  if(musicType.value=="odenplan"){
    $.when(setupBuffer(audio.files.ace)).done(function() {
       musicType.value="karlaplan";
        setTimeout(function(){
          element=document.getElementById("button_playnow")
          element.value = ("play all");
          buttonClick()}, 1000);

  });
  }
  else if(musicType.value=='karlaplan'){
    $.when(setupBuffer(audio.files.tech)).done(function() {
      musicType.value='slussen';
      setTimeout(function(){
        element=document.getElementById("button_playnow")
        element.value = ("play all");
        buttonClick()}, 1000);

    });
  }
  else if(musicType.value=='slussen'){
    $.when(setupBuffer(audio.files.slow)).done(function() {
      musicType.value='odenplan';
      setTimeout(function(){
        element=document.getElementById("button_playnow")
        element.value = ("play all");
        buttonClick()}, 1000);

    });
  }
}
