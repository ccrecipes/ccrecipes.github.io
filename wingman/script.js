// DOM elements
const turkeyScoreEl = document.getElementById('turkey-score');
const slovakiaScoreEl = document.getElementById('slovakia-score');
const matchesContainerEl = document.getElementById('matches-container');
const matchDetailsModal = document.getElementById('match-details');
const closeModalBtn = document.querySelector('.close-btn');
const seriesRoundsEl = document.querySelector('.series-rounds');

// Global variable to store match data
let matchesData = { matches: [] }; // Initialize with empty matches array

// Calculate match wins and rounds won
function calculateStats() {
    let turkeyWins = 0;
    let slovakiaWins = 0;
    let turkeyRounds = 0;
    let slovakiaRounds = 0;

    matchesData.matches.forEach(match => {
        const [turkeyScore, slovakiaScore] = match.score.split('-').map(Number);
        turkeyRounds += turkeyScore;
        slovakiaRounds += slovakiaScore;
        
        if (match.winner === 'turkey') {
            turkeyWins++;
        } else if (match.winner === 'slovakia') {
            slovakiaWins++;
        }
    });

    return { turkeyWins, slovakiaWins, turkeyRounds, slovakiaRounds };
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
    const { turkeyWins, slovakiaWins, turkeyRounds, slovakiaRounds } = calculateStats();
    
    // Update all score displays
    turkeyScoreEl.textContent = turkeyWins;
    slovakiaScoreEl.textContent = slovakiaWins;
    
    // Update rounds won display
    seriesRoundsEl.textContent = `${turkeyRounds} - ${slovakiaRounds}`;
    
    // Clear matches container
    matchesContainerEl.innerHTML = '';
    
    // Show message if no matches
    if (!matchesData.matches || matchesData.matches.length === 0) {
        matchesContainerEl.innerHTML = `<div class="no-matches">No matches recorded yet</div>`;
        return;
    }
    
    // Add match cards (show only last 6 matches)
    const recentMatches = matchesData.matches.slice(-6).reverse();
    recentMatches.forEach(match => {
        matchesContainerEl.appendChild(createMatchCard(match));
    });
}

// Create a match card element
function createMatchCard(match) {
    const matchCard = document.createElement('div');
    const mapData = getMapData(match.map);
    const winnerClass = match.winner === 'turkey' ? 'winner-turkey' : 'winner-slovak';
    
    matchCard.className = `match-card ${winnerClass}`;
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
        </div>
    `;

    matchCard.addEventListener('click', () => showMatchDetails(match));
    return matchCard;
}

// Show match details in modal
function showMatchDetails(match) {
    const modal = document.getElementById('match-details');
    const mapData = getMapData(match.map);
    
    document.getElementById('match-details-title').textContent = `MATCH #${match.id}`;
    document.getElementById('match-map-img').src = mapData.image;
    document.getElementById('match-map-name').textContent = mapData.displayName;
    document.getElementById('match-score').textContent = match.score;
    document.getElementById('match-date').textContent = formatDate(match.date, true);
    
    // Turkey players
    const turkeyPlayersEl = document.getElementById('turkey-players');
    turkeyPlayersEl.innerHTML = '';
    match.players.turkey.forEach(player => {
        const kda = calculateKDA(player.kills, player.deaths, player.assists);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="player-col">${player.name}</td>
            <td>${player.kills}</td>
            <td>${player.deaths}</td>
            <td>${player.assists}</td>
            <td>${kda}</td>
        `;
        turkeyPlayersEl.appendChild(row);
    });
    
    // Slovak players
    const slovakPlayersEl = document.getElementById('slovak-players');
    slovakPlayersEl.innerHTML = '';
    match.players.slovakia.forEach(player => {
        const kda = calculateKDA(player.kills, player.deaths, player.assists);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="player-col">${player.name}</td>
            <td>${player.kills}</td>
            <td>${player.deaths}</td>
            <td>${player.assists}</td>
            <td>${kda}</td>
        `;
        slovakPlayersEl.appendChild(row);
    });
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Helper function to get map image and display name
function getMapData(mapName) {
    const baseName = mapName.replace('de_', '').toLowerCase();
    return {
        image: `maps/${baseName}.png`,
        displayName: baseName.charAt(0).toUpperCase() + baseName.slice(1)
    };
}

// Calculate KDA ratio
function calculateKDA(kills, deaths, assists) {
    if (deaths === 0) return kills.toFixed(1);
    return ((kills + assists) / deaths).toFixed(2);
}

// Format date for display
function formatDate(dateString, fullDate = false) {
    const date = new Date(dateString);
    if (fullDate) {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Event listeners
closeModalBtn.addEventListener('click', () => {
    matchDetailsModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === matchDetailsModal) {
        matchDetailsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && matchDetailsModal.style.display === 'block') {
        matchDetailsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});


// Initial load
loadData();