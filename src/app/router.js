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
