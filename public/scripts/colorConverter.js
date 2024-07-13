function getClosestVelocity(color) {
    let closestVelocity = null;
    let closestDistance = Infinity;

    window.velocityColors.forEach(item => {
        const [r, g, b] = item.color;
        const distance = Math.sqrt(
            Math.pow(color[0] - r, 2) +
            Math.pow(color[1] - g, 2) +
            Math.pow(color[2] - b, 2)
        );

        if (distance < closestDistance) {
            closestDistance = distance;
            closestVelocity = item.velocity;
        }
    });

    return closestVelocity;
}

function rgbToCssColor([r, g, b]) {
    return `rgb(${r}, ${g}, ${b})`;
}
