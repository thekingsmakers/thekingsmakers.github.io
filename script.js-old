// ===== GLOBAL VARIABLES =====
let currentTheme = localStorage.getItem('theme') || 'dark';
let isScrolled = false;

// ===== DOM ELEMENTS =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const loadingScreen = document.getElementById('loadingScreen');
const loadingPercentage = document.getElementById('loadingPercentage');
const loadingProgressBar = document.getElementById('loadingProgressBar');
const loadingStatus = document.getElementById('loadingStatus');
const projectsGrid = document.getElementById('projectsGrid');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Add loading class to body to hide site content
    document.body.classList.add('loading');
    
    initializeApp();
    setupEventListeners();
    
    // Load projects with a fallback
    setTimeout(() => {
        loadProjects();
    }, 100);
    
    animateNumbers();
});

// ===== APP INITIALIZATION =====
function initializeApp() {
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    // Start cool loading sequence
    startLoadingSequence();
    
    // Initialize scroll animations
    initializeScrollAnimations();
}

// ===== LOADING SEQUENCE =====
function startLoadingSequence() {
    let progress = 0;
    const loadingSteps = [
        { status: 'Initializing...', progress: 20 },
        { status: 'Loading assets...', progress: 40 },
        { status: 'Setting up theme...', progress: 60 },
        { status: 'Preparing content...', progress: 80 },
        { status: 'Almost ready...', progress: 95 },
        { status: 'Welcome!', progress: 100 }
    ];
    
    let currentStep = 0;
    
    const updateProgress = () => {
        if (currentStep < loadingSteps.length) {
            const step = loadingSteps[currentStep];
            progress = step.progress;
            
            loadingPercentage.textContent = `${progress}%`;
            loadingProgressBar.style.width = `${progress}%`;
            loadingStatus.textContent = step.status;
            
            currentStep++;
            
            if (currentStep < loadingSteps.length) {
                setTimeout(updateProgress, 300);
            } else {
                // Complete loading
                setTimeout(() => {
                    // Remove loading class to show site content
                    document.body.classList.remove('loading');
                    
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 500);
            }
        }
    };
    
    // Start the loading sequence
    setTimeout(updateProgress, 200);
    
    // Fallback: ensure loading class is removed after 10 seconds
    setTimeout(() => {
        if (document.body.classList.contains('loading')) {
            document.body.classList.remove('loading');
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 10000);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Navigation toggle
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Back to top
    backToTop.addEventListener('click', scrollToTop);
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
    });
});

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// ===== MOBILE NAVIGATION =====
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// ===== THEME MANAGEMENT =====
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

// ===== SCROLL HANDLING =====
function handleScroll() {
    const scrollTop = window.pageYOffset;
    
    // Navbar background
    if (scrollTop > 50 && !isScrolled) {
        navbar.classList.add('scrolled');
        isScrolled = true;
    } else if (scrollTop <= 50 && isScrolled) {
        navbar.classList.remove('scrolled');
        isScrolled = false;
    }
    
    // Back to top button
    if (scrollTop > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    // Trigger scroll animations
    triggerScrollAnimations();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.section-title, .section-subtitle, .hero-title, .hero-subtitle, .hero-description, .hero-buttons');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function triggerScrollAnimations() {
    const elements = document.querySelectorAll('.project-card, .skill-category, .contact-item, .feature');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in');
        }
    });
}

// ===== PROJECTS MANAGEMENT =====
async function loadProjects() {
    try {
        // Try to load from projects.json first
        const response = await fetch('./projects.json');
        if (response.ok) {
            const projects = await response.json();
            console.log('Projects loaded from JSON:', projects);
            renderProjects(projects);
        } else {
            console.log('Failed to load projects.json, using default projects');
            renderProjects(getDefaultProjects());
        }
    } catch (error) {
        console.log('Error loading projects.json:', error);
        console.log('Using default projects');
        renderProjects(getDefaultProjects());
    }
}

function getDefaultProjects() {
    return [
        {
            title: "Intune Automation Scripts",
            description: "Comprehensive collection of PowerShell scripts and tools designed to streamline and enhance Microsoft Intune administration tasks. Built from managing over 50k devices.",
            tags: ["PowerShell", "Microsoft Intune", "Automation", "Enterprise Management"],
            image: "fas fa-robot",
            github: "https://github.com/thekingsmakers/Intune",
            demo: null,
            featured: true
        },
        {
            title: "OSDeploy",
            description: "Seamless software installation during MDT/SCCM imaging by dynamically downloading and installing the latest versions from vendors.",
            tags: ["SCCM", "MDT", "Deployment", "Automation"],
            image: "fas fa-download",
            github: "https://github.com/thekingsmakers/OSDeploy",
            demo: null,
            featured: true
        },
        {
            title: "USBBOOT",
            description: "Fully automated solution for setting up Windows environment with essential applications, Office 365, WiFi configuration, and activation.",
            tags: ["Windows", "Automation", "Office 365", "Deployment"],
            image: "fas fa-usb",
            github: "https://github.com/thekingsmakers/USBBOOT",
            demo: null,
            featured: true
        },
        {
            title: "Password Expiration Notification",
            description: "GUI-based PowerShell tool that alerts users when passwords are near expiration. Features customizable notifications and automatic password reset capabilities.",
            tags: ["PowerShell", "GUI", "Security", "Automation"],
            image: "fas fa-key",
            github: "https://github.com/thekingsmakers/Intune",
            demo: null,
            featured: true
        },
        {
            title: "BitLocker Compliance Checker",
            description: "Evaluates device readiness for BitLocker silent encryption. Checks TPM status, secure boot, and other security requirements.",
            tags: ["BitLocker", "Security", "Compliance", "PowerShell"],
            image: "fas fa-shield-alt",
            github: "https://github.com/thekingsmakers/Intune",
            demo: null,
            featured: true
        },
        {
            title: "Wallpaper Deployment",
            description: "Deploys custom wallpapers across enterprise devices using Intune. Supports multiple resolutions and automatic scaling.",
            tags: ["Intune", "Deployment", "PowerShell", "Enterprise"],
            image: "fas fa-image",
            github: "https://github.com/thekingsmakers/Intune",
            demo: null,
            featured: true
        },
        {
            title: "Camera Restriction by Location",
            description: "Enables/disables cameras based on geolocation using PowerShell. Integrates with network detection and security policies.",
            tags: ["PowerShell", "Security", "Geolocation", "Automation"],
            image: "fas fa-map-marker-alt",
            github: "https://github.com/thekingsmakers/Intune",
            demo: null,
            featured: true
        },
        {
            title: "Chrome Extension",
            description: "AI-powered Chrome extension that creates concise summaries of any webpage content to help users quickly understand information.",
            tags: ["Chrome Extension", "AI", "Web", "Productivity"],
            image: "fab fa-chrome",
            github: "https://github.com/thekingsmakers/Extensions",
            demo: null,
            featured: false
        },
        {
            title: "RLM License Manager",
            description: "Flexible license manager that can be integrated with any software to provide robust licensing and activation capabilities.",
            tags: ["License Management", "Software", "Integration", "Security"],
            image: "fas fa-key",
            github: "https://github.com/thekingsmakers/RLM",
            demo: null,
            featured: false
        }
    ];
}

function renderProjects(projects) {
    const featuredProjects = projects.filter(project => project.featured);
    
    projectsGrid.innerHTML = featuredProjects.map(project => `
        <div class="project-card fade-in">
            <div class="project-image">
                <i class="${project.image}"></i>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" class="project-link primary" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-github"></i>
                        View Code
                    </a>
                    ${project.demo ? `
                        <a href="${project.demo}" class="project-link secondary" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i>
                            Live Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// ===== ANIMATIONS =====
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 30);
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== PERFORMANCE OPTIMIZATION =====
const optimizedScrollHandler = throttle(handleScroll, 16); // ~60fps
window.addEventListener('scroll', optimizedScrollHandler);

// ===== ACCESSIBILITY =====
function handleKeyboardNavigation(e) {
    if (e.key === 'Escape') {
        // Close mobile menu
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

document.addEventListener('keydown', handleKeyboardNavigation);

// ===== SERVICE WORKER REGISTRATION (FOR PWA FEATURES) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== ANALYTICS (OPTIONAL) =====
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Track important user interactions
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn, .nav-link, .project-link')) {
        const element = e.target.closest('.btn, .nav-link, .project-link');
        const text = element.textContent.trim();
        trackEvent('engagement', 'click', text);
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to an error tracking service
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        }, 0);
    });
}

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleTheme,
        loadProjects,
        animateNumbers
    };
}
