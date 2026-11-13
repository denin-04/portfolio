
document.addEventListener("DOMContentLoaded", function () {

    // Mobile navigation
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (menuToggle) {
                menuToggle.checked = false;
            }
        });
    });


    // Typing animation
    const typingElement = document.querySelector(".typing-text");

    if (typingElement) {

        const roles = [
            "WEB DEVELOPER",
            "PYTHON DEVELOPER",
            "SOFTWARE DEVELOPER",
            "TECH ENTHUSIAST"
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeEffect() {

            const currentRole = roles[roleIndex];

            if (deleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            typingElement.textContent =
                currentRole.substring(0, charIndex);

            let speed = deleting ? 45 : 90;

            if (!deleting && charIndex === currentRole.length) {
                deleting = true;
                speed = 1400;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                speed = 400;
            }

            setTimeout(typeEffect, speed);
        }

        typeEffect();
    }


    // Automatic footer year
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // Contact form
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) {
                alert("Please fill in all fields.");
                return;
            }

            const subject = encodeURIComponent(
                "Portfolio Contact from " + name
            );

            const body = encodeURIComponent(
                "Name: " + name +
                "\nEmail: " + email +
                "\n\nMessage:\n" + message
            );

            window.location.href =
                "mailto:deninsaji4@gmail.com?subject=" +
                subject + "&body=" + body;
        });
    }

});
