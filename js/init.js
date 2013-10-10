window.onload = init;
var context;
var bufferLoader;

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      'sounds/techno.wav',
      'sounds/techno2.wav',
      'sounds/techno3.wav',
      'sounds/techno4.wav',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

var FilterSample = {
  FREQ_MUL: 7000,
  QUAL_MUL: 30,
  playing: false
};



function finishedLoading(bufferList) {

  for (i=0;i<bufferList.length;i++) {
  var source = context.createBufferSource();
  source.buffer = bufferList[i];

}
} 

FilterSample.play = function( ) {
  // Create the source.
  var source = context.createBufferSource();
  source.buffer = bufferList[i]
  // Create the filter.
  var filter = context.createBiquadFilter();
  filter.type = 0; // LOWPASS
  filter.frequency.value = 5000;
  // Connect source to filter, filter to destination.
  source.connect(filter);
  filter.connect(context.destination);
  // Play!
  if (!source.start)
    source.start = source.noteOn;
  source.start(0);
  source.loop = true;
  // Save source and filterNode for later access.
  this.source = source;
  this.filter = filter;
};

FilterSample.changeFrequency = function(element) {
  // Clamp the frequency between the minimum value (40 Hz) and half of the
  // sampling rate.
  var minValue = 40;
  var maxValue = context.sampleRate / 2;
  // Logarithm (base 2) to compute how many octaves fall in the range.
  var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  // Compute a multiplier from 0 to 1 based on an exponential scale.
  var multiplier = Math.pow(2, numberOfOctaves * (element.value - 1.0));
  // Get back to the frequency value between min and max.
  this.filter.frequency.value = maxValue * multiplier;
};

FilterSample.changeQuality = function(element) {
  this.filter.Q.value = element.value * this.QUAL_MUL;
};

FilterSample.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
};


