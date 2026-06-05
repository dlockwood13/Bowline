import { BRAND } from '../../data/state.js';
import { register, setTopbar, go } from '../../app/router.js';

// Expose 'go' globally for inline HTML onclick handlers
window.go = go;

const FEATURES = [
  { icon: 'ti-sun',            color: 'teal',     label: 'Today',  sub: 'Adapts to how you feel' },
  { icon: 'ti-player-play',    color: 'lavender', label: 'Now',    sub: 'One next step. No pressure.' },
  { icon: 'ti-message-2',      color: 'sky',      label: 'TL;DR',  sub: 'Decodes hard messages' },
  { icon: 'ti-refresh',        color: 'peach',    label: 'Reset',  sub: 'When the day breaks down' },
];

export function renderSplash() {
  // Hide the topbar for a clean, fully branded entry
  setTopbar('', '', { branded: false });

  document.getElementById('content').innerHTML = `
    <div class="screen splash">

      <!-- Brand mark (logo image, transparent background) -->
      <div class="splash-brand">
        <img src="src/assets/bowline-mark-256.png"
             alt="Bowline logo"
             class="splash-mark" />
        <div class="splash-wordmark">${BRAND ? BRAND.name : 'Bowline'}</div>
      </div>

      <!-- Hero copy -->
      <h1 class="splash-hero">A calmer way through your day.</h1>
      <p class="splash-sub">
        A daily support app built for ADHD, autism, dyslexia, dyspraxia,
        burnout, and the days in between. Structure when you need it.
        Never trapped by it.
      </p>

      <!-- Four feature highlights -->
      <div class="splash-features">
        ${FEATURES.map(f => `
          <div class="splash-feature">
            <i class="ti ${f.icon}" style="color:var(--${f.color})"></i>
            <div class="splash-feature-label">${f.label}</div>
            <div class="splash-feature-sub">${f.sub}</div>
          </div>
        `).join('')}
      </div>

      <!-- Primary CTA -->
      <button class="btn primary" style="max-width:280px;margin-top:8px"
              onclick="go('today')">
        <i class="ti ti-arrow-right"></i> Open ${BRAND ? BRAND.name : 'Bowline'}
      </button>

      <!-- Secondary CTA: jump into Journey -->
      <button class="btn" style="max-width:280px;margin-bottom:0"
              onclick="go('diagnosis')">
        <i class="ti ti-map"></i> Just exploring? See the Journey
      </button>

      <!-- Crisis strip — always available -->
      <div class="splash-crisis">
        In crisis? <strong>Samaritans</strong> 116 123 ·
        <strong>Shout</strong> text HOME to 85258 ·
        <a href="https://www.mind.org.uk/need-urgent-help/" target="_blank" rel="noopener noreferrer">Mind</a>
      </div>

    </div>`;
}

register('splash', renderSplash);
