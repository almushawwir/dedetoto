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
            titleEl.innerText = 'Dede Gacor';
            iconEl.innerText = 'crown';
            renderSlotMachine(canvasArea, 'Dede Gacor', ['👑', '👑', '💎', '⚡', '7️⃣'], 3, true);
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
