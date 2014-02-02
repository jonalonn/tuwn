var mapOnSite=false
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
var amountOfMarkersClicked=494
var element;
var musicType;
var error=false;
var centerOfStockholm=[59.324486,18.072853]
var zoomLevel=15;
var CSVArray=[];
var coordinates;
var exampleMarkerClicked=false;
var myAudio = new Audio('sounds/ace/ace1.m4a'); 

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
  var tunnelbana = $.get("data/Tunnelbana.csv");
  var sparvagnar = $.get("data/sparvagnar.csv");
  var bussar = $.get("data/busstationer.csv");
  var lidingobanan = $.get("data/Lidingobanan.csv");
  var tvarbana = $.get("data/Tvarbanan.csv");
  var roslagsbanan = $.get("data/Roslagsbanan.csv");
  var saltsjobanan = $.get("data/Saltsjobanan.csv");
  var nockebybanan = $.get("data/Nockebybanan.csv");
  var pendeltag = $.get("data/Pendeltag.csv");
  coordinates = $.get("data/coordinates.rtf");


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
  JSON.stringify(csvResults)
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
    zoom: zoomLevel,
    minZoom: 9,
        scrollwheel: false,

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

var locationMarkerImage;
for (var i = 0; i < csvResults.length; i++) {
  if(csvResults[i][1]){

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
    markerClicked: true,
  })

   if(marker.title==1||marker.title==2||marker.title==3||marker.title==4||marker.title==5||marker.title==6||marker.title==7||marker.title==8||marker.title==9)
  {
     allMarkers.push(marker);
  }
  else{
    marker.setMap(null)
  }
 }

 google.maps.event.addListener(marker, 'click', function() {
  var objectType;
  var objectTitle=this.title;
  switch(objectTitle){
    case '1':
      objectType="subway stations";
      break;
    case '2':
      objectType="tram stops";
      break;
    case '3':
      objectType="bus stations";
      break;
    case '4':
      objectType="Liding&ouml;banan";
      break;
    case '5':
      objectType="Tv&auml;rbanan";
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
      objectType="commuter train";
      break;
    default:
      break;
  }
  if(!this.markerClicked){
    $(".markerObject").hide().html(objectType+"<br><center>turned off</center>").fadeIn(650);
    $(".markerObject").fadeOut(650);
    audio.stop(this.title)
    this.markerClicked=true;
      $('div.gmnoprint[title="'+ this.title +'"]').removeClass('button' + this.title);
  }
  else{
    $(".markerObject").hide().html(objectType+"<br><center>turned on</center>").fadeIn(650);
    $(".markerObject").fadeOut(650);
    audio.play(this.title)
    this.markerClicked=false;
    $('div.gmnoprint[title="'+ this.title +'"]').addClass('button' + this.title);

  }
  for(var k = allMarkers.length - 1; k >= 0; k--) {
    if(allMarkers[k].title === this.title) {
      allMarkers[k].markerClicked=this.markerClicked;
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
  myLatLng = new google.maps.LatLng(centerOfStockholm[0], centerOfStockholm[1]);
  map.setCenter(myLatLng)
  mapOnSite=true;
  google.maps.event.addListener(map, 'bounds_changed', getMarkersShown) 

//Fade in intro page when map is fully loaded
  google.maps.event.addListenerOnce(map, 'tilesloaded', function(){

    myAudio.addEventListener('ended', function() {
        myAudio.currentTime = 0;
        myAudio.play();
    }, false);


    $(".spinner").css("visibility","hidden");
    $("#map-canvas").css("visibility","visible");
    $("#presentation-text").css("visibility","visible");
    $("#map-canvas").css("opacity","0.3")    
    myAudio.play(); 
});

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
    
    for(var j=1;j<10;j++){
      if(amountOfMarkersWithAnIndex[j]==0){
        audio.stop(j)
      }
    }
  }
   function playExampleMarker(){
    if(exampleMarkerClicked){
     myAudio.play();
     exampleMarkerClicked=false;
     $( "#markerdiv").append('<img src="images/circle3.png" id="animation" style="position:absolute; left:-7px" class="button3">');
    }
    else{
      myAudio.pause();
        exampleMarkerClicked=true;

      $( "#animation" ).detach();

    }

}

  function startTuwn(){
    $("#presentation-text").fadeOut("slow");
    $("#map-canvas").css("opacity","1")     
    $("#button_playnow").css("visibility","visible");
    $("#music_choice_button").css("visibility","visible");
    $(".about_button").css("visibility","visible");
    $("#title-div").css("visibility","visible");
    $("#zoom_in").css("visibility","visible");
    $("#zoom_out").css("visibility","visible");   
    setTimeout(function(){
      $("nav#slide-menu").css("visibility","visible");
    }, 2000);

  }

var MY_MAPTYPE_ID = 'custom_style';

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
  element=document.getElementById("button_playnow");
  element.value='stop all';
  buttonClick();

  musicType=document.getElementById("music_choice_button")
  //$('#music_choice_button').removeAttr('onclick'); 

  if(musicType.value=="tune one"){
    $.when(setupBuffer(audio.files.ace)).done(function() {
       musicType.value="tune two";

  });
  }
  else if(musicType.value=='tune two'){
    $.when(setupBuffer(audio.files.tech)).done(function() {
      musicType.value='tune three';

    });
  }
  else if(musicType.value=='tune three'){
    $.when(setupBuffer(audio.files.slow)).done(function() {
      musicType.value='tune one';

    });
  }
  for (var i = 10; i >= 0; i--) {
    $('div.gmnoprint[title="'+ i +'"]').removeClass('button' + i);
  };
  element=document.getElementById("button_playnow")
  element.value="play all"


}

function zoomIn(){
 zoomLevel=zoomLevel+1
  map.setZoom(zoomLevel)
};
function zoomOut(){
if(zoomLevel<=9){
  return;
}
else{
    zoomLevel=zoomLevel-1
  map.setZoom(zoomLevel)
}
};

