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
  ctx.beginPath();

  if (shape === 'square') {
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
  } else if (shape === 'triangle') {
    ctx.moveTo(x - size / 2, y + size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.lineTo(x, y - size / 2);
    ctx.closePath();
  }

  ctx.fill();
}

function updateProbeColor(ctx, x, y, size, shape) {
  const bgData = ctx.getImageData(x - 6, y - 6, 12, 12);
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

  const probeColor = getContrastingColor(r, g, b);

  ctx.fillStyle = probeColor;
  if (shape === 'square') {
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
  } else if (shape === 'triangle') {
    ctx.beginPath();
    ctx.moveTo(x - size / 2, y + size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.lineTo(x, y - size / 2);
    ctx.closePath();
    ctx.fill();
  }
}

function drawVideoFrame(video, videoCanvas) {
  const videoCtx = videoCanvas.getContext('2d');
  videoCanvas.width = video.videoWidth;
  videoCanvas.height = video.videoHeight;
  videoCtx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
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

function createVideoCanvas() {
  const videoCanvas = document.createElement('canvas');
  videoCanvas.id = 'video-canvas'; // Set the ID
  videoCanvas.style.position = 'absolute';
  videoCanvas.style.top = '0';
  videoCanvas.style.left = '0';
  videoCanvas.style.zIndex = '-1';
  videoCanvas.style.display = 'none'; // Keep the canvas hidden
  return videoCanvas;
}

let isVideoScreenVisible = false;

function runTrialWithProbes(videoId, canvasId) {
  const video = document.getElementById(videoId);
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const videoCanvas = createVideoCanvas();
  const existingVideoCanvas = document.getElementById('video-canvas');
  existingVideoCanvas.parentNode.replaceChild(videoCanvas, existingVideoCanvas);

  let probeVisible = false;
  let probeTimeout;

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

    shape = Math.random() < 0.5 ? 'square' : 'triangle'; // Use square and triangle as shapes
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

    if (probeTimeout) {
      clearTimeout(probeTimeout);
    }

    probeTimeout = setTimeout(showProbe, delay);

    probeDisappearTimeout = setTimeout(() => {
      if (probeVisible) {
        hideProbeAndScheduleNext();
      }
    }, 4000);

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

if (probeDisappearTimeout) {
  clearTimeout(probeDisappearTimeout);
}

probeTimeout = setTimeout(showProbe, delay);

}

function handleKeyPress(e) {
  if (!isVideoScreenVisible || !probeVisible) return;
  if (e.key === 'f' || e.key === 'j') {
    const currentTime = video.currentTime;
    const rt = currentTime - lastProbeTime;
    const keyPressed = e.key;
    const isCorrect = (e.key === 'f' && lastProbeShape === 'square') || (e.key === 'j' && lastProbeShape === 'triangle');


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

    if (probeDisappearTimeout) {
      clearTimeout(probeDisappearTimeout);
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
document.removeEventListener('keydown', handleKeyPress); // Remove keydown event listener when video ends
});

document.addEventListener('keydown', handleKeyPress);
}

window.runTrialWithProbes = runTrialWithProbes;
