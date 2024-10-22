document.addEventListener('DOMContentLoaded', async () => {
    // Constants for note ranges
    const bottomLeft = [48, 49, 50, 51, 44, 45, 46, 47, 40, 41, 42, 43, 36, 37, 38, 39];
    const bottomRight = [80, 81, 82, 83, 76, 77, 78, 79, 72, 73, 74, 75, 68, 69, 70, 71];
    const topLeft = [64, 65, 66, 67, 60, 61, 62, 63, 56, 57, 58, 59, 52, 53, 54, 55];
    const topRight = [96, 97, 98, 99, 92, 93, 94, 95, 88, 89, 90, 91, 84, 85, 86, 87];
    const sideButtons = [26, 108, 109, 110, 111, 112, 113, 114, 115, 115, 28, 29, 30, 31, 32, 33, 34, 35, 27, 100, 101, 102, 103, 104, 105, 106, 107, 107, 116, 117, 118, 119, 120, 121, 122, 123];


    let midiAccess = null;
    let midiInput = null;
    let midiOutput = null;

    // Request MIDI access
    try {
        midiAccess = await navigator.requestMIDIAccess();
        // Populate MIDI input devices select options
        const inputSelect = document.getElementById('midi-input-select');
        midiAccess.inputs.forEach(input => {
            const option = document.createElement('option');
            option.value = input.id;
            option.textContent = input.name;
            inputSelect.appendChild(option);
        });

        // Listen for MIDI input device selection
        inputSelect.addEventListener('change', (event) => {
            const selectedInputId = event.target.value;
            midiInput = midiAccess.inputs.get(selectedInputId);
            if (midiInput) {
                midiInput.onmidimessage = handleMIDIMessage;
            } else {
                console.error('Selected MIDI input device not found');
            }
        });

        // Automatically select the first input device initially
        const firstInput = midiAccess.inputs.values().next().value;
        if (firstInput) {
            midiInput = firstInput;
            midiInput.onmidimessage = handleMIDIMessage;
        }

        // Populate MIDI output devices select options
        const outputSelect = document.getElementById('midi-output-select');
        midiAccess.outputs.forEach(output => {
            const option = document.createElement('option');
            option.value = output.id;
            option.textContent = output.name;
            outputSelect.appendChild(option);
        });

        // Listen for MIDI output device selection
        outputSelect.addEventListener('change', (event) => {
            const selectedOutputId = event.target.value;
            midiOutput = midiAccess.outputs.get(selectedOutputId);
        });

        // Automatically select the first output device initially
        const firstOutput = midiAccess.outputs.values().next().value;
        if (firstOutput) {
            midiOutput = firstOutput;
        }

    } catch (error) {
        console.error('Failed to access MIDI devices:', error);
    }

    // Function to handle incoming MIDI messages
    function handleMIDIMessage(message) {
        const [command, note, velocity] = message.data;
        const button = document.querySelector(`.launchpad-button[data-note="${note}"]`);
        if (button) {
            if (command === 144 && velocity > 0) {
                // Note on
                const color = getVelocityColor(velocity);
                button.style.backgroundColor = rgbToCssColor(color);
            } else if ((command === 128) || (command === 144 && velocity === 0)) {
                // Note off
                button.style.backgroundColor = 'rgb(51, 51, 51)'; // Reset to default color
            }
        }
    }

    // Function to create a button element
    const createButton = (note) => {
        const button = document.createElement('div');
        button.className = 'launchpad-button';
        button.dataset.note = note;
        button.textContent = note; // Display the note number for reference

        // Set background color to default
        button.style.backgroundColor = 'rgb(51, 51, 51)';

        return button;
    };

    // Function to get color based on velocity
    const getVelocityColor = (velocity) => {
        const color = velocityColors.find(v => v.velocity === velocity);
        return color ? color.color : [51, 51, 51]; // Default to white if no match found
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
    appendButtons(sideButtonsBottomContainer, sideButtons.slice(28, 36));

    const sideButtonsRightContainer = document.createElement('div');
    sideButtonsRightContainer.className = 'side-buttons-right';
    appendButtons(sideButtonsRightContainer, sideButtons.slice(18, 28));

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
                        const velocity = Math.round(note.velocity * 127); // Convert MIDI velocity to 0-127 range
                        const color = getVelocityColor(velocity);
                        button.style.backgroundColor = rgbToCssColor(color);
                    }
                    sendMIDINoteOn(note.midi, note.velocity);
                    console.log(`Note on: ${note.midi} at ${note.time}s`);
                }, noteOnTime - startTime);

                setTimeout(() => {
                    const button = document.querySelector(`.launchpad-button[data-note="${note.midi}"]`);
                    if (button) {
                        button.style.backgroundColor = 'rgb(51, 51, 51)'; // Reset to default color
                    }
                    sendMIDINoteOff(note.midi);
                    console.log(`Note off: ${note.midi} at ${note.time + note.duration}s`);
                }, noteOffTime - startTime);
            });
        });
    }

    // Function to send MIDI Note On message to the Launchpad
    function sendMIDINoteOn(note, velocity) {
        if (midiOutput) {
            const midiVelocity = Math.round(velocity * 127); // Convert velocity to 0-127 range
            midiOutput.send([0x90, note, midiVelocity]); // 0x90 is the Note On message
        }
    }

    // Function to send MIDI Note Off message to the Launchpad
    function sendMIDINoteOff(note) {
        if (midiOutput) {
            midiOutput.send([0x80, note, 0x00]); // 0x80 is the Note Off message
        }
    }

    // Utility function to convert RGB array to CSS color format
    function rgbToCssColor(rgbArray) {
        return `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`;
    }
});
