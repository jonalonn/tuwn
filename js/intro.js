var exampleMarkerClicked=false;
var myAudio;

$( document ).ready(function() {
    myAudio = new Audio('sounds/ace/ace1.m4a'); 
    myAudio.addEventListener('ended', function() {
        myAudio.currentTime = 0;
        myAudio.play();
    }, false);
myAudio.play();
});


   function playExampleMarker(){
    if(exampleMarkerClicked){
     myAudio.play();
     exampleMarkerClicked=false;
     $( "#markerdiv").append('<img src="images/circle3.png" id="animation" style="position:absolute" class="button3">');
    }
    else{
      myAudio.pause();
        exampleMarkerClicked=true;

      $( "#animation" ).detach();

    }

}
