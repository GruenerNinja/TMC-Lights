// Function to enable dragging
function enableDragging(element) {
    var isDragging = false;
    var offsetX, offsetY;
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;

    // Function to check if an element is out of bounds
    function isOutOfBounds(x, y, width, height) {
        return x < 0 || y < 0 || x + width > viewportWidth || y + height > viewportHeight;
    }

    // Mouse down event to start dragging
    element.addEventListener('mousedown', function(event) {
        isDragging = true;
        var rect = element.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        element.style.cursor = 'grabbing';
    });

    // Mouse move event to handle dragging
    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            var x = event.clientX - offsetX;
            var y = event.clientY - offsetY;

            // Check if the element is out of bounds
            if (isOutOfBounds(x, y, element.offsetWidth, element.offsetHeight)) {
                // If out of bounds, set position to be at the edge of the viewport
                x = Math.max(0, Math.min(x, viewportWidth - element.offsetWidth));
                y = Math.max(0, Math.min(y, viewportHeight - element.offsetHeight));
            }

            // Update element's position
            element.style.left = x + 'px';
            element.style.top = y + 'px';
        }
    });

    // Mouse up event to stop dragging
    document.addEventListener('mouseup', function() {
        isDragging = false;
        element.style.cursor = 'grab';
    });

    // Window resize event to update viewport dimensions
    window.addEventListener('resize', function() {
        viewportWidth = window.innerWidth;
        viewportHeight = window.innerHeight;
    });
}

// Get the draggable element
var draggableElement = document.getElementById('draggableElement');

// Call the enableDragging function with the draggable element
enableDragging(draggableElement);
