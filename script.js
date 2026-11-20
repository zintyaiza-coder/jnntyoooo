// Bisa kamu isi nama panggilanmu di sini supaya jejak pengirimnya makin terasa
const SENDER_NAME = ""; // contoh: "Zintya"

let userName = "Sahabat Hebat";
let currentTrack = "none";
const userWishes = [
    { text: "Semoga semua anak bahagia", author: "Teman Kecil" }
];
let lanternInterval = null;
let quoteIdx = 0;
let hopeIdx = 0;
let laneIndex = 0;

(function applySenderIdentity() {
    if (SENDER_NAME.trim()) {
        const cleanSender = SENDER_NAME.trim();
        document.getElementById('sender-tag').textContent = `DARI ${cleanSender.toUpperCase()} • UNTUK ANAK DI SELURUH DUNIA`;
        document.getElementById('sender-footer').textContent = `Dibuat dengan penuh cinta oleh ${cleanSender} untuk anak-anak hebat 💛`;
        document.getElementById('ending-sender').textContent = `Pelukan hangat dari ${cleanSender} untukmu — kita bertaut dalam harapan 💫`;
    }
})();

// Buat bintang malam untuk mode ending
(function createNightStars() {
    const worldBg = document.getElementById('world-bg');
    for (let i = 0; i < 52; i++) {
        const s = document.createElement('div');
        s.className = 'twinkle-star';
        const sz = Math.random() * 3.5 + 1.5;
        s.style.width = sz + 'px';
        s.style.height = sz + 'px';
        s.style.top = (Math.random() * 72) + '%';
        s.style.left = (Math.random() * 100) + '%';
        s.style.animationDelay = (Math.random() * 2.5) + 's';
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
        `"Untuk ${userName} dan semua anak: semoga kalian tumbuh dengan hati yang lapang, tawa yang merdeka, dan keberanian menjemput masa depan penuh cahaya!" 🌈💫`,
        `"Harapanku untukmu, ${userName}: semoga kamu gak pernah merasa sendirian saat mengejar mimpimu. Kami di sini menemani dengan balon dan permen manis!" 🎈🍭`,
        `"Teruslah bermain dengan gembira, belajar dengan rasa ingin tahu, dan menjaga kebaikan hatimu ya, ${userName}. Langkah kecilmu hari ini awal cerita hebat esok hari!" ⭐🌱`
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
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, ctx.currentTime + dur);
        gain.gain.setValueAtTime(0.14, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
    } catch (err) {}
}

function fadeOutAndSwitch(fromAudio, toAudio, trackName) {
    const btn = document.getElementById('music-toggle');
    currentTrack = trackName;

    const startTarget = () => {
        if (!toAudio.querySelector('source')) {
            btn.textContent = trackName === 'bertaut'
                ? "🎵 Bertaut (Isi MP3 di HTML)"
                : "🎵 Semua Aku Dirayakan (Isi MP3 di HTML)";
            return;
        }
        toAudio.volume = 1;
        toAudio.play().then(() => {
            btn.textContent = trackName === 'bertaut'
                ? "🎵 Memutar: Bertaut"
                : "🎵 Memutar: Semua Aku Dirayakan";
        }).catch(() => {
            btn.textContent = "🔇 Klik untuk Putar Lagu";
        });
    };

    if (!fromAudio || fromAudio.paused) {
        startTarget();
        return;
    }

    let vol = fromAudio.volume;
    const fadeTimer = setInterval(() => {
        vol = Math.max(0, vol - 0.12);
        fromAudio.volume = vol;
        if (vol <= 0.05) {
            clearInterval(fadeTimer);
            fromAudio.pause();
            fromAudio.currentTime = 0;
            fromAudio.volume = 1;
            startTarget();
        }
    }, 90);
}

function playTrack(trackName) {
    const celebrateAudio = document.getElementById('audio-celebrate');
    const bertautAudio = document.getElementById('audio-bertaut');
    if (trackName === 'bertaut') {
        fadeOutAndSwitch(celebrateAudio, bertautAudio, 'bertaut');
    } else {
        fadeOutAndSwitch(bertautAudio, celebrateAudio, 'celebrate');
    }
}

function handleMusic() {
    const celebrateAudio = document.getElementById('audio-celebrate');
    const bertautAudio = document.getElementById('audio-bertaut');
    const activeAudio = currentTrack === 'bertaut' ? bertautAudio : celebrateAudio;

    if (!activeAudio.querySelector('source')) {
        alert("Lagu belum dipasang — isi file MP3 di tag <audio> pada index.html ya! 🎵");
        return;
    }

    if (activeAudio.paused) {
        activeAudio.play().catch(() => {});
        document.getElementById('music-toggle').textContent = currentTrack === 'bertaut'
            ? "🎵 Memutar: Bertaut"
            : "🎵 Memutar: Semua Aku Dirayakan";
    } else {
        activeAudio.pause();
        document.getElementById('music-toggle').textContent = "🔇 Lagu: Dijeda";
    }
}

function cheerCharacter() {
    const dockEl = document.getElementById('companions-dock');
    dockEl.classList.remove('excited');
    void dockEl.offsetWidth;
    dockEl.classList.add('excited');
    playTone(740, 0.16);
    burstSparkles(150, window.innerHeight - 140, 16);

    const notes = [
        `🎈 Aku bawa balon & temanku bawa permen buat nemenin ${userName}!`,
        `🍭 Manisnya permen ini buat nyemangatin ${userName} hari ini!`,
        `🏮 Lihat ke kanan atas, ${userName}—lampion harapanmu terbang tinggi!`
    ];
    document.getElementById('buddy-note').textContent = notes[Math.floor(Math.random() * notes.length)];
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
    document.getElementById('buddy-note').textContent = `🎈 Aku bawa balon & temanku bawa permen buat nemenin ${userName}!`;
    document.getElementById('ending-title').textContent = `Teruslah Bersinar, ${userName}! 🌟`;
    document.getElementById('ending-hope-label').textContent = `✨ Pesan Semangat & Harapan Untuk ${userName} ✨`;
    document.getElementById('ending-hope-text').textContent = getEndingHopes()[0];

    playTone(523, 0.22);
    cheerCharacter();
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
    burstSparkles(window.innerWidth / 2, window.innerHeight / 2, 48);

    playTrack('celebrate');
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
    }, 160);
}

function openTreeStep() {
    playTone(784, 0.2);
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.remove('hidden');
}

const lanternPalette = ['#FFD166', '#FF8FA3', '#90E0EF', '#C77DFF', '#B5E48C', '#FFB703'];

function showLanternMsg(msg) {
    const box = document.getElementById('lantern-modal');
    box.style.display = 'block';
    box.textContent = "🌟 Harapan di Pohon: \"" + msg + "\"";
    playTone(698, 0.14);
}

function addLantern() {
    const input = document.getElementById('wish-input');
    const val = input.value.trim();
    if (!val) {
        showLanternMsg(`Yuk tulis dulu harapanmu di kotak sebelum digantung, ${userName}!`);
        return;
    }

    userWishes.push({ text: val, author: userName });
    playTone(880, 0.22);
    cheerCharacter();

    const zone = document.getElementById('lantern-zone');
    const item = document.createElement('div');
    item.className = 'wish-lantern';

    const top = Math.floor(Math.random() * 98) + 8;
    const left = Math.floor(Math.random() * 138) + 8;
    const bg = lanternPalette[Math.floor(Math.random() * lanternPalette.length)];

    item.style.top = top + 'px';
    item.style.left = left + 'px';
    item.style.background = bg;
    item.style.animationDelay = (Math.random() * 1.5) + 's, 0s';
    item.textContent = `🌟 ${val} (${userName})`;
    item.onclick = () => showLanternMsg(`${val} — Harapan dari ${userName}`);

    zone.appendChild(item);
    input.value = '';
    showLanternMsg(`"${val}" dari ${userName} — Sudah menggantung indah di Pohon Harapan!`);
    burstSparkles(window.innerWidth / 2, window.innerHeight * 0.45, 32);
}

function prepareGrandFinale() {
    playTone(587, 0.22);
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('step-transition').classList.remove('hidden');
    document.getElementById('transition-text').textContent =
        `Langit mulai bertabur bintang untuk ${userName}, lampion-lampion disalakan, dan nadanya berubah pelan agar kita bisa merasakan kehangatan yang saling bertaut...`;

    document.body.classList.add('night-magic');
    playTrack('bertaut');

    setTimeout(() => {
        document.getElementById('step-transition').classList.add('hidden');
        goGrandFinale();
    }, 2400);
}

// Lampion diarahkan naik di area tengah sampai kanan (46vw - 81vw) agar tidak tertumpuk kartu kiri
function spawnSingleSkyLantern(wishObj) {
    const layer = document.getElementById('sky-lanterns-layer');
    const lantern = document.createElement('div');
    lantern.className = 'sky-lantern';

    const lanes = [46, 58, 70, 81];
    const baseLeft = lanes[laneIndex % lanes.length];
    laneIndex++;
    const leftPercent = baseLeft + (Math.random() * 4 - 2);
    const duration = 10.5 + Math.random() * 4.5;
    const driftX = (Math.random() - 0.5) * 45;

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
    cheerCharacter();

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
    cheerCharacter();
    const list = getEndingHopes();
    hopeIdx = (hopeIdx + 1) % list.length;
    const el = document.getElementById('ending-hope-text');
    el.style.opacity = 0;
    setTimeout(() => {
        el.textContent = list[hopeIdx];
        el.style.opacity = 1;
    }, 160);
}

function sendWarmHug() {
    playTone(880, 0.24);
    cheerCharacter();
    const hugBox = document.getElementById('hug-box');
    hugBox.style.display = 'block';
    hugBox.textContent = `🤗 Pelukan hangat sudah tersimpan di hati untuk ${userName}! Selamat Hari Anak, kamu berharga! 💖`;
    burstSparkles(window.innerWidth * 0.65, window.innerHeight * 0.45, 36);
}

function goGrandFinale() {
    playTone(1046, 0.28);
    document.getElementById('step-4').classList.remove('hidden');
    document.body.classList.add('night-magic');
    cheerCharacter();
    launchSkyLanternWave();
    triggerGrandFireworks();

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
        }, 2800);
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
    if (Math.random() > 0.5) return;
    particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4 - 0.5,
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
        const speed = Math.random() * 7 + 1.8;
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.8,
            size: Math.random() * 5.5 + 2.5,
            color: palette[Math.floor(Math.random() * palette.length)],
            alpha: 1,
            gravity: 0.14,
            fade: 0.014
        });
    }
}

function triggerGrandFireworks() {
    for (let b = 0; b < 4; b++) {
        setTimeout(() => {
            playTone(440 + b * 120, 0.2);
            const fx = canvas.width * (0.5 + Math.random() * 0.4);
            const fy = canvas.height * (0.16 + Math.random() * 0.34);
            burstSparkles(fx, fy, 50);
        }, b * 480);
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
