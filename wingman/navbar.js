// navbar.js - Reusable navigation component

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
        
        // Add refresh button functionality if it exists on this page
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn && typeof loadData === 'function') {
            refreshBtn.addEventListener('click', loadData);
        }
    }
}