// Show and Hide Screens

function showScreen(screenId) {
    const screen = document.getElementById(screenId);
    screen.style.display = "block";
}

function hideScreen(screenId) {
    const screen = document.getElementById(screenId);
    screen.style.display = "none";
}

// Screen Navigation

const state = {
    currentScreen: null,
    eventListeners: [],
};

function goToScreen(screenId) {
    if (state.currentScreen) {
        hideScreen(state.currentScreen);
        removeEventListeners();
    }

    state.currentScreen = screenId;
    showScreen(screenId);
    addEventListeners(screenId);
}