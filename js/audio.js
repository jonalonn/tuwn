//--------------
// Audio Object
//--------------
var audio = {
    buffer: {},
    buffer_effects: {},
    compatibility: {},
    convolver: {},
    effects: [
        'sounds/techno2.wav',
        'sounds/techno3.wav',
        'sounds/techno4.wav',
        'sounds/techno5.wav'
    ],
    files: [
        'sounds/techno.wav',
        'sounds/techno3.wav',
        'sounds/techno4.wav'
    ],
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
            /*
            The depreciated noteOn() function does not support offsets.
            Compensate by using noteGrainOn() with an offset to play once and then schedule a noteOn() call to loop after that.
            */
            audio.source_once[n] = audio.context.createBufferSource();
            audio.source_once[n].buffer = audio.buffer[n];
            audio.source_once[n].connect(audio.gain_once[n]);
            audio.source_once[n].noteGrainOn(0, offset, audio.buffer[n].duration - offset); // currentTime, offset, duration
            /*
            Note about the third parameter of noteGrainOn().
            If your sound is 10 seconds long, your offset 5 and duration 5 then you'll get what you expect.
            If your sound is 10 seconds long, your offset 5 and duration 10 then the sound will play from the start instead of the offset.
            */

            audio.gain_once[n].gain.setValueAtTime(0, audio.context.currentTime);
            audio.gain_once[n].gain.linearRampToValueAtTime(1, audio.context.currentTime + audio.volume_fade_time);

            // Now queue up our looping sound to start immediatly after the source_once audio plays.
            audio.source_loop[n][audio.compatibility.start](audio.context.currentTime + (audio.buffer[n].duration - offset));
        } else {
            audio.source_loop[n][audio.compatibility.start](0, offset);
        }

        audio.gain_loop[n].gain.setValueAtTime(0, audio.context.currentTime);
        audio.gain_loop[n].gain.linearRampToValueAtTime(1, audio.context.currentTime + audio.volume_fade_time);

        document.getElementById('button-loop-' + n).className = 'active';
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

        document.getElementById('button-loop-' + n).className = 'inactive';
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
    //---------------
    // Compatibility
    //---------------
    (function() {
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

    //---------------------
    // Setup Master Volume
    //---------------------
    // jQuery('#master-volume').prop('disabled', false).knob({
    //     angleArc: 360,
    //     angleOffset: 0,
    //     displayInput: true,
    //     height: 104,
    //     thickness: '.2',
    //     width: 104,
    //     change: function(v) {
    //         v = v / 100;
    //         audio.gain.master.gain.value = v * v;
    //     }
    // });
    //.trigger('change');

    audio.gain.master = audio.context[audio.compatibility.createGain]();
    audio.gain.master.gain.value = 0.8649; // aka (93 / 100) * the same math
    // audio.gain.master.connect(audio.analyser);
    audio.gain.master.connect(audio.context.destination);



    //---------------------------------
    // Hook up Gain Collapse to Master
    //---------------------------------
    audio.gain.collapse.connect(audio.gain.master);


    $(document).ready(function() {
    //-----------------------
    // Setup Effects Buttons
    //-----------------------
    jQuery('.widget-effects').delegate('button', 'click', function(e) {
        var val = parseInt(this.value);
        audio.gain.collapse.disconnect();
        audio.gain.booster.disconnect();

        var previous_vol = audio.gain.master.gain.value;
        audio.gain.master.gain.value = 0;

        if (this.className === 'active') {
            jQuery('.widget-effects .active').removeClass('active');
            audio.gain.collapse.connect(audio.gain.master);
        } else {
            jQuery('.widget-effects .active').removeClass('active');
            audio.convolver.buffer = audio.buffer_effects[val];
            audio.gain.collapse.connect(audio.convolver);
            audio.gain.booster.connect(audio.gain.master);
            this.className = 'active';
        }

        setTimeout(function() {
            audio.gain.master.gain.value = previous_vol;
        }, 50);
    });



    //-----------------------
    // Setup Stop All Button
    //-----------------------
    document.getElementById('button-stop').addEventListener('click', audio.stopAll);
    document.getElementById('button-stop').disabled = false;



    //-----------------------
    // Setup Play All Button
    //-----------------------
    document.getElementById('button-play').addEventListener('click', audio.playAll);
    document.getElementById('button-play').disabled = false;



    //-------------------
    // Setup Audio Files
    //-------------------
    for (var a in audio.files) {
        (function() {
            var i = parseInt(a) + 1;
            var req = new XMLHttpRequest();
            req.open('GET', audio.files[i - 1], true); // array starts with 0 hence the -1
            req.responseType = 'arraybuffer';
            req.onload = function() {
                audio.context.decodeAudioData(
                    req.response,
                    function(buffer) {
                        audio.buffer[i] = buffer;
                        audio.source_loop[i] = {};
                        var button = document.getElementById('button-loop-' + i);
                        button.addEventListener('click', function(e) {
                            e.preventDefault();
                            audio.play(this.value, false);
                        });
                        jQuery(button).text(button.getAttribute('data-name')).removeClass('loading');
                        button.disabled = false;

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
                        console.log('Error decoding audio "' + audio.files[i - 1] + '".');
                    }
                );
            };
            req.send();
        })();
    }


})
    //---------------
    // Setup Effects
    //---------------
    for (var a in audio.effects) {
        (function() {
            var i = parseInt(a) + 1;
            var req = new XMLHttpRequest();
            req.open('GET', audio.effects[i - 1], true); // array starts with 0 hence the -1
            req.responseType = 'arraybuffer';
            req.onload = function() {
                audio.context.decodeAudioData(
                    req.response,
                    function(buffer) {
                        audio.buffer_effects[i] = buffer;
                        var button = document.getElementById('effect-' + i);
                        button.disabled = false;
                        $(document).ready(function() {
                            jQuery(button).html(button.getAttribute('data-name').replace(' ', '<br>')).removeClass('loading');
                        })
                    },
                    function() {
                        console.log('Error decoding effect "' + audio.effects[i - 1] + '".');
                    }
                );
            };
            req.send();
        })();
    };
}