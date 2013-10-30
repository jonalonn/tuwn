var exampleMarkerClicked=false;
var audio;

$( document ).ready(function() {
     audio=document.getElementById('audiotag1');
    audio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    audio.play();

});



   function playExampleMarker(){
    if(exampleMarkerClicked){
     audio.play();
     exampleMarkerClicked=false
    }
    else{
      audio.pause()
     exampleMarkerClicked=true

    }

}
