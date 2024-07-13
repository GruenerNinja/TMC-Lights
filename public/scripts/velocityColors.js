// velocityColors.js

let velocityColors = [];

fetch('scripts/velocityColors.json')
    .then(response => response.json())
    .then(data => {
        velocityColors = data;
        window.velocityColors = velocityColors;
    })
    .catch(error => console.error('Error loading velocity colors:', error));
