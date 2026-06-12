// DOM Elements
const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
const dayEl = document.getElementById('day');
const themeToggle = document.getElementById('theme-toggle');
const timezoneSelect = document.getElementById('timezone-select');
const addZoneBtn = document.getElementById('add-zone-btn');
const worldClocksList = document.getElementById('world-clocks');
const alarmTimeInput = document.getElementById('alarm-time');
const addAlarmBtn = document.getElementById('add-alarm-btn');
const alarmsListEl = document.getElementById('alarms-list');
const alarmOverlay = document.getElementById('alarm-overlay');
const stopAlarmBtn = document.getElementById('stop-alarm');

// State
let worldZones = JSON.parse(localStorage.getItem('worldZones')) || [];
let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
let isLightMode = localStorage.getItem('theme') === 'light';

// Initialize
if (isLightMode) document.body.classList.add('light-mode');
renderWorldClocks();
renderAlarms();

// --- Clock Engine ---
function updateClock() {
    const now = new Date();
    
    // Local Time
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    clockEl.textContent = now.toLocaleTimeString('en-GB', timeOptions);
    
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    dateEl.textContent = now.toLocaleDateString('en-GB', dateOptions).replace(/\//g, ' / ');
    
    const dayOptions = { weekday: 'long' };
    dayEl.textContent = now.toLocaleDateString('en-GB', dayOptions).toUpperCase();

    // Check Alarms
    const currentTimeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    checkAlarms(currentTimeStr);

    // Update World Clocks
    updateWorldClocksUI();
}

setInterval(updateClock, 1000);
updateClock();

// --- World Clocks ---
function renderWorldClocks() {
    worldClocksList.innerHTML = '';
    worldZones.forEach((zone, index) => {
        const div = document.createElement('div');
        div.className = 'world-clock-item';
        div.innerHTML = `
            <div class="world-clock-info">
                <div class="city">${zone.split('/').pop().replace('_', ' ')}</div>
                <div class="time" data-zone="${zone}">--:--:--</div>
            </div>
            <button class="btn-neon" onclick="removeZone(${index})">×</button>
        `;
        worldClocksList.appendChild(div);
    });
}

function updateWorldClocksUI() {
    const timeEls = document.querySelectorAll('.world-clock-item .time');
    const now = new Date();
    timeEls.forEach(el => {
        const zone = el.getAttribute('data-zone');
        try {
            const timeStr = now.toLocaleTimeString('en-GB', {
                timeZone: zone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            el.textContent = timeStr;
        } catch (e) {
            el.textContent = 'Invalid Zone';
        }
    });
}

addZoneBtn.addEventListener('click', () => {
    const zone = timezoneSelect.value;
    if (zone && !worldZones.includes(zone)) {
        worldZones.push(zone);
        localStorage.setItem('worldZones', JSON.stringify(worldZones));
        renderWorldClocks();
    }
});

window.removeZone = (index) => {
    worldZones.splice(index, 1);
    localStorage.setItem('worldZones', JSON.stringify(worldZones));
    renderWorldClocks();
};

// --- Alarms ---
function renderAlarms() {
    alarmsListEl.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const div = document.createElement('div');
        div.className = 'alarm-item';
        div.innerHTML = `
            <div class="alarm-time">${alarm}</div>
            <button class="btn-neon" onclick="removeAlarm(${index})">DELETE</button>
        `;
        alarmsListEl.appendChild(div);
    });
}

addAlarmBtn.addEventListener('click', () => {
    const time = alarmTimeInput.value;
    if (time && !alarms.includes(time)) {
        alarms.push(time);
        localStorage.setItem('alarms', JSON.stringify(alarms));
        renderAlarms();
    }
});

window.removeAlarm = (index) => {
    alarms.splice(index, 1);
    localStorage.setItem('alarms', JSON.stringify(alarms));
    renderAlarms();
};

function checkAlarms(currentTime) {
    if (alarms.includes(currentTime)) {
        alarmOverlay.classList.remove('hidden');
        // Optional: play sound here
    }
}

stopAlarmBtn.addEventListener('click', () => {
    alarmOverlay.classList.add('hidden');
});

// --- Theme Toggle ---
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
