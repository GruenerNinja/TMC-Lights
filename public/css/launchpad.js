document.addEventListener('DOMContentLoaded', () => {
    // Constants for note ranges
    const bottomLeft = [48, 49, 50, 51, 44, 45, 46, 47, 40, 41, 42, 43, 36, 37, 38, 39];
    const bottomRight = [80, 81, 82, 83, 76, 77, 78, 79, 72, 73, 74, 75, 68, 69, 70, 71];
    const topLeft = [64, 65, 66, 67, 60, 61, 62, 63, 56, 57, 58, 59, 52, 53, 54, 55];
    const topRight = [96, 97, 98, 99, 92, 93, 94, 95, 88, 89, 90, 91, 84, 85, 86, 87];
    const sideButtons = [104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129];

    // Function to create a button element
    const createButton = (note) => {
        const button = document.createElement('div');
        button.className = 'launchpad-button';
        button.dataset.note = note;
        button.textContent = note; // Display the note number for reference
        return button;
    };

    // Function to append buttons to a container
    const appendButtons = (container, notes) => {
        notes.forEach(note => {
            const button = createButton(note);
            container.appendChild(button);
        });
    };

    // Create the grid structure
    const launchpad = document.getElementById('launchpad');
    if (!launchpad) {
        console.error('Launchpad element not found');
        return;
    }

    // Clear any existing content
    launchpad.innerHTML = '';

    // Create containers
    const sideButtonsLeftContainer = document.createElement('div');
    sideButtonsLeftContainer.className = 'side-buttons-left';
    appendButtons(sideButtonsLeftContainer, sideButtons.slice(0, 10));

    const sideButtonsTopContainer = document.createElement('div');
    sideButtonsTopContainer.className = 'side-buttons-top';
    appendButtons(sideButtonsTopContainer, sideButtons.slice(10, 18));

    const mainButtonsContainer = document.createElement('div');
    mainButtonsContainer.className = 'main-buttons';

    const mainButtonsTopLeftContainer = document.createElement('div');
    mainButtonsTopLeftContainer.className = 'main-buttons-top-left';
    appendButtons(mainButtonsTopLeftContainer, topLeft);
    mainButtonsContainer.appendChild(mainButtonsTopLeftContainer);

    const mainButtonsTopRightContainer = document.createElement('div');
    mainButtonsTopRightContainer.className = 'main-buttons-top-right';
    appendButtons(mainButtonsTopRightContainer, topRight);
    mainButtonsContainer.appendChild(mainButtonsTopRightContainer);

    const mainButtonsBottomLeftContainer = document.createElement('div');
    mainButtonsBottomLeftContainer.className = 'main-buttons-bottom-left';
    appendButtons(mainButtonsBottomLeftContainer, bottomLeft);
    mainButtonsContainer.appendChild(mainButtonsBottomLeftContainer);

    const mainButtonsBottomRightContainer = document.createElement('div');
    mainButtonsBottomRightContainer.className = 'main-buttons-bottom-right';
    appendButtons(mainButtonsBottomRightContainer, bottomRight);
    mainButtonsContainer.appendChild(mainButtonsBottomRightContainer);

    const sideButtonsBottomContainer = document.createElement('div');
    sideButtonsBottomContainer.className = 'side-buttons-bottom';
    appendButtons(sideButtonsBottomContainer, sideButtons.slice(18, 26));

    const sideButtonsRightContainer = document.createElement('div');
    sideButtonsRightContainer.className = 'side-buttons-right';
    appendButtons(sideButtonsRightContainer, sideButtons.slice(0, 10));

    // Append containers to launchpad
    launchpad.appendChild(sideButtonsLeftContainer);

    const middleButtonsContainer = document.createElement('div');
    middleButtonsContainer.className = 'middle-buttons';
    middleButtonsContainer.appendChild(sideButtonsTopContainer);
    middleButtonsContainer.appendChild(mainButtonsContainer);
    middleButtonsContainer.appendChild(sideButtonsBottomContainer);
    launchpad.appendChild(middleButtonsContainer);

    launchpad.appendChild(sideButtonsRightContainer);

    // MIDI file handling and playback
    let midiData;
    const playButton = document.getElementById('play-button');

    document.getElementById('midi-file-input').addEventListener('change', handleFileSelect);
    playButton.addEventListener('click', playMidiClip);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const arrayBuffer = e.target.result;
                midiData = new Midi(arrayBuffer);
                console.log('MIDI file loaded', midiData);
            };
            reader.readAsArrayBuffer(file);
        }
    }

    function playMidiClip() {
        if (!midiData) {
            alert('Please load a MIDI file first.');
            return;
        }

        console.log('Playing MIDI clip');

        // Set start time for the playback
        const startTime = window.performance.now();

        midiData.tracks.forEach(track => {
            track.notes.forEach(note => {
                const noteOnTime = startTime + (note.time * 1000); // Convert to milliseconds
                const noteOffTime = noteOnTime + (note.duration * 1000);

                setTimeout(() => {
                    const button = document.querySelector(`.launchpad-button[data-note="${note.midi}"]`);
                    if (button) {
                        button.classList.add('active');
                    }
                    console.log(`Note on: ${note.midi} at ${note.time}s`);
                }, noteOnTime - startTime);

                setTimeout(() => {
                    const button = document.querySelector(`.launchpad-button[data-note="${note.midi}"]`);
                    if (button) {
                        button.classList.remove('active');
                    }
                    console.log(`Note off: ${note.midi} at ${note.time + note.duration}s`);
                }, noteOffTime - startTime);
            });
        });
    }
});
