// Bisa diisi nama panggilanmu supaya jejak pengirimnya muncul
const SENDER_NAME = ""; // contoh: "Zintya"

// Atur detik mulai lagu1.mp3 (0 = dari awal file lagu1.mp3)
const ENDING_MUSIC_START_SEC = 0;

// Jeda tiap kata/angka sebelum bentuk hati terbentuk & lampion mulai naik (dalam milidetik)
const SEQUENCE_STEP_MS = 620;

let userName = "Sahabat Hebat";
const userWishes = [
    { text: "Semoga semua anak bahagia", author: "Teman Kecil" }
];
let lanternInterval = null;
let dialogInterval = null;
let quoteIdx = 0;
let hopeIdx = 0;
let dialogIdx = 0;
let laneIndex = 0;
let sharedAudioCtx = null;

(function applySenderIdentity() {
    if (SENDER_NAME.trim()) {
        const cleanSender = SENDER_NAME.trim();
        document.getElementById('sender-tag').textContent = `DARI ${cleanSender.toUpperCase()} • UNTUK ANAK DI SELURUH DUNIA`;
        document.getElementById('sender-footer').textContent = `Dibuat dengan penuh cinta oleh ${cleanSender} 💛`;
    }
})();

// Buat bintang malam untuk mode ending
(function createNightStars() {
    const worldBg = document.getElementById('world-bg');
    for (let i = 0; i < 64; i++) {
        const s = document.createElement('div');
        s.className = 'twinkle-star';
        const sz = Math.random() * 3.5 + 1.5;
        s.style.width = sz + 'px';
        s.style.height = sz + 'px';
        s.style.top = (Math.random() * 76) + '%';
        s.style.left = (Math.random() * 100) + '%';
        s.style.animationDelay = (Math.random() * 3) + 's';
        worldBg.appendChild(s);
    }
})();

function getKidMessages() {
    return [
        `"Hai ${userName}! Kita mungkin masih kecil di mata dunia, tapi imajinasi, tawa, dan kebaikanmu bisa bikin dunia jadi tempat yang jauh lebih hangat!" 🌟`,
        `"Gak apa-apa kalau langkahmu pelan atau sempat jatuh, ${userName}. Yang penting kamu tetap berani bermimpi dan mencoba lagi!" 🚀`,
        `"Setiap anak punya cerita uniknya sendiri, termasuk kamu, ${userName}. Kamu gak harus jadi orang lain untuk jadi hebat!" 🌈`,
        `"Terima kasih sudah jadi anak yang kuat dan penuh warna hari ini, ${userName}. Peluk hangat untukmu!" 🤗💖`
    ];
}

function getEndingHopes() {
    return [
        `"Untuk ${userName}: semoga kamu tumbuh dengan hati yang lapang, tawa yang merdeka, dan keberanian menjemput masa depan penuh cahaya!" 🌈`,
        `"Semoga kamu gak pernah merasa sendirian saat mengejar mimpimu ya, ${userName}. Langkah kecilmu hari ini awal cerita hebat esok hari!" ⭐`,
        `"Teruslah bermain dengan gembira, belajar dengan rasa ingin tahu, dan menjaga kebaikan hatimu, ${userName}!" 💫`
    ];
}

// Dialog saling sahut antara 2 karakter anak di step akhir
function getEndingBuddyDialogs() {
    return [
        { speaker: "🎈 Teman Balon", text: `Wah, lihat ke langit ${userName}! Hatinya bersinar terang banget! ✨` },
        { speaker: "🍭 Teman Permen", text: `Iyaa! Lampion harapanmu juga ikut naik tinggi! Kamu hebat banget, ${userName}! 🌟` },
        { speaker: "🎈 Teman Balon", text: `Kalau suatu hari kamu capek, ingat ya ${userName}, kami selalu nyemangatin kamu di sini! 💛` },
        { speaker: "🍭 Teman Permen", text: `Betul! Terus berani bermimpi ya ${userName}, Selamat Hari Anak Sedunia! 🤗🎈` }
    ];
}

const defaultLanternPool = [
    { text: "Tawa ceria anak", author: "Anak Dunia" },
    { text: "Mimpi setinggi langit", author: "Sahabatmu" },
    { text: "Dunia penuh damai", author: "Anak Indonesia" },
    { text: "Selalu berani mencoba", author: "Teman Bermain" }
];

function playTone(freq = 587, dur = 0.18) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!sharedAudioCtx) {
            sharedAudioCtx = new AudioCtx();
        }
        if (sharedAudioCtx.state === 'suspended') {
            sharedAudioCtx.resume();
        }
        const osc = sharedAudioCtx.createOscillator();
        const gain = sharedAudioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, sharedAudioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, sharedAudioCtx.currentTime + dur);
        gain.gain.setValueAtTime(0.12, sharedAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, sharedAudioCtx.currentTime + dur);
        osc.connect(gain);
        gain.connect(sharedAudioCtx.destination);
        osc.start();
        osc.stop(sharedAudioCtx.currentTime + dur);
    } catch (err) {}
}

function startEndingMusic() {
    const endingAudio = document.getElementById('audio-ending');
    const btn = document.getElementById('music-toggle');
    btn.classList.remove('hidden');

    endingAudio.volume = 1;

    const playFromOffset = () => {
        try {
            if (ENDING_MUSIC_START_SEC > 0 && endingAudio.duration > ENDING_MUSIC_START_SEC) {
                endingAudio.currentTime = ENDING_MUSIC_START_SEC;
            }
        } catch (e) {}

        endingAudio.play().then(() => {
            btn.textContent = "🎵 lagu1.mp3";
        }).catch(() => {
            btn.textContent = "🔇 Ketuk untuk Putar Lagu";
        });
    };

    if (endingAudio.readyState >= 1) {
        playFromOffset();
    } else {
        endingAudio.addEventListener('loadedmetadata', playFromOffset, { once: true });
        playFromOffset();
    }
}

function handleMusic() {
    const endingAudio = document.getElementById('audio-ending');
    const btn = document.getElementById('music-toggle');

    if (endingAudio.paused) {
        endingAudio.play().catch(() => {});
        btn.textContent = "🎵 lagu1.mp3";
    } else {
        endingAudio.pause();
        btn.textContent = "🔇 Lagu: Dijeda";
    }
}

function updateBuddyChat(speaker, text) {
    const box = document.getElementById('buddy-chat-box');
    document.getElementById('chat-speaker').textContent = speaker;
    document.getElementById('buddy-note').textContent = text;
    box.classList.remove('pop-msg');
    void box.offsetWidth;
    box.classList.add('pop-msg');
}

function cheerCharacter() {
    const dockEl = document.getElementById('companions-dock');
    dockEl.classList.remove('excited');
    void dockEl.offsetWidth;
    dockEl.classList.add('excited');
    playTone(740, 0.16);
    burstSparkles(150, window.innerHeight - 140, 14);

    if (document.body.classList.contains('night-magic')) {
        const dialogs = getEndingBuddyDialogs();
        const pick = dialogs[dialogIdx % dialogs.length];
        dialogIdx++;
        updateBuddyChat(pick.speaker, pick.text);
    } else {
        const casualNotes = [
            { speaker: "🎈 Teman Balon", text: `Aku bawa balon buat nemenin ${userName} hari ini!` },
            { speaker: "🍭 Teman Permen", text: `Permen manis ini buat nyemangatin ${userName}!` }
        ];
        const pick = casualNotes[Math.floor(Math.random() * casualNotes.length)];
        updateBuddyChat(pick.speaker, pick.text);
    }
}

function reactTyping() {
    const mouth = document.getElementById('kid-mouth');
    mouth.setAttribute('d', 'M85 97 Q98 114 111 97 Z');
    setTimeout(() => {
        mouth.setAttribute('d', 'M87 98 Q98 111 109 98 Z');
    }, 220);
}

function startJourney() {
    const rawName = document.getElementById('user-name-input').value.trim();
    if (rawName) {
        userName = rawName;
    }

    document.getElementById('greeting-title').textContent = `Hai ${userName}, Kamu Dirayakan! 💖`;
    document.getElementById('voice-quote').textContent = getKidMessages()[0];
    document.getElementById('tree-title').textContent = `Pohon Harapan ${userName} 🌳`;
    document.getElementById('ending-title').textContent = `Teruslah Bersinar, ${userName}! 🌟`;
    document.getElementById('ending-hope-text').textContent = getEndingHopes()[0];
    document.getElementById('heart-inner-text').textContent = `You Are Awesome, ${userName}!`;

    playTone(523, 0.22);
    updateBuddyChat("🎈 Teman Balon", `Yeay! Selamat datang di taman, ${userName}!`);
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
    burstSparkles(window.innerWidth / 2, window.innerHeight / 2, 42);
}

function cycleQuote() {
    playTone(659, 0.16);
    cheerCharacter();
    const list = getKidMessages();
    quoteIdx = (quoteIdx + 1) % list.length;
    const el = document.getElementById('voice-quote');
    el.style.opacity = 0;
    setTimeout(() => {
        el.textContent = list[quoteIdx];
        el.style.opacity = 1;
    }, 180);
}

function openTreeStep() {
    playTone(784, 0.2);
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('main-stage').classList.add('wide-stage');
    document.getElementById('step-3').classList.remove('hidden');
    updateBuddyChat("🍭 Teman Permen", `Yuk gantung harapanmu di pohon yang luas ini, ${userName}!`);
}

const lanternPalette = ['#FFD166', '#FF8FA3', '#90E0EF', '#C77DFF', '#B5E48C', '#FFB703'];

// Slot titik gantung tersebar rapi di tajuk pohon agar tidak numpuk
const treeAnchorSlots = [
    { top: 44, left: 225 },
    { top: 96, left: 84 },
    { top: 102, left: 248 },
    { top: 146, left: 152 },
    { top: 68, left: 165 },
    { top: 154, left: 66 },
    { top: 152, left: 262 }
];

function showLanternMsg(msg) {
    const box = document.getElementById('lantern-modal');
    box.textContent = "🌟 Harapan di Pohon: \"" + msg + "\"";
    playTone(698, 0.14);
}

function addLantern() {
    const input = document.getElementById('wish-input');
    const val = input.value.trim();
    if (!val) {
        showLanternMsg(`Tulis dulu harapanmu di kotak sebelah kanan ya, ${userName}!`);
        return;
    }

    userWishes.push({ text: val, author: userName });
    playTone(880, 0.22);
    updateBuddyChat("🎈 Teman Balon", `Wah, harapan yang indah dari ${userName}! ✨`);

    const zone = document.getElementById('lantern-zone');
    const item = document.createElement('div');
    item.className = 'wish-lantern';

    const slot = treeAnchorSlots[(userWishes.length - 2) % treeAnchorSlots.length];
    const top = slot.top + (Math.random() * 12 - 6);
    const left = slot.left + (Math.random() * 14 - 7);
    const bg = lanternPalette[Math.floor(Math.random() * lanternPalette.length)];

    item.style.top = top + 'px';
    item.style.left = left + 'px';
    item.style.background = bg;
    item.style.animationDelay = `0s, ${(Math.random() * 1.4).toFixed(2)}s`;
    item.textContent = `🌟 ${val}`;
    item.onclick = () => showLanternMsg(`${val} — Harapan dari ${userName}`);

    zone.appendChild(item);
    input.value = '';
    document.getElementById('wish-counter').textContent = `${userWishes.length} harapan tergantung`;
    showLanternMsg(`"${val}" dari ${userName} — Sudah menggantung indah di Pohon Harapan!`);
    burstSparkles(window.innerWidth * 0.4, window.innerHeight * 0.45, 30);
}

/* Gambar Bentuk Hati Berkilau di Canvas */
let heartAnimFrame = null;

function startGlowingHeartCanvas() {
    const hCanvas = document.getElementById('heart-canvas');
    const hCtx = hCanvas.getContext('2d');
    const w = hCanvas.width;
    const h = hCanvas.height;
    const heartDots = [];

    for (let i = 0; i < 180; i++) {
        const t = (i / 180) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        heartDots.push({
            baseX: w / 2 + x * 9.5,
            baseY: h / 2 + y * 9.5 - 10,
            phase: Math.random() * Math.PI * 2,
            size: Math.random() * 3.2 + 2,
            color: i % 3 === 0 ? '#FFD166' : (i % 2 === 0 ? '#FF6B8B' : '#FF8FA3')
        });
    }

    let tick = 0;
    function renderHeart() {
        tick += 0.04;
        hCtx.clearRect(0, 0, w, h);

        heartDots.forEach((d) => {
            const pulse = 1 + Math.sin(tick + d.phase) * 0.045;
            const px = w / 2 + (d.baseX - w / 2) * pulse;
            const py = h / 2 + (d.baseY - h / 2) * pulse;

            hCtx.save();
            hCtx.globalAlpha = 0.72 + Math.sin(tick * 1.4 + d.phase) * 0.25;
            hCtx.fillStyle = d.color;
            hCtx.shadowColor = d.color;
            hCtx.shadowBlur = 12;
            hCtx.beginPath();
            hCtx.arc(px, py, d.size, 0, Math.PI * 2);
            hCtx.fill();
            hCtx.restore();
        });

        heartAnimFrame = requestAnimationFrame(renderHeart);
    }
    if (!heartAnimFrame) renderHeart();
}

/* Sekuens Malam: 3 -> 2 -> 1 -> Selamat -> Hari -> Anak -> Sedunia -> Hati + Lampion */
function prepareGrandFinale() {
    playTone(587, 0.22);
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('main-stage').classList.remove('wide-stage');
    document.body.classList.add('night-magic');

    // Mulai lagu1.mp3 tepat saat masuk sekuens akhir
    startEndingMusic();

    const seqLayer = document.getElementById('finale-sequence');
    const wordEl = document.getElementById('sequence-word');
    seqLayer.classList.remove('hidden');

    updateBuddyChat("🎈 Teman Balon", `Sstt... lihat ke langit malam, ${userName}! ✨`);

    const sequenceSteps = ["3", "2", "1", "Selamat", "Hari", "Anak", "Sedunia"];
    let idx = 0;

    function showNextWord() {
        if (idx >= sequenceSteps.length) {
            wordEl.classList.remove('show-word');
            setTimeout(() => {
                wordEl.classList.add('hidden');
                revealHeartAndLanterns();
            }, 240);
            return;
        }

        wordEl.classList.remove('show-word');
        setTimeout(() => {
            wordEl.textContent = sequenceSteps[idx];
            wordEl.classList.add('show-word');
            playTone(idx < 3 ? 523 + idx * 65 : 698 + (idx - 3) * 55, 0.16);
            burstSparkles(window.innerWidth * 0.56, window.innerHeight * 0.45, 18);
            idx++;
            setTimeout(showNextWord, SEQUENCE_STEP_MS);
        }, 140);
    }

    showNextWord();
}

function revealHeartAndLanterns() {
    const heartBox = document.getElementById('heart-showcase');
    heartBox.classList.remove('hidden');
    startGlowingHeartCanvas();

    requestAnimationFrame(() => {
        heartBox.classList.add('heart-active');
    });

    // Begitu hati terbentuk & bertahan, lampion ikut naik dan kartu ending + obrolan 2 anak aktif
    playTone(1046, 0.28);
    document.getElementById('step-4').classList.remove('hidden');
    launchSkyLanternWave();
    triggerGrandFireworks();

    // Mulai dialog bergantian 2 karakter anak
    const dialogs = getEndingBuddyDialogs();
    updateBuddyChat(dialogs[0].speaker, dialogs[0].text);
    dialogIdx = 1;

    if (!dialogInterval) {
        dialogInterval = setInterval(() => {
            if (document.body.classList.contains('night-magic')) {
                const list = getEndingBuddyDialogs();
                const current = list[dialogIdx % list.length];
                dialogIdx++;
                updateBuddyChat(current.speaker, current.text);
            }
        }, 4400);
    }

    if (!lanternInterval) {
        lanternInterval = setInterval(() => {
            if (document.body.classList.contains('night-magic')) {
                const personalizedDefaults = defaultLanternPool.map((item, idx) =>
                    idx === 0 ? { text: "Tetap semangat & bahagia!", author: userName } : item
                );
                const pool = [...userWishes, ...personalizedDefaults];
                const pick = pool[Math.floor(Math.random() * pool.length)];
                spawnSingleSkyLantern(pick);
            }
        }, 2900);
    }
}

// Jalur lampion di sisi tengah-kanan agar tidak menutupi kartu kiri
function spawnSingleSkyLantern(wishObj) {
    const layer = document.getElementById('sky-lanterns-layer');
    const lantern = document.createElement('div');
    lantern.className = 'sky-lantern';

    const lanes = [42, 56, 70, 82];
    const baseLeft = lanes[laneIndex % lanes.length];
    laneIndex++;
    const leftPercent = baseLeft + (Math.random() * 4 - 2);
    const duration = 11 + Math.random() * 4;
    const driftX = (Math.random() - 0.5) * 42;

    lantern.style.left = leftPercent + 'vw';
    lantern.style.setProperty('--drift-x', driftX + 'px');
    lantern.style.animationDuration = duration + 's';

    const dome = document.createElement('div');
    dome.className = 'lantern-dome';

    const wishSpan = document.createElement('span');
    wishSpan.textContent = `🏮 "${wishObj.text}"`;

    const authorSpan = document.createElement('span');
    authorSpan.className = 'lantern-author';
    authorSpan.textContent = `— ${wishObj.author}`;

    dome.appendChild(wishSpan);
    dome.appendChild(authorSpan);

    const flame = document.createElement('div');
    flame.className = 'lantern-flame';

    lantern.appendChild(dome);
    lantern.appendChild(flame);
    layer.appendChild(lantern);

    setTimeout(() => {
        lantern.remove();
    }, duration * 1000 + 300);
}

function launchSkyLanternWave() {
    playTone(784, 0.2);

    const personalizedDefaults = defaultLanternPool.map((item, idx) =>
        idx === 0 ? { text: "Tetap semangat & bahagia!", author: userName } : item
    );

    const pool = [...userWishes, ...personalizedDefaults];
    const count = Math.min(6, Math.max(4, pool.length));
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const pick = pool[i % pool.length];
            spawnSingleSkyLantern(pick);
        }, i * 650);
    }
}

function cycleEndingHope() {
    playTone(659, 0.16);
    const list = getEndingHopes();
    hopeIdx = (hopeIdx + 1) % list.length;
    const el = document.getElementById('ending-hope-text');
    el.style.opacity = 0;
    setTimeout(() => {
        el.textContent = list[hopeIdx];
        el.style.opacity = 1;
    }, 180);
}

function sendWarmHug() {
    playTone(880, 0.24);
    const hugBox = document.getElementById('hug-box');
    hugBox.style.display = 'block';
    hugBox.textContent = `🤗 Pelukan hangat tersimpan untuk ${userName}! Selamat Hari Anak Sedunia 💖`;
    burstSparkles(window.innerWidth * 0.58, window.innerHeight * 0.44, 34);
}

function triggerGrandFireworks() {
    for (let b = 0; b < 3; b++) {
        setTimeout(() => {
            const fx = canvas.width * (0.48 + Math.random() * 0.36);
            const fy = canvas.height * (0.18 + Math.random() * 0.28);
            burstSparkles(fx, fy, 42);
        }, b * 550);
    }
}

/* Sistem Kilau Sentuhan & Kembang Api */
const canvas = document.getElementById('magic-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const palette = ['#FF6B6B', '#FFD166', '#80ED99', '#72EFDD', '#C77DFF', '#FFB703', '#FFFFFF'];

window.addEventListener('pointermove', (e) => {
    if (Math.random() > 0.55) return;
    particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.3,
        vy: (Math.random() - 0.5) * 1.3 - 0.5,
        size: Math.random() * 4 + 2,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 0.85,
        gravity: 0.015,
        fade: 0.022
    });
});

function burstSparkles(x, y, count) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6.5 + 1.8;
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.6,
            size: Math.random() * 5 + 2.5,
            color: palette[Math.floor(Math.random() * palette.length)],
            alpha: 1,
            gravity: 0.13,
            fade: 0.014
        });
    }
}

function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.fade;

        if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    requestAnimationFrame(renderParticles);
}
renderParticles();

// Dukungan tombol Enter di kolom nama
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('user-name-input');
    nameInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') startJourney();
    });
});
