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
    'videos/P1E.mp4',  // 1
    'videos/S5U.mp4',  // 18
    'videos/P4E.mp4',  // 7
    'videos/S3E.mp4',  // 13
    'videos/P2U.mp4',  // 4
    'videos/S4U.mp4',   // 16
    'videos/S1E.mp4',  // 9
    'videos/P1U.mp4',  // 2
    'videos/S4E.mp4',  // 15
    'videos/P2E.mp4',  // 3
    'videos/S3U.mp4',  // 14
    'videos/P3E.mp4',  // 5
    'videos/S2E.mp4',  // 11
    'videos/S1U.mp4',  // 10
    'videos/P4U.mp4',  // 8
    'videos/S5E.mp4',  // 17
    'videos/P3U.mp4',  // 6
    'videos/S2U.mp4'  // 12
  ];
  
  const texts = [
  'Did the previous video show a toy ball?',  // 1
  'Did the previous video show an apple?',	 // 18
  'Did the previous video show a striped object?',  // 7
  'Did the previous video show a toy ball?',  // 13
  'Did the previous video show an arm wearing a watch?',  // 4
  'Did the previous video show a person eating?', // 16
  'Did the previous video show a lion?',  // 9
	'Did the previous video show a red rectangle?',  // 2
  'Did the previous video show a person wearing red?',  // 15
	'Did the previous video show a train?',  // 3
	'Did the previous video show a toy train?', // 14
	'Did the previous video show a red box?',  // 5
	'Did the previous video show a person with a logo on their shirt?',  // 11
  'Did the previous video show strawberries?', // 10
	'Did the previous video show a blue box?',  // 8
  'Did the previous video show a person eating?',  // 17
	'Did the previous video show a toy train?',  // 6
	'Did the previous video show a clear pitcher of water?' // 12
  ];


let currentVideoIndex = 0;

function resizeWrapper() {
  const videoWrapper = document.getElementById('video-wrapper');
  videoWrapper.style.width = `${video.videoWidth/2}px`; // set the video wrapper width to half of its original width
  videoWrapper.style.height = `${video.videoHeight/2}px`; // set the video wrapper height to half of its original height
  // Set canvas dimensions to match the video dimensions
  canvas.width = video.videoWidth/2; // set the canvas width to half of its original width
  canvas.height = video.videoHeight/2; // set the canvas height to half of its original height
}

function handleInputScreenKeyPress(e) {
  if (!isInputScreenVisible) return;
  if (e.key === 'f' || e.key === 'j') {
    // Start the next trial
    inputScreen.classList.add('hidden');
    videoScreen.classList.remove('hidden');
    nextVideo();
  }
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
  
    video.addEventListener('ended', videoEndedHandler, {once:true}); // Add the new event listener
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

