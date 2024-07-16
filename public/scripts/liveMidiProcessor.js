if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(onMIDISuccess, onMIDIFailure);
} else {
    console.log('Web MIDI API not supported');
}

function onMIDISuccess(midiAccess) {
    const inputs = midiAccess.inputs.values();
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = onMIDIMessage;
    }
    document.getElementById('status').innerText = 'MIDI input connected';
}

function onMIDIMessage(event) {
    console.log('MIDI Message:', event.data);
    // Process MIDI messages here
}

function onMIDIFailure(error) {
    console.error('Failed to access MIDI devices:', error);
    document.getElementById('status').innerText = 'Failed to connect MIDI input';
}
