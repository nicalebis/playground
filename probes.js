function runTrialWithProbes(trialNum, canvasId, videoId) {
    const video = document.getElementById(videoId);
    const canvas = document.getElementById(canvasId);
  
    if (!canvas) {
      console.error(`Canvas with ID '${canvasId}' not found.`);
      return;
    }
  
    const ctx = canvas.getContext('2d');
    let probeTimeout;
  
    const drawRedProbe = (ctx, size, color, x, y) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    };
  
    const clearCanvas = (ctx, canvas) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  
    const showRedProbe = (ctx, size, color, canvas) => {
      const x = Math.random() * (canvas.width - size);
      const y = Math.random() * (canvas.height - size);
      drawRedProbe(ctx, size, color, x, y);
      setTimeout(() => clearCanvas(ctx, canvas), 100);
    };
  
    const startProbes = (ctx, canvas) => {
      showRedProbe(ctx, 5, 'red', canvas);
      const interval = Math.random() * (2500 - 1500) + 1500;
      probeTimeout = setTimeout(() => startProbes(ctx, canvas), interval);
    };
  
    video.onplaying = () => {
      startProbes(ctx, canvas);
    };
  
    video.onpause = () => {
      clearTimeout(probeTimeout);
      clearCanvas(ctx, canvas);
    };
  
    video.onended = () => {
      clearTimeout(probeTimeout);
      clearCanvas(ctx, canvas);
    };
  }
  