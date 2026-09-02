// DEDETOTO Interactive Playable Games Logic

const SYMBOLS_SLOT = ['👑', '💎', '7️⃣', '🎰', '🔔', '🍋', '⭐'];
const CARD_SUITS = ['♠️', '♥️', '♦️', '♣️'];
const CARD_RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Main launcher function called when "Enter" button on any game card is clicked
function launchGame(gameId) {
    const gameModal = document.getElementById('game-modal');
    const titleEl = document.getElementById('game-modal-title');
    const iconEl = document.getElementById('game-modal-icon');
    const canvasArea = document.getElementById('game-canvas-area');

    if (!gameModal || !canvasArea) return;

    // Update modal balance display
    updateGameModalBalance();

    gameModal.classList.remove('hidden');

    switch (gameId) {
        case 'golden-reel':
            titleEl.innerText = 'Golden Reel Spin';
            iconEl.innerText = 'casino';
            renderSlotMachine(canvasArea, 'Golden Reel', ['👑', '💎', '🎰', '⭐'], 3);
            break;
        case 'solar-flare':
            titleEl.innerText = 'Solar Flare Spin';
            iconEl.innerText = 'wb_sunny';
            renderSlotMachine(canvasArea, 'Solar Flare', ['☀️', '🔥', '👑', '7️⃣', '⭐'], 5);
            break;
        case 'ocean-pearl':
            titleEl.innerText = "Ocean's Pearl Slots";
            iconEl.innerText = 'water_drop';
            renderSlotMachine(canvasArea, "Ocean's Pearl", ['🦪', '💎', '🧜‍♀️', '⭐'], 3);
            break;
        case 'dede-gacor':
            titleEl.innerText = 'Dede Gacor - Starlight Princess Edition';
            iconEl.innerText = 'auto_awesome';
            renderDedeGacorPrincess(canvasArea);
            break;
        case 'roulette':
            titleEl.innerText = 'Midnight Roulette';
            iconEl.innerText = 'donut_large';
            renderRoulette(canvasArea, 'Midnight');
            break;
        case 'emerald-roulette':
            titleEl.innerText = 'Emerald Empress Roulette';
            iconEl.innerText = 'auto_awesome';
            renderRoulette(canvasArea, 'Emerald Empress');
            break;
        case 'diamond-vault':
            titleEl.innerText = 'Diamond Vault';
            iconEl.innerText = 'lock';
            renderDiamondVault(canvasArea);
            break;
        case 'blackjack':
            titleEl.innerText = 'Titanium Blackjack';
            iconEl.innerText = 'playing_cards';
            renderBlackjack(canvasArea);
            break;
        case 'stardust-poker':
            titleEl.innerText = 'Stardust Poker';
            iconEl.innerText = 'style';
            renderPoker(canvasArea);
            break;
        case 'royal-cards':
            titleEl.innerText = 'Royal Cards';
            iconEl.innerText = 'style';
            renderRoyalCards(canvasArea);
            break;
        case 'baccarat':
            titleEl.innerText = 'Neon Dragon Baccarat';
            iconEl.innerText = 'view_agenda';
            renderBaccarat(canvasArea);
            break;
        default:
            canvasArea.innerHTML = `<p class="text-primary-fixed font-headline-md">Game loading...</p>`;
    }
}

function closeGameModal() {
    const gameModal = document.getElementById('game-modal');
    if (gameModal) gameModal.classList.add('hidden');
}

function updateGameModalBalance() {
    const balEl = document.getElementById('game-modal-balance');
    if (balEl && window.userState) {
        balEl.innerText = window.userState.balance.toLocaleString();
    }
}

// ==========================================
// STARLIGHT PRINCESS / DEDE GACOR 6x5 ENGINE
// ==========================================

const PRINCESS_SYMBOLS = [
    { id: 'crown', name: 'Mahkota Putri', icon: '👑', color: 'text-yellow-300', pay: { 8: 10, 10: 25, 12: 50 } },
    { id: 'heart', name: 'Permata Hati Red', icon: '❤️', color: 'text-red-400', pay: { 8: 2.5, 10: 10, 12: 25 } },
    { id: 'star', name: 'Bintang Emas', icon: '⭐', color: 'text-amber-300', pay: { 8: 2, 10: 5, 12: 15 } },
    { id: 'moon', name: 'Bulan Purnama', icon: '🌙', color: 'text-cyan-300', pay: { 8: 1.5, 10: 2, 12: 12 } },
    { id: 'diamond', name: 'Berlian Hijau', icon: '💎', color: 'text-emerald-400', pay: { 8: 1, 10: 1.5, 12: 10 } },
    { id: 'ruby', name: 'Ruby Merah', icon: '🔻', color: 'text-rose-500', pay: { 8: 0.8, 10: 1.2, 12: 8 } },
    { id: 'sapphire', name: 'Safir Biru', icon: '🔷', color: 'text-blue-400', pay: { 8: 0.5, 10: 1, 12: 5 } },
    { id: 'emerald', name: 'Zamrud Segitiga', icon: '🟢', color: 'text-green-400', pay: { 8: 0.4, 10: 0.9, 12: 4 } },
    { id: 'yellow_gem', name: 'Gem Kuning', icon: '🟡', color: 'text-yellow-400', pay: { 8: 0.25, 10: 0.75, 12: 2 } }
];

const MULTIPLIER_ORBS = [
    { val: 2, icon: '💥', label: '2x', color: 'from-blue-500 to-indigo-600' },
    { val: 3, icon: '💥', label: '3x', color: 'from-blue-500 to-indigo-600' },
    { val: 5, icon: '⚡', label: '5x', color: 'from-green-500 to-teal-600' },
    { val: 10, icon: '⚡', label: '10x', color: 'from-green-500 to-teal-600' },
    { val: 15, icon: '⚡', label: '15x', color: 'from-green-500 to-teal-600' },
    { val: 25, icon: '🔮', label: '25x', color: 'from-purple-500 to-pink-600' },
    { val: 50, icon: '🔮', label: '50x', color: 'from-purple-500 to-pink-600' },
    { val: 100, icon: '👑', label: '100x', color: 'from-amber-400 to-red-600' },
    { val: 250, icon: '👑', label: '250x', color: 'from-amber-400 to-red-600' },
    { val: 500, icon: '🌌', label: '500x', color: 'from-amber-300 via-pink-500 to-purple-700' }
];

const SCATTER_SYMBOL = { id: 'scatter', name: 'Putri Dede Scatter', icon: '👸', color: 'text-pink-300' };

// Game State
window.dedeGacorState = {
    bet: 10000,
    isSpinning: false,
    freeSpinsLeft: 0,
    globalMultiplier: 0,
    totalWinThisRound: 0,
    grid: [], // 6 columns x 5 rows
    anteBetActive: false
};

function getRandomGridSymbol(isFreeSpins = false, anteBet = false) {
    const rand = Math.random();
    // Scatter chance
    const scatterThreshold = anteBet ? 0.05 : 0.035;
    if (rand < scatterThreshold) {
        return { ...SCATTER_SYMBOL, type: 'scatter' };
    }

    // Multiplier Orb chance
    const orbThreshold = isFreeSpins ? 0.12 : (anteBet ? 0.09 : 0.06);
    if (rand < scatterThreshold + orbThreshold) {
        // Weighted orb selection
        const orbRand = Math.random();
        let orb;
        if (orbRand < 0.5) orb = MULTIPLIER_ORBS[Math.floor(Math.random() * 2)]; // 2x, 3x
        else if (orbRand < 0.8) orb = MULTIPLIER_ORBS[2 + Math.floor(Math.random() * 3)]; // 5x, 10x, 15x
        else if (orbRand < 0.95) orb = MULTIPLIER_ORBS[5 + Math.floor(Math.random() * 2)]; // 25x, 50x
        else orb = MULTIPLIER_ORBS[7 + Math.floor(Math.random() * 3)]; // 100x, 250x, 500x

        return { type: 'orb', val: orb.val, icon: orb.icon, label: orb.label, color: orb.color, id: `orb_${orb.val}` };
    }

    // Regular symbols
    const sym = PRINCESS_SYMBOLS[Math.floor(Math.random() * PRINCESS_SYMBOLS.length)];
    return { ...sym, type: 'regular' };
}

function generateFullGrid(isFreeSpins = false, anteBet = false) {
    const grid = [];
    for (let col = 0; col < 6; col++) {
        const column = [];
        for (let row = 0; row < 5; row++) {
            column.push(getRandomGridSymbol(isFreeSpins, anteBet));
        }
        grid.push(column);
    }
    return grid;
}

// Evaluate Pay-Anywhere wins across 6x5 grid
function evaluateGridWins(grid, currentBet) {
    const symbolCounts = {};
    const symbolLocations = {};
    let scatterCount = 0;
    const orbSymbols = [];

    for (let col = 0; col < 6; col++) {
        for (let row = 0; row < 5; row++) {
            const item = grid[col][row];
            if (!item) continue;

            if (item.type === 'scatter') {
                scatterCount++;
            } else if (item.type === 'orb') {
                orbSymbols.push({ col, row, val: item.val, label: item.label, icon: item.icon });
            } else if (item.type === 'regular') {
                if (!symbolCounts[item.id]) {
                    symbolCounts[item.id] = 0;
                    symbolLocations[item.id] = [];
                }
                symbolCounts[item.id]++;
                symbolLocations[item.id].push({ col, row });
            }
        }
    }

    let winPresents = [];
    let baseWinAmount = 0;

    PRINCESS_SYMBOLS.forEach(symDef => {
        const count = symbolCounts[symDef.id] || 0;
        if (count >= 8) {
            let multiplier = symDef.pay[8];
            if (count >= 12) multiplier = symDef.pay[12];
            else if (count >= 10) multiplier = symDef.pay[10];

            const winVal = currentBet * multiplier;
            baseWinAmount += winVal;
            winPresents.push({
                symbol: symDef,
                count: count,
                winVal: winVal,
                locations: symbolLocations[symDef.id]
            });
        }
    });

    return {
        hasWin: winPresents.length > 0,
        winPresents,
        baseWinAmount,
        scatterCount,
        orbSymbols
    };
}

function buyDedeGacorFreeSpins() {
    const cost = window.dedeGacorState.bet * 100;
    if (window.userState.balance < cost) {
        alert("EP Balance tidak cukup untuk Buy Free Spins! Butuh " + cost.toLocaleString() + " EP.");
        return;
    }

    if (window.dedeGacorState.isSpinning) return;

    window.userState.balance -= cost;
    window.addLog('Buy Free Spins (Dede Gacor Princess)', -cost);
    window.saveState();
    updateGameModalBalance();

    window.dedeGacorState.freeSpinsLeft = 15;
    window.dedeGacorState.globalMultiplier = 0;

    alert("✨ BONUS BUY SUCCESSFUL! 15 Free Spins Triggered! ✨");
    triggerPrincessSpin(true);
}

function toggleAnteBet() {
    if (window.dedeGacorState.isSpinning) return;
    window.dedeGacorState.anteBetActive = !window.dedeGacorState.anteBetActive;
    const anteBtn = document.getElementById('ante-bet-btn');
    if (anteBtn) {
        if (window.dedeGacorState.anteBetActive) {
            anteBtn.className = "px-sm py-xs bg-amber-500 text-black font-label-bold text-xs rounded-xl border border-yellow-300 shadow-[0_0_15px_rgba(255,215,0,0.6)] animate-pulse";
            anteBtn.innerText = "ANTE BET 1.25x: ON ⚡";
        } else {
            anteBtn.className = "px-sm py-xs bg-surface-container/80 text-on-surface-variant font-label-bold text-xs rounded-xl border border-white/10 hover:text-white";
            anteBtn.innerText = "ANTE BET 1.25x: OFF";
        }
    }
}

// Render Starlight Princess Dede Gacor UI
function renderDedeGacorPrincess(container) {
    container.innerHTML = `
        <div class="flex flex-col lg:flex-row items-center justify-between gap-md w-full max-w-4xl">
            <!-- Left Side Panel: Princess Mascot, Multipliers, Controls -->
            <div class="flex flex-col items-center lg:items-start gap-sm w-full lg:w-1/3">
                <!-- Mascot & Wand Container -->
                <div class="relative w-full bg-gradient-to-b from-purple-900/60 via-pink-900/40 to-surface-container p-sm rounded-3xl border border-pink-500/40 shadow-[0_0_25px_rgba(236,72,153,0.3)] flex flex-col items-center text-center overflow-hidden">
                    <div class="absolute -top-6 -right-6 w-20 h-20 bg-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div id="princess-wand-fx" class="text-5xl sm:text-6xl my-xs transition-transform duration-300 transform hover:scale-110 drop-shadow-[0_0_15px_rgba(255,105,180,0.8)]">
                        👸✨
                    </div>
                    <h3 class="font-headline-md text-pink-300 text-base sm:text-lg glow-text uppercase tracking-wider">PUTRI DEDE GACOR</h3>
                    <p class="font-label-bold text-[11px] text-yellow-300 tracking-widest">STARLIGHT PRINCESS SLOT</p>

                    <!-- Multiplier Accumulator Badge -->
                    <div class="mt-xs w-full bg-black/60 border border-yellow-400/50 rounded-2xl p-xs flex items-center justify-between px-sm">
                        <span class="text-xs font-label-bold text-on-surface-variant">TOTAL MULTIPLIER:</span>
                        <span id="princess-total-mult" class="text-xl font-headline-md text-yellow-300 glow-text">1x</span>
                    </div>

                    <!-- Free Spins Counter Badge -->
                    <div id="fs-counter-badge" class="mt-xs w-full bg-pink-950/80 border border-pink-400/50 rounded-2xl p-xs flex items-center justify-between px-sm ${window.dedeGacorState.freeSpinsLeft > 0 ? '' : 'hidden'}">
                        <span class="text-xs font-label-bold text-pink-300">FREE SPINS LEFT:</span>
                        <span id="fs-count-num" class="text-lg font-headline-md text-pink-200 animate-pulse">${window.dedeGacorState.freeSpinsLeft}</span>
                    </div>
                </div>

                <!-- Action Controls: Buy Bonus & Ante Bet -->
                <div class="flex flex-col gap-xs w-full">
                    <button id="btn-buy-bonus" class="w-full py-2 px-md bg-gradient-to-r from-amber-500 via-pink-600 to-purple-600 text-white font-button-text text-xs uppercase tracking-wider rounded-2xl border border-yellow-300/60 shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:scale-102 transition-transform" onclick="buyDedeGacorFreeSpins()">
                        ✨ BUY FREE SPINS (100x Bet)
                    </button>
                    <div class="flex justify-between items-center gap-xs w-full">
                        <button id="ante-bet-btn" class="px-sm py-xs bg-surface-container/80 text-on-surface-variant font-label-bold text-xs rounded-xl border border-white/10 hover:text-white" onclick="toggleAnteBet()">
                            ANTE BET 1.25x: OFF
                        </button>
                        <button class="px-sm py-xs bg-primary-fixed/20 text-primary-fixed font-label-bold text-xs rounded-xl border border-primary-fixed/40 hover:bg-primary-fixed/30 flex items-center gap-1" onclick="openCaraMainModal()">
                            <span class="material-symbols-outlined text-[16px]">help</span> Cara Main
                        </button>
                    </div>
                </div>
            </div>

            <!-- Right Side Panel: 6x5 Grid Area -->
            <div class="flex flex-col items-center gap-xs w-full lg:w-2/3">
                <!-- Grid Reel Box -->
                <div id="princess-grid-box" class="grid grid-cols-6 gap-1 sm:gap-2 bg-slate-950/90 border-2 border-pink-500/50 p-2 sm:p-3 rounded-3xl w-full shadow-[0_0_35px_rgba(236,72,153,0.25)] min-h-[300px]">
                    <!-- Dynamically filled with 30 cell slots -->
                </div>

                <!-- Tumble Win Status Bar -->
                <div id="princess-status-bar" class="h-10 w-full flex items-center justify-center font-headline-md text-yellow-300 text-sm sm:text-base text-center bg-surface-container/80 rounded-2xl border border-white/10 px-sm">
                    ✨ Bayar di Mana Saja (Pay Anywhere)! Dapatkan 8+ simbol sama.
                </div>

                <!-- Bet Adjuster & Main Spin Button -->
                <div class="flex flex-wrap items-center justify-between gap-xs w-full bg-surface-container/60 p-2 rounded-2xl border border-white/10">
                    <div class="flex items-center gap-xs">
                        <span class="text-xs font-label-bold text-on-surface-variant">BET:</span>
                        <button class="px-2 py-0.5 bg-surface-bright rounded text-xs hover:text-primary-fixed" onclick="adjustDedeGacorBet(-2000)">-2k</button>
                        <span id="dede-bet-val" class="font-button-text text-primary-fixed text-sm px-1">10,000</span>
                        <button class="px-2 py-0.5 bg-surface-bright rounded text-xs hover:text-primary-fixed" onclick="adjustDedeGacorBet(2000)">+2k</button>
                        <button class="px-2 py-0.5 bg-pink-500/20 text-pink-300 border border-pink-400/50 rounded text-xs" onclick="adjustDedeGacorBet(50000)">MAX</button>
                    </div>

                    <button id="btn-princess-spin" class="btn-primary font-button-text px-lg py-2 text-base uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.5)]" onclick="triggerPrincessSpin()">
                        SPIN GACOR 👑
                    </button>
                </div>
            </div>
        </div>
    `;

    // Render initial grid display
    window.dedeGacorState.grid = generateFullGrid(false, window.dedeGacorState.anteBetActive);
    renderGridToDOM(window.dedeGacorState.grid);
}

function adjustDedeGacorBet(delta) {
    if (window.dedeGacorState.isSpinning) return;
    if (delta === 50000) {
        window.dedeGacorState.bet = Math.min(window.userState.balance, 50000);
    } else {
        window.dedeGacorState.bet = Math.max(2000, window.dedeGacorState.bet + delta);
    }
    const betEl = document.getElementById('dede-bet-val');
    if (betEl) betEl.innerText = window.dedeGacorState.bet.toLocaleString();
}

function renderGridToDOM(grid, winningLocations = []) {
    const gridBox = document.getElementById('princess-grid-box');
    if (!gridBox) return;

    let html = '';
    // Display by row then col so CSS grid 6 cols fills naturally
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 6; col++) {
            const item = grid[col][row];
            const isWin = winningLocations.some(loc => loc.col === col && loc.row === row);

            if (!item) {
                html += `<div class="aspect-square bg-black/40 rounded-xl border border-white/5"></div>`;
                continue;
            }

            let cellBg = "bg-slate-900/80 border-slate-700/50";
            let contentHtml = "";

            if (item.type === 'scatter') {
                cellBg = "bg-gradient-to-b from-pink-900/90 to-purple-950/90 border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.5)]";
                contentHtml = `<div class="text-2xl sm:text-3xl animate-bounce">👸</div><span class="text-[9px] font-label-bold text-pink-300 uppercase">SCATTER</span>`;
            } else if (item.type === 'orb') {
                cellBg = `bg-gradient-to-tr ${item.color} border-yellow-300 shadow-[0_0_15px_rgba(255,215,0,0.8)] animate-pulse`;
                contentHtml = `<div class="text-xl sm:text-2xl">${item.icon}</div><span class="text-xs font-headline-md text-white drop-shadow-[0_0_8px_black]">${item.label}</span>`;
            } else {
                contentHtml = `<div class="text-2xl sm:text-3xl ${item.color}">${item.icon}</div>`;
            }

            if (isWin) {
                cellBg += " ring-2 ring-yellow-400 bg-yellow-500/40 animate-ping";
            }

            html += `
                <div class="aspect-square ${cellBg} border rounded-xl flex flex-col items-center justify-center transition-all duration-200 hover:scale-105">
                    ${contentHtml}
                </div>
            `;
        }
    }
    gridBox.innerHTML = html;
}

// Trigger Princess Spin Loop with Cascading Tumbles
async function triggerPrincessSpin(isBonusBuy = false) {
    if (window.dedeGacorState.isSpinning) return;

    const actualBet = window.dedeGacorState.anteBetActive ? window.dedeGacorState.bet * 1.25 : window.dedeGacorState.bet;

    if (!isBonusBuy && window.dedeGacorState.freeSpinsLeft <= 0) {
        if (window.userState.balance < actualBet) {
            alert("Balance EP tidak cukup! Silakan kurangi bet atau klaim Free Spin.");
            return;
        }
        window.userState.balance -= actualBet;
        window.saveState();
        updateGameModalBalance();
    }

    window.dedeGacorState.isSpinning = true;
    const spinBtn = document.getElementById('btn-princess-spin');
    const statusBar = document.getElementById('princess-status-bar');
    const wandFx = document.getElementById('princess-wand-fx');

    if (spinBtn) spinBtn.disabled = true;

    if (window.dedeGacorState.freeSpinsLeft > 0 && !isBonusBuy) {
        window.dedeGacorState.freeSpinsLeft--;
        const fsCountEl = document.getElementById('fs-count-num');
        if (fsCountEl) fsCountEl.innerText = window.dedeGacorState.freeSpinsLeft;
    } else if (window.dedeGacorState.freeSpinsLeft === 0) {
        window.dedeGacorState.globalMultiplier = 0;
    }

    const multValEl = document.getElementById('princess-total-mult');
    if (multValEl) multValEl.innerText = `${window.dedeGacorState.globalMultiplier || 1}x`;

    if (statusBar) statusBar.innerHTML = `<span class="animate-pulse text-pink-300">⚡ MENGOCOK PERMATA BINTANG... ⚡</span>`;

    // Fast reel shuffle effect
    for (let shuffle = 0; shuffle < 5; shuffle++) {
        const shuffleGrid = generateFullGrid(window.dedeGacorState.freeSpinsLeft > 0, window.dedeGacorState.anteBetActive);
        renderGridToDOM(shuffleGrid);
        await new Promise(r => setTimeout(r, 100));
    }

    // Final Grid
    window.dedeGacorState.grid = generateFullGrid(window.dedeGacorState.freeSpinsLeft > 0, window.dedeGacorState.anteBetActive);
    renderGridToDOM(window.dedeGacorState.grid);

    // Process Tumble Cascade Loop
    let roundTotalWin = 0;
    let roundMultiplierSum = 0;
    let tumbleCount = 0;
    let hasMoreTumbles = true;
    let totalScattersFound = 0;

    while (hasMoreTumbles) {
        const evalRes = evaluateGridWins(window.dedeGacorState.grid, window.dedeGacorState.bet);
        totalScattersFound = Math.max(totalScattersFound, evalRes.scatterCount);

        // Collect multipliers from orbs present
        if (evalRes.orbSymbols.length > 0) {
            evalRes.orbSymbols.forEach(orb => {
                roundMultiplierSum += orb.val;
            });
            if (wandFx) {
                wandFx.classList.add('scale-125', 'rotate-12');
                setTimeout(() => wandFx.classList.remove('scale-125', 'rotate-12'), 300);
            }
        }

        if (evalRes.hasWin) {
            tumbleCount++;
            roundTotalWin += evalRes.baseWinAmount;

            // Highlight winning symbols
            const allWinLocations = evalRes.winPresents.flatMap(wp => wp.locations);
            renderGridToDOM(window.dedeGacorState.grid, allWinLocations);

            if (statusBar) {
                statusBar.innerHTML = `🎉 <span class="text-yellow-300 font-bold">TUMBLE #${tumbleCount}: +${evalRes.baseWinAmount.toLocaleString()} EP!</span> 🎉`;
            }

            await new Promise(r => setTimeout(r, 800));

            // Remove winning symbols & let upper symbols fall down
            removeAndCascadeGrid(evalRes.winPresents);
            renderGridToDOM(window.dedeGacorState.grid);
            await new Promise(r => setTimeout(r, 400));
        } else {
            hasMoreTumbles = false;
        }
    }

    // Final calculations with multipliers
    let finalWinForSpin = roundTotalWin;

    if (roundMultiplierSum > 0) {
        if (window.dedeGacorState.freeSpinsLeft > 0) {
            window.dedeGacorState.globalMultiplier += roundMultiplierSum;
        } else {
            window.dedeGacorState.globalMultiplier = roundMultiplierSum;
        }

        const effectiveMult = window.dedeGacorState.globalMultiplier || 1;
        finalWinForSpin = roundTotalWin * effectiveMult;
    } else if (window.dedeGacorState.freeSpinsLeft > 0 && window.dedeGacorState.globalMultiplier > 0) {
        finalWinForSpin = roundTotalWin * window.dedeGacorState.globalMultiplier;
    }

    if (multValEl) multValEl.innerText = `${window.dedeGacorState.globalMultiplier || 1}x`;

    // Trigger Free Spins if 4+ Scatters landed
    if (totalScattersFound >= 4 && window.dedeGacorState.freeSpinsLeft <= 0) {
        window.dedeGacorState.freeSpinsLeft = 15;
        alert(`👸 STARLIGHT PRINCESS GACOR! ${totalScattersFound} SCATTER DITEMUKAN! 15 FREE SPINS DIMULAI!`);
    }

    if (finalWinForSpin > 0) {
        window.userState.balance += finalWinForSpin;
        window.addLog(`Dede Gacor Win (${window.dedeGacorState.globalMultiplier || 1}x)`, finalWinForSpin);
        if (statusBar) {
            statusBar.innerHTML = `🔥 <span class="text-yellow-300 font-bold glow-text">TOTAL KEMENANGAN: +${finalWinForSpin.toLocaleString()} EP!</span> 🔥`;
        }
    } else {
        if (statusBar) {
            statusBar.innerHTML = `<span class="text-on-surface-variant">Belum hoki! Cobalah spin lagi.</span>`;
        }
    }

    window.saveState();
    updateGameModalBalance();

    const fsCounterBadge = document.getElementById('fs-counter-badge');
    const fsCountNum = document.getElementById('fs-count-num');
    if (fsCounterBadge && fsCountNum) {
        if (window.dedeGacorState.freeSpinsLeft > 0) {
            fsCounterBadge.classList.remove('hidden');
            fsCountNum.innerText = window.dedeGacorState.freeSpinsLeft;
        } else {
            fsCounterBadge.classList.add('hidden');
        }
    }

    window.dedeGacorState.isSpinning = false;
    if (spinBtn) spinBtn.disabled = false;

    // Auto spin if free spins remain
    if (window.dedeGacorState.freeSpinsLeft > 0) {
        setTimeout(() => triggerPrincessSpin(), 1200);
    }
}

// Cascading replacement logic
function removeAndCascadeGrid(winPresents) {
    const locationsToRemove = new Set();
    winPresents.forEach(wp => {
        wp.locations.forEach(loc => {
            locationsToRemove.add(`${loc.col},${loc.row}`);
        });
    });

    for (let col = 0; col < 6; col++) {
        const remaining = [];
        for (let row = 0; row < 5; row++) {
            if (!locationsToRemove.has(`${col},${row}`)) {
                remaining.push(window.dedeGacorState.grid[col][row]);
            }
        }
        // Top off column with fresh symbols
        while (remaining.length < 5) {
            remaining.unshift(getRandomGridSymbol(window.dedeGacorState.freeSpinsLeft > 0, window.dedeGacorState.anteBetActive));
        }
        window.dedeGacorState.grid[col] = remaining;
    }
}

// "Cara Main" Modal trigger
function openCaraMainModal() {
    let modal = document.getElementById('caramain-modal');
    if (!modal) {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'caramain-modal';
        modalDiv.className = 'fixed inset-0 z-50 flex items-center justify-center p-md bg-black/85 backdrop-blur-md';
        modalDiv.innerHTML = `
            <div class="glass-card w-full max-w-2xl rounded-3xl p-md md:p-lg flex flex-col gap-md relative border-2 border-pink-500/50 max-h-[85vh] overflow-y-auto">
                <button class="absolute top-4 right-4 text-on-surface-variant hover:text-primary-fixed" onclick="document.getElementById('caramain-modal').remove()">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <div class="text-center flex flex-col gap-xs border-b border-white/10 pb-sm">
                    <h2 class="font-headline-md text-pink-300 text-2xl glow-text">👑 CARA MAIN DEDE GACOR (STARLIGHT PRINCESS) 👑</h2>
                    <p class="font-label-bold text-xs text-yellow-300 uppercase tracking-widest">— Panduan Slot &amp; Tabel Hadiah —</p>
                </div>

                <div class="flex flex-col gap-md text-sm text-on-surface-variant">
                    <div class="bg-surface-container p-sm rounded-2xl border border-white/10">
                        <h3 class="font-label-bold text-primary-fixed mb-xs flex items-center gap-2">
                            <span class="material-symbols-outlined text-pink-400">auto_awesome</span> 1. Sistem Pay Anywhere (Bayar di Mana Saja)
                        </h3>
                        <p>Simbol tidak membutuhkan garis pembayaran (payline) tertentu. Cukup dapatkan minimal <strong>8 simbol yang sama</strong> di posisi mana saja pada kisi 6x5 untuk memenangkan hadiah!</p>
                    </div>

                    <div class="bg-surface-container p-sm rounded-2xl border border-white/10">
                        <h3 class="font-label-bold text-primary-fixed mb-xs flex items-center gap-2">
                            <span class="material-symbols-outlined text-yellow-400">south</span> 2. Fitur Tumble (Runtuhan Simbol)
                        </h3>
                        <p>Simbol yang menang akan pecah dan menghilang. Simbol di atasnya akan jatuh mengisi kekosongan, dan simbol baru turun dari atas. Tumble berlanjut hingga tidak ada kombinasi menang baru.</p>
                    </div>

                    <div class="bg-surface-container p-sm rounded-2xl border border-white/10">
                        <h3 class="font-label-bold text-primary-fixed mb-xs flex items-center gap-2">
                            <span class="material-symbols-outlined text-purple-400">bolt</span> 3. Bola Pengali Multiplier (2x - 500x)
                        </h3>
                        <p>Putri Dede dapat mengibaskan tongkat sihirnya untuk menjatuhkan Orb Pengali Acak bernilai <strong>2x hingga 500x</strong>! Semua nilai Orb dijumlahkan dan dikalikan dengan total kemenangan spin.</p>
                    </div>

                    <div class="bg-surface-container p-sm rounded-2xl border border-white/10">
                        <h3 class="font-label-bold text-primary-fixed mb-xs flex items-center gap-2">
                            <span class="material-symbols-outlined text-pink-300">stars</span> 4. Free Spins &amp; Buy Bonus
                        </h3>
                        <p>Dapatkan <strong>4+ Scatter 👸</strong> untuk memicu 15 Spin Gratis. Selama Free Spins, nilai Multiplier bersifat akumulatif global! Anda juga dapat memicu Spin Gratis secara instan dengan memilih <strong>Buy Free Spins (100x Bet)</strong>.</p>
                    </div>

                    <div class="bg-surface-container p-sm rounded-2xl border border-white/10">
                        <h3 class="font-label-bold text-primary-fixed mb-sm">💎 TABEL SIMBOL &amp; MULTIPLIER PAYOUT</h3>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                            <div class="p-2 bg-black/40 rounded-xl border border-yellow-400/30">👑 Mahkota: 8x (10x), 12+ (50x)</div>
                            <div class="p-2 bg-black/40 rounded-xl border border-red-400/30">❤️ Hati Red: 8x (2.5x), 12+ (25x)</div>
                            <div class="p-2 bg-black/40 rounded-xl border border-amber-400/30">⭐ Bintang: 8x (2x), 12+ (15x)</div>
                            <div class="p-2 bg-black/40 rounded-xl border border-cyan-400/30">🌙 Bulan: 8x (1.5x), 12+ (12x)</div>
                            <div class="p-2 bg-black/40 rounded-xl border border-emerald-400/30">💎 Berlian: 8x (1x), 12+ (10x)</div>
                            <div class="p-2 bg-black/40 rounded-xl border border-pink-400/30">👸 Scatter: 4+ Trigger 15 FS</div>
                        </div>
                    </div>
                </div>

                <button class="btn-primary w-full py-sm font-button-text uppercase tracking-widest text-sm mt-xs" onclick="document.getElementById('caramain-modal').remove()">
                    MENGERTI &amp; MULAI MAIN 🚀
                </button>
            </div>
        `;
        document.body.appendChild(modalDiv);
    }
}

// ==========================================
// 1. SLOT MACHINES (3-reel & 5-reel)
// ==========================================
function renderSlotMachine(container, title, symbols, numReels = 3, isGacor = false) {
    container.innerHTML = `
        <div class="flex flex-col items-center gap-md w-full max-w-lg">
            <div class="text-center">
                <span class="font-label-bold text-xs text-primary-fixed tracking-widest uppercase">SIMULATED SLOT ARENA</span>
                <p class="text-on-surface-variant text-sm">Match identical symbols across reels to win massive EP multipliers!</p>
            </div>

            <!-- Reels Box -->
            <div class="flex justify-center items-center gap-sm sm:gap-md bg-surface-container border-2 border-primary-fixed/50 p-md rounded-3xl w-full shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                ${Array(numReels).fill(0).map((_, i) => `
                    <div id="reel-${i}" class="w-16 h-24 sm:w-24 sm:h-32 bg-black/60 border border-primary-fixed/30 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-inner transition-all duration-200">
                        ${symbols[i % symbols.length]}
                    </div>
                `).join('')}
            </div>

            <!-- Result Message -->
            <div id="slot-result" class="h-10 flex items-center justify-center font-headline-md text-primary-fixed text-lg sm:text-xl text-center">
                🎰 Set your bet and spin the golden reels!
            </div>

            <!-- Controls -->
            <div class="flex flex-wrap items-center justify-between gap-md w-full bg-surface-container/60 p-sm rounded-2xl border border-white/10">
                <div class="flex items-center gap-xs">
                    <span class="text-xs font-label-bold text-on-surface-variant">BET:</span>
                    <button class="px-xs py-0.5 bg-surface-bright rounded text-xs hover:text-primary-fixed" onclick="adjustSlotBet(-1000)">-1k</button>
                    <span id="slot-bet-val" class="font-button-text text-primary-fixed px-2">5,000</span>
                    <button class="px-xs py-0.5 bg-surface-bright rounded text-xs hover:text-primary-fixed" onclick="adjustSlotBet(1000)">+1k</button>
                    <button class="px-2 py-0.5 bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/50 rounded text-xs" onclick="adjustSlotBet(50000)">MAX</button>
                </div>
                <button id="btn-spin-slot" class="btn-primary font-button-text px-lg py-sm text-lg uppercase tracking-widest" onclick="spinSlotMachine(${numReels}, ${JSON.stringify(symbols).replace(/"/g, '&quot;')}, ${isGacor})">
                    SPIN 🎰
                </button>
            </div>
        </div>
    `;
    window.currentSlotBet = 5000;
}

function adjustSlotBet(delta) {
    if (!window.currentSlotBet) window.currentSlotBet = 5000;
    if (delta === 50000) {
        window.currentSlotBet = Math.min(window.userState.balance, 50000);
    } else {
        window.currentSlotBet = Math.max(1000, window.currentSlotBet + delta);
    }
    const betEl = document.getElementById('slot-bet-val');
    if (betEl) betEl.innerText = window.currentSlotBet.toLocaleString();
}

function spinSlotMachine(numReels, symbols, isGacor) {
    const bet = window.currentSlotBet || 5000;
    if (window.userState.balance < bet) {
        alert("Inadequate EP balance! Use Spin & Win or adjust your bet.");
        return;
    }

    // Deduct bet
    window.userState.balance -= bet;
    window.saveState();
    updateGameModalBalance();

    const spinBtn = document.getElementById('btn-spin-slot');
    const resultEl = document.getElementById('slot-result');
    if (spinBtn) spinBtn.disabled = true;

    resultEl.innerHTML = `<span class="animate-pulse text-yellow-400">⚡ REELS SPINNING... ⚡</span>`;

    let interval;
    let ticks = 0;
    interval = setInterval(() => {
        ticks++;
        for (let i = 0; i < numReels; i++) {
            const reel = document.getElementById(`reel-${i}`);
            if (reel) {
                const randomSym = symbols[Math.floor(Math.random() * symbols.length)];
                reel.innerText = randomSym;
            }
        }

        if (ticks > 15) {
            clearInterval(interval);
            // Calculate outcome
            const finalResults = [];
            const isWin = isGacor ? Math.random() < 0.7 : Math.random() < 0.45;

            let chosenSym = symbols[Math.floor(Math.random() * symbols.length)];

            if (isWin) {
                // High win probability
                for (let i = 0; i < numReels; i++) {
                    finalResults.push(chosenSym);
                }
            } else {
                // Random mix
                for (let i = 0; i < numReels; i++) {
                    finalResults.push(symbols[Math.floor(Math.random() * symbols.length)]);
                }
            }

            // Display final symbols
            for (let i = 0; i < numReels; i++) {
                const reel = document.getElementById(`reel-${i}`);
                if (reel) reel.innerText = finalResults[i];
            }

            // Check if all match
            const allMatch = finalResults.every(val => val === finalResults[0]);
            if (allMatch) {
                const multiplier = isGacor ? 10 : (numReels === 5 ? 15 : 5);
                const winAmount = bet * multiplier;
                window.userState.balance += winAmount;
                window.addLog(`Slot Jackpot Win (${finalResults[0]})`, winAmount);
                resultEl.innerHTML = `🎉 <span class="text-primary-fixed glow-text font-bold">JACKPOT! YOU WON ${winAmount.toLocaleString()} EP (${multiplier}x)</span> 🎉`;
            } else {
                window.addLog('Slot Spin', -bet);
                resultEl.innerHTML = `<span class="text-on-surface-variant">Try again! Fortune favors the bold.</span>`;
            }

            window.saveState();
            updateGameModalBalance();
            if (spinBtn) spinBtn.disabled = false;
        }
    }, 100);
}

// ==========================================
// 2. ROULETTE (Midnight & Emerald Empress)
// ==========================================
function renderRoulette(container, themeName) {
    container.innerHTML = `
        <div class="flex flex-col items-center gap-md w-full max-w-xl">
            <div class="text-center">
                <span class="font-label-bold text-xs text-primary-fixed tracking-widest uppercase">${themeName.toUpperCase()} ROULETTE</span>
                <p class="text-on-surface-variant text-sm">Select your bet option and spin the illuminated wheel!</p>
            </div>

            <!-- Wheel Display -->
            <div class="relative w-40 h-40 sm:w-52 sm:h-52 rounded-full border-4 border-primary-fixed shadow-[0_0_30px_rgba(255,215,0,0.3)] flex items-center justify-center bg-gradient-to-tr from-black via-surface-container to-surface-bright overflow-hidden">
                <div id="roulette-wheel-inner" class="w-full h-full rounded-full flex items-center justify-center transition-transform duration-[3000ms] ease-out">
                    <div id="roulette-ball-number" class="text-4xl sm:text-6xl font-headline-md text-primary-fixed drop-shadow-[0_0_15px_gold]">
                        36
                    </div>
                </div>
            </div>

            <div id="roulette-status" class="h-8 font-headline-md text-primary-fixed text-sm sm:text-base text-center">
                Place your bet and spin the wheel!
            </div>

            <!-- Betting Board -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-xs sm:gap-sm w-full">
                <button class="roulette-bet-btn btn-bet p-sm bg-red-900/60 border border-red-500 rounded-xl font-button-text text-xs text-red-200 hover:bg-red-800" onclick="selectRouletteBet('RED', this)">
                    🔴 RED (2x)
                </button>
                <button class="roulette-bet-btn btn-bet p-sm bg-stone-900/80 border border-stone-500 rounded-xl font-button-text text-xs text-stone-200 hover:bg-stone-800" onclick="selectRouletteBet('BLACK', this)">
                    ⚫ BLACK (2x)
                </button>
                <button class="roulette-bet-btn btn-bet p-sm bg-emerald-900/60 border border-emerald-500 rounded-xl font-button-text text-xs text-emerald-200 hover:bg-emerald-800" onclick="selectRouletteBet('EVEN', this)">
                    🔢 EVEN (2x)
                </button>
                <button class="roulette-bet-btn btn-bet p-sm bg-amber-900/60 border border-amber-500 rounded-xl font-button-text text-xs text-amber-200 hover:bg-amber-800" onclick="selectRouletteBet('ODD', this)">
                    ⚡ ODD (2x)
                </button>
            </div>

            <!-- Action Controls -->
            <div class="flex justify-between items-center w-full bg-surface-container/60 p-sm rounded-2xl border border-white/10">
                <div class="flex items-center gap-xs">
                    <span class="text-xs font-label-bold text-on-surface-variant">BET:</span>
                    <button class="px-xs py-0.5 bg-surface-bright rounded text-xs" onclick="adjustRouletteBet(-2500)">-2.5k</button>
                    <span id="roulette-bet-val" class="font-button-text text-primary-fixed px-2">10,000</span>
                    <button class="px-xs py-0.5 bg-surface-bright rounded text-xs" onclick="adjustRouletteBet(2500)">+2.5k</button>
                </div>
                <button id="btn-spin-roulette" class="btn-primary font-button-text px-lg py-sm text-base uppercase tracking-widest" onclick="spinRouletteWheel()">
                    SPIN WHEEL 🎡
                </button>
            </div>
        </div>
    `;
    window.currentRouletteBet = 10000;
    window.selectedRouletteOption = 'RED';
}

function adjustRouletteBet(delta) {
    if (!window.currentRouletteBet) window.currentRouletteBet = 10000;
    window.currentRouletteBet = Math.max(1000, window.currentRouletteBet + delta);
    const betEl = document.getElementById('roulette-bet-val');
    if (betEl) betEl.innerText = window.currentRouletteBet.toLocaleString();
}

function selectRouletteBet(option, element) {
    window.selectedRouletteOption = option;
    document.querySelectorAll('.roulette-bet-btn').forEach(b => b.classList.remove('ring-2', 'ring-primary-fixed'));
    element.classList.add('ring-2', 'ring-primary-fixed');
}

function spinRouletteWheel() {
    const bet = window.currentRouletteBet || 10000;
    const opt = window.selectedRouletteOption || 'RED';

    if (window.userState.balance < bet) {
        alert("Insufficient balance!");
        return;
    }

    window.userState.balance -= bet;
    window.saveState();
    updateGameModalBalance();

    const spinBtn = document.getElementById('btn-spin-roulette');
    const statusEl = document.getElementById('roulette-status');
    const numDisplay = document.getElementById('roulette-ball-number');

    if (spinBtn) spinBtn.disabled = true;
    statusEl.innerText = `Spinning wheel for bet on ${opt}...`;

    // Random number 0-36
    const landedNum = Math.floor(Math.random() * 37);
    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    const isRed = redNumbers.includes(landedNum);
    const isEven = landedNum > 0 && landedNum % 2 === 0;

    let won = false;
    if (opt === 'RED' && isRed) won = true;
    if (opt === 'BLACK' && !isRed && landedNum !== 0) won = true;
    if (opt === 'EVEN' && isEven) won = true;
    if (opt === 'ODD' && landedNum % 2 !== 0) won = true;

    setTimeout(() => {
        numDisplay.innerText = landedNum;
        if (won) {
            const winAmount = bet * 2;
            window.userState.balance += winAmount;
            window.addLog(`Roulette Win (${opt})`, winAmount);
            statusEl.innerHTML = `🎉 <span class="text-primary-fixed font-bold">Landed on ${landedNum}! WINNER: +${winAmount.toLocaleString()} EP!</span> 🎉`;
        } else {
            window.addLog(`Roulette Spin`, -bet);
            statusEl.innerText = `Landed on ${landedNum}. Better luck next spin!`;
        }
        window.saveState();
        updateGameModalBalance();
        if (spinBtn) spinBtn.disabled = false;
    }, 1500);
}

// ==========================================
// 3. DIAMOND VAULT (Combination Crack Game)
// ==========================================
function renderDiamondVault(container) {
    const secretCode = [Math.floor(Math.random()*9)+1, Math.floor(Math.random()*9)+1, Math.floor(Math.random()*9)+1];
    window.vaultSecretCode = secretCode;

    container.innerHTML = `
        <div class="flex flex-col items-center gap-md w-full max-w-lg">
            <div class="text-center">
                <span class="font-label-bold text-xs text-primary-fixed tracking-widest uppercase">DIAMOND VAULT SAFE CRACKER</span>
                <p class="text-on-surface-variant text-sm">Guess the 3-digit combination (1-9) to unlock up to 250,000 EP!</p>
            </div>

            <!-- Vault Door Visual -->
            <div class="w-48 h-48 sm:w-60 sm:h-60 rounded-full border-8 border-yellow-600/80 bg-gradient-to-b from-stone-900 to-black flex flex-col items-center justify-center relative shadow-[0_0_40px_rgba(255,215,0,0.3)]">
                <span class="material-symbols-outlined text-6xl text-primary-fixed mb-2">lock</span>
                <div class="flex gap-2">
                    <input id="code-0" type="number" min="1" max="9" value="5" class="w-10 h-12 bg-surface-container border border-primary-fixed text-center font-headline-md text-xl text-primary-fixed rounded-xl">
                    <input id="code-1" type="number" min="1" max="9" value="5" class="w-10 h-12 bg-surface-container border border-primary-fixed text-center font-headline-md text-xl text-primary-fixed rounded-xl">
                    <input id="code-2" type="number" min="1" max="9" value="5" class="w-10 h-12 bg-surface-container border border-primary-fixed text-center font-headline-md text-xl text-primary-fixed rounded-xl">
                </div>
            </div>

            <div id="vault-hint" class="h-10 font-headline-md text-primary-fixed text-sm text-center">
                Enter your 3-digit combination guess!
            </div>

            <button class="btn-primary font-button-text px-xl py-md text-lg uppercase tracking-widest w-full" onclick="attemptCrackVault()">
                CRACK VAULT (10,000 EP) 🔓
            </button>
        </div>
    `;
}

function attemptCrackVault() {
    const bet = 10000;
    if (window.userState.balance < bet) {
        alert("Insufficient balance!");
        return;
    }

    window.userState.balance -= bet;
    window.saveState();
    updateGameModalBalance();

    const g0 = parseInt(document.getElementById('code-0').value) || 1;
    const g1 = parseInt(document.getElementById('code-1').value) || 1;
    const g2 = parseInt(document.getElementById('code-2').value) || 1;
    const guesses = [g0, g1, g2];
    const code = window.vaultSecretCode;

    let correctCount = 0;
    for (let i = 0; i < 3; i++) {
        if (guesses[i] === code[i]) correctCount++;
    }

    const hintEl = document.getElementById('vault-hint');

    if (correctCount === 3) {
        const winAmount = 250000;
        window.userState.balance += winAmount;
        window.addLog('Diamond Vault Cracker Jackpot', winAmount);
        hintEl.innerHTML = `💎 <span class="text-primary-fixed font-bold glow-text">VAULT UNLOCKED! YOU WON ${winAmount.toLocaleString()} EP!</span> 💎`;
        // reset code
        window.vaultSecretCode = [Math.floor(Math.random()*9)+1, Math.floor(Math.random()*9)+1, Math.floor(Math.random()*9)+1];
    } else {
        window.addLog('Diamond Vault Crack Attempt', -bet);
        hintEl.innerText = `Vault Sealed! ${correctCount} digits correctly positioned. Keep cracking!`;
    }

    window.saveState();
    updateGameModalBalance();
}

// ==========================================
// 4. TITANIUM BLACKJACK
// ==========================================
function renderBlackjack(container) {
    container.innerHTML = `
        <div class="flex flex-col items-center gap-md w-full max-w-xl">
            <div class="text-center">
                <span class="font-label-bold text-xs text-primary-fixed tracking-widest uppercase">TITANIUM BLACKJACK</span>
                <p class="text-on-surface-variant text-sm">Beat the dealer's hand without exceeding 21!</p>
            </div>

            <!-- Dealer Cards -->
            <div class="w-full bg-surface-container/80 p-sm sm:p-md rounded-2xl border border-white/10 flex flex-col items-center">
                <div class="font-label-bold text-xs text-on-surface-variant mb-xs">DEALER'S HAND <span id="dealer-score"></span></div>
                <div id="dealer-cards" class="flex gap-2 min-h-[60px] items-center">
                    <div class="w-12 h-16 bg-surface-bright border border-primary-fixed/40 rounded-lg flex items-center justify-center font-bold">?</div>
                </div>
            </div>

            <!-- Player Cards -->
            <div class="w-full bg-surface-container/80 p-sm sm:p-md rounded-2xl border border-white/10 flex flex-col items-center">
                <div class="font-label-bold text-xs text-primary-fixed mb-xs">YOUR HAND <span id="player-score"></span></div>
                <div id="player-cards" class="flex gap-2 min-h-[60px] items-center">
                    <div class="w-12 h-16 bg-surface-bright border border-primary-fixed/40 rounded-lg flex items-center justify-center font-bold">?</div>
                </div>
            </div>

            <div id="bj-status" class="h-8 font-headline-md text-primary-fixed text-sm text-center">
                Place your bet and click Deal to start!
            </div>

            <!-- Action Buttons -->
            <div id="bj-actions" class="flex gap-md w-full justify-center">
                <button id="btn-bj-deal" class="btn-primary font-button-text px-lg py-sm text-base" onclick="startBlackjackGame()">DEAL (10,000 EP)</button>
                <button id="btn-bj-hit" class="glass-card text-primary-fixed font-button-text px-md py-sm text-base hidden" onclick="hitBlackjack()">HIT</button>
                <button id="btn-bj-stand" class="btn-primary font-button-text px-md py-sm text-base hidden" onclick="standBlackjack()">STAND</button>
            </div>
        </div>
    `;
}

function startBlackjackGame() {
    const bet = 10000;
    if (window.userState.balance < bet) {
        alert("Insufficient balance!");
        return;
    }

    window.userState.balance -= bet;
    window.saveState();
    updateGameModalBalance();

    window.bjBet = bet;
    window.bjPlayerHand = [getRandomCard(), getRandomCard()];
    window.bjDealerHand = [getRandomCard(), getRandomCard()];
    window.bjGameOver = false;

    document.getElementById('btn-bj-deal').classList.add('hidden');
    document.getElementById('btn-bj-hit').classList.remove('hidden');
    document.getElementById('btn-bj-stand').classList.remove('hidden');

    updateBlackjackUI(false);
}

function getRandomCard() {
    const suit = CARD_SUITS[Math.floor(Math.random() * CARD_SUITS.length)];
    const rank = CARD_RANKS[Math.floor(Math.random() * CARD_RANKS.length)];
    let val = parseInt(rank);
    if (['J', 'Q', 'K'].includes(rank)) val = 10;
    if (rank === 'A') val = 11;
    return { suit, rank, val };
}

function calculateHandValue(hand) {
    let sum = 0;
    let aces = 0;
    hand.forEach(c => {
        sum += c.val;
        if (c.rank === 'A') aces++;
    });
    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces--;
    }
    return sum;
}

function updateBlackjackUI(showDealerFull) {
    const pCardsEl = document.getElementById('player-cards');
    const dCardsEl = document.getElementById('dealer-cards');
    const pScoreEl = document.getElementById('player-score');
    const dScoreEl = document.getElementById('dealer-score');

    pCardsEl.innerHTML = window.bjPlayerHand.map(c => `
        <div class="w-12 h-16 bg-white text-black border border-amber-400 rounded-lg flex flex-col items-center justify-center font-bold text-xs shadow-md">
            <span>${c.rank}</span>
            <span>${c.suit}</span>
        </div>
    `).join('');

    if (showDealerFull) {
        dCardsEl.innerHTML = window.bjDealerHand.map(c => `
            <div class="w-12 h-16 bg-white text-black border border-amber-400 rounded-lg flex flex-col items-center justify-center font-bold text-xs shadow-md">
                <span>${c.rank}</span>
                <span>${c.suit}</span>
            </div>
        `).join('');
        dScoreEl.innerText = `(${calculateHandValue(window.bjDealerHand)})`;
    } else {
        dCardsEl.innerHTML = `
            <div class="w-12 h-16 bg-white text-black border border-amber-400 rounded-lg flex flex-col items-center justify-center font-bold text-xs shadow-md">
                <span>${window.bjDealerHand[0].rank}</span>
                <span>${window.bjDealerHand[0].suit}</span>
            </div>
            <div class="w-12 h-16 bg-surface-bright border border-primary-fixed/40 rounded-lg flex items-center justify-center font-bold text-white">?</div>
        `;
        dScoreEl.innerText = `(?)`;
    }

    pScoreEl.innerText = `(${calculateHandValue(window.bjPlayerHand)})`;
}

function hitBlackjack() {
    window.bjPlayerHand.push(getRandomCard());
    const score = calculateHandValue(window.bjPlayerHand);
    updateBlackjackUI(false);

    if (score > 21) {
        endBlackjackGame(false, "Bust! You exceeded 21.");
    }
}

function standBlackjack() {
    let dScore = calculateHandValue(window.bjDealerHand);
    while (dScore < 17) {
        window.bjDealerHand.push(getRandomCard());
        dScore = calculateHandValue(window.bjDealerHand);
    }

    const pScore = calculateHandValue(window.bjPlayerHand);
    updateBlackjackUI(true);

    if (dScore > 21 || pScore > dScore) {
        endBlackjackGame(true, `You win! Your ${pScore} beats dealer's ${dScore > 21 ? 'Bust' : dScore}.`);
    } else if (pScore === dScore) {
        endBlackjackGame(null, "Push! It's a tie.");
    } else {
        endBlackjackGame(false, `Dealer wins with ${dScore} against your ${pScore}.`);
    }
}

function endBlackjackGame(playerWon, message) {
    document.getElementById('btn-bj-hit').classList.add('hidden');
    document.getElementById('btn-bj-stand').classList.add('hidden');
    document.getElementById('btn-bj-deal').classList.remove('hidden');

    const statusEl = document.getElementById('bj-status');

    if (playerWon === true) {
        const winVal = window.bjBet * 2;
        window.userState.balance += winVal;
        window.addLog('Blackjack Win', winVal);
        statusEl.innerHTML = `🎉 <span class="text-primary-fixed font-bold">${message} (+${winVal.toLocaleString()} EP)</span> 🎉`;
    } else if (playerWon === null) {
        window.userState.balance += window.bjBet;
        statusEl.innerText = message;
    } else {
        window.addLog('Blackjack Loss', -window.bjBet);
        statusEl.innerText = message;
    }

    window.saveState();
    updateGameModalBalance();
}

// ==========================================
// 5. STARDUST POKER & ROYAL CARDS
// ==========================================
function renderPoker(container) {
    container.innerHTML = `
        <div class="flex flex-col items-center gap-md w-full max-w-xl">
            <div class="text-center">
                <span class="font-label-bold text-xs text-primary-fixed tracking-widest uppercase">STARDUST VIDEO POKER</span>
                <p class="text-on-surface-variant text-sm">Draw a 5-card poker hand to win astronomical EP payouts!</p>
            </div>

            <div id="poker-hand" class="flex gap-2 justify-center my-md">
                ${Array(5).fill(0).map(() => `
                    <div class="w-14 h-20 bg-surface-bright border border-primary-fixed/40 rounded-xl flex items-center justify-center text-xl text-primary-fixed font-bold">🎴</div>
                `).join('')}
            </div>

            <div id="poker-status" class="h-8 font-headline-md text-primary-fixed text-sm text-center">
                Press Deal Hand to draw cards!
            </div>

            <button class="btn-primary font-button-text px-xl py-md text-base uppercase tracking-widest" onclick="playPokerHand()">
                DEAL POKER HAND (15,000 EP) ♠️
            </button>
        </div>
    `;
}

function playPokerHand() {
    const bet = 15000;
    if (window.userState.balance < bet) {
        alert("Insufficient balance!");
        return;
    }

    window.userState.balance -= bet;
    window.saveState();
    updateGameModalBalance();

    const hand = [getRandomCard(), getRandomCard(), getRandomCard(), getRandomCard(), getRandomCard()];
    const handEl = document.getElementById('poker-hand');
    const statusEl = document.getElementById('poker-status');

    handEl.innerHTML = hand.map(c => `
        <div class="w-14 h-20 bg-white text-black border border-amber-400 rounded-xl flex flex-col items-center justify-center font-bold text-sm shadow-lg">
            <span>${c.rank}</span>
            <span>${c.suit}</span>
        </div>
    `).join('');

    // Simple evaluation
    const ranks = hand.map(c => c.rank);
    const uniqueRanks = new Set(ranks);

    let payout = 0;
    let handName = "High Card";

    if (uniqueRanks.size === 4) {
        payout = bet * 2;
        handName = "One Pair";
    } else if (uniqueRanks.size === 3) {
        payout = bet * 4;
        handName = "Three of a Kind";
    } else if (uniqueRanks.size === 2) {
        payout = bet * 10;
        handName = "Full House / Four of a Kind";
    }

    if (payout > 0) {
        window.userState.balance += payout;
        window.addLog(`Poker Win (${handName})`, payout);
        statusEl.innerHTML = `🎉 <span class="text-primary-fixed font-bold">${handName}! Won ${payout.toLocaleString()} EP!</span> 🎉`;
    } else {
        window.addLog('Poker Hand', -bet);
        statusEl.innerText = `${handName}. Better luck next hand!`;
    }

    window.saveState();
    updateGameModalBalance();
}

function renderRoyalCards(container) {
    renderPoker(container);
}

// ==========================================
// 6. NEON DRAGON BACCARAT
// ==========================================
function renderBaccarat(container) {
    container.innerHTML = `
        <div class="flex flex-col items-center gap-md w-full max-w-xl">
            <div class="text-center">
                <span class="font-label-bold text-xs text-primary-fixed tracking-widest uppercase">NEON DRAGON BACCARAT</span>
                <p class="text-on-surface-variant text-sm">Bet on Player, Banker, or Tie!</p>
            </div>

            <div class="grid grid-cols-2 gap-md w-full">
                <div class="bg-surface-container/80 p-md rounded-2xl border border-blue-500/30 text-center">
                    <h3 class="font-label-bold text-blue-400 mb-2">PLAYER</h3>
                    <div id="bac-player-cards" class="text-2xl font-bold text-white mb-1">? ?</div>
                </div>
                <div class="bg-surface-container/80 p-md rounded-2xl border border-red-500/30 text-center">
                    <h3 class="font-label-bold text-red-400 mb-2">BANKER</h3>
                    <div id="bac-banker-cards" class="text-2xl font-bold text-white mb-1">? ?</div>
                </div>
            </div>

            <div id="bac-status" class="h-8 font-headline-md text-primary-fixed text-sm text-center">
                Choose your side and deal!
            </div>

            <div class="grid grid-cols-3 gap-sm w-full">
                <button class="btn-primary font-button-text p-sm text-xs uppercase" onclick="playBaccarat('PLAYER')">BET PLAYER (2x)</button>
                <button class="btn-primary font-button-text p-sm text-xs uppercase" onclick="playBaccarat('BANKER')">BET BANKER (1.95x)</button>
                <button class="glass-card text-primary-fixed font-button-text p-sm text-xs uppercase" onclick="playBaccarat('TIE')">BET TIE (8x)</button>
            </div>
        </div>
    `;
}

function playBaccarat(betOn) {
    const bet = 10000;
    if (window.userState.balance < bet) {
        alert("Insufficient balance!");
        return;
    }

    window.userState.balance -= bet;
    window.saveState();
    updateGameModalBalance();

    const pCard1 = Math.floor(Math.random() * 9) + 1;
    const pCard2 = Math.floor(Math.random() * 9) + 1;
    const bCard1 = Math.floor(Math.random() * 9) + 1;
    const bCard2 = Math.floor(Math.random() * 9) + 1;

    const pTotal = (pCard1 + pCard2) % 10;
    const bTotal = (bCard1 + bCard2) % 10;

    document.getElementById('bac-player-cards').innerText = `${pCard1} + ${pCard2} = [${pTotal}]`;
    document.getElementById('bac-banker-cards').innerText = `${bCard1} + ${bCard2} = [${bTotal}]`;

    let winner = 'TIE';
    if (pTotal > bTotal) winner = 'PLAYER';
    if (bTotal > pTotal) winner = 'BANKER';

    const statusEl = document.getElementById('bac-status');

    if (betOn === winner) {
        const mult = winner === 'TIE' ? 8 : (winner === 'BANKER' ? 1.95 : 2);
        const winAmount = Math.floor(bet * mult);
        window.userState.balance += winAmount;
        window.addLog(`Baccarat Win (${winner})`, winAmount);
        statusEl.innerHTML = `🎉 <span class="text-primary-fixed font-bold">${winner} WON! You received +${winAmount.toLocaleString()} EP!</span> 🎉`;
    } else {
        window.addLog(`Baccarat Loss`, -bet);
        statusEl.innerText = `${winner} Won! Better luck next round.`;
    }

    window.saveState();
    updateGameModalBalance();
}
