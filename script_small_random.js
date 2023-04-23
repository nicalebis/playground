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
    'videos/P1E.mp4', 'videos/P1U.mp4', 'videos/P2E.mp4', 'videos/P2U.mp4', 'videos/P3E.mp4', 'videos/P3U.mp4', 
    'videos/P4E.mp4', 'videos/P4U.mp4', 'videos/S1E.mp4', 'videos/S1U.mp4', 'videos/S2E.mp4', 'videos/S2U.mp4', 
    'videos/S3E.mp4', 'videos/S3U.mp4', 'videos/S4E.mp4', 'videos/S4U.mp4', 'videos/S5E.mp4', 'videos/S5U.mp4'
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

  
  const trialIndices = Array.from({ length: videos.length }, (_, i) => i);
  let currentTrialIndex = -1;
  
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  function getRandomTrialIndex() {
  const shuffledIndices = [...trialIndices];
  shuffle(shuffledIndices);

  for (let i = 0; i < shuffledIndices.length; i++) {
    const newIndex = shuffledIndices[i];

    if (
      (currentTrialIndex === -1 || videos[newIndex][0] !== videos[currentTrialIndex][0]) &&
      (currentTrialIndex <= 0 || videos[newIndex][0] !== videos[currentTrialIndex - 1][0])
    ) {
      return newIndex;
    }
  }

  // Fallback in case no valid index is found
  return Math.floor(Math.random() * trialIndices.length);
}


function startProbes() {
  runTrialWithProbes('video', 'canvas');
}

let currentVideoIndex = 0;

function resizeWrapper() {
  const videoWrapper = document.getElementById('video-wrapper');
  videoWrapper.style.width = `${video.videoWidth}px`;
  videoWrapper.style.height = `${video.videoHeight}px`;
  // Set canvas dimensions to match the video dimensions
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
}

function loadVideo(index) {
  video.removeEventListener('ended', videoEndedHandler); // Remove the old event listener
  video.src = videos[index];
  video.load();
  video.play();
  video.addEventListener('loadedmetadata', resizeWrapper);
  window.runTrialWithProbes('video', 'canvas', { once: true }); // Add this line to run the probe task for each video

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  isVideoScreenVisible = true;
  
  video.addEventListener('ended', videoEndedHandler); // Add the new event listener
}

function videoEndedHandler() {
    video.removeEventListener('loadedmetadata', resizeWrapper);
    videoScreen.classList.add('hidden');
    inputScreen.classList.remove('hidden');
    isVideoScreenVisible = false;
    isInputScreenVisible = true;
  
    // Remove the current video from the list
    videos.splice(currentVideoIndex - 1, 1);
    texts.splice(currentVideoIndex - 1, 1);

    document.addEventListener('keydown', handleInputScreenKeyPress);
  }

function loadText(index) {
    text.textContent = texts[index];
}

function nextVideo() {
  currentTrialIndex = getRandomTrialIndex();
    loadVideo(currentVideoIndex);
    loadText(currentVideoIndex);
  
    trialIndices.splice(currentTrialIndex, 1);
  
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
  
