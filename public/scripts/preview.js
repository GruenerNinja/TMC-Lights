async function loadMidiClips() {
    try {
        const response = await fetch('/api/midi/list');
        const midiClips = await response.json();
        const midiListDiv = document.getElementById('midi-list');
        midiListDiv.innerHTML = '';
        midiClips.forEach(clip => {
            const clipDiv = document.createElement('div');
            clipDiv.textContent = `${clip.name} (Uploaded at: ${new Date(clip.uploadedAt).toLocaleString()})`;
            clipDiv.dataset.id = clip._id;
            clipDiv.addEventListener('click', async () => {
                const clipId = clipDiv.dataset.id;
                const clipResponse = await fetch(`/api/midi/${clipId}`);
                const clipData = await clipResponse.json();
                previewMidiClip(clipData);
            });
            midiListDiv.appendChild(clipDiv);
        });
    } catch (error) {
        console.error('Error loading MIDI clips:', error);
    }
}

function previewMidiClip(clipData) {
    const midiArrayBuffer = clipData.data.data;
    const midi = new Midi(midiArrayBuffer);
    console.log('Previewing MIDI clip:', clipData.name, midi);
    // Your existing logic to preview the MIDI clip on the virtual Launchpad
    playMidiClip(midi);
}

function playMidiClip(midi) {
    const launchpadButtons = document.querySelectorAll('.launchpad-button');
    launchpadButtons.forEach(button => button.classList.remove('active'));

    // Set start time for the playback
    const startTime = window.performance.now();

    midi.tracks.forEach(track => {
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

// Initial load
loadMidiClips();
