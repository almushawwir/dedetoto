// DEDETOTO Application Logic & State Management

// Initial Default State
const DEFAULT_USER_STATE = {
    balance: 4285900,
    vipTier: "Platinum Elite",
    profile: {
        alias: "AlexV_Elite",
        fullName: "Alexander Vance",
        email: "alexander.v@luminaluxe.priv",
        bio: "Seeking high-stakes environments and exclusive network opportunities.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-IYVRedtpt7IBMCHcpZKSsffVtKS97Lu01aluJ3cRDwgCRpIpQ2crhrf_XYkh_iRVQBHtusg5F8moX0BHRVDrdDiBH3VSXPI0I3tl0ndN95XyKFM3A2aQj3MwxbI7dJhDAEizofb0gh-gXNcmCwpYqcfEHRRO7D3y5iaCWvCMqp2ORNA88cUy78Qbjtl_4WALbo7L47i7ee-za2jG2PEmZ-5TEUTrdCrSa6bpXeiTuMTxT5at7NFCnA"
    },
    activityLogs: [
        { type: 'Grand Spin Win', time: 'Today, 14:32', amount: 150000, isPositive: true },
        { type: 'Standard Spin', time: 'Today, 14:30', amount: -5000, isPositive: false },
        { type: 'Multiplier Bonus', time: 'Yesterday, 22:15', amount: 25000, isPositive: true }
    ],
    inventory: []
};

// Initialize or Load State from LocalStorage
function loadState() {
    try {
        const saved = localStorage.getItem('dedetoto_user_state');
        if (saved) {
            window.userState = JSON.parse(saved);
        } else {
            window.userState = { ...DEFAULT_USER_STATE };
        }
    } catch (e) {
        window.userState = { ...DEFAULT_USER_STATE };
    }
}

function saveState() {
    try {
        localStorage.setItem('dedetoto_user_state', JSON.stringify(window.userState));
        updateAllUI();
    } catch (e) {
        console.error("Failed to save state", e);
    }
}
window.saveState = saveState;

function addLog(type, amount) {
    const isPositive = amount > 0;
    const now = new Date();
    const timeStr = `Today, ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

    window.userState.activityLogs.unshift({
        type: type,
        time: timeStr,
        amount: amount,
        isPositive: isPositive
    });

    if (window.userState.activityLogs.length > 20) {
        window.userState.activityLogs.pop();
    }
}
window.addLog = addLog;

// Single Page Navigation
function navigateTo(viewId) {
    const views = document.querySelectorAll('.view-section');
    views.forEach(v => v.classList.add('hidden'));

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
        targetView.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update Nav Highlights
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('text-primary-fixed', 'border-b-2', 'border-primary-fixed');
        link.classList.add('text-on-surface-variant/70');
    });

    const activeNav = document.getElementById(`nav-${viewId}`);
    if (activeNav) {
        activeNav.classList.remove('text-on-surface-variant/70');
        activeNav.classList.add('text-primary-fixed', 'border-b-2', 'border-primary-fixed');
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}

// Modal Controls
function openSpinModal() {
    const modal = document.getElementById('spin-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeSpinModal() {
    const modal = document.getElementById('spin-modal');
    if (modal) modal.classList.add('hidden');
}

// Spin & Win Form Logic
function simulateSpin() {
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');

    if (!resultBox || !resultText) return;

    // Loading state
    resultBox.style.borderColor = '#ffd700';
    resultBox.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.2)';
    resultText.innerHTML = '<span class="material-symbols-outlined animate-spin inline-block mr-2">sync</span> Memproses Spin...';
    resultText.style.color = '#d0c6ab';

    setTimeout(() => {
        const rewardAmount = 100000;
        window.userState.balance += rewardAmount;
        addLog('Spin Gratis Reward', rewardAmount);
        saveState();

        resultBox.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
        resultBox.style.borderColor = '#ffd700';
        resultBox.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.4)';
        resultText.innerHTML = '🎉 ANDA MENDAPATKAN: <strong>100,000 KREDIT VIP</strong> 🎉';
        resultText.className = 'font-label-bold text-[14px] text-primary-container text-glow-gold tracking-wider';
    }, 1500);
}

// Reward Store Redemption
function redeemReward(itemName, cost) {
    if (window.userState.balance < cost) {
        alert("Inadequate Entertainment Points! Win more points in the Lobby.");
        return;
    }

    window.userState.balance -= cost;
    window.userState.inventory.push(itemName);
    addLog(`Redeemed ${itemName}`, -cost);
    saveState();

    alert(`🎉 Success! You unlocked: ${itemName}`);
}

// Profile Editing
function saveProfileDossier(e) {
    e.preventDefault();
    const alias = document.getElementById('input-alias').value;
    const fullName = document.getElementById('input-fullname').value;
    const email = document.getElementById('input-email').value;
    const bio = document.getElementById('input-bio').value;

    window.userState.profile.alias = alias;
    window.userState.profile.fullName = fullName;
    window.userState.profile.email = email;
    window.userState.profile.bio = bio;

    saveState();

    const msg = document.getElementById('save-status-msg');
    if (msg) {
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 3000);
    }
}

function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            window.userState.profile.avatar = e.target.result;
            saveState();
        };
        reader.readAsDataURL(file);
    }
}

// Update All Dynamic UI Components
function updateAllUI() {
    const formattedBal = window.userState.balance.toLocaleString();

    // Header Balance
    const headBal = document.getElementById('header-balance');
    if (headBal) headBal.innerText = `${formattedBal} EP`;

    // VIP Balance
    const vipBal = document.getElementById('vip-balance-display');
    if (vipBal) vipBal.innerText = formattedBal;

    // Vault Balance
    const vaultBal = document.getElementById('vault-balance-display');
    if (vaultBal) vaultBal.innerText = formattedBal;

    // Profile EP
    const profEp = document.getElementById('profile-ep-display');
    if (profEp) profEp.innerText = `${(window.userState.balance / 1000).toFixed(0)}k`;

    // Profile Name
    const profName = document.getElementById('profile-display-name');
    if (profName) profName.innerText = window.userState.profile.alias.toUpperCase();

    // Profile Avatar
    const headAvatar = document.getElementById('header-avatar');
    if (headAvatar) headAvatar.src = window.userState.profile.avatar;

    const profAvatar = document.getElementById('profile-avatar-img');
    if (profAvatar) profAvatar.src = window.userState.profile.avatar;

    // Activity Logs Table
    const logContainer = document.getElementById('activity-log-container');
    if (logContainer) {
        logContainer.innerHTML = window.userState.activityLogs.map(log => `
            <div class="flex items-center justify-between p-sm rounded-lg hover:bg-surface-container-high/50 transition-colors border border-transparent hover:border-white/5">
                <div class="flex items-center gap-md">
                    <div class="w-10 h-10 rounded-full ${log.isPositive ? 'bg-primary-container/10 border-primary-fixed/30' : 'bg-surface-container border-white/10'} flex items-center justify-center border">
                        <span class="material-symbols-outlined ${log.isPositive ? 'text-primary-fixed' : 'text-on-surface-variant'} text-lg">
                            ${log.isPositive ? 'celebration' : 'casino'}
                        </span>
                    </div>
                    <div>
                        <p class="font-label-bold text-label-bold text-on-background uppercase">${log.type}</p>
                        <p class="font-body-md text-[14px] text-on-surface-variant">${log.time}</p>
                    </div>
                </div>
                <div class="font-button-text text-button-text ${log.isPositive ? 'text-primary-fixed' : 'text-on-surface-variant'}">
                    ${log.isPositive ? '+' : ''}${log.amount.toLocaleString()} EP
                </div>
            </div>
        `).join('');
    }
}

// Initial Launch
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    updateAllUI();
});
