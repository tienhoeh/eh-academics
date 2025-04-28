document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.main-nav .nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Optional: Change toggle button icon (e.g., hamburger to X)
            if (navLinks.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'true');
                navToggle.innerHTML = '✕'; // Use a close icon/symbol
            } else {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.innerHTML = '☰'; // Back to hamburger
            }
        });
    }

    // Optional: Close mobile menu when a link is clicked
    const allNavLinks = document.querySelectorAll('.main-nav .nav-links a');
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                 navLinks.classList.remove('active');
                 navToggle.setAttribute('aria-expanded', 'false');
                 navToggle.innerHTML = '☰';
            }
        });
    });


    // --- Optional: Add simple hover effect for dropdown on touch devices (basic) ---
    // CSS hover handles this on desktop. This is a minimal touch fallback.
    const dropdowns = document.querySelectorAll('.main-nav .dropdown > a');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (event) => {
            // Prevent link navigation only if it's meant to open a dropdown
            // Check screen width to only apply this on "mobile" where hover isn't reliable
            if (window.innerWidth <= 768 && event.target.href.endsWith('#')) { // Or check for a specific class/data attribute
                event.preventDefault();
                // Simple toggle (might need improvement for closing others)
                let subMenu = event.target.nextElementSibling;
                if (subMenu && subMenu.classList.contains('dropdown-menu')) {
                   // Basic visibility toggle - CSS handles display in mobile view currently
                   // This part might need more logic depending on exact desired mobile behavior
                }
            }
        });
    });

    // --- Add more JS functionality here as needed (e.g., animations, form validation) ---

});