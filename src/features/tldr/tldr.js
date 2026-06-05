import { state, ACCENT } from '../../data/state.js';
import { register, setTopbar, go } from '../../app/router.js';
import { callClaude, TLDR_PROMPTS } from '../../services/api.js';

// Expose 'go' globally for inline HTML onclick handlers
window.go = go;

// ─── Local state ──────────────────────────────────────────
if (!state.tldrInput)        state.tldrInput = '';
if (!state.tldrOutput)       state.tldrOutput = null;
if (!state.tldrMode)         state.tldrMode = null;
if (!state.tldrLoading)      state.tldrLoading = false;
if (!state.tldrHistory)      state.tldrHistory = [];
if (!state.tldrParsedActions) state.tldrParsedActions = [];
if (state.tldrShowHistory === undefined) state.tldrShowHistory = false;

const MODE_LABELS = {
  full:    { l: 'Summarise',     icon: 'ti-sparkles',     sub: 'Main points, details, dates',   color: 'teal' },
  tone:    { l: 'Explain tone',  icon: 'ti-mood-neutral', sub: 'Read between the lines',        color: 'lavender' },
  actions: { l: 'Action items',  icon: 'ti-checklist',    sub: 'Just the things you need to do', color: 'sky' },
  reply:   { l: 'Draft reply',   icon: 'ti-send',         sub: 'A short, calm response',         color: 'amber' },
};

// ─── Main render ──────────────────────────────────────────
export function renderTldr() {
  setTopbar('TL;DR Assist', 'Paste a message. Get what matters.');

  document.getElementById('content').innerHTML = `
    <div class="screen">

      <div class="card sky">
        <div class="card-label">TL;DR Assist</div>
        <div class="card-main" style="font-size:16px">Paste an email, letter, message, or instruction.</div>
        <div class="card-sub" style="margin-top:6px;line-height:1.6">
          Bowline pulls out what matters so you do not have to wade through every line.
        </div>
      </div>

      <!-- Input -->
      <div class="card">
        <textarea id="tldr-input"
          placeholder="Paste the message here..."
          style="min-height:160px;margin:0"
          oninput="tldrUpdateInput(this.value)">${state.tldrInput}</textarea>

        ${state.tldrInput ? `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding:0 4px">
            <span style="font-size:12px;font-weight:600;color:var(--text-muted)">${state.tldrInput.length} characters</span>
            <button onclick="tldrClear()"
              style="border:none;background:transparent;color:var(--peach-d);font-size:12px;font-weight:700;cursor:pointer;font-family:var(--font);text-decoration:underline">
              Clear text
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Mode buttons -->
      <div class="section-label">What do you want?</div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:14px">
        ${Object.entries(MODE_LABELS).map(([k, m]) => `
          <button class="btn ${m.color === 'teal' ? 'teal' : m.color}"
            style="margin:0;flex-direction:column;align-items:flex-start;padding:14px;min-height:auto;text-align:left"
            onclick="tldrRun('${k}')">
            <div style="display:flex;align-items:center;gap:8px;width:100%">
              <i class="ti ${m.icon}" style="font-size:20px;color:var(--${m.color})"></i>
              <span style="font-size:14px;font-weight:700;color:var(--${m.color}-d)">${m.l}</span>
            </div>
            <span style="font-size:12px;font-weight:400;color:var(--text-secondary);margin-top:4px;line-height:1.4">${m.sub}</span>
          </button>
        `).join('')}
      </div>

      <!-- Loading -->
      ${state.tldrLoading ? `
        <div class="card" style="text-align:center;padding:1.5rem">
          <div class="spinner" style="margin:0 auto 12px"></div>
          <div style="font-size:14px;font-weight:600;color:var(--text-secondary)">
            ${getLoadingMessage(state.tldrMode)}
          </div>
        </div>
      ` : ''}

      <!-- Output -->
      ${state.tldrOutput && !state.tldrLoading ? renderOutput() : ''}

      <!-- History -->
      ${state.tldrHistory.length > 0 ? renderHistory() : ''}

      <!-- Privacy notice -->
      <div class="notice green" style="margin-top:1.5rem">
        <strong>Privacy.</strong> The message is sent to an AI service for analysis. It is not stored or used for training.
      </div>

    </div>`;
}

function getLoadingMessage(mode) {
  const m = {
    full:    'Reading the message...',
    tone:    'Looking at the tone...',
    actions: 'Finding what needs doing...',
    reply:   'Drafting a calm response...',
  };
  return m[mode] || 'Working on it...';
}

// ─── Output card with extracted actions ──────────────────
function renderOutput() {
  const mode = MODE_LABELS[state.tldrMode] || MODE_LABELS.full;

  return `
    <div class="section-label">
      <i class="ti ${mode.icon}" style="color:var(--${mode.color});font-size:14px"></i> Result
    </div>

    <div class="card ${mode.color}">
      <div class="card-label" style="display:flex;align-items:center;gap:6px">
        <i class="ti ${mode.icon}" style="font-size:14px"></i> ${mode.l}
      </div>
      <div style="font-size:15px;color:var(--text-primary);line-height:1.7;white-space:pre-wrap;margin-top:10px">${state.tldrOutput}</div>
    </div>

    ${state.tldrParsedActions.length > 0 ? `
      <div class="section-label">
        <i class="ti ti-checklist" style="color:var(--teal);font-size:14px"></i> Detected actions
      </div>
      <div class="notice blue" style="margin-bottom:0.85rem">
        Tap + to add any action to your Today list.
      </div>
      <div class="card" style="padding:0.5rem 1.25rem">
        ${state.tldrParsedActions.map((a, i) => `
          <div class="task-row">
            <button onclick="tldrAddAction(${i})"
              style="width:28px;height:28px;border:none;background:var(--teal-l);color:var(--teal-d);border-radius:50%;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center"
              aria-label="Add to Today">
              <i class="ti ti-plus" style="font-size:16px"></i>
            </button>
            <div style="flex:1;font-size:14px;color:var(--text-primary);line-height:1.5;padding-top:4px">${a}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:1rem">
      <button class="btn" style="margin:0" onclick="tldrCopy(this)">
        <i class="ti ti-copy"></i> Copy result
      </button>
      <button class="btn sky" style="margin:0" onclick="tldrSaveAll()">
        <i class="ti ti-calendar-plus"></i> Save to Today
      </button>
    </div>

    <button class="btn" style="margin-top:6px;color:var(--text-muted)" onclick="tldrClearOutput()">
      <i class="ti ti-x"></i> Clear result
    </button>
  `;
}

// ─── History view ────────────────────────────────────────
function renderHistory() {
  return `
    <div class="section-label" style="cursor:pointer" onclick="tldrToggleHistory()">
      <i class="ti ti-history" style="color:var(--lavender);font-size:14px"></i>
      <span style="flex:1">Previous (${state.tldrHistory.length})</span>
      <i class="ti ${state.tldrShowHistory ? 'ti-chevron-up' : 'ti-chevron-down'}" style="color:var(--text-muted);font-size:16px"></i>
    </div>

    ${state.tldrShowHistory ? `
      <div class="card" style="padding:0.5rem 1.25rem">
        ${state.tldrHistory.slice().reverse().map((h, idx) => {
          const modeInfo = MODE_LABELS[h.mode] || MODE_LABELS.full;
          return `
            <div class="task-row" style="align-items:center;gap:12px">
              <span style="width:36px;height:36px;border-radius:8px;background:var(--${modeInfo.color}-l);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i class="ti ${modeInfo.icon}" style="font-size:16px;color:var(--${modeInfo.color}-d)"></i>
              </span>
              <div style="flex:1;min-width:0">
                <div style="font-size:14px;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                  ${(h.input || '').slice(0, 60)}${(h.input || '').length > 60 ? '...' : ''}
                </div>
                <div style="font-size:12px;color:var(--text-muted)">
                  ${modeInfo.l} · ${h.time}
                </div>
              </div>
              <button onclick="tldrRestore(${state.tldrHistory.length - 1 - idx})"
                style="border:none;background:none;color:var(--sky-d);cursor:pointer;padding:8px;flex-shrink:0"
                aria-label="Restore">
                <i class="ti ti-rotate-clockwise" style="font-size:18px"></i>
              </button>
            </div>
          `;
        }).join('')}
      </div>
      <button class="btn" style="margin-top:6px;color:var(--text-muted)" onclick="tldrClearHistory()">
        <i class="ti ti-trash"></i> Clear all history
      </button>
    ` : ''}
  `;
}

// ─── Action extraction from output ───────────────────────
function parseActions(text) {
  if (!text) return [];
  const lines = text.split(/\n/);
  const actions = [];
  let inActions = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^(WHAT YOU NEED TO DO|YOU NEED TO|ACTION ITEMS)/i.test(trimmed)) {
      inActions = true;
      continue;
    }
    if (inActions && /^[A-Z][A-Z\s]{3,}$/.test(trimmed)) {
      inActions = false;
      continue;
    }
    if (inActions) {
      const m = trimmed.match(/^(?:\d+[.)\s]|[-•·*]\s)(.+)/);
      if (m && m[1].length > 4) actions.push(m[1].trim());
    }
  }

  if (actions.length === 0) {
    for (const line of lines) {
      const m = line.trim().match(/^\d+[.)\s]+(.+)/);
      if (m && m[1].length > 4 && !/^[A-Z\s]+:$/.test(m[1])) {
        actions.push(m[1].trim());
      }
    }
  }

  return actions.slice(0, 8);
}

// ─── Window handlers ──────────────────────────────────────
window.tldrUpdateInput = function (val) {
  state.tldrInput = val;
};

window.tldrRun = async function (mode) {
  const input = (document.getElementById('tldr-input')?.value || state.tldrInput || '').trim();

  if (!input) {
    alert('Please paste a message first.');
    return;
  }

  state.tldrInput   = input;
  state.tldrMode    = mode;
  state.tldrOutput  = null;
  state.tldrLoading = true;
  state.tldrParsedActions = [];
  renderTldr();

  try {
    const prompt = TLDR_PROMPTS[mode](input);
    const result = await callClaude(prompt);
    state.tldrOutput = result;
    state.tldrParsedActions = parseActions(result);

    state.tldrHistory.push({
      input,
      output: result,
      mode,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    });
    if (state.tldrHistory.length > 20) state.tldrHistory = state.tldrHistory.slice(-20);
  } catch (e) {
    state.tldrOutput = getFallbackResponse(mode, input);
    state.tldrParsedActions = parseActions(state.tldrOutput);
  }

  state.tldrLoading = false;
  renderTldr();
};

// ─── Fallback templates (when AI unavailable) ────────────
function getFallbackResponse(mode, input) {
  const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const firstSentence = sentences[0] ? sentences[0].trim() : 'The message';
  const dateMatch = input.match(/\b(?:on |by |before )?(\w+day|\d{1,2}(?:st|nd|rd|th)?(?: of)? \w+|\d{1,2}\/\d{1,2}|next \w+|tomorrow|today|tonight)\b/i);
  const timeMatch = input.match(/\b(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))\b/);
  const questionMatch = /\?/.test(input);

  if (mode === 'full') {
    return [
      'AI is not available right now. Here is a basic breakdown:', '',
      'MAIN POINT', firstSentence + '.', '',
      'KEY DETAILS',
      sentences.slice(1, 4).map(s => '· ' + s.trim()).join('\n') || '· (no further detail extracted)', '',
      'WHAT YOU NEED TO DO',
      questionMatch ? '1. Reply to the question they asked' : '1. Read the message in full',
      dateMatch || timeMatch ? '2. Note: ' + (dateMatch ? dateMatch[0] : '') + (timeMatch ? ' ' + timeMatch[0] : '') : '2. Decide if any response is needed', '',
      'DATES AND DEADLINES',
      (dateMatch || timeMatch) ? (dateMatch ? dateMatch[0] : '') + (timeMatch ? ' ' + timeMatch[0] : '') : 'None mentioned', '',
      'TONE',
      'Cannot analyse tone offline. Consider asking someone you trust if it feels ambiguous.',
    ].join('\n');
  }

  if (mode === 'tone') {
    return [
      'AI is not available right now. A few things to consider on your own:', '',
      'WHAT IS CLEAR', '· The literal content of the message', '',
      'WHAT IS NOT CLEAR',
      '· The emotional tone behind the words',
      '· Whether the sender is annoyed, neutral, or friendly', '',
      'DO NOT ASSUME',
      '· That punctuation or word choice signals emotion',
      '· That a short reply means anger', '',
      'SAFEST REPLY',
      'A short, factual reply that asks for clarification if needed.',
    ].join('\n');
  }

  if (mode === 'actions') {
    return [
      'AI is not available right now. Best-guess actions:', '',
      'YOU NEED TO:',
      questionMatch ? '1. Reply to the question they asked' : '1. Read the message in full',
      dateMatch ? '2. Note the date: ' + dateMatch[0] : '2. Decide whether any response is needed',
      timeMatch ? '3. Note the time: ' + timeMatch[0] : '',
    ].filter(Boolean).join('\n');
  }

  if (mode === 'reply') {
    return [
      'AI is not available right now. A basic template:', '',
      'Thanks for your message. ',
      questionMatch ? 'Yes, [your answer here]. ' : '',
      'Let me know if you need anything else.', '',
      '(Edit this to sound like you before sending.)',
    ].join('\n');
  }

  return 'AI is not available right now. Please try again later.';
}

window.tldrClear = function () {
  state.tldrInput = '';
  state.tldrOutput = null;
  state.tldrParsedActions = [];
  const input = document.getElementById('tldr-input');
  if (input) input.value = '';
  renderTldr();
};

window.tldrClearOutput = function () {
  state.tldrOutput = null;
  state.tldrParsedActions = [];
  renderTldr();
};

window.tldrCopy = function (btn) {
  if (!state.tldrOutput) return;
  navigator.clipboard.writeText(state.tldrOutput).catch(() => {});

  if (btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="ti ti-check"></i> Copied';
    setTimeout(() => { btn.innerHTML = originalHTML; }, 1500);
  } else {
    alert('Copied to clipboard.');
  }
};

window.tldrAddAction = function (idx) {
  const action = state.tldrParsedActions[idx];
  if (!action) return;
  state.tasks.push({
    id: Date.now() + idx,
    text: action,
    meta: 'From TL;DR · Medium energy',
    color: 'sky',
    done: false,
  });
  state.tldrParsedActions.splice(idx, 1);
  renderTldr();
};

window.tldrSaveAll = function () {
  if (state.tldrParsedActions.length === 0) {
    state.tasks.push({
      id: Date.now(),
      text: 'Follow up on message',
      meta: 'From TL;DR · Medium energy',
      color: 'sky',
      done: false,
    });
    alert('Added a follow-up task to Today.');
  } else {
    state.tldrParsedActions.forEach((a, i) => {
      state.tasks.push({
        id: Date.now() + i,
        text: a,
        meta: 'From TL;DR · Medium energy',
        color: 'sky',
        done: false,
      });
    });
    alert('Added ' + state.tldrParsedActions.length + ' tasks to Today.');
    state.tldrParsedActions = [];
  }
  renderTldr();
};

window.tldrToggleHistory = function () {
  state.tldrShowHistory = !state.tldrShowHistory;
  renderTldr();
};

window.tldrRestore = function (idx) {
  const h = state.tldrHistory[idx];
  if (!h) return;
  state.tldrInput = h.input;
  state.tldrOutput = h.output;
  state.tldrMode = h.mode;
  state.tldrParsedActions = parseActions(h.output);
  state.tldrShowHistory = false;
  renderTldr();
};

window.tldrClearHistory = function () {
  if (confirm('Clear all TL;DR history?')) {
    state.tldrHistory = [];
    renderTldr();
  }
};

register('tldr', renderTldr);
