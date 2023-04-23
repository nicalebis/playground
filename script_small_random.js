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
  'How confident are you that the previous video showed a toy ball?', 
	'How confident are you that the previous video showed a red rectangle?', 
	'How confident are you that the previous video showed a train?', 
	'How confident are you that the previous video showed an arm wearing a watch?', 
	'How confident are you that the previous video showed a red box?', 
	'How confident are you that the previous video showed a toy train?', 
  'How confident are you that the previous video showed a striped object?', 
	'How confident are you that the previous video showed a blue box?', 
	'How confident are you that the previous video showed a lion?', 
	'How confident are you that the previous video showed strawberries?',
	'How confident are you that the previous video showed a person with a logo on their shirt?', 
	'How confident are you that the previous video showed a clear pitcher of water?',
	'How confident are you that the previous video showed a toy ball?', 
	'How confident are you that the previous video showed a toy train?',
	'How confident are you that the previous video showed a person wearing red?', 
	'How confident are you that the previous video showed a person eating?',
	'How confident are you that the previous video showed a person eating?', 
	'How confident are you that the previous video showed an apple?'	
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

video.addEventListener('ended', () => {
    videoScreen.classList.add('hidden');
    inputScreen.classList.remove('hidden');
});

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
  video.removeEventListener('loadedmetadata', resizeWrapper); // Add this line
  videoScreen.classList.add('hidden');
  inputScreen.classList.remove('hidden');
  isVideoScreenVisible = false;
}

function loadText(index) {
    text.textContent = texts[index];
}

function nextVideo() {
    currentTrialIndex = getRandomTrialIndex();
    loadVideo(currentTrialIndex);
    loadText(currentTrialIndex);
    trialIndices.splice(currentTrialIndex, 1);

    video.addEventListener('playing', startProbes, { once: true });
  }

  let spacebarPressed = false;

  document.addEventListener('keydown', (event) => {
  if (inputScreen.classList.contains('hidden')) {
    return; // If inputScreen is hidden, exit the event listener
  }
  if (event.key >= '1' && event.key <= '5') {
    slider.value = event.key;
  } else if (event.code === 'Space' && !spacebarPressed) {
    spacebarPressed = true;
    inputScreen.classList.add('hidden');
    videoScreen.classList.remove('hidden');

    // Record the slider position and checkbox status
    const sliderValue = slider.value;
    const notApplicableChecked = document.getElementById('notApplicable').checked;
    console.log('Slider value:', sliderValue);
    console.log('Not Applicable checked:', notApplicableChecked);

    // Call nextVideo
    nextVideo();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    spacebarPressed = false;
  }
});

startInstructionsButton.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    instructionsScreen.classList.remove('hidden');
});

startTrialsButton.addEventListener('click', () => {
  instructionsScreen.classList.add('hidden');
  videoScreen.classList.remove('hidden');
  nextVideo();
});

video.addEventListener('ended', () => {
  videoScreen.classList.add('hidden');
  inputScreen.classList.remove('hidden');
  isVideoScreenVisible = false;
});

