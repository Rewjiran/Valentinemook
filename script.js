// --- CONFIGURATION ---
const SECRET_CODE = "031166";
const ANNIVERSARY_DATE = "2023-11-03"; // Format: YYYY-MM-DD
const ERROR_MESSAGES = [
    "ลองใหม่อีกครั้งนะที่รัก ❤️",
    "เกือบถูกแล้ววว สู้ๆ นะ 💕",
    "นึกให้ออกนะคนดี 🌹"
];

// --- ELEMENTS ---
const passwordPage = document.getElementById('passwordPage');
const lovePage = document.getElementById('lovePage');
const pinInputs = document.querySelectorAll('.pin-input');
const errorMsg = document.getElementById('errorMsg');
const daysCount = document.getElementById('daysCount');
const heartBg = document.getElementById('heartBg');
const musicToggle = document.getElementById('musicToggle');
const loveSong = document.getElementById('loveSong');
const volumeSlider = document.getElementById('volumeSlider');
const openLetterBtn = document.getElementById('openLetterBtn');
const letterModal = document.getElementById('letterModal');
const closeModal = document.querySelector('.close-modal');
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let player;
let isYTReady = false;
let particles = [];

// --- PARTICLE SYSTEM ---
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '#fff' : '#ffd1dc';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

// --- 3D TILT EFFECT ---
function setupTilt() {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });
}

// --- INITIALIZATION ---
function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    initParticles();
    animateParticles();
    setupTilt();
    
    createHearts();
    setupPinInputs();
    
    // Set initial volume
    if (loveSong && volumeSlider) {
        loveSong.volume = volumeSlider.value;
    }
    
    musicToggle.addEventListener('click', toggleMusic);
    
    volumeSlider.addEventListener('input', (e) => {
        loveSong.volume = e.target.value;
    });

    openLetterBtn.addEventListener('click', () => {
        letterModal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        letterModal.classList.add('hidden');
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === letterModal) {
            letterModal.classList.add('hidden');
        }
    });
}

// --- PIN LOGIC ---
function setupPinInputs() {
    pinInputs.forEach((input, index) => {
        // Handle input
        input.addEventListener('input', (e) => {
            if (e.target.value) {
                if (index < pinInputs.length - 1) {
                    pinInputs[index + 1].focus();
                } else {
                    checkPin();
                }
            }
        });

        // Handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                pinInputs[index - 1].focus();
            }
        });
    });
}

function checkPin() {
    const enteredPin = Array.from(pinInputs).map(input => input.value).join('');

    if (enteredPin === SECRET_CODE) {
        showLovePage();
    } else {
        const randomMsg = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
        errorMsg.textContent = randomMsg;
        
        // Clear inputs and shake
        pinInputs.forEach(input => input.value = "");
        pinInputs[0].focus();
        
        const card = passwordPage.querySelector('.glass-card');
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
    }
}

function showLovePage() {
    passwordPage.style.opacity = '0';
    setTimeout(() => {
        passwordPage.classList.add('hidden');
        lovePage.classList.remove('hidden');
        calculateAnniversary();
    }, 500);
}

// --- ANNIVERSARY COUNTER ---
function calculateAnniversary() {
    const start = new Date(ANNIVERSARY_DATE);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Animate the number counting up
    let current = 0;
    const interval = setInterval(() => {
        if (current >= diffDays) {
            daysCount.textContent = diffDays;
            clearInterval(interval);
        } else {
            current += Math.ceil(diffDays / 50); // Speed up
            if (current > diffDays) current = diffDays;
            daysCount.textContent = current;
        }
    }, 30);
}

// --- FLOATING HEARTS EFFECT ---
function createHearts() {
    const heartSymbols = ['❤️', '💖', '💕', '💗', '💓'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.animationDuration = Math.random() * 5 + 5 + 's';
        
        heartBg.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 10000);
    }, 500);
}

// --- MUSIC PLAYER ---
let isPlaying = false;
function toggleMusic() {
    if (isPlaying) {
        loveSong.pause();
        musicToggle.textContent = "🎵 เล่นเพลงรัก";
    } else {
        loveSong.play().catch(e => {
            console.error("Playback failed:", e);
            alert("ไม่สามารถเล่นเพลงได้ กรุณาลองใหม่หรือตรวจสอบไฟล์เพลงครับ ❤️");
        });
        musicToggle.textContent = "⏸️ พักเพลง";
    }
    isPlaying = !isPlaying;
}

// Run init
init();
