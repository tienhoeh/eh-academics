document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.main-nav .nav-links');
    const hamburgerIcon = '<i class="fas fa-bars"></i>'; // Hamburger icon
    const closeIcon = '<i class="fas fa-times"></i>'; // Close icon

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isActive);
            // Change toggle button icon
            navToggle.innerHTML = isActive ? closeIcon : hamburgerIcon;
        });
    }

    // --- Close mobile menu when a link is clicked ---
    const allNavLinks = document.querySelectorAll('.main-nav .nav-links a');
    allNavLinks.forEach(link => {
        // Exclude dropdown triggers if you add them later
        if (!link.parentElement.classList.contains('dropdown')) {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                     navLinks.classList.remove('active');
                     navToggle.setAttribute('aria-expanded', 'false');
                     navToggle.innerHTML = hamburgerIcon; // Back to hamburger
                }
            });
        }
    });

    // --- Optional: Close mobile menu when clicking outside ---
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navToggle.contains(event.target) || navLinks.contains(event.target);
        if (!isClickInsideNav && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.innerHTML = hamburgerIcon;
        }
    });

});
