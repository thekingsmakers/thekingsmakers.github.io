// ===== AZURE STATUS MONITORING =====

// Global variables
let autoRefreshInterval = null;
let isAutoRefreshEnabled = false;
let lastUpdateTime = null;

// Azure services data (simulated for demo - in production, this would come from Azure Status API)
const azureServices = [
    {
        id: 'azure-active-directory',
        name: 'Azure Active Directory',
        category: 'Identity & Access Management',
        status: 'online',
        region: 'Global',
        description: 'Cloud-based identity and access management service',
        lastIncident: null,
        uptime: '99.99%'
    },
    {
        id: 'azure-compute',
        name: 'Azure Virtual Machines',
        category: 'Compute',
        status: 'online',
        region: 'Global',
        description: 'Cloud computing service for virtual machines',
        lastIncident: null,
        uptime: '99.95%'
    },
    {
        id: 'azure-storage',
        name: 'Azure Storage',
        category: 'Storage',
        status: 'online',
        region: 'Global',
        description: 'Cloud storage solution for data objects',
        lastIncident: null,
        uptime: '99.99%'
    },
    {
        id: 'azure-sql',
        name: 'Azure SQL Database',
        category: 'Databases',
        status: 'online',
        region: 'Global',
        description: 'Managed cloud database service',
        lastIncident: null,
        uptime: '99.99%'
    },
    {
        id: 'azure-network',
        name: 'Azure Virtual Network',
        category: 'Networking',
        status: 'online',
        region: 'Global',
        description: 'Network isolation and segmentation',
        lastIncident: null,
        uptime: '99.99%'
    },
    {
        id: 'azure-key-vault',
        name: 'Azure Key Vault',
        category: 'Security',
        status: 'online',
        region: 'Global',
        description: 'Cloud service for storing cryptographic keys',
        lastIncident: null,
        uptime: '99.99%'
    },
    {
        id: 'azure-app-service',
        name: 'Azure App Service',
        category: 'Web & Mobile',
        status: 'online',
        region: 'Global',
        description: 'Platform for building web and mobile apps',
        lastIncident: null,
        uptime: '99.95%'
    },
    {
        id: 'azure-functions',
        name: 'Azure Functions',
        category: 'Compute',
        status: 'online',
        region: 'Global',
        description: 'Serverless compute service',
        lastIncident: null,
        uptime: '99.95%'
    },
    {
        id: 'azure-cosmos-db',
        name: 'Azure Cosmos DB',
        category: 'Databases',
        status: 'online',
        region: 'Global',
        description: 'Globally distributed database service',
        lastIncident: null,
        uptime: '99.99%'
    },
    {
        id: 'azure-ai',
        name: 'Azure AI Services',
        category: 'AI & Machine Learning',
        status: 'online',
        region: 'Global',
        description: 'Artificial intelligence and machine learning services',
        lastIncident: null,
        uptime: '99.9%'
    },
    {
        id: 'azure-devops',
        name: 'Azure DevOps',
        category: 'Developer Tools',
        status: 'online',
        region: 'Global',
        description: 'DevOps platform for software development',
        lastIncident: null,
        uptime: '99.9%'
    },
    {
        id: 'azure-monitor',
        name: 'Azure Monitor',
        category: 'Management & Governance',
        status: 'online',
        region: 'Global',
        description: 'Full-stack monitoring service',
        lastIncident: null,
        uptime: '99.99%'
    }
];

// DOM elements
const servicesGrid = document.getElementById('servicesGrid');
const totalServices = document.getElementById('totalServices');
const onlineServices = document.getElementById('onlineServices');
const offlineServices = document.getElementById('offlineServices');
const lastUpdated = document.getElementById('lastUpdated');
const refreshStatusBtn = document.getElementById('refreshStatus');
const autoRefreshBtn = document.getElementById('autoRefresh');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeAzureStatus();
    setupEventListeners();
    loadServices();
    updateStats();
    updateLastUpdated();
});

// Initialize Azure status page
function initializeAzureStatus() {
    // Set page title
    document.title = 'Azure Services Status - Omar Osman Mahat';
    
    // Ensure Azure AD is online initially
    const azureAD = azureServices.find(s => s.id === 'azure-active-directory');
    if (azureAD) {
        azureAD.status = 'online';
        azureAD.lastIncident = null;
    }
    
    // Check if we should simulate some services as offline for demo purposes
    simulateServiceIssues();
}

// Setup event listeners
function setupEventListeners() {
    // Refresh status button
    refreshStatusBtn.addEventListener('click', function() {
        refreshStatus();
    });
    
    // Auto refresh toggle
    autoRefreshBtn.addEventListener('click', function() {
        toggleAutoRefresh();
    });
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterServices(filter);
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Load services into the grid
function loadServices() {
    servicesGrid.innerHTML = '';
    
    azureServices.forEach(service => {
        const serviceCard = createServiceCard(service);
        servicesGrid.appendChild(serviceCard);
    });
}

// Create service card element
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = `service-card ${service.status}`;
    card.setAttribute('data-status', service.status);
    card.setAttribute('data-category', service.category);
    
    const statusIcon = getStatusIcon(service.status);
    const statusClass = getStatusClass(service.status);
    
    card.innerHTML = `
        <div class="service-header">
            <div class="service-icon">
                <i class="fas fa-cloud"></i>
            </div>
            <div class="service-status ${statusClass}">
                ${statusIcon}
                <span>${service.status.toUpperCase()}</span>
            </div>
        </div>
        <div class="service-content">
            <h3 class="service-name">${service.name}</h3>
            <p class="service-description">${service.description}</p>
            <div class="service-details">
                <div class="service-category">
                    <i class="fas fa-tag"></i>
                    <span>${service.category}</span>
                </div>
                <div class="service-region">
                    <i class="fas fa-globe"></i>
                    <span>${service.region}</span>
                </div>
                <div class="service-uptime">
                    <i class="fas fa-chart-line"></i>
                    <span>${service.uptime}</span>
                </div>
            </div>
        </div>
        ${service.lastIncident ? `
        <div class="service-incident">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${service.lastIncident}</span>
        </div>
        ` : ''}
    `;
    
    return card;
}

// Get status icon
function getStatusIcon(status) {
    switch(status) {
        case 'online':
            return '<i class="fas fa-check-circle"></i>';
        case 'offline':
            return '<i class="fas fa-times-circle"></i>';
        case 'degraded':
            return '<i class="fas fa-exclamation-triangle"></i>';
        case 'maintenance':
            return '<i class="fas fa-tools"></i>';
        default:
            return '<i class="fas fa-question-circle"></i>';
    }
}

// Get status class
function getStatusClass(status) {
    switch(status) {
        case 'online':
            return 'status-online';
        case 'offline':
            return 'status-offline';
        case 'degraded':
            return 'status-degraded';
        case 'maintenance':
            return 'status-maintenance';
        default:
            return 'status-unknown';
    }
}

// Filter services by status
function filterServices(filter) {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-status') === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Update statistics
function updateStats() {
    const total = azureServices.length;
    const online = azureServices.filter(s => s.status === 'online').length;
    const offline = azureServices.filter(s => s.status !== 'online').length;
    
    // Animate numbers
    animateNumber(totalServices, total);
    animateNumber(onlineServices, online);
    animateNumber(offlineServices, offline);
}

// Animate number counting
function animateNumber(element, target) {
    const start = 0;
    const increment = target / 50;
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 20);
}

// Update last updated time
function updateLastUpdated() {
    const now = new Date();
    lastUpdateTime = now;
    lastUpdated.textContent = now.toLocaleString();
}

// Refresh status (simulate API call)
function refreshStatus() {
    // Show loading state
    refreshStatusBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    refreshStatusBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Simulate some random status changes for demo
        simulateServiceIssues();
        
        // Reload services
        loadServices();
        updateStats();
        updateLastUpdated();
        
        // Reset button
        refreshStatusBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Status';
        refreshStatusBtn.disabled = false;
        
        // Show success message
        showNotification('Status refreshed successfully!', 'success');
    }, 1500);
}

// Toggle auto refresh
function toggleAutoRefresh() {
    if (isAutoRefreshEnabled) {
        // Disable auto refresh
        clearInterval(autoRefreshInterval);
        isAutoRefreshEnabled = false;
        autoRefreshBtn.innerHTML = '<i class="fas fa-clock"></i> Auto Refresh: OFF';
        autoRefreshBtn.classList.remove('active');
        showNotification('Auto refresh disabled', 'info');
    } else {
        // Enable auto refresh
        isAutoRefreshEnabled = true;
        autoRefreshBtn.innerHTML = '<i class="fas fa-clock"></i> Auto Refresh: ON';
        autoRefreshBtn.classList.add('active');
        
        // Refresh every 5 minutes
        autoRefreshInterval = setInterval(() => {
            refreshStatus();
        }, 5 * 60 * 1000);
        
        showNotification('Auto refresh enabled - updates every 5 minutes', 'success');
    }
}

// Simulate service issues for demo purposes
function simulateServiceIssues() {
    // Ensure Azure AD is always online (it's a critical service)
    const azureAD = azureServices.find(s => s.id === 'azure-active-directory');
    if (azureAD) {
        azureAD.status = 'online';
        azureAD.lastIncident = null;
    }
    
    // Randomly set some other services as offline or degraded (but not Azure AD)
    const otherServices = azureServices.filter(s => s.id !== 'azure-active-directory');
    const randomServices = otherServices.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    randomServices.forEach(service => {
        const random = Math.random();
        if (random < 0.1) {
            service.status = 'offline';
            service.lastIncident = 'Service unavailable - investigating';
        } else if (random < 0.2) {
            service.status = 'degraded';
            service.lastIncident = 'Performance degradation detected';
        } else {
            service.status = 'online';
            service.lastIncident = null;
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

// Hide notification
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Check real Azure status (placeholder for production)
async function checkRealAzureStatus() {
    try {
        // In production, this would call Azure Status API
        // const response = await fetch('https://status.azure.com/api/status');
        // const data = await response.json();
        // return data;
        
        // For demo, return simulated data
        return azureServices;
    } catch (error) {
        console.error('Error checking Azure status:', error);
        showNotification('Error checking Azure status', 'error');
        return azureServices;
    }
}

// Export functions for potential external use
window.AzureStatus = {
    refreshStatus,
    toggleAutoRefresh,
    filterServices,
    checkRealAzureStatus
};
