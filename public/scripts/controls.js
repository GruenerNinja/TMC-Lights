document.addEventListener('DOMContentLoaded', function () {
    const optionsButton = document.getElementById('options-button');
    const selectionMenu = document.getElementById('selection-menu');

    optionsButton.addEventListener('click', () => {
        if (selectionMenu.classList.contains('hidden')) {
            selectionMenu.classList.remove('hidden');
            selectionMenu.classList.add('visible');
        } else {
            selectionMenu.classList.remove('visible');
            selectionMenu.classList.add('hidden');
        }
    });
});
