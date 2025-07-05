// maps.js - Dedicated script for the maps statistics page

// DOM elements
const mapsContainerEl = document.getElementById('maps-container');
const statFilterEl = document.getElementById('stat-filter');

// Global variable to store match data
let matchesData = { matches: [] };

// Initialize the page
function initMapsPage() {
    setupEventListeners();
    loadData();
}

// Set up event listeners
function setupEventListeners() {
    statFilterEl.addEventListener('change', updateUI);
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
        mapsContainerEl.innerHTML = `<div class="error">Failed to load map data. Please try again later.</div>`;
    }
}

// Calculate all map statistics
function calculateMapStats() {
    const mapStats = {};

    matchesData.matches.forEach(match => {
        const mapName = match.map.replace('de_', '').toLowerCase();
        
        if (!mapStats[mapName]) {
            mapStats[mapName] = {
                name: mapName,
                displayName: mapName.charAt(0).toUpperCase() + mapName.slice(1),
                matches: 0,
                turkeyWins: 0,
                slovakiaWins: 0,
                totalRounds: 0,
                turkeyRounds: 0,
                slovakiaRounds: 0,
                totalKills: 0
            };
        }

        const [turkeyScore, slovakiaScore] = match.score.split('-').map(Number);
        
        mapStats[mapName].matches += 1;
        mapStats[mapName].turkeyRounds += turkeyScore;
        mapStats[mapName].slovakiaRounds += slovakiaScore;
        mapStats[mapName].totalRounds += turkeyScore + slovakiaScore;
        
        if (match.winner === 'turkey') {
            mapStats[mapName].turkeyWins += 1;
        } else {
            mapStats[mapName].slovakiaWins += 1;
        }

        // Calculate total kills
        match.players.turkey.forEach(player => {
            mapStats[mapName].totalKills += player.kills;
        });
        match.players.slovakia.forEach(player => {
            mapStats[mapName].totalKills += player.kills;
        });
    });

    return mapStats;
}

// Update the UI with loaded data
function updateUI() {
    const mapStats = calculateMapStats();
    const statFilter = statFilterEl.value;
    
    // Clear maps container
    mapsContainerEl.innerHTML = '';
    
    // Show message if no matches
    if (matchesData.matches.length === 0) {
        mapsContainerEl.innerHTML = `<div class="no-maps">No map data available yet</div>`;
        return;
    }
    
    // Convert to array and sort
    let mapsArray = Object.values(mapStats);
    
    // Sort based on selected filter
    mapsArray.sort((a, b) => {
        switch(statFilter) {
            case 'matches': return b.matches - a.matches;
            case 'winrate': 
                const aWinRate = a.turkeyWins / a.matches;
                const bWinRate = b.turkeyWins / b.matches;
                return bWinRate - aWinRate;
            case 'rounds': return b.totalRounds - a.totalRounds;
            case 'kills': return b.totalKills - a.totalKills;
            default: return b.matches - a.matches;
        }
    });
    
    // Create map cards
    mapsArray.forEach(map => {
        mapsContainerEl.appendChild(createMapCard(map));
    });
}

// Create a map card element
function createMapCard(map) {
    const mapCard = document.createElement('div');
    const turkeyWinRate = ((map.turkeyWins / map.matches) * 100).toFixed(1);
    const slovakiaWinRate = ((map.slovakiaWins / map.matches) * 100).toFixed(1);
    const avgRounds = (map.totalRounds / map.matches).toFixed(1);
    const avgKills = (map.totalKills / map.matches).toFixed(1);
    
    mapCard.className = 'map-card';
    
    mapCard.innerHTML = `
        <div class="map-header">
            <img src="maps/${map.name}.png" alt="${map.displayName}" class="map-image">
            <div class="map-name">${map.displayName}</div>
        </div>
        <div class="map-stats">
            <div class="stat-row">
                <span class="stat-label">Matches Played:</span>
                <span class="stat-value">${map.matches}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">TÜRKİYE Win Rate:</span>
                <span class="stat-value">${turkeyWinRate}% (${map.turkeyWins}W)</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">SLOVAKIA Win Rate:</span>
                <span class="stat-value">${slovakiaWinRate}% (${map.slovakiaWins}W)</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Total Rounds:</span>
                <span class="stat-value">${map.totalRounds}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Avg. Rounds/Match:</span>
                <span class="stat-value">${avgRounds}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Total Kills:</span>
                <span class="stat-value">${map.totalKills}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Avg. Kills/Match:</span>
                <span class="stat-value">${avgKills}</span>
            </div>
        </div>
    `;
    
    return mapCard;
}

// Initialize the maps page
initMapsPage();