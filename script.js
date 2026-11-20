// Bisa diisi nama panggilanmu supaya jejak pengirimnya muncul
const SENDER_NAME = ""; // contoh: "Zintya"

// =========================================================================
// PENGATURAN SINKRONISASI DETIK LAGU (lagu1.mp3)
// =========================================================================
const ENDING_MUSIC_START_SEC = 0;
const HEART_APPEAR_AT_SEC = 9.2;
const LANTERNS_RISE_AT_SEC = 11.4;
// =========================================================================

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

// Deteksi otomatis apakah perangkat saat ini HP atau Laptop/Desktop
function isMobileDevice() {
    const byWidth = window.innerWidth <= 768;
    const byUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const byPortraitNarrow = window.innerWidth < 860 && window.innerHeight > window.innerWidth;
    return byWidth || (byUA && byPortraitNarrow);
}

function syncDeviceLayoutMode() {
    const mobile = isMobileDevice();
    document.body.classList.toggle('device-mobile', mobile);
    document.body.classList.toggle('device-desktop', !mobile);
}

syncDeviceLayoutMode();
window.addEventListener('resize', syncDeviceLayoutMode);
window.addEventListener('orientationchange', syncDeviceLayoutMode);

(function applySenderIdentity() {
    if (SENDER_NAME.trim()) {
        const cleanSender = SENDER_NAME.trim();
        document.getElementById('sender-tag').textContent = `DARI ${cleanSender.toUpperCase()} • UNTUK ANAK DI SELURUH DUNIA`;
        document.getElementById('sender-footer').textContent = `Dibuat dengan penuh cinta oleh ${cleanSender} 💛`;
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

function getEndingBuddyDialogs() {
    return [
        { speaker: "🎈 Teman Balon", text: `Wah, lihat ke langit ${userName}! Kunang-kunangnya merajut hati yang bersinar! ✨` },
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

/* =========================================================================
   EFEK HUJAN BINTANG JATUH + KUNANG-KUNANG BESAR & JELAS (3-2-1-SELAMAT-HARI-ANAK-SEDUNIA -> HATI)
   ========================================================================= */
let fireflyAnimId = null;
const fireflies = [];
const starRainStreams = [];
let morphMode = 'scatter'; // 'scatter' | 'word' | 'heart'

function getCenterTarget() {
    const mobile = isMobileDevice();
    return {
        cx: mobile ? window.innerWidth * 0.5 : window.innerWidth * 0.58,
        cy: mobile ? window.innerHeight * 0.56 : window.innerHeight * 0.45
    };
}

function sampleTextPoints(word) {
    const off = document.createElement('canvas');
    const oCtx = off.getContext('2d');
    const mobile = isMobileDevice();
    const w = Math.min(820, Math.floor(window.innerWidth * (mobile ? 0.94 : 0.86)));
    const h = 230;
    off.width = w;
    off.height = h;

    // Ukuran diperbesar agar 3-2-1-Selamat-Hari-Anak-Sedunia lebih gagah & mudah dibaca
    const fontSize = mobile
        ? (word.length === 1 ? 132 : (word.length <= 4 ? 92 : 68))
        : (word.length === 1 ? 176 : (word.length <= 4 ? 138 : 106));

    oCtx.fillStyle = '#FFFFFF';
    oCtx.font = `700 ${fontSize}px Fredoka, sans-serif`;
    oCtx.textAlign = 'center';
    oCtx.textBaseline = 'middle';
    oCtx.fillText(word, w / 2, h / 2);

    const imgData = oCtx.getImageData(0, 0, w, h).data;
    const pts = [];
    const gap = word.length === 1 ? 4 : 3.5;

    for (let y = 0; y < h; y += Math.ceil(gap)) {
        for (let x = 0; x < w; x += Math.ceil(gap)) {
            const alpha = imgData[(y * w + x) * 4 + 3];
            if (alpha > 120) {
                pts.push({ x: x - w / 2, y: y - h / 2 });
            }
        }
    }
    return pts;
}

function sampleHeartPoints() {
    const pts = [];
    const mobile = isMobileDevice();
    const scale = mobile ? 9.8 : 13.4;

    // 4 lapisan cincin hati agar bentuk hati kunang-kunang terlihat tebal dan bercahaya jelas
    const rings = [0.88, 0.96, 1.04, 1.12];
    rings.forEach((ringScale, rIdx) => {
        const steps = 115 + rIdx * 18;
        for (let i = 0; i < steps; i++) {
            const t = (i / steps) * Math.PI * 2;
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            pts.push({
                x: hx * scale * ringScale + (Math.random() - 0.5) * 6,
                y: hy * scale * ringScale - 12 + (Math.random() - 0.5) * 6
            });
        }
    });
    return pts;
}

function initFireflyMorphEngine() {
    const fCanvas = document.getElementById('firefly-morph-canvas');
    const fCtx = fCanvas.getContext('2d');

    function syncSize() {
        fCanvas.width = window.innerWidth;
        fCanvas.height = window.innerHeight;
        syncDeviceLayoutMode();
    }
    syncSize();
    window.addEventListener('resize', syncSize);

    // 1. Hujan bintang jatuh lembut di latar malam (lebih halus agar tidak menutupi teks/hati)
    starRainStreams.length = 0;
    const colCount = Math.floor(window.innerWidth / 34);
    for (let c = 0; c < colCount; c++) {
        starRainStreams.push({
            x: c * 34 + Math.random() * 16,
            y: Math.random() * -window.innerHeight,
            speed: 1.2 + Math.random() * 1.7,
            length: 3 + Math.floor(Math.random() * 4),
            phase: Math.random() * Math.PI * 2
        });
    }

    // 2. Kunang-kunang diperbanyak & diperjelas ukurannya
    fireflies.length = 0;
    const totalFlies = 540;
    for (let i = 0; i < totalFlies; i++) {
        fireflies.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            tx: window.innerWidth * 0.58,
            ty: window.innerHeight * 0.45,
            active: false,
            size: Math.random() * 2.2 + 2.4,
            phase: Math.random() * Math.PI * 2,
            isPink: i % 2 === 0
        });
    }

    let tick = 0;
    function drawStarShape(ctx, cx, cy, r, alpha, color) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        for (let k = 0; k < 4; k++) {
            const ang = (k * Math.PI) / 2;
            const ox = cx + Math.cos(ang) * r;
            const oy = cy + Math.sin(ang) * r;
            const ix = cx + Math.cos(ang + Math.PI / 4) * (r * 0.32);
            const iy = cy + Math.sin(ang + Math.PI / 4) * (r * 0.32);
            if (k === 0) ctx.moveTo(ox, oy);
            else ctx.lineTo(ox, oy);
            ctx.lineTo(ix, iy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawFireflyGlow(ctx, x, y, radius, alpha, color, isFormed) {
        ctx.save();
        ctx.globalAlpha = alpha;

        // Aura cahaya kunang-kunang
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = isFormed ? 18 : 12;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Inti terang di tengah supaya bentuk huruf & hati lebih tegas
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFDF9';
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.46, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function loopMorph() {
        tick += 0.045;
        fCtx.clearRect(0, 0, fCanvas.width, fCanvas.height);

        // Hujan bintang jatuh
        starRainStreams.forEach((st) => {
            st.y += st.speed;
            if (st.y - st.length * 20 > fCanvas.height) {
                st.y = -20;
                st.x = Math.random() * fCanvas.width;
            }
            for (let s = 0; s < st.length; s++) {
                const sy = st.y - s * 20;
                if (sy < -10 || sy > fCanvas.height + 10) continue;
                const fade = (1 - s / st.length) * (0.28 + 0.22 * Math.sin(tick + st.phase + s));
                const starColor = s === 0 ? '#FFFDF7' : (s % 2 === 0 ? '#FFD166' : '#FF8FA3');
                drawStarShape(fCtx, st.x, sy, s === 0 ? 3.8 : 2.6, Math.max(0.05, fade), starColor);
            }
        });

        // Kunang-kunang
        const { cx, cy } = getCenterTarget();
        const heartBeat = morphMode === 'heart' ? (1 + Math.sin(tick * 1.4) * 0.035) : 1;

        fireflies.forEach((f) => {
            if (morphMode === 'scatter' || !f.active) {
                f.vx += (Math.random() - 0.5) * 0.25;
                f.vy += (Math.random() - 0.5) * 0.25;
                f.vx *= 0.96;
                f.vy *= 0.96;
                f.x += f.vx;
                f.y += f.vy;

                if (f.x < 0) f.x = fCanvas.width;
                if (f.x > fCanvas.width) f.x = 0;
                if (f.y < 0) f.y = fCanvas.height;
                if (f.y > fCanvas.height) f.y = 0;
            } else {
                const goalX = cx + (f.tx - cx) * heartBeat + Math.sin(tick * 1.6 + f.phase) * 1.4;
                const goalY = cy + (f.ty - cy) * heartBeat + Math.cos(tick * 1.5 + f.phase) * 1.4;
                f.x += (goalX - f.x) * 0.12;
                f.y += (goalY - f.y) * 0.12;
            }

            const glowAlpha = f.active
                ? (0.82 + Math.sin(tick * 2.2 + f.phase) * 0.18)
                : (0.52 + Math.sin(tick * 2.0 + f.phase) * 0.28);

            let flyColor = '#FFF3B0';
            if (morphMode === 'heart' && f.active) {
                flyColor = f.isPink ? '#FF6B8B' : '#FFD166';
            } else if (f.active) {
                flyColor = f.isPink ? '#FF8FA3' : '#FFD166';
            }

            const drawRadius = f.active ? f.size * 1.25 : f.size;
            drawFireflyGlow(fCtx, f.x, f.y, drawRadius, Math.max(0.18, glowAlpha), flyColor, f.active);
        });

        fireflyAnimId = requestAnimationFrame(loopMorph);
    }

    if (!fireflyAnimId) loopMorph();
}

function morphFirefliesToWord(word) {
    const { cx, cy } = getCenterTarget();
    const pts = sampleTextPoints(word);
    morphMode = 'word';

    const glowEl = document.getElementById('word-backdrop-glow');
    if (glowEl) {
        glowEl.style.left = cx + 'px';
        glowEl.style.top = cy + 'px';
        glowEl.textContent = word;
        glowEl.classList.remove('hidden');
        requestAnimationFrame(() => glowEl.classList.add('active-glow'));
    }

    const innerHeartText = document.getElementById('heart-inner-text');
    if (innerHeartText) {
        innerHeartText.style.left = cx + 'px';
        innerHeartText.style.top = cy + 'px';
    }

    fireflies.forEach((f, idx) => {
        if (idx < pts.length) {
            f.active = true;
            f.tx = cx + pts[idx].x;
            f.ty = cy + pts[idx].y;
        } else {
            f.active = false;
        }
    });
}

function scatterFirefliesBurst() {
    morphMode = 'scatter';
    const glowEl = document.getElementById('word-backdrop-glow');
    if (glowEl) {
        glowEl.classList.remove('active-glow');
        setTimeout(() => glowEl.classList.add('hidden'), 220);
    }

    fireflies.forEach((f) => {
        if (f.active) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 4 + Math.random() * 8;
            f.vx = Math.cos(ang) * spd;
            f.vy = Math.sin(ang) * spd;
        }
        f.active = false;
    });
}

function morphFirefliesToHeart() {
    const { cx, cy } = getCenterTarget();
    const pts = sampleHeartPoints();
    morphMode = 'heart';

    const innerHeartText = document.getElementById('heart-inner-text');
    if (innerHeartText) {
        innerHeartText.style.left = cx + 'px';
        innerHeartText.style.top = cy + 'px';
    }

    fireflies.forEach((f, idx) => {
        const targetPt = pts[idx % pts.length];
        f.active = true;
        f.tx = cx + targetPt.x;
        f.ty = cy + targetPt.y;
    });
}

/* Sekuens Malam Tersinkron dengan Detik Lagu (lagu1.mp3) */
function prepareGrandFinale() {
    syncDeviceLayoutMode();
    playTone(587, 0.22);
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('main-stage').classList.remove('wide-stage');
    document.body.classList.add('night-magic');

    const seqLayer = document.getElementById('finale-sequence');
    seqLayer.classList.remove('hidden');
    initFireflyMorphEngine();

    startEndingMusic();
    const sequenceStartTime = performance.now();

    updateBuddyChat("🎈 Teman Balon", `Sstt... lihat kunang-kunang & bintang jatuh di langit, ${userName}! ✨`);

    const sequenceSteps = ["3", "2", "1", "Selamat", "Hari", "Anak", "Sedunia"];
    const totalPreHeartMs = Math.max(5600, HEART_APPEAR_AT_SEC * 1000);
    const perWordSlotMs = totalPreHeartMs / sequenceSteps.length;
    const holdDurationMs = perWordSlotMs * 0.72;

    let stepIdx = 0;

    function runNextSequenceWord() {
        if (stepIdx >= sequenceSteps.length) {
            const elapsedMs = performance.now() - sequenceStartTime;
            const waitToHeartMs = Math.max(120, totalPreHeartMs - elapsedMs);
            setTimeout(() => {
                revealHeartAndLanterns(sequenceStartTime);
            }, waitToHeartMs);
            return;
        }

        const currentWord = sequenceSteps[stepIdx];
        morphFirefliesToWord(currentWord);
        playTone(stepIdx < 3 ? 523 + stepIdx * 65 : 698 + (stepIdx - 3) * 55, 0.16);
        stepIdx++;

        setTimeout(() => {
            scatterFirefliesBurst();
            setTimeout(runNextSequenceWord, perWordSlotMs - holdDurationMs);
        }, holdDurationMs);
    }

    setTimeout(runNextSequenceWord, 450);
}

function revealHeartAndLanterns(sequenceStartTime) {
    morphFirefliesToHeart();
    playTone(1046, 0.28);

    setTimeout(() => {
        const innerText = document.getElementById('heart-inner-text');
        const { cx, cy } = getCenterTarget();
        innerText.style.left = cx + 'px';
        innerText.style.top = cy + 'px';
        innerText.classList.remove('hidden');
        requestAnimationFrame(() => {
            innerText.classList.add('visible-heart-text');
        });
    }, 900);

    const elapsedMs = performance.now() - sequenceStartTime;
    const waitToLanternMs = Math.max(950, LANTERNS_RISE_AT_SEC * 1000 - elapsedMs);

    setTimeout(() => {
        document.getElementById('step-4').classList.remove('hidden');
        launchSkyLanternWave();
        triggerGrandFireworks();

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
    }, waitToLanternMs);
}

// Jalur lampion menyesuaikan otomatis apakah HP atau Laptop agar tidak menabrak elemen lain
function spawnSingleSkyLantern(wishObj) {
    const layer = document.getElementById('sky-lanterns-layer');
    const lantern = document.createElement('div');
    lantern.className = 'sky-lantern';

    const mobile = isMobileDevice();
    const lanes = mobile ? [18, 42, 68, 84] : [42, 56, 70, 82];
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
    const { cx, cy } = getCenterTarget();
    burstSparkles(cx, cy, 34);
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

document.addEventListener('DOMContentLoaded', () => {
    syncDeviceLayoutMode();
    const nameInput = document.getElementById('user-name-input');
    nameInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') startJourney();
    });
});
