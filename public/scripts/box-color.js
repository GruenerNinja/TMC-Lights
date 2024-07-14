// Function to set the box-shadow based on the background color
function setBoxShadow() {
    const colorBox = document.getElementById('color-box');
    const bgColor = window.getComputedStyle(colorBox).backgroundColor;
    colorBox.style.boxShadow = `0 4px 8px 0 ${bgColor}, 0 6px 20px 0 ${bgColor}`;
}

// Call the function to set the box-shadow
setBoxShadow();
