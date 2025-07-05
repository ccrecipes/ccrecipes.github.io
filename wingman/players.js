// players.js - Dedicated script for the players statistics page

// DOM elements
const playersContainerEl = document.getElementById('players-container');
const teamFilterEl = document.getElementById('team-filter');
const statFilterEl = document.getElementById('stat-filter');

// Global variable to store match data
let matchesData = { matches: [] };

// Initialize the page
function initPlayersPage() {
    setupEventListeners();
    loadData();
}

// Set up event listeners
function setupEventListeners() {
    teamFilterEl.addEventListener('change', updateUI);
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
        playersContainerEl.innerHTML = `<div class="error">Failed to load player data. Please try again later.</div>`;
    }
}

// Calculate all player statistics
function calculatePlayerStats() {
    const playerStats = {
        turkey: {},
        slovakia: {}
    };

    matchesData.matches.forEach(match => {
        // Process Turkish players
        match.players.turkey.forEach(player => {
            if (!playerStats.turkey[player.name]) {
                playerStats.turkey[player.name] = {
                    name: player.name,
                    kills: 0,
                    deaths: 0,
                    assists: 0,
                    matches: 0,
                    wins: 0
                };
            }

            playerStats.turkey[player.name].kills += player.kills;
            playerStats.turkey[player.name].deaths += player.deaths;
            playerStats.turkey[player.name].assists += player.assists;
            playerStats.turkey[player.name].matches += 1;
            if (match.winner === 'turkey') {
                playerStats.turkey[player.name].wins += 1;
            }
        });

        // Process Slovak players
        match.players.slovakia.forEach(player => {
            if (!playerStats.slovakia[player.name]) {
                playerStats.slovakia[player.name] = {
                    name: player.name,
                    kills: 0,
                    deaths: 0,
                    assists: 0,
                    matches: 0,
                    wins: 0
                };
            }

            playerStats.slovakia[player.name].kills += player.kills;
            playerStats.slovakia[player.name].deaths += player.deaths;
            playerStats.slovakia[player.name].assists += player.assists;
            playerStats.slovakia[player.name].matches += 1;
            if (match.winner === 'slovakia') {
                playerStats.slovakia[player.name].wins += 1;
            }
        });
    });

    return playerStats;
}

// Update the UI with loaded data
function updateUI() {
    const playerStats = calculatePlayerStats();
    const teamFilter = teamFilterEl.value;
    const statFilter = statFilterEl.value;
    
    // Clear players container
    playersContainerEl.innerHTML = '';
    
    // Show message if no matches
    if (matchesData.matches.length === 0) {
        playersContainerEl.innerHTML = `<div class="no-players">No player data available yet</div>`;
        return;
    }
    
    // Get players based on team filter
    let players = [];
    if (teamFilter === 'all') {
        players = [
            ...Object.values(playerStats.turkey),
            ...Object.values(playerStats.slovakia)
        ];
    } else if (teamFilter === 'turkey') {
        players = Object.values(playerStats.turkey);
    } else {
        players = Object.values(playerStats.slovakia);
    }
    
    // Sort players based on stat filter
    players.sort((a, b) => {
        const statA = getPlayerStat(a, statFilter);
        const statB = getPlayerStat(b, statFilter);
        return statB - statA; // Descending order
    });
    
    // Create player cards
    players.forEach(player => {
        playersContainerEl.appendChild(createPlayerCard(player, teamFilter === 'all' ? 
            (playerStats.turkey[player.name] ? 'turkey' : 'slovakia') : 
            teamFilter));
    });
}

// Create a player card element
function createPlayerCard(player, team) {
    const playerCard = document.createElement('div');
    const teamClass = team === 'turkey' ? 'turkish-player' : 'slovak-player';
    const winRate = ((player.wins / player.matches) * 100).toFixed(1);
    const kdRatio = (player.kills / Math.max(player.deaths, 1)).toFixed(2);
    
    playerCard.className = `player-card ${teamClass}`;
    
    playerCard.innerHTML = `
        <div class="player-header">
            <div class="player-name">${player.name}</div>
            <div class="player-team">${team === 'turkey' ? 'TÜRKİYE' : 'SLOVAKIA'}</div>
        </div>
        <div class="player-stats">
            <div class="stat-row">
                <span class="stat-label">Matches:</span>
                <span class="stat-value">${player.matches}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Win Rate:</span>
                <span class="stat-value">${winRate}%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Total Kills:</span>
                <span class="stat-value">${player.kills}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Total Deaths:</span>
                <span class="stat-value">${player.deaths}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">K/D Ratio:</span>
                <span class="stat-value">${kdRatio}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Assists:</span>
                <span class="stat-value">${player.assists}</span>
            </div>
        </div>
    `;
    
    return playerCard;
}

// Helper function to get specific player stat for sorting
function getPlayerStat(player, stat) {
    switch(stat) {
        case 'kills': return player.kills;
        case 'kd': return player.kills / Math.max(player.deaths, 1);
        case 'winrate': return (player.wins / player.matches);
        case 'matches': return player.matches;
        default: return player.kills;
    }
}

// Initialize the players page
initPlayersPage();