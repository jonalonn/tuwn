//--------------
// Audio Object
//--------------
var audio = {
    buffer: {},
    buffer_effects: {},
    compatibility: {},
    convolver: {},
    effects: [
        'sounds/cave.wav',
        'sounds/lodge.wav',
        'sounds/parking-garage.wav'
    ],
    files: {
    ace: [
        'sounds/ace/ace1.m4a',
        'sounds/ace/ace2.m4a',
        'sounds/ace/ace3.m4a',
        'sounds/ace/ace4.m4a',
        'sounds/ace/ace5.m4a',
        'sounds/ace/ace6.m4a',
        'sounds/ace/ace7.m4a',
        'sounds/ace/ace8.m4a',
        'sounds/ace/ace9.m4a'
    ],
    slow: [
        'sounds/slow/slow1.m4a',
        'sounds/slow/slow2.m4a',
        'sounds/slow/slow3.m4a',
        'sounds/slow/slow4.m4a',
        'sounds/slow/slow5.m4a',
        'sounds/slow/slow6.m4a',
        'sounds/slow/slow7.m4a',
        'sounds/slow/slow8.m4a',
        'sounds/slow/slow9.m4a'
    ],
    tech: [
        'sounds/techno/techno1.m4a',
        'sounds/techno/techno2.m4a',
        'sounds/techno/techno3.m4a',
        'sounds/techno/techno4.m4a',
        'sounds/techno/techno5.m4a',
        'sounds/techno/techno6.m4a',
        'sounds/techno/techno7.m4a',
        'sounds/techno/techno8.m4a',
        'sounds/techno/techno9.m4a'
    ]},
    frequencyData: {},
    gain: {},
    gain_loop: {},
    gain_once: {},
    playing: 0,
    proceed: true,
    source_loop: {},
    source_once: {},
    volume_fade_time: 0.7
};

//-----------------
// Audio Functions
//-----------------
audio.findSync = function(n) {
    var first = 0,
        current = 0,
        offset = 0;

    // Find the audio source with the earliest startTime to sync all others to
    for (var i in audio.source_loop) {
        current = audio.source_loop[i]._startTime;
        if (current > 0) {
            if (current < first || first === 0) {
                first = current;
            }
        }
    }

    if (audio.context.currentTime > first) {
        /*
        Did you know that JavaScript floating point math is imperfect?
        Precise enough for humans though so no worries. ^_^
        */
        var duration = audio.buffer[n].duration;
        offset = (audio.context.currentTime - first) % duration;
    }

    return offset;
};

audio.play = function(n, playOnly) {
    if (audio.source_loop[n]._playing) {
        if (!playOnly) {
        }
    } else {
        audio.source_loop[n] = audio.context.createBufferSource();
        audio.source_loop[n].buffer = audio.buffer[n];
        audio.source_loop[n].connect(audio.gain_loop[n]);
        audio.source_loop[n].loop = true;

        var offset = audio.context.currentTime % audio.buffer[n].duration//audio.findSync(n) ; 
        audio.source_loop[n]._startTime = audio.context.currentTime;


        if (audio.compatibility.start === 'noteOn') {

            audio.source_once[n] = audio.context.createBufferSource();
            audio.source_once[n].buffer = audio.buffer[n];
            audio.source_once[n].connect(audio.gain_once[n]);
            audio.source_once[n].noteGrainOn(0, offset, audio.buffer[n].duration - offset); // currentTime, offset, duration

            audio.gain_once[n].gain.setValueAtTime(0, audio.context.currentTime);
            audio.gain_once[n].gain.linearRampToValueAtTime(1, audio.context.currentTime + audio.volume_fade_time);

            audio.source_loop[n][audio.compatibility.start](audio.context.currentTime + (audio.buffer[n].duration - offset));
        } else {
            audio.source_loop[n][audio.compatibility.start](0, offset);
        }

        audio.gain_loop[n].gain.setValueAtTime(0, audio.context.currentTime);
        audio.gain_loop[n].gain.linearRampToValueAtTime(1, audio.context.currentTime + audio.volume_fade_time);
        audio.source_loop[n]._playing = true;
        audio.playing = audio.playing + 1;
        
    }
};

audio.playAll = function() {
    for (var a in audio.source_loop) {
        audio.play(a, true); // true meaning play only as in do not stop any playing audio
    };
};

audio.stop = function(n) {
    if (audio.source_loop[n]._playing && !audio.source_loop[n]._stopping) {
        audio.source_loop[n]._stopping = true;
        audio.source_loop[n][audio.compatibility.stop](audio.context.currentTime + audio.volume_fade_time);
        audio.source_loop[n]._startTime = 0;

        if (audio.compatibility.start === 'noteOn') {
            audio.source_once[n][audio.compatibility.stop](audio.context.currentTime + audio.volume_fade_time);
            audio.gain_once[n].gain.setValueAtTime(1, audio.context.currentTime);
            audio.gain_once[n].gain.linearRampToValueAtTime(0, audio.context.currentTime + audio.volume_fade_time);
        }

        (function() {
            var num = n;
            setTimeout(function() {
                audio.source_loop[num]._playing = false;
                audio.source_loop[num]._stopping = false;
            }, audio.volume_fade_time * 100); // 700 ms
        })();

        audio.gain_loop[n].gain.setValueAtTime(1, audio.context.currentTime);
        audio.gain_loop[n].gain.linearRampToValueAtTime(0, audio.context.currentTime + audio.volume_fade_time);

        audio.playing = audio.playing - 1;
    }
};

audio.stopAll = function() {
    for (var a in audio.source_loop) {
        audio.stop(a);
    }
};



//-----------------------------
// Check Web Audio API Support
//-----------------------------
try {
    // More info at http://caniuse.com/#feat=audio-api
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audio.context = new window.AudioContext();
} catch(e) {
    audio.proceed = false;
    alert('Web Audio API not supported in this browser.');
}

if (audio.proceed) {
    initAudio(audio.files.ace)
}



function initAudio(audioFiles){

    //---------------
    // Compatibility
    //---------------
    (
        function() {
        var name = 'createGain';
        if (typeof audio.context.createGain !== 'function') {
            name = 'createGainNode';
        }
        audio.compatibility.createGain = name;
    })();

    (function() {
        var start = 'start',
            stop = 'stop',
            buffer = audio.context.createBufferSource();

        if (typeof buffer.start !== 'function') {
            start = 'noteOn';
        }
        audio.compatibility.start = start;

        if (typeof buffer.stop !== 'function') {
            stop = 'noteOff';
        }
        audio.compatibility.stop = stop;
    })();

    var requestAnimationFrame = window.requestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;



    //------------------------------------
    // Setup Volume Booster for Convolver
    //------------------------------------
    audio.gain.booster = audio.context[audio.compatibility.createGain]();
    audio.gain.booster.gain.value = 3;



    //-----------------
    // Setup Convolver
    //-----------------
    audio.convolver = audio.context.createConvolver();
    audio.convolver.connect(audio.gain.booster);



    //--------------------------------------------------------------------
    // Setup Gain node which only exists to collapse audio feeds into it.
    //--------------------------------------------------------------------
    audio.gain.collapse = audio.context[audio.compatibility.createGain]();
    audio.gain.master = audio.context[audio.compatibility.createGain]();
    audio.gain.master.gain.value = 0.8649;
    audio.gain.master.connect(audio.context.destination);



    //---------------------------------
    // Hook up Gain Collapse to Master
    //---------------------------------
    audio.gain.collapse.connect(audio.gain.master);

    //-------------------
    // Setup Audio Files
    //-------------------
    for (var a in audioFiles) {
        (function() {
            var i = parseInt(a) + 1;
            var req = new XMLHttpRequest();
            req.open('GET', audioFiles[i - 1], true); // array starts with 0 hence the -1
            req.responseType = 'arraybuffer';
            req.onload = function() {
                audio.context.decodeAudioData(
                    req.response,
                    function(buffer) {
                        audio.buffer[i] = buffer;
                        audio.source_loop[i] = {};
                        // Setup individual volume for this loop
                        audio.gain_loop[i] = audio.context[audio.compatibility.createGain]();
                        audio.gain_loop[i].connect(audio.gain.collapse);
                        
                        if (audio.compatibility.start === 'noteOn') {
                            // Setup additional gains needed for browsers using depreciated functions like noteOn
                            audio.gain_once[i] = audio.context[audio.compatibility.createGain]();
                            audio.gain_once[i].connect(audio.gain.collapse);                        
                        }
                    },
                    function() {
                        console.log('Error decoding audio "' + audioFiles[i - 1] + '".');
                    }
                );
            };
            req.send();
        })();
    }


}

function setupBuffer(style) {
    audio.stopAll()
    amountOfMarkersClicked=allMarkers.length
    for(var i=0;i<allMarkers.length;i++){
      if(allMarkers[i].markerClicked!==undefined){
        allMarkers[i].markerClicked=true;

    }
      }
    
    initAudio(style);
}