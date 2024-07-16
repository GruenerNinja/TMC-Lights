class Sidebar {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.openButton = document.querySelector('.openSidebarLink');
        this.closeButton = document.querySelector('.closeButtonSidebar');
        this.toggleSidebarButton = document.querySelector('.toggleSidebarButton');
        this.idleTimeout = null;

        this.openButton.addEventListener('click', this.toggleSidebar.bind(this));
        this.closeButton.addEventListener('click', this.toggleSidebar.bind(this));
        this.toggleSidebarButton.addEventListener('click', this.toggleSidebar.bind(this));
    }

    toggleSidebar(event) {
        event.preventDefault();
        this.sidebar.classList.toggle('closed');
    }
}

// Wait for the DOM to load before creating the Sidebar object
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = new Sidebar();
});
