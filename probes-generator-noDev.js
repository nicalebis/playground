<!-------------------------------->
                <!--------- PROBES TASK ---------->
                <!-------------------------------->

                <script>
                    function runTrialWithProbes(trialId, videoId) {
                        const video = document.getElementById(videoId);
                        const canvas = document.getElementById('canvas-' + trialId);
                        const ctx = canvas.getContext('2d');
                        let probeTimeout;
                    
                        function getRandom(min, max) {
                            return Math.random() * (max - min) + min;
                        }
                        
                        function drawRedProbe() {
                            const x = getRandom(0, canvas.width);
                            const y = getRandom(0, canvas.height);
                            const radius = 10;
                    
                            ctx.fillStyle = 'red';
                            ctx.beginPath();
                            ctx.arc(x, y, radius, 0, 2 * Math.PI);
                            ctx.fill();
                    
                            console.log("x: " + x + " y: " + y);
                            return { x, y };
                        }
                    
                        function clearCanvas() {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                        }
                    
                        function showRedProbe() {
                            const probeCoordinates = drawRedProbe();
                            const probeTime = new Date().getTime();
                            setTimeout(clearCanvas, 100); // Probe visible for 100ms
                            return { probeCoordinates, probeTime };
                        }
                    
                        function startProbes() {
                            const { probeCoordinates, probeTime } = showRedProbe();
                            const interval = getRandom(1500, 2500); // Probe interval between 1.5s and 2.5s
                            probeTimeout = setTimeout(startProbes, interval);
                    
                            return { probeCoordinates, probeTime };
                        }
                    
                        video.addEventListener('play', () => {
                            startProbes();
                        });
                    
                        video.addEventListener('pause', () => {
                            clearTimeout(probeTimeout);
                            clearCanvas();
                        });
                    
                        video.addEventListener('ended', () => {
                            clearTimeout(probeTimeout);
                            clearCanvas();
                        });
                    
                        function recordKeyPress(event, probeTime) {
                            if (event.code === 'Space') {
                                const spacebarPressTime = new Date().getTime();
                                const reactionTime = spacebarPressTime - probeTime;
                                const videoTime = video.currentTime;
                    
                                console.log({
                                    trialId,
                                    videoId,
                                    videoTime,
                                    probeCoordinates,
                                    reactionTime,
                                });
                            }
                        }
                    
                        document.addEventListener('keydown', (event) => {
                            recordKeyPress(event, probeTime);
                        });
                    }
                    </script>
