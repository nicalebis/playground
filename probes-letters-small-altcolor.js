const probeSize = 12;
const results = [];

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

  function updateProbeColor(x, y, time) {
    const r = Math.sin(0.004 * time) * 128 + 128;
    const g = Math.sin(0.008 * time) * 128 + 128;
    const b = Math.sin(0.012 * time) * 128 + 128;
  
    return `rgb(${r}, ${g}, ${b})`;
  }
  // q: how can i make the probe color change slower?
  // a: change the numbers in the updateProbeColor function
  // a: which numbers do i change?
  // a: the numbers that are multiplied by time

  

  // Add this function to create a CSV file and download the results
  function downloadResults(results) {
    const header = [
      'video_id',
      'keypress',
      'reaction_time',
      'probe_shape',
      'probe_x',
      'probe_y',
      'time_within_video', // Add this line to the header
    ];
    const csvContent =
      header.join(',') +
      '\n' +
      results
        .map((result) =>
          [
            result.video_id,
            result.keyPressed,
            result.rt,
            result.probe_shape,
            result.x,
            result.y,
            result.time_within_video, // Add this line when mapping the results
          ].join(',')
        )
        .join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  function showProbe() {
    if (probeVisible || !isVideoScreenVisible) return;
  
    clearCanvas(ctx);
  
    let x, y, shape;
  
    x = (Math.random() * (ctx.canvas.width - (0.2*ctx.canvas.width))) + 0.1*ctx.canvas.width;
    y = (Math.random() * (ctx.canvas.height - (0.2*ctx.canvas.height))) + 0.1*ctx.canvas.height;
  
    shape = Math.random() < 0.5 ? 'F' : 'J'; // Use F and J as shapes
  
    function animateProbe() {
      const probeColor = updateProbeColor(x, y, Date.now());
      clearCanvas(ctx);
      drawProbe(ctx, probeSize, x, y, shape, probeColor);
  
      if (probeVisible) {
        requestAnimationFrame(animateProbe);
      } else {
        clearCanvas(ctx);
      }
    }
  
    requestAnimationFrame(animateProbe);
  
    lastProbeTime = video.currentTime;
    lastProbeShape = shape;
    lastProbeX = x;
    lastProbeY = y;
  
    const meanDelay = 2250;
    const sdDelay = 500;
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

const meanDelay = 2250;
const sdDelay = 500;
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
      const isCorrect =
        (keyPressed === 'f' && lastProbeShape === 'F') ||
        (keyPressed === 'j' && lastProbeShape === 'J');
  
      lastKeyPressTime = Date.now();
  
      results.push({
        video_id: currentVideoIndex,
        rt: rt,
        x: lastProbeX,
        y: lastProbeY,
        keyPressed: keyPressed,
        probe_shape: lastProbeShape,
        correct: isCorrect,
        time_within_video: currentTime, // Add this line to include the time within video
      });
  
      // Display the last reaction time and whether the last keypress was correct
      document.getElementById(
        'last-reaction-time'
      ).textContent = `Last Reaction Time: ${rt.toFixed(3)} seconds`;
      document.getElementById(
        'last-keypress-correct'
      ).textContent = `Last Keypress Correct: ${
        isCorrect ? 'Yes' : 'No'
      }`;
  
      console.log(results);
  
      // clear the previous timeout if it exists
      if (probeTimeout) {
        clearTimeout(probeTimeout);
      }
  
      hideProbeAndScheduleNext();
    }
  }
  

const showProbeOnPlay = () => {
    setTimeout(showProbe, 3000);
  };
  
  video.removeEventListener('play', showProbeOnPlay);
  video.addEventListener('play', showProbeOnPlay, { once: config.once });


video.addEventListener('ended', () => {
clearCanvas(ctx);
probeVisible = false;
document.removeEventListener('keydown', handleKeyPress);
if (probeTimeout) {
    clearTimeout(probeTimeout);
  }
});


document.addEventListener('keydown', handleKeyPress);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "7") {
      downloadResults(results);
    }
  });
  
window.runTrialWithProbes = runTrialWithProbes;

