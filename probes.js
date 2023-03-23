/////////////////////
// PROBE GENERATOR //
/////////////////////

function getProbeSettings() {
    const defaultSettings = {
        duration: 100,
        size: 10,
        color: 'red',
        frequency: 2000,
    };

    const savedSettings = localStorage.getItem('probeSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function drawRedProbe(ctx, size, color, x, y) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
}

function clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function showRedProbe(ctx, size, color, canvas) {
    const x = getRandom(0, canvas.width - size);
    const y = getRandom(0, canvas.height - size);
    drawRedProbe(ctx, size, color, x, y);
    setTimeout(() => clearCanvas(ctx, canvas), getProbeSettings().duration);
}

function startProbes(ctx, canvas) {
    showRedProbe(ctx, getProbeSettings().size, getProbeSettings().color, canvas);
    const interval = getRandom(1500, 2500); // Probe interval between 1.5s and 2.5s
    probeTimeout = setTimeout(() => startProbes(ctx, canvas), interval);
}

function runTrialWithProbes(trialNum, canvasId, videoId) {
    const video = document.getElementById(videoId);
    const canvas = document.getElementById(canvasId);

    if (!canvas) {
        console.error(`Canvas with ID '${canvasId}' not found.`);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let probeTimeout;

    video.addEventListener('play', () => {
        startProbes(ctx, canvas);
    });

    video.addEventListener('pause', () => {
        clearTimeout(probeTimeout);
        clearCanvas(ctx, canvas);
    });

    video.addEventListener('ended', () => {
        clearTimeout(probeTimeout);
        clearCanvas(ctx, canvas);
    });
}
