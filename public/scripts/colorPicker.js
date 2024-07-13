// colorPicker.js

document.addEventListener('DOMContentLoaded', () => {
    const pickr = Pickr.create({
        el: '#color-picker',
        theme: 'nano',
        swatches: null,
        components: {
            preview: true,
            opacity: false,
            hue: true,
            interaction: {
                hex: false,
                rgba: false,
                hsva: false,
                input: true,
                clear: false,
                save: true
            }
        }
    });

    pickr.on('save', (color) => {
        const selectedColorDiv = document.getElementById('selected-color');
        const newVelocity = getClosestVelocityFromColor(color.toHEXA().toString());
        selectedColorDiv.textContent = `New V: ${newVelocity}`;
        selectedColorDiv.style.backgroundColor = color.toHEXA().toString();
        pickr.hide();
    });
});

function getClosestVelocityFromColor(colorHex) {
    // Implement this function to find the closest matching velocity from the color
    // You can use a similar approach to the previous color matching function
    // Return the velocity value
}
