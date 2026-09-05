  <template>
    <section class="about-section" id="about">
      <div class="container">

        <div class="about-content">
          <!-- Media column -->
          <div class="about-media animate-fade-up" ref="mediaWrapper">
            <video
            ref="videoRef"
            class="video-img"
            src="/coverr.mp4"
            playsinline
            @play="isPlaying = true"
            @pause="isPlaying = false"
            @ended="handleEnded"
          ></video>
            <!-- Play button -->
            <button class="play-btn" aria-label="Play video" @click="openModal">
              <div class="play-ring" aria-hidden="true"></div>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <!-- Floating stat badge -->
            <div class="floating-badge" aria-hidden="true">
              <span class="badge-num">+500</span>
              <span class="badge-label">Projects Done</span>
            </div>
          </div>

          <!-- Text column -->
          <div class="about-text animate-fade-up delay-150">
            <span class="section-eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              About Us
            </span>
            <h2 class="section-title">
              Sustainable Energy<br />for a Better Tomorrow
            </h2>
            <p class="section-desc">
              We are <strong>Energy Agency</strong>, specialists in the development of renewable energy projects, focusing on premium solar systems for homes and commercial facilities across the region.
            </p>
            <p class="section-desc" style="margin-top: 1rem;">
              With over a decade of expertise and 500+ successful installations, we deliver end-to-end solar solutions — from consultation and custom design through to installation and ongoing maintenance.
            </p>
            <a href="#" class="about-cta" id="about-learn-more">
              Learn more about us
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Stats row -->
        <div class="stats-grid">
          <div class="stat-item" v-for="s in stats" :key="s.label">
            <div class="stat-icon" v-html="s.icon" aria-hidden="true"></div>
            <h3 class="stat-num">{{ s.num }}</h3>
            <p class="stat-label">{{ s.label }}</p>
          </div>
        </div>

      </div>

      <!-- Video Modal -->
      <teleport to="body">
        <transition name="modal-fade">
          <div v-if="showModal" class="video-modal-overlay" @click.self="closeModal">
            <div class="video-modal-box">
              <button class="modal-close-btn" aria-label="Close video" @click="closeModal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              <video
                ref="videoRef"
                class="modal-video"
                src="/coverr.mp4"
                autoplay
                playsinline
                @ended="closeModal"
              ></video>
            </div>
          </div>
        </transition>
      </teleport>
    </section>
  </template>

  <script setup>
  import { ref, onBeforeUnmount } from 'vue'

  const videoRef = ref(null)
  const showModal = ref(false)

  function openModal() {
    showModal.value = true
    document.body.style.overflow = 'hidden'
  }

  function closeModal() {
    if (videoRef.value) {
      videoRef.value.pause()
      videoRef.value.currentTime = 0
    }
    showModal.value = false
    document.body.style.overflow = ''
  }

  function onKeydown(e) {
    if (e.key === 'Escape' && showModal.value) {
      closeModal()
    }
  }

  window.addEventListener('keydown', onKeydown)
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  })

  const stats = [
    {
      num: '+10',
      label: 'Years Experience',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    },
    {
      num: '+500',
      label: 'Realised Projects',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    },
    {
      num: '98%',
      label: 'Client Satisfaction',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    },
    {
      num: '25yr',
      label: 'Panel Warranty',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    },
  ]
  </script>

  <style scoped>
  .about-section {
    background-color: var(--bg-section);
    position: relative;
    overflow: hidden;
  }

  .about-section::before {
    content: '';
    position: absolute;
    bottom: -80px;
    left: -80px;
    width: 350px;
    height: 350px;
    background: radial-gradient(ellipse, rgba(74,222,128,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;
    margin-bottom: 5rem;
  }

  .about-media {
    position: relative;
    border-radius: var(--radius-lg);
    overflow: visible;
  }

  .video-img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    aspect-ratio: 4/3;
    border-radius: var(--radius-lg);
    box-shadow: 0 24px 60px rgba(0,0,0,0.15);
    transition: transform 0.5s var(--ease-spring);
  }

  .about-media:hover .video-img {
    transform: scale(1.02);
  }

  .play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 68px;
    height: 68px;
    background: rgba(34,197,94,0.9);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 3px;
    transition: background 0.2s, transform 0.3s;
    backdrop-filter: blur(8px);
    border: 2px solid rgba(255,255,255,0.3);
    cursor: pointer;
  }

  .play-btn:hover {
    background: #22c55e;
    transform: translate(-50%, -50%) scale(1.12);
  }

  .play-ring {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 1.5px solid rgba(34,197,94,0.35);
    animation: ping 2s ease-in-out infinite;
  }

  @keyframes ping {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.18); opacity: 0; }
  }

  .floating-badge {
    position: absolute;
    bottom: -20px;
    right: -20px;
    background: #fff;
    border-radius: 14px;
    padding: 1rem 1.25rem;
    box-shadow: 0 12px 40px rgba(0,0,0,0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    border: 1px solid rgba(74,222,128,0.2);
  }

  .badge-num {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--text-main);
    line-height: 1;
  }

  .badge-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .about-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .section-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    font-weight: 800;
    margin-bottom: 1.25rem;
    color: var(--text-main);
    line-height: 1.15;
    letter-spacing: -0.5px;
  }

  .section-desc {
    font-size: 1rem;
    color: var(--text-muted);
    line-height: 1.75;
  }

  .about-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 2rem;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-main);
    border-bottom: 2px solid rgba(74,222,128,0.5);
    padding-bottom: 2px;
    transition: color 0.2s, border-color 0.2s;
  }

  .about-cta svg {
    transition: transform 0.2s;
  }

  .about-cta:hover {
    color: #16a34a;
    border-color: #4ade80;
  }

  .about-cta:hover svg {
    transform: translateX(4px);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: 2.5rem;
    box-shadow: var(--shadow-md);
    border: 1px solid rgba(0,0,0,0.04);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    padding: 0.5rem;
  }

  .stat-item:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -0.75rem;
    top: 15%;
    height: 70%;
    width: 1px;
    background: rgba(0,0,0,0.06);
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(74,222,128,0.1);
    color: #16a34a;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
    border: 1px solid rgba(74,222,128,0.15);
  }

  .stat-num {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--text-main);
    line-height: 1;
    margin-bottom: 0.4rem;
  }

  .stat-label {
    font-size: 0.825rem;
    color: var(--text-muted);
    font-weight: 500;
    letter-spacing: 0.01em;
  }

  @media (max-width: 768px) {
    .about-content {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }

    .floating-badge {
      right: 12px;
      bottom: -16px;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem 1rem;
    }

    .stat-item:not(:last-child)::after {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>

  <style>
  /* Modal styles (not scoped, since teleported to body) */
  .video-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 2rem;
  }

  .video-modal-box {
    position: relative;
    width: 100%;
    max-width: 960px;
    aspect-ratio: 16/9;
    background: #000;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(0,0,0,0.5);
  }

  .modal-video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    background: #000;
  }

  .modal-close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    border-radius: 30%;
    background: rgba(34, 197, 94, 0.9);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    border: 2px solid rgba(255,255,255,0.3);
    backdrop-filter: blur(8px);
    z-index: 2;
  }

  .modal-close-btn:hover {
    background: #22c55e;
    transform: scale(1.1);
  }
  .modal-close-btn:hover {
    background: rgba(255,255,255,0.2);
    transform: scale(1.08);
  }

  @media (max-width: 640px) {
    .video-modal-overlay {
      padding: 1rem;
    }
    .modal-close-btn {
      top: -44px;
    }
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.25s ease;
  }
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  </style>