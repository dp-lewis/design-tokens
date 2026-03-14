/* ==========================================================================
   App — Brand/layout switching, token inspector, live editing
   ========================================================================== */

// --- Primitive tokens by type ---
const PRIMITIVES = {
  color: {
    '--color-navy-900':       '#0a1633',
    '--color-black-900':      '#111111',
    '--color-black-alpha-81': 'rgba(0, 0, 0, 0.81)',
    '--color-black-alpha-58': 'rgba(0, 0, 0, 0.58)',
    '--color-blue-600':       '#096dd2',
    '--color-blue-601':       '#0f6cc9',
    '--color-white':          '#ffffff',
    '--color-grey-50':        '#f5f5f5',
    '--color-grey-100':       '#e8e8e8',
    '--color-grey-200':       '#d4d4d4',
    '--color-grey-500':       '#6b6b6b',
  },
  font: {
    '--font-playfair':  '"Playfair Display"',
    '--font-pt-sans':   '"PT Sans"',
    '--font-pt-serif':  '"PT Serif"',
    '--font-lora':      '"Lora"',
    '--font-nunito':    '"Nunito"',
    '--font-noto-sans': '"Noto Sans"',
  },
  size: {
    '--font-size-xs':    '0.75rem',
    '--font-size-sm':    '0.875rem',
    '--font-size-md':    '1rem',
    '--font-size-lg':    '1.25rem',
    '--font-size-xl':    '1.5rem',
    '--font-size-xl-2':  '1.875rem',
    '--font-size-2xl':   '2rem',
    '--font-weight-normal': '400',
    '--font-weight-bold':   '700',
    '--spacing-xs':  '4px',
    '--spacing-sm':  '8px',
    '--spacing-md':  '12px',
    '--spacing-lg':  '16px',
    '--spacing-xl':  '24px',
    '--spacing-2xl': '32px',
    '--radius-sm':   '2px',
    '--radius-md':   '4px',
  },
};

// Semantic token → primitive token (per brand)
const BRANDS = {
  broadsheet: {
    label: 'Broadsheet',
    tokens: {
      '--heading-font':   { primitive: '--font-playfair',    type: 'font' },
      '--heading-size':   { primitive: '--font-size-xl',     type: 'size' },
      '--heading-color':  { primitive: '--color-navy-900',   type: 'color' },
      '--heading-weight': { primitive: '--font-weight-bold', type: 'size' },
      '--body-font':      { primitive: '--font-pt-serif',    type: 'font' },
      '--body-size':      { primitive: '--font-size-md',     type: 'size' },
      '--body-color':     { primitive: '--color-navy-900',   type: 'color' },
      '--ui-font':        { primitive: '--font-pt-sans',     type: 'font' },
      '--label-size':     { primitive: '--font-size-sm',     type: 'size' },
      '--caption-size':   { primitive: '--font-size-xs',     type: 'size' },
      '--caption-color':  { primitive: '--color-grey-500',   type: 'color' },
      '--accent-color':   { primitive: '--color-blue-600',   type: 'color' },
      '--surface-bg':     { primitive: '--color-white',      type: 'color' },
      '--border-color':   { primitive: '--color-grey-200',   type: 'color' },
      '--space-tight':    { primitive: '--spacing-md',       type: 'size' },
      '--space-loose':    { primitive: '--spacing-xl',       type: 'size' },
      '--radius':         { primitive: '--radius-sm',        type: 'size' },
    }
  },
  tabloid: {
    label: 'Tabloid',
    tokens: {
      '--heading-font':   { primitive: '--font-nunito',          type: 'font' },
      '--heading-size':   { primitive: '--font-size-xl',         type: 'size' },
      '--heading-color':  { primitive: '--color-black-alpha-81', type: 'color' },
      '--heading-weight': { primitive: '--font-weight-bold',     type: 'size' },
      '--body-font':      { primitive: '--font-noto-sans',       type: 'font' },
      '--body-size':      { primitive: '--font-size-md',         type: 'size' },
      '--body-color':     { primitive: '--color-black-alpha-81', type: 'color' },
      '--ui-font':        { primitive: '--font-noto-sans',       type: 'font' },
      '--label-size':     { primitive: '--font-size-sm',         type: 'size' },
      '--caption-size':   { primitive: '--font-size-xs',         type: 'size' },
      '--caption-color':  { primitive: '--color-black-alpha-58', type: 'color' },
      '--accent-color':   { primitive: '--color-black-alpha-58', type: 'color' },
      '--surface-bg':     { primitive: '--color-white',          type: 'color' },
      '--border-color':   { primitive: '--color-grey-100',       type: 'color' },
      '--space-tight':    { primitive: '--spacing-sm',           type: 'size' },
      '--space-loose':    { primitive: '--spacing-md',           type: 'size' },
      '--radius':         { primitive: '--radius-md',            type: 'size' },
    }
  },
  financial: {
    label: 'Financial',
    tokens: {
      '--heading-font':   { primitive: '--font-lora',        type: 'font' },
      '--heading-size':   { primitive: '--font-size-xl-2',   type: 'size' },
      '--heading-color':  { primitive: '--color-black-900',  type: 'color' },
      '--heading-weight': { primitive: '--font-weight-bold', type: 'size' },
      '--body-font':      { primitive: '--font-lora',        type: 'font' },
      '--body-size':      { primitive: '--font-size-md',     type: 'size' },
      '--body-color':     { primitive: '--color-black-900',  type: 'color' },
      '--ui-font':        { primitive: '--font-lora',        type: 'font' },
      '--label-size':     { primitive: '--font-size-xs',     type: 'size' },
      '--caption-size':   { primitive: '--font-size-xs',     type: 'size' },
      '--caption-color':  { primitive: '--color-grey-500',   type: 'color' },
      '--accent-color':   { primitive: '--color-blue-601',   type: 'color' },
      '--surface-bg':     { primitive: '--color-white',      type: 'color' },
      '--border-color':   { primitive: '--color-grey-200',   type: 'color' },
      '--space-tight':    { primitive: '--spacing-sm',       type: 'size' },
      '--space-loose':    { primitive: '--spacing-sm',       type: 'size' },
      '--radius':         { primitive: '--radius-sm',        type: 'size' },
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
    const currentPrimitive = (semantic in overrides) ? overrides[semantic] : info.primitive;
    const isOverridden = semantic in overrides;

    const li = document.createElement('li');
    li.className = 'token-row';
    li.dataset.token = semantic;
    if (isOverridden) li.classList.add('token-row--modified');

    // Semantic token name
    const semanticEl = document.createElement('span');
    semanticEl.className = 'token-row__semantic';
    semanticEl.textContent = semantic.replace(/^--/, '');

    // Primitive dropdown
    const selectGroup = document.createElement('div');
    selectGroup.className = 'token-row__input-group';

    const select = document.createElement('select');
    select.className = 'token-row__select';

    const primitiveOptions = PRIMITIVES[info.type];
    for (const [primName, primValue] of Object.entries(primitiveOptions)) {
      const option = document.createElement('option');
      option.value = primName;
      option.textContent = `${primName.replace(/^--/, '')}  (${primValue})`;
      if (primName === currentPrimitive) option.selected = true;
      select.appendChild(option);
    }

    select.addEventListener('change', (e) => {
      const selectedPrimitive = e.target.value;
      const value = PRIMITIVES[info.type][selectedPrimitive];
      applyOverride(semantic, selectedPrimitive, value);
    });

    // Color swatch preview for color tokens
    if (info.type === 'color') {
      const swatch = document.createElement('span');
      swatch.className = 'token-row__swatch';
      swatch.style.backgroundColor = PRIMITIVES.color[currentPrimitive];
      selectGroup.appendChild(swatch);
    }

    selectGroup.appendChild(select);

    li.appendChild(semanticEl);
    li.appendChild(selectGroup);
    list.appendChild(li);
  }
}

function applyOverride(semantic, primitive, value) {
  overrides[semantic] = primitive;
  document.documentElement.style.setProperty(semantic, value);

  const row = document.querySelector(`[data-token="${semantic}"]`);
  if (row) {
    row.classList.add('token-row--modified');
    // Update swatch if present
    const swatch = row.querySelector('.token-row__swatch');
    if (swatch) swatch.style.backgroundColor = value;
  }
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

// --- Init ---
renderTokenList();
