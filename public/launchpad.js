document.addEventListener('DOMContentLoaded', () => {
    // Constants for note ranges
    const bottomLeft = [51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36];
    const bottomRight = [83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68];
    const topLeft = [67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52];
    const topRight = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84];
    const sideButtons = [104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119];

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
    appendButtons(sideButtonsLeftContainer, sideButtons.slice(0, 8));

    const sideButtonsTopContainer = document.createElement('div');
    sideButtonsTopContainer.className = 'side-buttons-top';
    appendButtons(sideButtonsTopContainer, sideButtons.slice(8, 16));

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
    appendButtons(sideButtonsBottomContainer, sideButtons.slice(16, 24));

    const sideButtonsRightContainer = document.createElement('div');
    sideButtonsRightContainer.className = 'side-buttons-right';
    appendButtons(sideButtonsRightContainer, sideButtons.slice(24, 32));

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
