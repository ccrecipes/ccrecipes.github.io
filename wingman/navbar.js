// navbar.js - Responsive navigation component with hamburger menu

function createNavbar(activeTab = 'overview') {
    const tabs = {
        overview: { name: 'OVERVIEW', url: 'index.html' },
        matches: { name: 'MATCHES', url: 'matches.html' },
        players: { name: 'PLAYERS', url: 'players.html' },
        maps: { name: 'MAPS', url: 'maps.html' }
    };

    return `
        <header class="cs2-header">
            <div class="cs2-nav">
                <div class="cs2-logo">
                    <img src="images/cs2-icon.png" alt="CS2 Icon" class="logo-icon">
                    <span class="logo-text">WINGMAN SERIES</span>
                </div>
                
                <!-- Hamburger Menu Button -->
                <button class="hamburger-btn" aria-label="Toggle menu">
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </button>
                
                <nav class="cs2-tabs">
                    ${Object.entries(tabs).map(([key, tab]) => `
                        <a href="${tab.url}" class="cs2-tab ${key === activeTab ? 'active' : ''}">
                            ${tab.name}
                        </a>
                    `).join('')}
                </nav>
                <div class="cs2-actions">
                </div>
            </div>
        </header>
    `;
}

// Function to initialize navbar
function initNavbar(activeTab) {
    const headerContainer = document.getElementById('navbar-container');
    if (headerContainer) {
        headerContainer.innerHTML = createNavbar(activeTab);
        
        // Hamburger menu functionality
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const navTabs = document.querySelector('.cs2-tabs');
        
        hamburgerBtn.addEventListener('click', () => {
            navTabs.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });
        
        // Close menu when clicking on a link (for single page apps)
        document.querySelectorAll('.cs2-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                navTabs.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            });
        });
        
        // Add refresh button functionality if it exists on this page
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn && typeof loadData === 'function') {
            refreshBtn.addEventListener('click', loadData);
        }
    }
}
