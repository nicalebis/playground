<!---------------------------->
                <!------ Tone Generator ------>
                <!---------------------------->

                <script>
                // Tone Generator - produces 300ms tones randomly at either 550hz or 700hz - tones presented every second (with 700ms silence in between) - tones continue for duration of current video file
                var toneGenerator = function() {
                    var context = new AudioContext();
                    var oscillator = context.createOscillator();
                    var gainNode = context.createGain();
                    oscillator.connect(gainNode);
                    gainNode.connect(context.destination);
                    gainNode.gain.value = 0;
                    oscillator.frequency.value = 550;
                    oscillator.start();
                    var interval = setInterval(function() {
                        var random = Math.random();
                        if (random < 0.5) {
                            oscillator.frequency.value = 550;
                        } else {
                            oscillator.frequency.value = 700;
                        }
                        gainNode.gain.value = 1;
                        setTimeout(function() {
                            gainNode.gain.value = 0;
                        }, 300);
                    }, 1000);
                    return interval;
                };
    
    // Function for presenting tones during video playback
    async function startTrial(videoId, callback) {
        var toneInterval;
        var video = document.getElementById(videoId);
        var userResponses = [];
    
        function keyDownHandler(event) {
            if (event.key === 'f' || event.key === 'F' || event.key === 'j' || event.key === 'J') {
                var response = {
                    key: event.key.toLowerCase(),
                    time: new Date().getTime(),
                };
                userResponses.push(response);
            }
        }
    
        document.addEventListener('keydown', keyDownHandler);
    
        await new Promise((resolve) => {
            video.oncanplaythrough = function () {
                resolve();
            };
        });
    
        video.onplay = function () {
            toneInterval = toneGenerator();
            video.play();
        };
    
        await new Promise((resolve) => {
            video.onended = function () {
                resolve();
            };
        });
    
        clearInterval(toneInterval);
        document.removeEventListener('keydown', keyDownHandler);
        callback(userResponses);
    }
                </script>
