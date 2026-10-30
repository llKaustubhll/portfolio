document.getElementById('year').textContent = new Date().getFullYear();

// Prefer the Clipboard API; support local files and browsers without it.
async function copyContact(value) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch (_) { /* Try the local-file compatible fallback. */ }
  }
  const previousFocus = document.activeElement;
  const field = document.createElement('textarea');
  field.value = value;
  field.setAttribute('readonly', '');
  field.setAttribute('aria-label', 'Contact detail to copy');
  field.style.cssText = 'position:fixed;left:-9999px;top:0;';
  document.body.appendChild(field);
  try {
    field.select();
    field.setSelectionRange(0, value.length);
    if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
  } finally {
    field.remove();
    if (previousFocus) previousFocus.focus();
  }
}

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const status = button.closest('.contact-card').querySelector('.copy-status');
    status.textContent = '';
    try {
      await copyContact(button.dataset.copy);
      status.textContent = `${button.dataset.kind} copied!`;
    } catch (_) {
      status.textContent = `Couldn’t copy automatically. Select and copy: ${button.dataset.copy}`;
    }
  });
});
