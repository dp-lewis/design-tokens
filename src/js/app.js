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
// Token definitions with groups — order matters for display
const TOKEN_DEFS = [
  { token: '--heading-font',   group: 'Typography', type: 'font' },
  { token: '--heading-size',   group: 'Typography', type: 'size' },
  { token: '--heading-color',  group: 'Typography', type: 'color' },
  { token: '--heading-weight', group: 'Typography', type: 'size' },
  { token: '--body-font',      group: 'Typography', type: 'font' },
  { token: '--body-size',      group: 'Typography', type: 'size' },
  { token: '--body-color',     group: 'Typography', type: 'color' },
  { token: '--ui-font',        group: 'Typography', type: 'font' },
  { token: '--label-size',     group: 'Typography', type: 'size' },
  { token: '--caption-size',   group: 'Typography', type: 'size' },
  { token: '--caption-color',  group: 'Typography', type: 'color' },
  { token: '--accent-color',   group: 'Color',      type: 'color' },
  { token: '--surface-bg',     group: 'Color',      type: 'color' },
  { token: '--border-color',   group: 'Color',      type: 'color' },
  { token: '--space-tight',    group: 'Spacing',    type: 'size' },
  { token: '--space-loose',    group: 'Spacing',    type: 'size' },
  { token: '--radius',         group: 'Spacing',    type: 'size' },
];

// Per-brand primitive mappings
const BRANDS = {
  broadsheet: {
    label: 'Broadsheet',
    primitives: {
      '--heading-font':   '--font-playfair',
      '--heading-size':   '--font-size-xl',
      '--heading-color':  '--color-navy-900',
      '--heading-weight': '--font-weight-bold',
      '--body-font':      '--font-pt-serif',
      '--body-size':      '--font-size-md',
      '--body-color':     '--color-navy-900',
      '--ui-font':        '--font-pt-sans',
      '--label-size':     '--font-size-sm',
      '--caption-size':   '--font-size-xs',
      '--caption-color':  '--color-grey-500',
      '--accent-color':   '--color-blue-600',
      '--surface-bg':     '--color-white',
      '--border-color':   '--color-grey-200',
      '--space-tight':    '--spacing-md',
      '--space-loose':    '--spacing-xl',
      '--radius':         '--radius-sm',
    }
  },
  tabloid: {
    label: 'Tabloid',
    primitives: {
      '--heading-font':   '--font-nunito',
      '--heading-size':   '--font-size-xl',
      '--heading-color':  '--color-black-alpha-81',
      '--heading-weight': '--font-weight-bold',
      '--body-font':      '--font-noto-sans',
      '--body-size':      '--font-size-md',
      '--body-color':     '--color-black-alpha-81',
      '--ui-font':        '--font-noto-sans',
      '--label-size':     '--font-size-sm',
      '--caption-size':   '--font-size-xs',
      '--caption-color':  '--color-black-alpha-58',
      '--accent-color':   '--color-black-alpha-58',
      '--surface-bg':     '--color-white',
      '--border-color':   '--color-grey-100',
      '--space-tight':    '--spacing-sm',
      '--space-loose':    '--spacing-md',
      '--radius':         '--radius-md',
    }
  },
  financial: {
    label: 'Financial',
    primitives: {
      '--heading-font':   '--font-lora',
      '--heading-size':   '--font-size-xl-2',
      '--heading-color':  '--color-black-900',
      '--heading-weight': '--font-weight-bold',
      '--body-font':      '--font-lora',
      '--body-size':      '--font-size-md',
      '--body-color':     '--color-black-900',
      '--ui-font':        '--font-lora',
      '--label-size':     '--font-size-xs',
      '--caption-size':   '--font-size-xs',
      '--caption-color':  '--color-grey-500',
      '--accent-color':   '--color-blue-601',
      '--surface-bg':     '--color-white',
      '--border-color':   '--color-grey-200',
      '--space-tight':    '--spacing-sm',
      '--space-loose':    '--spacing-sm',
      '--radius':         '--radius-sm',
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

// --- Mode switching ---
document.getElementById('mode-switcher').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-mode]');
  if (!btn) return;

  const modeLink = document.getElementById('mode-css');
  modeLink.disabled = (btn.dataset.mode === 'light');

  btn.closest('.switcher').querySelectorAll('.switcher__btn').forEach(b => {
    b.setAttribute('aria-pressed', b === btn);
  });
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
  const brand = BRANDS[currentBrand];
  list.innerHTML = '';

  let currentGroup = null;

  for (const def of TOKEN_DEFS) {
    const semantic = def.token;
    const defaultPrimitive = brand.primitives[semantic];
    if (!defaultPrimitive) continue;

    // Group heading
    if (def.group !== currentGroup) {
      currentGroup = def.group;
      const heading = document.createElement('li');
      heading.className = 'token-group-heading';
      heading.textContent = currentGroup;
      list.appendChild(heading);
    }

    const currentPrimitive = (semantic in overrides) ? overrides[semantic] : defaultPrimitive;
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

    const primitiveOptions = PRIMITIVES[def.type];
    for (const [primName, primValue] of Object.entries(primitiveOptions)) {
      const option = document.createElement('option');
      option.value = primName;
      option.textContent = `${primName.replace(/^--/, '')}  (${primValue})`;
      if (primName === currentPrimitive) option.selected = true;
      select.appendChild(option);
    }

    select.addEventListener('change', (e) => {
      const selectedPrimitive = e.target.value;
      const value = PRIMITIVES[def.type][selectedPrimitive];
      applyOverride(semantic, selectedPrimitive, value);
    });

    // Color swatch preview for color tokens
    if (def.type === 'color') {
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
