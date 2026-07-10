// ===== GALLERY DATA =====
const galleryData = [
    // Ganti dengan foto/video kalian
    {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop'
    },
    {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=600&fit=crop'
    },
    {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=600&h=600&fit=crop'
    },
    {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&h=600&fit=crop'
    },
    {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&h=600&fit=crop'
    },
    {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop'
    }
];

// ===== RENDER GALLERY =====
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    grid.innerHTML = '';

    galleryData.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.style.animationDelay = `${index * 0.1}s`;

        if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;

            // Auto-play on hover
            div.addEventListener('mouseenter', () => video.play());
            div.addEventListener('mouseleave', () => video.pause());

            div.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = `Memory ${index + 1}`;
            img.loading = 'lazy';
            div.appendChild(img);
        }

        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';
        overlay.innerHTML = `<i class="fas fa-heart"></i>`;
        div.appendChild(overlay);

        // Click to open lightbox
        div.addEventListener('click', () => {
            const img = div.querySelector('img');
            if (img) {
                openLightbox(img.src);
            }
        });

        grid.appendChild(div);
    });
}

// ===== LIGHTBOX =====
function openLightbox(src) {
    const existing = document.querySelector('.lightbox');
    if (existing) existing.remove();

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';

    const closeBtn = document.createElement('div');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', () => lightbox.remove());

    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Memory';

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(img);

    // Click on background to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.remove();
    });

    // ESC key to close
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            lightbox.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    document.body.appendChild(lightbox);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});