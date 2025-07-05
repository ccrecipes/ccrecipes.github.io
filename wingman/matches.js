// matches.js - Dedicated script for the matches page

// DOM elements
const matchesContainerEl = document.getElementById('matches-container');
const mapFilterEl = document.getElementById('map-filter');
const teamFilterEl = document.getElementById('team-filter');

// Global variable to store match data
let matchesData = { matches: [] };

// Initialize the page
function initMatchesPage() {
    setupEventListeners();
    loadData();
}

// Set up event listeners
function setupEventListeners() {
    mapFilterEl.addEventListener('change', updateUI);
    teamFilterEl.addEventListener('change', updateUI);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && matchDetailsModal.style.display === 'block') {
            matchDetailsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        matchesData = await response.json();
        updateUI();
    } catch (error) {
        console.error('Error loading data:', error);
        matchesContainerEl.innerHTML = `<div class="error">Failed to load match data. Please try again later.</div>`;
    }
}

// Update the UI with loaded data
function updateUI() {
    // Clear matches container
    matchesContainerEl.innerHTML = '';
    
    // Show message if no matches
    if (!matchesData.matches || matchesData.matches.length === 0) {
        matchesContainerEl.innerHTML = `<div class="no-matches">No matches recorded yet</div>`;
        return;
    }
    
    // Apply filters
    const mapFilter = mapFilterEl.value;
    const teamFilter = teamFilterEl.value;
    
    const filteredMatches = matchesData.matches
        .filter(match => {
            const mapMatch = mapFilter === 'all' || 
                match.map.toLowerCase().includes(mapFilter);
            const teamMatch = teamFilter === 'all' || 
                match.winner === teamFilter;
            return mapMatch && teamMatch;
        })
        .reverse(); // Newest first
    
    filteredMatches.forEach(match => {
        matchesContainerEl.appendChild(createMatchCard(match));
    });
}

// Create a match card element (expanded view for matches page)
function createMatchCard(match) {
    const matchCard = document.createElement('div');
    const mapData = getMapData(match.map);
    const winnerClass = match.winner === 'turkey' ? 'winner-turkey' : 'winner-slovak';
    
    matchCard.className = `match-card large ${winnerClass}`;
    matchCard.dataset.matchId = match.id;

    matchCard.innerHTML = `
        <div class="match-map" style="background-image: url('${mapData.image}')">
            <div class="map-name">${mapData.displayName}</div>
            <div class="match-winner ${winnerClass}">${match.winner === 'turkey' ? 'TÜRKİYE WINS' : 'SLOVAKIA WINS'}</div>
        </div>
        <div class="match-info">
            <div class="match-teams">
                <span class="team-name turkish">TÜRKİYE</span>
                <span class="match-result">${match.score}</span>
                <span class="team-name slovak">SLOVAKIA</span>
            </div>
            <div class="match-date">${formatDate(match.date)}</div>
            <div class="match-details">
                <div class="player-performance">
                    <h4>Top Performers</h4>
                    ${getTopPerformers(match.players.turkey, 'TÜRKİYE')}
                    ${getTopPerformers(match.players.slovakia, 'SLOVAKIA')}
                </div>
                <div class="match-stats">
                    <h4>Match Stats</h4>
                    <div class="player-stat">
                        <span>Total Kills:</span>
                        <span>${getTotalKills(match)}</span>
                    </div>
                    <div class="player-stat">
                        <span>Average K/D:</span>
                        <span>${getAverageKD(match)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return matchCard;
}

// Helper function to get map image and display name
function getMapData(mapName) {
    const baseName = mapName.replace('de_', '').toLowerCase();
    return {
        image: `maps/${baseName}.png`,
        displayName: baseName.charAt(0).toUpperCase() + baseName.slice(1)
    };
}

// Helper functions for match stats
function getTopPerformers(players, teamName) {
    const sorted = [...players].sort((a, b) => b.kills - a.kills);
    return `
        <div class="team-performers">
            <h5>${teamName}</h5>
            <div class="player-stat">
                <span>${sorted[0].name}:</span>
                <span>${sorted[0].kills} K / ${sorted[0].deaths} D</span>
            </div>
            ${sorted[1] ? `
            <div class="player-stat">
                <span>${sorted[1].name}:</span>
                <span>${sorted[1].kills} K / ${sorted[1].deaths} D</span>
            </div>` : ''}
        </div>
    `;
}

function getTotalKills(match) {
    return match.players.turkey.reduce((sum, p) => sum + p.kills, 0) +
           match.players.slovakia.reduce((sum, p) => sum + p.kills, 0);
}

function getAverageKD(match) {
    const turkeyKD = match.players.turkey.reduce((sum, p) => sum + (p.kills / Math.max(p.deaths, 1)), 0) / 2;
    const slovakiaKD = match.players.slovakia.reduce((sum, p) => sum + (p.kills / Math.max(p.deaths, 1)), 0) / 2;
    return ((turkeyKD + slovakiaKD) / 2).toFixed(2);
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize the matches page
initMatchesPage();