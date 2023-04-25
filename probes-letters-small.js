const probeSize = 10;

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function getContrastingColor(r, g, b) {
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 128 ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
}

function drawProbe(ctx, size, x, y, shape, probeColor) {
  
    ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.stroke();
  
    ctx.fillStyle = probeColor;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  
    if (shape === 'F') {
      ctx.fillText('F', x, y);
    } else if (shape === 'J') {
      ctx.fillText('J', x, y);
    }
  }

  function drawVideoFrame(video, videoCanvas) {
    const videoCtx = videoCanvas.getContext('2d');
    videoCanvas.width = video.videoWidth;
    videoCanvas.height = video.videoHeight;
    videoCtx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
  }

  function updateProbeColor(videoCanvas, x, y) {
    const videoCtx = videoCanvas.getContext('2d');
    const bgData = videoCtx.getImageData(x - 8, y - 8, 16, 16);
    const data = bgData.data;
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
  
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  
    r /= count;
    g /= count;
    b /= count;
  
    return getContrastingColor(r, g, b);
  }

function gaussianRandom(mean, sd) {
  const u = Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.round(mean + sd * z);
}

function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function createVideoCanvas() {
    const videoCanvas = document.createElement('canvas');
    videoCanvas.style.position = 'absolute';
    videoCanvas.style.top = '0';
    videoCanvas.style.left = '0';
    videoCanvas.style.zIndex = '-1';
    videoCanvas.style.display = 'none'; // Add this line to hide the videoCanvas
    document.body.appendChild(videoCanvas);
    return videoCanvas;
  }

let isVideoScreenVisible = false;

function runTrialWithProbes(videoId, canvasId, config = {}) {
  const video = document.getElementById(videoId);
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const videoCanvas = createVideoCanvas();
  let probeVisible = false;
  let probeTimeout;

  let lastKeyPressTime = null;

  let lastProbeTime;
  let lastProbeShape;
  let lastProbeX;
  let lastProbeY;
  const results = [];

  function showProbe() {
    if (probeVisible || !isVideoScreenVisible) return;
  
    clearCanvas(ctx);
  
    let x, y, shape;
  
    x = Math.random() * (ctx.canvas.width - 2 * probeSize) + probeSize;
    y = Math.random() * (ctx.canvas.height - 2 * probeSize) + probeSize;
  
    shape = Math.random() < 0.5 ? 'F' : 'J'; // Use F and J as shapes
    drawVideoFrame(video, videoCanvas);
    const probeColor = updateProbeColor(videoCanvas, x, y);
    drawProbe(ctx, probeSize, x, y, shape, probeColor);
  
    lastProbeTime = video.currentTime;
    lastProbeShape = shape;
    lastProbeX = x;
    lastProbeY = y;
  
    const meanDelay = 1600;
    const sdDelay = 400;
    const delay = Math.max(0, Math.round(gaussianRandom(meanDelay, sdDelay)));
  
    // clear the previous timeout if it exists
    if (probeTimeout) {
      clearTimeout(probeTimeout);
    }
  
    probeTimeout = setTimeout(showProbe, delay);
  
    probeVisible = true;
  }

function hideProbeAndScheduleNext() {
if (!probeVisible || !isVideoScreenVisible) return;

clearCanvas(ctx);
probeVisible = false;

const meanDelay = 1600;
const sdDelay = 400;
const delay = Math.max(0, Math.round(gaussianRandom(meanDelay, sdDelay)));

// clear the previous timeout if it exists
if (probeTimeout) {
  clearTimeout(probeTimeout);
}

probeTimeout = setTimeout(showProbe, delay);

}

function handleKeyPress(e) {
    if (!isVideoScreenVisible || !probeVisible) return;
    if (e.key === 'f' || e.key === 'j') {
      const currentTime = video.currentTime;
      const rt = currentTime - lastProbeTime;
      const keyPressed = e.key;
      const isCorrect = (keyPressed === 'f' && lastProbeShape === 'F') || (keyPressed === 'j' && lastProbeShape === 'J');

      lastKeyPressTime = Date.now();

    results.push({
      rt: rt,
      x: lastProbeX,
      y: lastProbeY,
      keyPressed: keyPressed,
      correct: isCorrect,
    });

    // Display the last reaction time and whether the last keypress was correct
    document.getElementById("last-reaction-time").textContent = `Last Reaction Time: ${rt.toFixed(3)} seconds`;
    document.getElementById("last-keypress-correct").textContent = `Last Keypress Correct: ${isCorrect ? "Yes" : "No"}`;

    console.log(results);

    // clear the previous timeout if it exists
    if (probeTimeout) {
      clearTimeout(probeTimeout);
    }

    hideProbeAndScheduleNext();
  }
}

const showProbeOnPlay = () => {
    setTimeout(showProbe, 2500);
  };
  
  video.removeEventListener('play', showProbeOnPlay);
  video.addEventListener('play', showProbeOnPlay, { once: config.once });


video.addEventListener('ended', () => {
clearCanvas(ctx);
probeVisible = false;
document.removeEventListener('keydown', handleKeyPress);
});


document.addEventListener('keydown', handleKeyPress);
}

window.runTrialWithProbes = runTrialWithProbes;

