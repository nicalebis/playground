let lastProbeTimes = {};
let lastProbeTime = 0;
const minProbeInterval = 1.5; // Change to 1.5 seconds
const maxProbeInterval = 3; // Change to 3 seconds

function setupProbes(videoId, canvasId) {
    const video = document.getElementById(videoId);
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
  
    function createProbe() {
        const x = Math.random() * (canvas.width - 10);
        const y = Math.random() * (canvas.height - 10);
        const probeType = Math.random() < 0.5 ? 'F' : 'J';
        const size = 40;
        drawProbe(ctx, probeType, size, x, y);

        console.log(`Probe ${probeType} appeared at (${x}, ${y}) - Video time: ${video.currentTime}`);
        lastProbeTimes[video.id] = { videoTime: video.currentTime, probeType };

        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 50);
    }

    function drawProbe(ctx, probeType, size, x, y) {
        ctx.font = size + 'px sans-serif';
        ctx.fillStyle = 'red';
        ctx.fillText(probeType, x, y + size);
    }
  
    function checkVideoTime() {
        const currentTime = video.currentTime;

        if (currentTime - lastProbeTime >= minProbeInterval) {
            const probeProbability = (currentTime - lastProbeTime) / (maxProbeInterval - minProbeInterval);
            if (Math.random() < probeProbability) {
                createProbe();
                lastProbeTime = currentTime;
            }
        }
    }
  
    video.addEventListener('play', () => {
        probeInterval = setInterval(checkVideoTime, 100);
    });
  
    video.addEventListener('pause', () => {
        clearInterval(probeInterval);
    });
  
    video.addEventListener('ended', () => {
        clearInterval(probeInterval);
    });
  
    video.addEventListener('timeupdate', () => {
        if (video.currentTime >= 2 && !probeInterval) {
            probeInterval = setInterval(checkVideoTime, 100);
        }
    });
}
