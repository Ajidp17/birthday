
// ===================================================================
// EFEK MATRIX RAIN INTRO (OTOMATIS HILANG SETELAH 4 DETIK)
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
    const matrixCanvas = document.getElementById('matrixCanvas');
    if (!matrixCanvas) return;

    const ctx = matrixCanvas.getContext('2d');

    // Menyesuaikan ukuran canvas dengan layar penuh
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    // Karakter yang akan jatuh (bisa huruf, angka, atau katakana Jepang)
    const katakana = "HAPPY BIRTHDAY";
    const alphabet = katakana.split("");

    const fontSize = 16;
    // Menghitung berapa banyak kolom yang muat di layar
    const columns = matrixCanvas.width / fontSize;

    // Array untuk mencatat posisi Y dari setiap kolom jatuh
    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    // Fungsi utama untuk menggambar teks jatuh
    function drawMatrix() {
        // Lapisan hitam transparan untuk menciptakan efek jejak memudar (trail)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        // Mengatur warna dan font teks kode
        ctx.fillStyle = 'rgb(175, 39, 62)'; // Warna hijau khas Matrix
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            // Ambil karakter acak
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            
            // Gambar karakternya koordinat X dan Y
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            // Jika kode sudah mentok bawah layar, beri peluang acak untuk reset ke atas
            if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            
            // Jalankan kode turun ke bawah
            rainDrops[i]++;
        }
    }

    // Jalankan animasi Matrix setiap 30 milidetik
    const matrixInterval = setInterval(drawMatrix, 30);

    // Otomatis hilangkan efek Matrix setelah 4 detik (4000 ms)
    setTimeout(() => {
        clearInterval(matrixInterval); // Stop animasinya biar ga ngeberatin RAM
        matrixCanvas.style.opacity = '0';
        matrixCanvas.style.visibility = 'hidden';
        
        // Sepenuhnya hapus elemen setelah efek transisi memudar selesai
        setTimeout(() => {
            matrixCanvas.remove();
        }, 1000);
    }, 4000); // <-- Ganti angka ini (dalam milidetik) kalau mau durasinya lebih lama/sebentar
});
// ===================================================================
// DEKLARASI ELEMEN UTAMA
// ===================================================================
const lockScreen = document.getElementById('lockScreen');
const dateInput = document.getElementById('dateInput');
const unlockBtn = document.getElementById('unlockBtn');
const errorMessage = document.getElementById('errorMessage');
const mainWeb = document.getElementById('mainWeb');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

// Password Tanggal Jadian (Format: DDMMYY)
const targetDate = "300326"; 

// ===================================================================
// 1. LOGIKA UNLOCK SCREEN & PLAY MUSIK + EFEK MENGETIK
// ===================================================================
if (unlockBtn) {
    unlockBtn.addEventListener('click', () => {
        if (dateInput.value === targetDate) {
            if (bgMusic) {
                bgMusic.play().then(() => {
                    musicToggle.classList.add('playing');
                }).catch(err => console.log("Musik tertahan browser:", err));
            }
            
            mainWeb.classList.remove('web-hidden');
            lockScreen.style.opacity = '0';
            lockScreen.style.visibility = 'hidden';
            
            setTimeout(() => {
                lockScreen.style.display = 'none';
                document.body.style.overflow = 'auto'; 
                startTypewriter();
            }, 500);

        } else {
            errorMessage.textContent = "Tanggalnya salah sayang, wkwk masa lupa sih";
            setTimeout(() => { errorMessage.textContent = ""; }, 3000);
        }
    });
}

function startTypewriter() {
    const textTarget = "Nita Nurpadilah 😋";
    const element = document.getElementById('typingTarget');
    const scrollHint = document.getElementById('scrollHint');
    let i = 0;
    const speed = 150; 

    if (element) {
        element.innerHTML = ""; 

        function type() {
            if (i < textTarget.length) {
                element.innerHTML += textTarget.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.style.borderRight = "none";
                if (scrollHint) {
                    scrollHint.style.opacity = "1";
                }
            }
        }
        type();
    }
}

if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.add('playing');
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
        }
    });
}

// ===================================================================
// 2. LOGIKA INTERAKTIF FOGGY SCREEN (USAP KACA)
// ===================================================================
const btnOpenFog = document.getElementById('btnOpenFog');
const foggyOverlay = document.getElementById('foggyOverlay');
const fogCanvas = document.getElementById('fogCanvas');
const btnNextToCake = document.getElementById('btnNextToCake');
const txtHint = document.getElementById('txtHint');

if (btnOpenFog) {
    btnOpenFog.addEventListener('click', () => {
        foggyOverlay.classList.remove('hidden');
        initFogCanvas();
        document.body.style.overflow = 'hidden';
    });
}

function initFogCanvas() {
    if (!fogCanvas) return;
    const ctx = fogCanvas.getContext('2d');
    fogCanvas.width = foggyOverlay.offsetWidth;
    fogCanvas.height = foggyOverlay.offsetHeight;
    
    ctx.fillStyle = 'rgba(120, 125, 135, 0.93)';
    ctx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
    ctx.filter = 'blur(3px)';

    let isDrawing = false;
    let clearedPixels = 0;

    function scratch(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2); 
        ctx.fill();
        if (txtHint) txtHint.style.opacity = '0';
        
        clearedPixels += 1;
        if (clearedPixels > 80) { 
            if (btnNextToCake) btnNextToCake.classList.remove('hidden');
        }
    }

    fogCanvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e.offsetX, e.offsetY); });
    fogCanvas.addEventListener('mousemove', (e) => { if (isDrawing) scratch(e.offsetX, e.offsetY); });
    window.addEventListener('mouseup', () => isDrawing = false);

    fogCanvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        const r = fogCanvas.getBoundingClientRect();
        scratch(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
    });
    fogCanvas.addEventListener('touchmove', (e) => {
        if (!isDrawing) return;
        const r = fogCanvas.getBoundingClientRect();
        scratch(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
        e.preventDefault();
    });
    window.addEventListener('touchend', () => isDrawing = false);
}

// ===================================================================
// 3. MENU TIUP LILIN, KIRIM PESAN (EMAILJS) & GOSOK HADIAH
// ===================================================================
const cakeScreen = document.getElementById('cakeScreen');
const blowBtn = document.getElementById('blowBtn');
const candleFlame = document.getElementById('candleFlame');
const messageSection = document.getElementById('messageSection');
const emailForm = document.getElementById('emailForm');
const formStatus = document.getElementById('formStatus');
const scratchSection = document.getElementById('scratchSection');

if (btnNextToCake) {
    btnNextToCake.addEventListener('click', () => {
        foggyOverlay.classList.add('hidden');
        if (cakeScreen) cakeScreen.classList.remove('hidden');
    });
}

// A. Aksi Tiup Lilin
if (blowBtn && candleFlame) {
    blowBtn.addEventListener('click', () => {
        candleFlame.classList.add('extinguished'); 
        
        setTimeout(() => {
            if (cakeScreen) cakeScreen.classList.add('hidden');
            if (messageSection) messageSection.classList.remove('hidden');
        }, 1200);
    });
}

// B. Proses Pengiriman Form via EmailJS SDK
if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const sendBtn = document.getElementById('sendEmailBtn');
        sendBtn.innerText = "Mengirim...";
        sendBtn.disabled = true;
        formStatus.style.color = "gold";
        formStatus.innerText = "Tunggu sebentar ya sayang...";

        // --- SOLUSI UTAMA: Inisialisasi Kunci Publik Tepat Sebelum Mengirim ---
        emailjs.init({ publicKey: "ms9mjrwKbrf_LyeCM" });

        const serviceID = "service_29s77ct";
        const templateID = "template_pi66guc";

        // Mengunci target element ke variabel 'emailForm' secara eksplisit
        emailjs.sendForm(serviceID, templateID, emailForm)
            .then(() => {
                formStatus.style.color = "#4aff4a";
                formStatus.innerText = "Pesan terkirim! Membuka kado...";
                
                setTimeout(() => {
                    if (messageSection) messageSection.classList.add('hidden');
                    if (scratchSection) {
                        scratchSection.classList.remove('hidden');
                        initScratchCard();
                    }
                }, 1500);
            }, (err) => {
                console.error("EmailJS Error:", err);
                formStatus.style.color = "#ff4a4a";
                formStatus.innerText = "Ada kendala, melompat ke hadiah...";
                
                setTimeout(() => {
                    if (messageSection) messageSection.classList.add('hidden');
                    if (scratchSection) {
                        scratchSection.classList.remove('hidden');
                        initScratchCard();
                    }
                }, 1500);
            });
    });
}

// SCRATCH CARD SYSTEM
function initScratchCard() {
    const canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const waBtn = document.getElementById('waBtn');
    
    ctx.fillStyle = '#888';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let isScratching = false;
    let scratchCount = 0;

    function erase(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        scratchCount++;
        if (scratchCount > 60 && waBtn) {
            waBtn.classList.remove('hidden'); 
        }
    }

    canvas.addEventListener('mousedown', () => isScratching = true);
    canvas.addEventListener('mousemove', (e) => { if (isScratching) erase(e.offsetX, e.offsetY); });
    window.addEventListener('mouseup', () => isScratching = false);

    canvas.addEventListener('touchstart', () => isScratching = true);
    canvas.addEventListener('touchmove', (e) => {
        if (!isScratching) return;
        const r = canvas.getBoundingClientRect();
        erase(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
    });
    window.addEventListener('touchend', () => isScratching = false);
}

// SIMULASI GENERATOR PARTIKEL SEDERHANA
const particleCanvasElement = document.getElementById('particleCanvas');
if (particleCanvasElement) {
    const pCtx = particleCanvasElement.getContext('2d');
    particleCanvasElement.width = window.innerWidth;
    particleCanvasElement.height = window.innerHeight;
    
    let particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * particleCanvasElement.width,
            y: Math.random() * particleCanvasElement.height,
            r: Math.random() * 2 + 1,
            d: Math.random() * 1
        });
    }
}

// ===================================================================
// 4. LOGIKA ANIMASI KORSEL 3D INFINITE
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('carousel3dContainer');
    const prevBtn = document.getElementById('prev3dBtn');
    const nextBtn = document.getElementById('next3dBtn');
    
    if (container) {
        const totalCards = 35;
        let currentIndex = 0;

        let cardsHTML = "";
        for (let i = 1; i <= totalCards; i++) {
            cardsHTML += `
                <div class="card-3d-item" data-id="${i - 1}">
                    <img src="assets/images/foto${i}.jpg" alt="Memori ${i}" loading="lazy">
                </div>
            `;
        }
        container.innerHTML = cardsHTML;

        const items = document.querySelectorAll('.card-3d-item');

        function updateCarousel() {
            items.forEach((item) => {
                const itemIndex = parseInt(item.getAttribute('data-id'));
                let offset = itemIndex - currentIndex;
                
                if (offset < -totalCards / 2) offset += totalCards;
                if (offset > totalCards / 2) offset -= totalCards;

                if (Math.abs(offset) <= 2) {
                    item.style.visibility = 'visible';
                    item.style.opacity = offset === 0 ? '1' : offset === 1 || offset === -1 ? '0.7' : '0.3';
                    
                    let translateX = offset * 220;  
                    let translateZ = -Math.abs(offset) * 150; 
                    let rotateY = offset * -25; 
                    
                    if (window.innerWidth <= 768) {
                        translateX = offset * 130;
                        translateZ = -Math.abs(offset) * 100;
                    }

                    item.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
                    
                    if (offset === 0) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                } else {
                    item.style.visibility = 'hidden';
                    item.style.opacity = '0';
                    item.style.transform = `translateX(0px) translateZ(-500px) rotateY(0deg)`;
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalCards;
                updateCarousel();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                updateCarousel();
            });
        }

        let touchStartX = 0;
        container.addEventListener('touchstart', (e) => touchStartX = e.touches[0].clientX, {passive: true});
        container.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) { 
                currentIndex = (currentIndex + 1) % totalCards;
                updateCarousel();
            } else if (touchEndX - touchStartX > 50) { 
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                updateCarousel();
            }
        }, {passive: true});

        updateCarousel();
    }
});