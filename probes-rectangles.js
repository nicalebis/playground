const lastProbeTimes = {};

function setupProbes(videoId, canvasId) {
    const video = document.getElementById(videoId);
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
  
    let probeInterval;
    let lastProbeTime = 0;
    const minProbeInterval = 1.5;
    const maxProbeInterval = 4;
    const minSize = 10;
    const maxSize = 30;
  
    function createProbe() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const x = Math.random() * (canvas.width - maxSize);
      const y = Math.random() * (canvas.height - maxSize);
      const width = Math.floor(Math.random() * (maxSize - minSize + 1) + minSize);
      let height;
      do {
        height = Math.floor(Math.random() * (maxSize - minSize + 1) + minSize);
      } while (Math.abs(height - width) <= 5);
  
      const isTransparent = Math.random() < 0.6;
      ctx.fillStyle = isTransparent ? 'rgba(255, 0, 0, 0.5)' : 'red';
  
      ctx.fillRect(x, y, width, height);
  
      console.log(`Probe appeared at (${x}, ${y}) - Video time: ${video.currentTime}`);
      
      const probeData = {
        x: x,
        y: y,
        width: width,
        height: height,
        correctKey: width > height ? 'KeyF' : 'KeyJ',
        videoTime: video.currentTime
      };
    
      lastProbeTimes[videoId] = probeData; // Update the last probe time object with probe data

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
  }
  
