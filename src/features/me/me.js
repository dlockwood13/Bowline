import { state, BRAND } from '../../data/state.js';
import { register, setTopbar, go } from '../../app/router.js';

// Expose 'go' globally for inline HTML onclick handlers
window.go = go;

// ─── Local state ──────────────────────────────────────────
if (!state.meView) state.meView = 'menu';
if (!state.supportTab) state.supportTab = 'adhd';

// ─── Scripts ──────────────────────────────────────────────
const SCRIPTS = [
  { l: 'Ask for clarity',    t: 'Thanks for the message. Could you clarify what you need from me and by when?' },
  { l: 'Running late',       t: "I'm running late. I'm still coming, but I need more time. I'll update you when I know my arrival time." },
  { l: 'Need more time',     t: "I've seen this. I need time to process before I reply properly." },
  { l: 'Overwhelmed',        t: "I'm overwhelmed and need a quieter moment before I can respond. I'm not ignoring you." },
  { l: 'Set boundary',       t: "I'm not available for this today. I can look at it on [date]." },
  { l: 'Say no',             t: "Thanks for asking. I'm not able to do this." },
  { l: 'Social recovery',    t: "I enjoyed seeing you. I need quiet time now, so I may not reply quickly." },
  { l: 'Change of plan',     t: "I can adapt, but I need a few minutes to understand the new plan." },
];

const SENSORY_TOOLS = [
  { l: 'Headphones',       icon: 'ti-headphones' },
  { l: 'Sunglasses',       icon: 'ti-sunglasses' },
  { l: 'Weighted blanket', icon: 'ti-bed' },
  { l: 'Fidget',           icon: 'ti-hand-finger' },
  { l: 'Hoodie',           icon: 'ti-shirt' },
  { l: 'Quiet room',       icon: 'ti-door' },
  { l: 'Familiar music',   icon: 'ti-music' },
  { l: 'Movement',         icon: 'ti-walk' },
];

const ESSENTIALS = [
  { l: 'Water',              icon: 'ti-droplet' },
  { l: 'Food',               icon: 'ti-bowl' },
  { l: 'Medication',         icon: 'ti-pill' },
  { l: 'Hygiene minimum',    icon: 'ti-bath' },
  { l: 'Sleep',              icon: 'ti-zzz' },
  { l: 'Key responsibility', icon: 'ti-star' },
];

const SUPPORT_TABS = [
  { k: 'adhd',       l: 'ADHD' },
  { k: 'autism',     l: 'Autism' },
  { k: 'strategies', l: 'Strategies' },
  { k: 'crisis',     l: 'Crisis' },
];

const SUPPORT_LINKS = {
  adhd: [
    { title: 'ADHD Foundation (UK)',     sub: 'Resources, diagnosis info, adult ADHD support',     url: 'https://www.adhdfoundation.org.uk', icon: 'ti-brain', color: 'lavender' },
    { title: 'CHADD',                    sub: 'Evidence-based ADHD information and support',       url: 'https://chadd.org', icon: 'ti-book', color: 'lavender' },
    { title: 'How to ADHD (YouTube)',    sub: 'Practical strategies from a neurodivergent creator',url: 'https://www.youtube.com/@HowtoADHD', icon: 'ti-player-play', color: 'sky' },
    { title: 'Body doubling explained',  sub: 'Why working alongside others helps ADHD focus',     url: 'https://www.additudemag.com/body-doubling-adhd-focus/', icon: 'ti-users', color: 'teal' },
    { title: 'ADDitude Magazine',        sub: 'Practical guidance for ADHD adults and parents',    url: 'https://www.additudemag.com', icon: 'ti-news', color: 'amber' },
  ],
  autism: [
    { title: 'National Autistic Society',sub: "UK's leading autism charity",                       url: 'https://www.autism.org.uk', icon: 'ti-heart', color: 'teal' },
    { title: 'Autistic UK',              sub: 'Autistic-led support and resources',                url: 'https://autisticuk.org', icon: 'ti-heart', color: 'teal' },
    { title: 'NHS — Autism in adults',   sub: 'Official UK NHS guidance',                          url: 'https://www.nhs.uk/conditions/autism/', icon: 'ti-stethoscope', color: 'sky' },
    { title: 'Meltdown vs shutdown',     sub: 'What they are and how to recover',                  url: 'https://neuroclastic.com/meltdown-vs-shutdown/', icon: 'ti-info-circle', color: 'amber' },
    { title: 'Ambitious About Autism',   sub: 'UK charity for autistic children and young people', url: 'https://www.ambitiousaboutautism.org.uk', icon: 'ti-star', color: 'lavender' },
  ],
  strategies: [
    { title: 'Pomodoro technique',       sub: 'Work in short timed bursts with breaks',            url: 'https://en.wikipedia.org/wiki/Pomodoro_Technique', icon: 'ti-clock', color: 'amber' },
    { title: 'Interoception guide',      sub: "Recognising your body's internal signals",          url: 'https://www.sensorysmart.com.au/interoception.html', icon: 'ti-activity', color: 'peach' },
    { title: 'Sensory diet planning',    sub: 'Building a personalised sensory routine',           url: 'https://www.sensoryprocessingdisorder.com/sensory-diet.html', icon: 'ti-list', color: 'teal' },
    { title: 'Task initiation',          sub: 'Practical ways to start when stuck',                url: 'https://www.additudemag.com/how-to-start-tasks-adhd/', icon: 'ti-player-play', color: 'lavender' },
    { title: 'Executive function explained', sub: 'What it is and how to work with it',            url: 'https://www.understood.org/articles/what-is-executive-function', icon: 'ti-brain', color: 'sky' },
  ],
  crisis: [
    { title: 'Mind (UK)',                sub: 'Mental health support and crisis resources',        url: 'https://www.mind.org.uk', icon: 'ti-heart', color: 'peach' },
    { title: 'Samaritans',               sub: 'Free, 24/7 listening — call 116 123',               url: 'https://www.samaritans.org', icon: 'ti-phone', color: 'sky' },
    { title: 'Shout crisis text line',   sub: 'Text HOME to 85258 (UK) — free, 24/7',              url: 'https://giveusashout.org', icon: 'ti-message-circle', color: 'lavender' },
    { title: 'Neurodivergent burnout',   sub: 'Understanding and recovering from burnout',         url: 'https://neuroclastic.com/autistic-burnout/', icon: 'ti-flame', color: 'amber' },
    { title: 'NHS — Urgent mental health',sub: 'How to get urgent NHS mental health help',         url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/behaviours/help-for-suicidal-thoughts/', icon: 'ti-first-aid-kit', color: 'teal' },
  ],
};

// ─── Main router ──────────────────────────────────────────
export function renderMe() {
  setTopbar('Me', 'Your support profile.');

  if (state.meView === 'resources')   return renderResources();
  if (state.meView === 'scripts')     return renderScripts();
  if (state.meView === 'sensory')     return renderSensory();
  if (state.meView === 'essentials')  return renderEssentials();

  return renderMeMenu();
}

// ─── Main menu ────────────────────────────────────────────
function renderMeMenu() {
  const menuItems = [
    { k: 'resources',  l: 'Support resources',     sub: 'Guides, links, and crisis info',   icon: 'ti-link',           color: 'lavender' },
    { k: 'scripts',    l: 'Communication scripts', sub: 'Templates for hard conversations', icon: 'ti-message-circle', color: 'sky' },
    { k: 'sensory',    l: 'My sensory tools',      sub: 'Items and routines that regulate', icon: 'ti-heart',          color: 'peach' },
    { k: 'essentials', l: 'My essentials',         sub: 'Minimum requirements for a day',   icon: 'ti-check',          color: 'teal' },
  ];

  document.getElementById('content').innerHTML = `
    <div class="screen">

      <!-- Branded header card -->
      <div class="card teal" style="text-align:center;padding:1.5rem 1.25rem">
        <img src="src/assets/bowline-mark-128.png"
             alt=""
             aria-hidden="true"
             style="width:64px;height:64px;margin:0 auto 10px;display:block;border-radius:14px;box-shadow:var(--shadow-sm)" />
        <div class="card-main" style="font-size:20px;letter-spacing:-0.02em">${BRAND ? BRAND.name : 'Bowline'}</div>
        <div class="card-sub" style="margin-top:6px">${BRAND && BRAND.motto ? BRAND.motto : 'A calmer way through your day.'}</div>
      </div>

      <div class="section-label">
        <i class="ti ti-user" style="color:var(--lavender);font-size:14px"></i> Your support profile
      </div>

      ${menuItems.map(item => `
        <button class="btn" style="border-left:4px solid var(--${item.color});justify-content:flex-start;text-align:left;padding-left:14px"
          onclick="openMeView('${item.k}')">
          <span style="
            width:36px;height:36px;border-radius:8px;
            background:var(--${item.color}-l);
            display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <i class="ti ${item.icon}" style="font-size:18px;color:var(--${item.color}-d)"></i>
          </span>
          <div style="flex:1;text-align:left">
            <div style="font-size:14px;font-weight:700">${item.l}</div>
            <div style="font-size:12px;font-weight:400;color:var(--text-muted);margin-top:2px">${item.sub}</div>
          </div>
          <i class="ti ti-chevron-right" style="font-size:16px;color:var(--text-muted);flex-shrink:0"></i>
        </button>
      `).join('')}

      <!-- Quick stats card -->
      ${renderQuickStats()}

      <div class="notice green" style="margin-top:1.5rem">
        <strong>In crisis?</strong> Samaritans 116 123 · Shout text HOME to 85258 · <a href="https://www.mind.org.uk/need-urgent-help/" target="_blank" rel="noopener noreferrer">Mind crisis support</a>
      </div>

    </div>
  `;
}

function renderQuickStats() {
  const titrationCount = (state.titrationEntries || []).length;
  const moodCount      = (state.moodLog || []).length;
  const masterCount    = (state.masterList || []).length;
  const wishlistCount  = (state.wishlist || []).length;

  if (titrationCount + moodCount + masterCount + wishlistCount === 0) return '';

  return `
    <div class="section-label">
      <i class="ti ti-chart-bar" style="color:var(--sky);font-size:14px"></i> At a glance
    </div>
    <div class="card" style="padding:1rem 1.25rem">
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;text-align:center">
        ${titrationCount > 0 ? `
          <div>
            <div style="font-size:22px;font-weight:700;color:var(--lavender-d);line-height:1">${titrationCount}</div>
            <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-top:4px">Titration logs</div>
          </div>
        ` : ''}
        ${moodCount > 0 ? `
          <div>
            <div style="font-size:22px;font-weight:700;color:var(--sky-d);line-height:1">${moodCount}</div>
            <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-top:4px">Mood entries</div>
          </div>
        ` : ''}
        ${masterCount > 0 ? `
          <div>
            <div style="font-size:22px;font-weight:700;color:var(--teal-d);line-height:1">${masterCount}</div>
            <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-top:4px">Master list items</div>
          </div>
        ` : ''}
        ${wishlistCount > 0 ? `
          <div>
            <div style="font-size:22px;font-weight:700;color:var(--amber-d);line-height:1">${wishlistCount}</div>
            <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-top:4px">Wishlist items</div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ─── Back button helper ──────────────────────────────────
function backToMenu() {
  return `
    <button class="btn" style="margin-bottom:10px;color:var(--text-muted);justify-content:flex-start" onclick="exitToMeMenu()">
      <i class="ti ti-arrow-left"></i> Back to profile
    </button>
  `;
}

// ─── Resources ───────────────────────────────────────────
function renderResources() {
  const links = SUPPORT_LINKS[state.supportTab] || [];

  document.getElementById('content').innerHTML = `
    <div class="screen">
      ${backToMenu()}

      <div class="card lavender">
        <div class="card-label">Support resources</div>
        <div class="card-main" style="font-size:16px">External guides, articles, and crisis lines.</div>
        <div class="card-sub" style="margin-top:6px">All links open in a new tab.</div>
      </div>

      <!-- Support tabs -->
      <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;margin-bottom:8px;-webkit-overflow-scrolling:touch">
        ${SUPPORT_TABS.map(t => {
          const isActive = state.supportTab === t.k;
          return `
            <button onclick="switchSupportTab('${t.k}')"
              style="padding:7px 14px;white-space:nowrap;
                     border:1.5px solid ${isActive ? 'var(--lavender)' : 'var(--border)'};
                     border-radius:var(--r-pill);
                     background:${isActive ? 'var(--lavender-l)' : 'var(--bg-card)'};
                     color:${isActive ? 'var(--lavender-d)' : 'var(--text-primary)'};
                     font-size:12px;font-weight:700;font-family:var(--font);cursor:pointer;flex-shrink:0">
              ${t.l}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Support links -->
      ${links.map(lk => `
        <a href="${lk.url}" target="_blank" rel="noopener noreferrer" class="link-card">
          <div class="link-icon" style="background:var(--${lk.color}-l)">
            <i class="ti ${lk.icon}" style="color:var(--${lk.color}-d)"></i>
          </div>
          <div style="flex:1;min-width:0">
            <div class="link-title">${lk.title}</div>
            <div class="link-sub">${lk.sub}</div>
          </div>
          <i class="ti ti-external-link" style="font-size:16px;color:var(--text-muted);flex-shrink:0"></i>
        </a>
      `).join('')}

    </div>
  `;
}

// ─── Scripts ─────────────────────────────────────────────
function renderScripts() {
  document.getElementById('content').innerHTML = `
    <div class="screen">
      ${backToMenu()}

      <div class="card sky">
        <div class="card-label">Communication scripts</div>
        <div class="card-main" style="font-size:16px">Templates for when finding the words is hard.</div>
        <div class="card-sub" style="margin-top:6px">Tap copy. Edit to sound like you before sending.</div>
      </div>

      ${SCRIPTS.map((s, idx) => `
        <div class="card">
          <div class="card-label">${s.l}</div>
          <div style="font-size:14px;color:var(--text-primary);line-height:1.6;margin:8px 0 12px;padding:10px 12px;background:var(--bg-page);border-radius:var(--r-md);border:1px solid var(--border)">
            "${s.t}"
          </div>
          <button class="btn sky" style="width:auto;padding:8px 14px;margin:0;font-size:13px" onclick="copyScript(${idx}, this)">
            <i class="ti ti-copy"></i> Copy
          </button>
        </div>
      `).join('')}

    </div>
  `;
}

// ─── Sensory tools ───────────────────────────────────────
function renderSensory() {
  document.getElementById('content').innerHTML = `
    <div class="screen">
      ${backToMenu()}

      <div class="card peach">
        <div class="card-label">My sensory tools</div>
        <div class="card-main" style="font-size:16px">Things that help regulate your nervous system.</div>
        <div class="card-sub" style="margin-top:6px">Use these to lower incoming stimulation or provide grounding pressure.</div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
        ${SENSORY_TOOLS.map(s => `
          <div class="card peach" style="padding:14px 12px;text-align:center">
            <i class="ti ${s.icon}" style="font-size:24px;color:var(--peach-d);display:block;margin-bottom:6px"></i>
            <div style="font-size:13px;font-weight:700;color:var(--peach-d)">${s.l}</div>
          </div>
        `).join('')}
      </div>

      <div class="notice peach" style="margin-top:1.25rem">
        <strong>Tip.</strong> Build your own sensory kit — keep one at home, one in your bag, one at work. Future-you will thank present-you.
      </div>

    </div>
  `;
}

// ─── Essentials ──────────────────────────────────────────
function renderEssentials() {
  document.getElementById('content').innerHTML = `
    <div class="screen">
      ${backToMenu()}

      <div class="card teal">
        <div class="card-label">My essentials</div>
        <div class="card-main" style="font-size:16px">The bare minimum for a survival day.</div>
        <div class="card-sub" style="margin-top:6px">When you are in shutdown or burnout, drop everything else. Just do these.</div>
      </div>

      <div class="card" style="padding:0.5rem 1.25rem">
        ${ESSENTIALS.map((e, idx) => `
          <div class="task-row" style="cursor:pointer" onclick="toggleEssential(this)">
            <div class="task-check" style="border-color:var(--teal)" role="checkbox" aria-label="${e.l}"></div>
            <i class="ti ${e.icon}" style="font-size:18px;color:var(--teal);flex-shrink:0;margin-top:2px"></i>
            <div class="task-text" style="font-size:15px;font-weight:600">${e.l}</div>
          </div>
        `).join('')}
      </div>

      <div class="notice green" style="margin-top:1.25rem">
        <strong>This is enough.</strong> If you did the essentials today, the day counts. Productivity is not the goal — staying well is.
      </div>

    </div>
  `;
}

// ─── Window handlers ─────────────────────────────────────
window.openMeView = (view) => {
  state.meView = view;
  renderMe();
};

window.exitToMeMenu = () => {
  state.meView = 'menu';
  renderMe();
};

window.switchSupportTab = (t) => {
  state.supportTab = t;
  renderMe();
};

window.copyScript = (idx, btn) => {
  const textToCopy = SCRIPTS[idx].t;
  navigator.clipboard.writeText(textToCopy).catch(() => {});

  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="ti ti-check"></i> Copied';
  setTimeout(() => { btn.innerHTML = originalHTML; }, 1500);
};

window.toggleEssential = (element) => {
  const check = element.querySelector('.task-check');
  if (!check) return;

  check.classList.toggle('done');
  if (check.classList.contains('done')) {
    check.innerHTML = '<i class="ti ti-check" style="font-size:14px"></i>';
  } else {
    check.innerHTML = '';
  }
};

register('me', renderMe);
