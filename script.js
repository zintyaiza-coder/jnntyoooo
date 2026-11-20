// Bisa diisi nama panggilanmu supaya jejak pengirimnya muncul
const SENDER_NAME = ""; // contoh: "zintya"

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

function isMobileDevice() {
    const isLandscape = window.innerWidth > window.innerHeight && window.innerHeight <= 520;
    if (isLandscape) return false;

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

// Slot titik gantung tersebar di tajuk pohon (diatur agar tidak terlalu mepet ke pinggir)
const treeAnchorSlots = [
    { top: 42, left: 190 },
    { top: 82, left: 74 },
    { top: 86, left: 215 },
    { top: 126, left: 132 },
    { top: 132, left: 56 },
    { top: 134, left: 220 },
    { top: 168, left: 142 }
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

    const mobile = isMobileDevice();
    const slot = treeAnchorSlots[(userWishes.length - 2) % treeAnchorSlots.length];
    const scaleX = mobile ? 0.65 : 1;
    const scaleY = mobile ? 0.72 : 1;
    const top = Math.max(18, Math.round(slot.top * scaleY + (Math.random() * 8 - 4)));
    const left = Math.max(12, Math.round(slot.left * scaleX + (Math.random() * 10 - 5)));
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
   EFEK KUNANG-KUNANG + TEKS 3-2-1-SELAMAT-HARI-ANAK-SEDUNIA JELAS + HATI
   ========================================================================= */
let fireflyAnimId = null;
const fireflies = [];
const starRainStreams = [];
let morphMode = 'scatter'; // 'scatter' | 'word' | 'heart'

function getCenterTarget() {
    const mobile = isMobileDevice();
    return {
        cx: mobile ? window.innerWidth * 0.5 : window.innerWidth * 0.58,
        cy: mobile ? window.innerHeight * 0.58 : window.innerHeight * 0.45
    };
}

function sampleHeartPoints() {
    const pts = [];
    const mobile = isMobileDevice();
    const scale = mobile ? 9.2 : 13.2;

    const rings = [0.88, 0.96, 1.04, 1.12];
    rings.forEach((ringScale, rIdx) => {
        const steps = 110 + rIdx * 18;
        for (let i = 0; i < steps; i++) {
            const t = (i / steps) * Math.PI * 2;
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            pts.push({
                x: hx * scale * ringScale + (Math.random() - 0.5) * 6,
                y: hy * scale * ringScale - 10 + (Math.random() - 0.5) * 6
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

    starRainStreams.length = 0;
    const colCount = Math.floor(window.innerWidth / 38);
    for (let c = 0; c < colCount; c++) {
        starRainStreams.push({
            x: c * 38 + Math.random() * 16,
            y: Math.random() * -window.innerHeight,
            speed: 1.1 + Math.random() * 1.5,
            length: 3 + Math.floor(Math.random() * 3),
            phase: Math.random() * Math.PI * 2
        });
    }

    fireflies.length = 0;
    const totalFlies = 460;
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

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = isFormed ? 18 : 11;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFDF9';
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function loopMorph() {
        tick += 0.045;
        fCtx.clearRect(0, 0, fCanvas.width, fCanvas.height);

        // Hujan bintang jatuh lembut di latar
        starRainStreams.forEach((st) => {
            st.y += st.speed;
            if (st.y - st.length * 22 > fCanvas.height) {
                st.y = -20;
                st.x = Math.random() * fCanvas.width;
            }
            for (let s = 0; s < st.length; s++) {
                const sy = st.y - s * 22;
                if (sy < -10 || sy > fCanvas.height + 10) continue;
                const fade = (1 - s / st.length) * (0.22 + 0.16 * Math.sin(tick + st.phase + s));
                const starColor = s === 0 ? '#FFFDF7' : (s % 2 === 0 ? '#FFD166' : '#FF8FA3');
                drawStarShape(fCtx, st.x, sy, s === 0 ? 3.4 : 2.3, Math.max(0.05, fade), starColor);
            }
        });

        const { cx, cy } = getCenterTarget();
        const heartBeat = morphMode === 'heart' ? (1 + Math.sin(tick * 1.4) * 0.035) : 1;

        fireflies.forEach((f) => {
            if (morphMode !== 'heart' || !f.active) {
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

            const isHeartActive = morphMode === 'heart' && f.active;
            const glowAlpha = isHeartActive
                ? (0.85 + Math.sin(tick * 2.2 + f.phase) * 0.15)
                : (0.48 + Math.sin(tick * 2.0 + f.phase) * 0.25);

            const flyColor = isHeartActive
                ? (f.isPink ? '#FF6B8B' : '#FFD166')
                : (f.isPink ? '#FF8FA3' : '#FFF3B0');

            const drawRadius = isHeartActive ? f.size * 1.25 : f.size;
            drawFireflyGlow(fCtx, f.x, f.y, drawRadius, Math.max(0.18, glowAlpha), flyColor, isHeartActive);
        });

        fireflyAnimId = requestAnimationFrame(loopMorph);
    }

    if (!fireflyAnimId) loopMorph();
}

function showClearSequenceWord(word) {
    const wordEl = document.getElementById('countdown-clear-word');
    const { cx, cy } = getCenterTarget();
    wordEl.style.left = cx + 'px';
    wordEl.style.top = cy + 'px';
    wordEl.textContent = word;
    wordEl.classList.remove('hidden');
    wordEl.classList.remove('show-clear-word');
    void wordEl.offsetWidth;
    wordEl.classList.add('show-clear-word');
}

function hideClearSequenceWord() {
    const wordEl = document.getElementById('countdown-clear-word');
    wordEl.classList.remove('show-clear-word');
    setTimeout(() => {
        if (!wordEl.classList.contains('show-clear-word')) {
            wordEl.classList.add('hidden');
        }
    }, 180);
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

    updateBuddyChat("🎈 Teman Balon", `Sstt... lihat ke langit malam, ${userName}! ✨`);

    const sequenceSteps = ["3", "2", "1", "Selamat", "Hari", "Anak", "Sedunia"];
    const totalPreHeartMs = Math.max(5600, HEART_APPEAR_AT_SEC * 1000);
    const perWordSlotMs = totalPreHeartMs / sequenceSteps.length;
    const holdDurationMs = perWordSlotMs * 0.72;

    let stepIdx = 0;

    function runNextSequenceWord() {
        if (stepIdx >= sequenceSteps.length) {
            hideClearSequenceWord();
            const elapsedMs = performance.now() - sequenceStartTime;
            const waitToHeartMs = Math.max(120, totalPreHeartMs - elapsedMs);
            setTimeout(() => {
                revealHeartAndLanterns(sequenceStartTime);
            }, waitToHeartMs);
            return;
        }

        const currentWord = sequenceSteps[stepIdx];
        showClearSequenceWord(currentWord);
        playTone(stepIdx < 3 ? 523 + stepIdx * 65 : 698 + (stepIdx - 3) * 55, 0.16);
        const { cx, cy } = getCenterTarget();
        burstSparkles(cx, cy, 14);
        stepIdx++;

        setTimeout(() => {
            hideClearSequenceWord();
            setTimeout(runNextSequenceWord, perWordSlotMs - holdDurationMs);
        }, holdDurationMs);
    }

    setTimeout(runNextSequenceWord, 450);
}

function revealHeartAndLanterns(sequenceStartTime) {
    hideClearSequenceWord();
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
    }, 850);

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

function spawnSingleSkyLantern(wishObj) {
    const layer = document.getElementById('sky-lanterns-layer');
    const lantern = document.createElement('div');
    lantern.className = 'sky-lantern';

    const mobile = isMobileDevice();
    // Di HP potret, lampion difokuskan ke pinggir kanan & kiri atas agar tidak menutupi tulisan tengah hati
    const lanes = mobile ? [8, 76, 84] : [44, 58, 72, 84];
    const baseLeft = lanes[laneIndex % lanes.length];
    laneIndex++;
    const leftPercent = baseLeft + (Math.random() * 3 - 1.5);
    const duration = 11 + Math.random() * 4;
    const driftX = (Math.random() - 0.5) * 32;

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
