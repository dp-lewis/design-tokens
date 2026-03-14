/* ==========================================================================
   App — Brand/layout switching, token inspector, live editing
   ========================================================================== */

// Semantic token → primitive token (per brand)
const BRANDS = {
  broadsheet: {
    label: 'Broadsheet',
    tokens: {
      '--heading-font':   { primitive: '--font-playfair',    value: '"Playfair Display", "Book Antiqua", Palatino, Georgia, serif', type: 'font' },
      '--heading-size':   { primitive: '--font-size-xl',     value: '1.5rem',     type: 'size' },
      '--heading-color':  { primitive: '--color-navy-900',   value: '#0a1633',    type: 'color' },
      '--heading-weight': { primitive: '--font-weight-bold', value: '700',        type: 'size' },
      '--body-font':      { primitive: '--font-pt-serif',    value: '"PT Serif", Georgia, Times, "Times New Roman", serif', type: 'font' },
      '--body-size':      { primitive: '--font-size-md',     value: '1rem',       type: 'size' },
      '--body-color':     { primitive: '--color-navy-900',   value: '#0a1633',    type: 'color' },
      '--ui-font':        { primitive: '--font-pt-sans',     value: '"PT Sans", Arial, Helvetica, sans-serif', type: 'font' },
      '--label-size':     { primitive: '--font-size-sm',     value: '0.875rem',   type: 'size' },
      '--caption-size':   { primitive: '--font-size-xs',     value: '0.75rem',    type: 'size' },
      '--caption-color':  { primitive: '--color-grey-500',   value: '#6b6b6b',    type: 'color' },
      '--accent-color':   { primitive: '--color-blue-600',   value: '#096dd2',    type: 'color' },
      '--surface-bg':     { primitive: '--color-white',      value: '#ffffff',    type: 'color' },
      '--border-color':   { primitive: '--color-grey-200',   value: '#d4d4d4',    type: 'color' },
      '--space-tight':    { primitive: '--spacing-md',       value: '12px',       type: 'size' },
      '--space-loose':    { primitive: '--spacing-xl',       value: '24px',       type: 'size' },
      '--radius':         { primitive: '--radius-sm',        value: '2px',        type: 'size' },
    }
  },
  tabloid: {
    label: 'Tabloid',
    tokens: {
      '--heading-font':   { primitive: '--font-nunito',          value: '"Nunito", sans-serif', type: 'font' },
      '--heading-size':   { primitive: '--font-size-xl',         value: '1.5rem',     type: 'size' },
      '--heading-color':  { primitive: '--color-black-alpha-81', value: 'rgba(0, 0, 0, 0.81)', type: 'color' },
      '--heading-weight': { primitive: '--font-weight-bold',     value: '700',        type: 'size' },
      '--body-font':      { primitive: '--font-noto-sans',       value: '"Noto Sans", sans-serif', type: 'font' },
      '--body-size':      { primitive: '--font-size-md',         value: '1rem',       type: 'size' },
      '--body-color':     { primitive: '--color-black-alpha-81', value: 'rgba(0, 0, 0, 0.81)', type: 'color' },
      '--ui-font':        { primitive: '--font-noto-sans',       value: '"Noto Sans", sans-serif', type: 'font' },
      '--label-size':     { primitive: '--font-size-sm',         value: '0.875rem',   type: 'size' },
      '--caption-size':   { primitive: '--font-size-xs',         value: '0.75rem',    type: 'size' },
      '--caption-color':  { primitive: '--color-black-alpha-58', value: 'rgba(0, 0, 0, 0.58)', type: 'color' },
      '--accent-color':   { primitive: '--color-black-alpha-58', value: 'rgba(0, 0, 0, 0.58)', type: 'color' },
      '--surface-bg':     { primitive: '--color-white',          value: '#ffffff',    type: 'color' },
      '--border-color':   { primitive: '--color-grey-100',       value: '#e8e8e8',    type: 'color' },
      '--space-tight':    { primitive: '--spacing-sm',           value: '8px',        type: 'size' },
      '--space-loose':    { primitive: '--spacing-md',           value: '12px',       type: 'size' },
      '--radius':         { primitive: '--radius-md',            value: '4px',        type: 'size' },
    }
  },
  financial: {
    label: 'Financial',
    tokens: {
      '--heading-font':   { primitive: '--font-lora',        value: '"Lora", Times, serif', type: 'font' },
      '--heading-size':   { primitive: '--font-size-xl-2',   value: '1.875rem',   type: 'size' },
      '--heading-color':  { primitive: '--color-black-900',  value: '#111111',    type: 'color' },
      '--heading-weight': { primitive: '--font-weight-bold', value: '700',        type: 'size' },
      '--body-font':      { primitive: '--font-lora',        value: '"Lora", Times, serif', type: 'font' },
      '--body-size':      { primitive: '--font-size-md',     value: '1rem',       type: 'size' },
      '--body-color':     { primitive: '--color-black-900',  value: '#111111',    type: 'color' },
      '--ui-font':        { primitive: '--font-lora',        value: '"Lora", Times, serif', type: 'font' },
      '--label-size':     { primitive: '--font-size-xs',     value: '0.75rem',    type: 'size' },
      '--caption-size':   { primitive: '--font-size-xs',     value: '0.75rem',    type: 'size' },
      '--caption-color':  { primitive: '--color-grey-500',   value: '#6b6b6b',    type: 'color' },
      '--accent-color':   { primitive: '--color-blue-601',   value: '#0f6cc9',    type: 'color' },
      '--surface-bg':     { primitive: '--color-white',      value: '#ffffff',    type: 'color' },
      '--border-color':   { primitive: '--color-grey-200',   value: '#d4d4d4',    type: 'color' },
      '--space-tight':    { primitive: '--spacing-sm',       value: '8px',        type: 'size' },
      '--space-loose':    { primitive: '--spacing-sm',       value: '8px',        type: 'size' },
      '--radius':         { primitive: '--radius-sm',        value: '2px',        type: 'size' },
    }
  }
};

let currentBrand = 'broadsheet';
let overrides = {};

// --- Brand switching ---
document.getElementById('brand-switcher').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-brand]');
  if (!btn) return;

  currentBrand = btn.dataset.brand;
  document.getElementById('brand-css').href = `css/brands/${currentBrand}.css`;

  btn.closest('.switcher').querySelectorAll('.switcher__btn').forEach(b => {
    b.setAttribute('aria-pressed', b === btn);
  });

  clearOverrides();
  renderTokenList();
});

// --- Layout switching ---
document.getElementById('layout-switcher').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-layout]');
  if (!btn) return;

  document.getElementById('layout-css').href = `css/layouts/${btn.dataset.layout}.css`;

  btn.closest('.switcher').querySelectorAll('.switcher__btn').forEach(b => {
    b.setAttribute('aria-pressed', b === btn);
  });
});

// --- Token inspector ---
function renderTokenList() {
  const list = document.getElementById('token-list');
  const tokens = BRANDS[currentBrand].tokens;
  list.innerHTML = '';

  for (const [semantic, info] of Object.entries(tokens)) {
    const li = document.createElement('li');
    li.className = 'token-row';
    li.dataset.token = semantic;

    const isOverridden = semantic in overrides;
    if (isOverridden) li.classList.add('token-row--modified');

    const semanticEl = document.createElement('span');
    semanticEl.className = 'token-row__semantic';
    semanticEl.textContent = semantic;

    const primitiveEl = document.createElement('span');
    primitiveEl.className = 'token-row__primitive';
    primitiveEl.textContent = `\u2192 ${info.primitive}`;

    const inputGroup = document.createElement('div');
    inputGroup.className = 'token-row__input-group';

    if (info.type === 'color') {
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.className = 'token-row__color-swatch';
      colorInput.value = toHex(isOverridden ? overrides[semantic] : info.value);
      colorInput.addEventListener('input', (e) => {
        applyOverride(semantic, e.target.value);
        const textInput = inputGroup.querySelector('.token-row__input');
        if (textInput) textInput.value = e.target.value;
      });
      inputGroup.appendChild(colorInput);
    }

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'token-row__input';
    textInput.value = isOverridden ? overrides[semantic] : info.value;
    textInput.addEventListener('input', (e) => {
      applyOverride(semantic, e.target.value);
      if (info.type === 'color') {
        const swatch = inputGroup.querySelector('.token-row__color-swatch');
        if (swatch) {
          const hex = toHex(e.target.value);
          if (hex) swatch.value = hex;
        }
      }
    });
    inputGroup.appendChild(textInput);

    li.appendChild(semanticEl);
    li.appendChild(primitiveEl);
    li.appendChild(inputGroup);
    list.appendChild(li);
  }
}

function applyOverride(token, value) {
  overrides[token] = value;
  document.documentElement.style.setProperty(token, value);

  const row = document.querySelector(`[data-token="${token}"]`);
  if (row) row.classList.add('token-row--modified');
}

function clearOverrides() {
  for (const token of Object.keys(overrides)) {
    document.documentElement.style.removeProperty(token);
  }
  overrides = {};
}

// --- Reset ---
document.getElementById('reset-btn').addEventListener('click', () => {
  clearOverrides();
  renderTokenList();
});

// --- Helpers ---
function toHex(color) {
  if (!color) return null;
  if (color.startsWith('#')) {
    if (color.length === 4) {
      return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    return color;
  }
  const temp = document.createElement('div');
  temp.style.color = color;
  document.body.appendChild(temp);
  const computed = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return null;
}

// --- Init ---
renderTokenList();
