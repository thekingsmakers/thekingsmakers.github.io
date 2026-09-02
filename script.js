// ===== GLOBAL VARIABLES =====
let isScrolled = false;

// ===== DOM ELEMENTS =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const backToTop = document.getElementById('backToTop');
const loadingScreen = document.getElementById('loadingScreen');
const loadingPercentage = document.getElementById('loadingPercentage');
const loadingProgressBar = document.getElementById('loadingProgressBar');
const loadingStatus = document.getElementById('loadingStatus');
const projectsGrid = document.getElementById('projectsGrid');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    if (loadingScreen && loadingPercentage && loadingProgressBar && loadingStatus) {
        document.body.classList.add('loading');
    }

    initializeApp();
    setupEventListeners();
    initializeAssistant();
    
    // Load projects with a fallback
    if (projectsGrid) {
        setTimeout(() => {
            loadProjects();
        }, 100);
    }
    
    animateNumbers();
});

// ===== APP INITIALIZATION =====
function initializeApp() {
    if (loadingScreen && loadingPercentage && loadingProgressBar && loadingStatus) {
        startLoadingSequence();
    }
    
    // Initialize scroll animations
    initializeScrollAnimations();
}

// ===== LOADING SEQUENCE =====
function startLoadingSequence() {
    let progress = 0;
    const loadingSteps = [
        { status: 'Initializing...', progress: 20 },
        { status: 'Loading assets...', progress: 40 },
        { status: 'Preparing layout...', progress: 60 },
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
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Back to top
    if (backToTop) {
        backToTop.addEventListener('click', scrollToTop);
    }
    
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
                if (navMenu && navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
    });
});

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== MOBILE NAVIGATION =====
function toggleMobileMenu() {
    if (!navMenu || !navToggle) {
        return;
    }

    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(navMenu.classList.contains('active')));
}

// ===== SCROLL HANDLING =====
function handleScroll() {
    const scrollTop = window.pageYOffset;
    
    // Navbar background
    if (scrollTop > 50 && !isScrolled) {
        if (navbar) navbar.classList.add('scrolled');
        isScrolled = true;
    } else if (scrollTop <= 50 && isScrolled) {
        if (navbar) navbar.classList.remove('scrolled');
        isScrolled = false;
    }
    
    // Back to top button
    if (scrollTop > 300) {
        if (backToTop) backToTop.classList.add('visible');
    } else {
        if (backToTop) backToTop.classList.remove('visible');
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
    if (!projectsGrid) {
        return;
    }

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
        if (navMenu && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

document.addEventListener('keydown', handleKeyboardNavigation);

// ===== BUILT-IN SITE ASSISTANT =====
function normalizeSearchText(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9+#. ]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getSearchTerms(question) {
    const ignoredTerms = new Set(['a', 'about', 'all', 'an', 'and', 'any', 'are', 'can', 'do', 'for', 'from', 'how', 'i', 'in', 'is', 'it', 'me', 'of', 'on', 'or', 'site', 'tell', 'the', 'this', 'to', 'what', 'which', 'who', 'with', 'you']);
    return normalizeSearchText(question)
        .split(' ')
        .filter(term => term.length > 1 && !ignoredTerms.has(term));
}

function createSearchEntry(title, text, url, keywords = '') {
    return { title, text: text.replace(/\s+/g, ' ').trim(), url, keywords };
}

function getPageSearchEntries() {
    const sections = [
        { id: 'home', title: 'Home', keywords: 'omar osman intune administrator sccm devices automation' },
        { id: 'about', title: 'About Omar', keywords: 'experience intune sccm mdt powershell automation enterprise' },
        { id: 'projects', title: 'Featured Projects', keywords: 'projects tools scripts github powershell intune' },
        { id: 'skills', title: 'Technical Skills', keywords: 'skills microsoft intune sccm mdt bitlocker active directory powershell python javascript git azure cloud sql' },
        { id: 'contact', title: 'Contact', keywords: 'contact email phone qatar github twitter' }
    ];

    return sections.map(section => {
        const element = document.getElementById(section.id);
        return createSearchEntry(section.title, element ? element.textContent : section.keywords, `#${section.id}`, section.keywords);
    });
}

async function getAdditionalPageEntries() {
    const pages = [
        { url: './azure-status.html', title: 'Azure Services Status', keywords: 'azure status services monitoring online offline degraded refresh' },
        { url: './lab-login.html', title: 'Lab Portal Access', keywords: 'lab login authorized security portal guacamole' }
    ];
    const entries = [];

    for (const page of pages) {
        try {
            const response = await fetch(page.url);
            if (!response.ok) continue;
            const documentContent = new DOMParser().parseFromString(await response.text(), 'text/html');
            entries.push(createSearchEntry(page.title, documentContent.body.textContent, page.url, page.keywords));
        } catch (error) {
            console.error(`Site assistant could not load ${page.url}:`, error);
        }
    }

    return entries;
}

async function getSiteSearchEntries() {
    const entries = getPageSearchEntries();
    const additionalEntries = await getAdditionalPageEntries();
    entries.push(...additionalEntries);

    try {
        const response = await fetch('./projects.json');
        if (!response.ok) {
            return entries;
        }

        const projects = await response.json();
        return entries.concat(projects.map(project => ({
            title: project.title,
            text: `${project.description} ${project.tags.join(' ')} ${project.technologies.join(' ')}`,
            url: project.github,
            keywords: `${project.category} ${project.lastUpdated}`
        })));
    } catch (error) {
        console.error('Site assistant could not load project data:', error);
        return entries;
    }
}

function findSiteResults(question, entries) {
    const terms = getSearchTerms(question);
    if (!terms.length) {
        return [];
    }

    return entries
        .map(entry => {
            const title = normalizeSearchText(entry.title);
            const content = normalizeSearchText(`${entry.text} ${entry.keywords}`);
            const score = terms.reduce((total, term) => {
                if (title.includes(term)) return total + 4;
                if (content.includes(term)) return total + 2;
                return total;
            }, 0);
            return { ...entry, score };
        })
        .filter(entry => entry.score > 0)
        .sort((first, second) => second.score - first.score)
        .slice(0, 3);
}

function createResultSummary(result, terms) {
    const content = result.text.replace(/\s+/g, ' ').trim();
    const normalizedContent = normalizeSearchText(content);
    const matchIndex = terms
        .map(term => normalizedContent.indexOf(term))
        .filter(index => index >= 0)
        .sort((first, second) => first - second)[0] || 0;
    const start = Math.max(0, matchIndex - 80);
    const end = Math.min(content.length, start + 220);
    return `${start ? '...' : ''}${content.slice(start, end).trim()}${end < content.length ? '...' : ''}`;
}

function createAssistantReply(question, entries) {
    const normalizedQuestion = normalizeSearchText(question);
    if (/^(hi|hello|hey)( there)?$/.test(normalizedQuestion)) {
        return 'Hello! I can help you find information about Omar, his skills, projects, services, or contact details.';
    }

    const results = findSiteResults(question, entries);
    if (!results.length) {
        return 'I can only answer questions using this website. Try asking about projects, PowerShell, Intune, Azure, technical skills, or contact details.';
    }

    const terms = getSearchTerms(question);
    const primaryResult = results[0];
    const summary = createResultSummary(primaryResult, terms);
    const otherMatches = results.slice(1).map(result => result.title);
    const related = otherMatches.length ? ` Related information is also available in ${otherMatches.join(' and ')}.` : '';
    return `${summary}${related}`;
}

function addAssistantMessage(messages, text, type, results = []) {
    const message = document.createElement('div');
    message.className = `ai-message ai-message-${type}`;
    const content = document.createElement('p');
    content.textContent = text;
    message.appendChild(content);

    if (results.length) {
        const resultList = document.createElement('div');
        resultList.className = 'ai-search-results';
        results.forEach(result => {
            const link = document.createElement('a');
            link.href = result.url;
            link.textContent = result.title;
            link.className = 'ai-search-result';
            if (/^https?:\/\//.test(result.url)) {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
            resultList.appendChild(link);
        });
        message.appendChild(resultList);
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function initializeAssistant() {
    const assistant = document.createElement('section');
    assistant.className = 'ai-assistant';
    assistant.innerHTML = `
        <button class="ai-assistant-toggle" type="button" aria-label="Open AI assistant" aria-expanded="false">
            <i class="fas fa-sparkles" aria-hidden="true"></i><span class="ai-assistant-prompt">Thekingsmaker Assistant</span>
        </button>
        <div class="ai-assistant-panel" hidden>
            <div class="ai-assistant-header">
                <div><i class="fas fa-robot"></i><strong>Thekingsmaker Assistant</strong></div>
                <button class="ai-assistant-close" type="button" aria-label="Close AI assistant"><i class="fas fa-times"></i></button>
            </div>
            <p class="ai-assistant-intro">Search the site for projects, services, skills, contact details, Azure status, and lab access.</p>
            <div class="ai-assistant-messages" aria-live="polite">
                <div class="ai-message ai-message-bot"><p>Hello! I can help you find information across Thekingsmaker website.</p></div>
            </div>
            <form class="ai-assistant-form">
                <label class="sr-only" for="ai-assistant-input">Your question</label>
                <input id="ai-assistant-input" type="text" placeholder="Ask a question..." autocomplete="off" required>
                <button type="submit" aria-label="Send question"><i class="fas fa-paper-plane"></i></button>
            </form>
        </div>
    `;

    document.body.appendChild(assistant);

    const toggle = assistant.querySelector('.ai-assistant-toggle');
    const panel = assistant.querySelector('.ai-assistant-panel');
    const close = assistant.querySelector('.ai-assistant-close');
    const form = assistant.querySelector('.ai-assistant-form');
    const input = assistant.querySelector('#ai-assistant-input');
    const messages = assistant.querySelector('.ai-assistant-messages');
    const prompt = assistant.querySelector('.ai-assistant-prompt');
    const promptMessages = [
        'Thekingsmaker Assistant',
        'Search the site',
        'Search for tools',
        'Find Intune projects',
        'Explore PowerShell tools'
    ];
    let promptIndex = 0;
    let searchEntries = getPageSearchEntries();
    getSiteSearchEntries().then(entries => {
        searchEntries = entries;
    });
    const setOpen = (isOpen) => {
        panel.hidden = !isOpen;
        toggle.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) input.focus();
    };

    toggle.addEventListener('click', () => setOpen(panel.hidden));
    close.addEventListener('click', () => setOpen(false));
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setInterval(() => {
            prompt.classList.add('is-changing');
            setTimeout(() => {
                promptIndex = (promptIndex + 1) % promptMessages.length;
                prompt.textContent = promptMessages[promptIndex];
                prompt.classList.remove('is-changing');
            }, 180);
        }, 3200);
    }
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const question = input.value.trim();
        if (!question) return;

        addAssistantMessage(messages, question, 'user');
        const results = findSiteResults(question, searchEntries);
        addAssistantMessage(messages, createAssistantReply(question, searchEntries), 'bot', results);
        input.value = '';
    });
}

// ===== SERVICE WORKER REGISTRATION (FOR PWA FEATURES) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        const serviceWorkerPath = '/sw.js';
        try {
            const response = await fetch(serviceWorkerPath, { method: 'HEAD', cache: 'no-store' });
            if (!response.ok) {
                console.warn(`Service worker not found (${response.status}). Skipping registration.`);
                return;
            }

            const registration = await navigator.serviceWorker.register(serviceWorkerPath);
            console.log('SW registered: ', registration);
        } catch (registrationError) {
            console.warn('SW registration skipped: ', registrationError);
        }
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
        loadProjects,
        animateNumbers
    };
}
