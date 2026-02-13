document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const header = document.querySelector('#header');

    // Create mobile menu overlay
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = `
        <nav>
            <ul>
                <li><a href="#services">Services</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#contact" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">Get Consultation</a></li>
            </ul>
        </nav>
    `;
    document.body.appendChild(mobileNav);

    // Style mobile nav via JS for simplicity or add to CSS
    mobileNav.style.position = 'fixed';
    mobileNav.style.top = '0';
    mobileNav.style.right = '-100%';
    mobileNav.style.width = '70%';
    mobileNav.style.height = '100vh';
    mobileNav.style.background = '#111625'; // Matches secondary bg
    mobileNav.style.zIndex = '999';
    mobileNav.style.padding = '80px 20px';
    mobileNav.style.transition = '0.3s ease-in-out';
    mobileNav.style.boxShadow = '-5px 0 15px rgba(0,0,0,0.5)';

    // Nav Links styling
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.style.display = 'block';
        link.style.fontSize = '1.2rem';
        link.style.marginBottom = '20px';
        link.style.color = '#fff';
        link.addEventListener('click', () => {
            mobileNav.style.right = '-100%';
        });
    });

    mobileBtn.addEventListener('click', () => {
        if (mobileNav.style.right === '0px') {
            mobileNav.style.right = '-100%';
        } else {
            mobileNav.style.right = '0px';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileNav.contains(e.target) && !mobileBtn.contains(e.target) && mobileNav.style.right === '0px') {
            mobileNav.style.right = '-100%';
        }
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const service = formData.get('service');
            const message = formData.get('message');

            const subject = `Service Inquiry: ${service} - ${name}`;
            const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0AService: ${service}%0D%0A%0D%0AMessage:%0D%0A${message}`;

            window.location.href = `mailto:oosman@programmer.net?subject=${encodeURIComponent(subject)}&body=${body}`;
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple fade-in on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.service-card, .contact-card, .about-content');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
