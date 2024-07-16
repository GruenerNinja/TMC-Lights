// launchpad.js

document.addEventListener('DOMContentLoaded', async () => {
    const launchpadContainer = document.getElementById('launchpad-container');
    const sideButtonsContainer = document.getElementById('side-buttons');
    const audioPlayer = document.getElementById('audio-player');
    const midiAccess = await navigator.requestMIDIAccess();

    midiAccess.inputs.forEach(input => {
        input.onmidimessage = handleMessage;
    });

    function handleMessage(event) {
        const [command, note, velocity] = event.data;

        if (command === 144 && velocity > 0) { // Note On with velocity
            playNoteAnimation(note);
        } else if (command === 128 || (command === 144 && velocity === 0)) { // Note Off
            stopNoteAnimation(note);
        }
    }

    function playNoteAnimation(note) {
        const button = document.querySelector(`.launchpad-button[data-note="${note}"], .side-button[data-note="${note}"]`);
        if (button) {
            button.classList.add('active');
        }
    }

    function stopNoteAnimation(note) {
        const button = document.querySelector(`.launchpad-button[data-note="${note}"], .side-button[data-note="${note}"]`);
        if (button) {
            button.classList.remove('active');
        }
    }

    // Dynamically create buttons for the 8x8 grid
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const note = row * 8 + col + 36; // Adjust the base note number as needed
            const button = document.createElement('div');
            button.className = 'launchpad-button';
            button.dataset.note = note;
            button.textContent = note;
            launchpadContainer.appendChild(button);
        }
    }

    // Dynamically create side buttons
    for (let i = 0; i < 8; i++) {
        const note = 104 + i; // Adjust the note number for side buttons
        const button = document.createElement('div');
        button.className = 'side-button';
        button.dataset.note = note;
        button.textContent = note;
        sideButtonsContainer.appendChild(button);
    }
});
