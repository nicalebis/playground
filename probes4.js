function setupProbes(videoId, canvasId) {
    const video = document.getElementById(videoId);
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
  
    let probeInterval;
    let lastProbeTime = 0;
    const minProbeInterval = 1.5;
    const maxProbeInterval = 4;
  
    function createProbe() {
      const x = Math.random() * (canvas.width - 5);
      const y = Math.random() * (canvas.height - 5);
  
      const isTransparent = Math.random() < 0.5;
      ctx.fillStyle = isTransparent ? 'rgba(255, 0, 0, 0.5)' : 'red';
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
      ctx.fill();
  
      console.log(`Probe appeared at (${x}, ${y}) - Video time: ${video.currentTime}`);
       
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 50);
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

    // Return the last probe time
  return {
    getLastProbeTime: function () {
      return lastProbeTime;
    }
  };
  }
  
