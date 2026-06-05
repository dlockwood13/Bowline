// ──────────────────────────────────────────────────────────────
// Router registry — maps screen names to render functions
// ──────────────────────────────────────────────────────────────

const screens = {};

export function register(name, renderFn) {
  screens[name] = renderFn;
}

export function go(screenName) {
  if (!screens[screenName]) {
    console.error(`Screen "${screenName}" not registered`);
    return;
  }

  // Call the render function
  screens[screenName]();

  // Update active nav button
  updateNavigation(screenName);
}

function updateNavigation(screenName) {
  // Remove active class from all nav buttons
  document.querySelectorAll('.nav button').forEach(btn => {
    btn.classList.remove('active');
  });

  // Add active class to current screen's button
  const activeBtn = document.getElementById(`nb-${screenName}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

export function setTopbar(title, sub = '', { branded = true } = {}) {
  if (!branded) {
    document.getElementById('topbar-content').innerHTML = '';
    return;
  }

  // Only render the title and subtitle — assume the home button is persistent
  document.getElementById('topbar-content').innerHTML = `
    <div class="topbar-row">
      <div>
        <h1>${title}</h1>
        ${sub ? `<p class="sub">${sub}</p>` : ''}
      </div>
    </div>`;
}
