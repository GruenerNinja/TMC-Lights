document.addEventListener('DOMContentLoaded', () => {
    // Constants for note ranges
    const bottomLeft = [51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36];
    const bottomRight = [83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68];
    const topLeft = [67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52];
    const topRight = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84];
    const sideButtons = [104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119];

    // Create the grid
    const launchpad = document.getElementById('launchpad');
    if (!launchpad) {
        console.error('Launchpad element not found');
        return;
    }
    launchpad.innerHTML = '';

    const grid = [
        ...topLeft.slice(12, 16), ...topRight.slice(12, 16),
        ...topLeft.slice(8, 12), ...topRight.slice(8, 12),
        ...topLeft.slice(4, 8), ...topRight.slice(4, 8),
        ...topLeft.slice(0, 4), ...topRight.slice(0, 4),
        ...bottomLeft.slice(12, 16), ...bottomRight.slice(12, 16),
        ...bottomLeft.slice(8, 12), ...bottomRight.slice(8, 12),
        ...bottomLeft.slice(4, 8), ...bottomRight.slice(4, 8),
        ...bottomLeft.slice(0, 4), ...bottomRight.slice(0, 4),
    ];

    const createButton = (note) => {
        const button = document.createElement('div');
        button.className = 'launchpad-button';
        button.dataset.note = note;
        button.textContent = note; // Display the note number for reference
        return button;
    };

    // Create the 8x8 grid with side buttons
    for (let row = 0; row < 10; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'launchpad-row';

        if (row > 0 && row < 9) {
            const sideButton = createButton(sideButtons[row - 1]);
            sideButton.classList.add('side-button');
            rowDiv.appendChild(sideButton);
        }

        for (let col = 0; col < 8; col++) {
            if (row === 0 || row === 9) {
                const sideButton = createButton(sideButtons[col]);
                sideButton.classList.add('side-button');
                rowDiv.appendChild(sideButton);
            } else {
                const note = grid[(row - 1) * 8 + col];
                rowDiv.appendChild(createButton(note));
            }
        }

        launchpad.appendChild(rowDiv);
    }

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
