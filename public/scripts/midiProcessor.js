// midiProcessor.js

document.addEventListener('DOMContentLoaded', () => {
    let midiAccess;
    let selectedMidiOutput;
    let midiOutputs = [];
    let midiData;

    document.getElementById('midi-file-input').addEventListener('change', handleFileSelect);
    document.getElementById('replace-velocity-button').addEventListener('click', replaceVelocities);
    document.getElementById('preview-velocity-button').addEventListener('click', showPreviewModal);
    document.getElementById('preview-play-button').addEventListener('click', playMidiPreview);
    document.getElementById('download-velocity-button').addEventListener('click', downloadMidiFile);

    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

    function onMIDISuccess(midiAccessObject) {
        midiAccess = midiAccessObject;
        populateMIDIDevices();
    }

    function onMIDIFailure() {
        console.error('Could not access your MIDI devices.');
    }

    function populateMIDIDevices() {
        const midiDeviceSelect = document.getElementById('midi-device-select');
        midiOutputs = Array.from(midiAccess.outputs.values());

        midiOutputs.forEach(output => {
            const option = document.createElement('option');
            option.value = output.id;
            option.text = output.name;
            midiDeviceSelect.add(option);
        });

        midiDeviceSelect.addEventListener('change', handleMidiDeviceChange);
    }

    function handleMidiDeviceChange(event) {
        const selectedDeviceId = event.target.value;
        selectedMidiOutput = midiOutputs.find(output => output.id === selectedDeviceId);
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const arrayBuffer = e.target.result;
                midiData = new Midi(arrayBuffer);
                const velocities = getUniqueVelocities(midiData);
                displayVelocities(velocities);
            };
            reader.readAsArrayBuffer(file);
        }
    }

    function getUniqueVelocities(midiData) {
        const velocities = new Set();
        midiData.tracks.forEach(track => {
            track.notes.forEach(note => {
                velocities.add(note.velocity * 127);
            });
        });
        return Array.from(velocities).sort((a, b) => a - b);
    }

    function displayVelocities(velocities) {
        const list = document.getElementById('velocity-list');
        list.innerHTML = '';
        velocities.forEach(velocity => {
            const item = document.createElement('div');
            item.className = 'velocity-item';

            // Original color display
            const colorDiv = document.createElement('div');
            colorDiv.className = 'color-div';
            const color = velocityColors.find(v => v.velocity === velocity).color;
            colorDiv.style.backgroundColor = rgbToCssColor(color);
            colorDiv.textContent = `V: ${velocity}`;
            item.appendChild(colorDiv);

            // Velocity input field
            const input = document.createElement('input');
            input.type = 'number';
            input.value = velocity;
            input.className = 'velocity-input';
            input.dataset.originalVelocity = velocity;
            input.addEventListener('input', handleVelocityInputChange);
            item.appendChild(input);

            // New color display
            const newColorDiv = document.createElement('div');
            newColorDiv.className = 'new-color';
            newColorDiv.style.backgroundColor = rgbToCssColor(color); // Initialize with original color
            newColorDiv.textContent = `New V: ${velocity}`; // Initialize with original velocity
            item.appendChild(newColorDiv);

            list.appendChild(item);
        });
    }

    function handleVelocityInputChange(event) {
        const input = event.target;
        const newVelocity = parseInt(input.value, 10);
        const newColorDiv = input.nextSibling;

        // Update new color and text
        const newColor = velocityColors.find(v => v.velocity === newVelocity).color;
        newColorDiv.style.backgroundColor = rgbToCssColor(newColor);
        newColorDiv.textContent = `New V: ${newVelocity}`;
    }

    function rgbToCssColor(rgbArray) {
        return `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`;
    }

    function replaceVelocities() {
        const inputs = document.querySelectorAll('#velocity-list input');
        inputs.forEach(input => {
            const newVelocity = parseInt(input.value, 10);
            if (!isNaN(newVelocity)) {
                const originalVelocity = parseInt(input.dataset.originalVelocity, 10);

                // Update the original color display
                const colorDiv = input.previousSibling;
                const newColor = velocityColors.find(v => v.velocity === newVelocity).color;
                colorDiv.style.backgroundColor = rgbToCssColor(newColor);
                colorDiv.textContent = `V: ${newVelocity}`;

                // Update the new color display
                const newColorDiv = input.nextSibling;
                newColorDiv.style.backgroundColor = rgbToCssColor(newColor);
                newColorDiv.textContent = `New V: ${newVelocity}`;

                // Update MIDI data
                updateMidiVelocity(originalVelocity / 127, newVelocity / 127);
            }
        });
    }

    function updateMidiVelocity(originalVelocity, newVelocity) {
        midiData.tracks.forEach(track => {
            track.notes.forEach(note => {
                if (note.velocity === originalVelocity) {
                    note.velocity = newVelocity;
                }
            });
        });
    }

    function showPreviewModal() {
        const modal = document.getElementById('midi-preview-modal');
        modal.style.display = 'block';
    }

    function playMidiPreview() {
        if (!selectedMidiOutput) {
            alert('Please select a MIDI device.');
            return;
        }

        console.log('Playing MIDI on device:', selectedMidiOutput.name);
        midiData.tracks.forEach(track => {
            track.notes.forEach(note => {
                selectedMidiOutput.send([0x90, note.midi, note.velocity * 127]);
                setTimeout(() => {
                    selectedMidiOutput.send([0x80, note.midi, 0]);
                }, note.duration * 1000);
            });
        });
    }

    function downloadMidiFile() {
        const midiFileData = midiData.toArray();
        const blob = new Blob([midiFileData], { type: 'audio/midi' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modified-midi-file.mid';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Modal close functionality
    const modal = document.getElementById('midi-preview-modal');
    const span = modal.getElementsByClassName('close')[0];
    span.onclick = function() {
        modal.style.display = 'none';
    }
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
});
