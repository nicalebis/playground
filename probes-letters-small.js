const probeSize = 10;

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function getContrastingColor(r, g, b) {
  return `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
}

function drawProbe(ctx, size, x, y, shape) {
    const probeColor = 'rgb(224, 176, 255)';
  
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

function gaussianRandom(mean, sd) {
  const u = Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.round(mean + sd * z);
}

function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

let isVideoScreenVisible = false;

function runTrialWithProbes(videoId, canvasId, config = {}) {
  const video = document.getElementById(videoId);
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
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
  
    let x, y, bgData, shape;
    let numBlackPixels = 0;
  
    do {
      x = Math.random() * (ctx.canvas.width - 2 * probeSize) + probeSize;
      y = Math.random() * (ctx.canvas.height - 2 * probeSize) + probeSize;
  
      ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.stroke();
  
      bgData = ctx.getImageData(x - 8, y - 8, 16, 16);
  
      let numBlackPixels = 0;
      for (let i = 0; i < bgData.data.length; i += 4) {
        if (bgData.data[i] === 0 && bgData.data[i + 1] === 0 && bgData.data[i + 2] === 0) {
          numBlackPixels++;
        }
      }
    } while (numBlackPixels > 128);
  
    shape = Math.random() < 0.5 ? 'F' : 'J'; // Use F and J as shapes
    drawProbe(ctx, probeSize, x, y, shape); // Removed bgData parameter
  
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

