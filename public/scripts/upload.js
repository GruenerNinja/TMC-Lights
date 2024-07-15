document.getElementById('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('midi-file');
    const nameInput = document.getElementById('midi-name');

    const formData = new FormData();
    formData.append('midi', fileInput.files[0]);
    formData.append('name', nameInput.value);

    try {
        const response = await fetch('http://localhost:3000/api/midi/upload', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        console.log(result);
        alert('MIDI clip uploaded successfully');
    } catch (error) {
        console.error('Error uploading MIDI clip:', error);
        alert('Error uploading MIDI clip');
    }
});
