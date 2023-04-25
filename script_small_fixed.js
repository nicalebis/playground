const welcomeScreen = document.getElementById('welcome-screen');
const instructionsScreen = document.getElementById('instructions-screen');
const videoScreen = document.getElementById('video-screen');
const inputScreen = document.getElementById('input-screen');
const startInstructionsButton = document.getElementById('start-instructions');
const startTrialsButton = document.getElementById('start-trials');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const text = document.getElementById('text');
const slider = document.getElementById('slider');
const progress = document.getElementById('progress');

let probeInterval;
const PROBE_INTERVAL_MS = 100;

const videos = [
    'videos_small/P1E.mp4', 'videos_small/P1U.mp4', 'videos_small/P2E.mp4', 'videos_small/P2U.mp4', 'videos_small/P3E.mp4', 'videos_small/P3U.mp4', 
    'videos_small/P4E.mp4', 'videos_small/P4U.mp4', 'videos_small/S1E.mp4', 'videos_small/S1U.mp4', 'videos_small/S2E.mp4', 'videos_small/S2U.mp4', 
    'videos_small/S3E.mp4', 'videos_small/S3U.mp4', 'videos_small/S4E.mp4', 'videos_small/S4U.mp4', 'videos_small/S5E.mp4', 'videos_small/S5U.mp4'
  ];
  
  const texts = [
  'Did the previous video show a toy ball?', 
	'Did the previous video show a red rectangle?', 
	'Did the previous video show a train?', 
	'Did the previous video show an arm wearing a watch?', 
	'Did the previous video show a red box?', 
	'Did the previous video show a toy train?', 
    'Did the previous video show a striped object?', 
	'Did the previous video show a blue box?', 
	'Did the previous video show a lion?', 
	'Did the previous video show strawberries?',
	'Did the previous video show a person with a logo on their shirt?', 
	'Did the previous video show a clear pitcher of water?',
	'Did the previous video show a toy ball?', 
	'Did the previous video show a toy train?',
	'Did the previous video show a person wearing red?', 
	'Did the previous video show a person eating?',
	'Did the previous video show a person eating?', 
	'Did the previous video show an apple?'	
  ];

  
function startProbes() {
  runTrialWithProbes('video', 'canvas');
}

let currentVideoIndex = 0;

function resizeWrapper() {
  const videoWrapper = document.getElementById('video-wrapper');
  videoWrapper.style.width = `${video.videoWidth/2}px`; // set the video wrapper width to half of its original width
  videoWrapper.style.height = `${video.videoHeight/2}px`; // set the video wrapper height to half of its original height
  // Set canvas dimensions to match the video dimensions
  canvas.width = video.videoWidth/2; // set the canvas width to half of its original width
  canvas.height = video.videoHeight/2; // set the canvas height to half of its original height
}


function loadVideo(index) {
    video.removeEventListener('ended', videoEndedHandler); // Remove the old event listener
    video.src = videos[index];
    video.load();
    video.play();
    video.muted = false;
    video.style.width = '100%';
    video.style.height = '100%';
  
    // Re-add the loadedmetadata event listener
    video.removeEventListener('loadedmetadata', resizeWrapper);
    video.addEventListener('loadedmetadata', resizeWrapper);
  
    window.runTrialWithProbes('video', 'canvas', { once: true }); // Add this line to run the probe task for each video
  
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    isVideoScreenVisible = true;
  
    video.addEventListener('ended', videoEndedHandler); // Add the new event listener
  }

function videoEndedHandler() {
    video.removeEventListener('loadedmetadata', resizeWrapper);
    video.muted = true;
    videoScreen.classList.add('hidden');
    inputScreen.classList.remove('hidden');
    isVideoScreenVisible = false;
    isInputScreenVisible = true;

    document.addEventListener('keydown', handleInputScreenKeyPress);
  }

function loadText(index) {
    text.textContent = texts[index];
}

function nextVideo() {
    // Remove the random trial index code
    loadVideo(currentVideoIndex);
    loadText(currentVideoIndex);
  
    // Increment the currentVideoIndex, if it reaches the end of the array, reset it to 0
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
  
    video.addEventListener('playing', startProbes, { once: true });

    inputScreen.classList.add('hidden');
  videoScreen.classList.remove('hidden');
  isInputScreenVisible = false;
  document.removeEventListener('keydown', handleInputScreenKeyPress);
  }

  let spacebarPressed = false;


startInstructionsButton.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    instructionsScreen.classList.remove('hidden');
});

startTrialsButton.addEventListener('click', () => {
  instructionsScreen.classList.add('hidden');
  videoScreen.classList.remove('hidden');
  nextVideo();
});

let isInputScreenVisible = false;

function handleInputScreenKeyPress(e) {
    if (!isInputScreenVisible) return;
    if (e.key === 'f' || e.key === 'j') {
      // Start the next trial
      inputScreen.classList.add('hidden');
      videoScreen.classList.remove('hidden');
      nextVideo();
    }
  }
