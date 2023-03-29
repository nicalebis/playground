const probeSize = 6;

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function getContrastingColor(r, g, b) {
  return `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
}

function drawProbe(ctx, size, x, y, shape, bgData) {
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

  ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, 2 * Math.PI);
  ctx.stroke();

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

// Generate a random number from a Gaussian distribution
function gaussianRandom(mean, sd) {
    const u = Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2* Math.PI * v);
    return Math.round(mean + sd * z);
  }

function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function runTrialWithProbes(videoId, canvasId) {
    const video = document.getElementById(videoId);
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    let probeVisible = false;
  
    let lastProbeTime;
    let lastProbeShape;
    let lastProbeX;
    let lastProbeY;
    const results = [];

    function showProbe() {
      if (probeVisible) return;
  
      clearCanvas(ctx);
  
      // Draw the background transparent probe
      ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
      ctx.beginPath();
      const x = Math.random() * (ctx.canvas.width - 2 * probeSize) + probeSize;
      const y = Math.random() * (ctx.canvas.height - 2 * probeSize) + probeSize;
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.stroke();
  
      // Get the image data for the background probe
      const bgData = ctx.getImageData(x - 15, y - 15, 30, 30);
  
      // Draw the visible probe with contrast color
      const shape = Math.random() < 0.5 ? 'square' : 'triangle';
      lastProbeShape = shape;
      lastProbeX = x;
      lastProbeY = y;
      drawProbe(ctx, probeSize, x, y, shape, bgData);

      probeVisible = true;

      lastProbeTime = video.currentTime; 
      console.log(lastProbeTime);
    }
  
    function hideProbeAndScheduleNext() {
      if (!probeVisible) return;
  
      clearCanvas(ctx);
      probeVisible = false;
  
      // Generate delay interval from Gaussian distribution
      const meanDelay = 500; // mean delay in milliseconds
      const sdDelay = 150; // standard deviation in milliseconds
      const delay = Math.max(0, Math.round(gaussianRandom(meanDelay, sdDelay)));
  
      // Schedule next probe after delay interval
      setTimeout(showProbe, delay);
    }
  
    function handleKeyPress(e) {
        if (e.key === 'f' || e.key === 'j') {
          const currentTime = video.currentTime;
          const rt = currentTime - lastProbeTime;
          const keyPressed = e.key;
          const isCorrect = (keyPressed === 'f' && lastProbeShape === 'square') || (keyPressed === 'j' && lastProbeShape === 'triangle');
    
          results.push({
            rt: rt,
            x: lastProbeX,
            y: lastProbeY,
            keyPressed: keyPressed,
            correct: isCorrect,
          });
    
          console.log(results);
    
          hideProbeAndScheduleNext();
        }
      }
  
    document.addEventListener('keydown', handleKeyPress);
  
    video.addEventListener('play', () => {
      setTimeout(showProbe, 2500);
    });
  
    video.addEventListener('ended', () => {
      clearCanvas(ctx);
      probeVisible = false;
    });
  }
  
