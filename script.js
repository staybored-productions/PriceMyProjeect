const CATEGORY_LABELS = {
 animation: 'Animation', illustration: 'Illustration', comic: 'Comic / Manga',
 video: 'Video Editing', graphic: 'Graphic Design', music: 'Music', website: 'Website', writing: 'Writing'
};

const REVISION_LABELS = {
 '0': 'Surprise me art (0 revisions)',
 '1': '1 revision',
 '2': '2 revisions',
 '3': '3 revisions',
 '4': '4 revisions',
 '5': '5 revisions',
 '6': '6 revisions',
 '7': '7 revisions',
 '8': '8 revisions',
 '9': '9 revisions',
 '10': '10 revisions',
 'unlimited': 'Unlimited revisions'
};

const USAGE_INFO = {
 organic: {
 label: 'Organic Usage',
 desc: 'Allows a brand to repost a creator\'s content on its own free social media channels, website, or emails without any ad spend.'
 },
 paid: {
 label: 'Paid Usage',
 desc: 'Permits a brand to use a creator\'s content inside paid advertisements or sponsored ad campaigns, which usually requires higher pay.'
 },
 royaltyfree: {
 label: 'Royalty-Free',
 desc: 'Requires a one-time fee to use content multiple times with no expiration date, though some specific limits may apply.'
 },
 rightsmanaged: {
 label: 'Rights-Managed',
 desc: 'Imposes strict, narrow limits on duration, geographic region, and medium, requiring a new license if usage changes.'
 },
 creativecommons: {
 label: 'Creative Commons',
 desc: 'Offers free public permission to use copyrighted work, but often requires giving credit and may ban commercial use or edits.'
 }
};

function getRevisionLabel(value) {
 return REVISION_LABELS[value] || value;
}
function getUsageLabel(value) {
 return USAGE_INFO[value]?.label || value;
}
function getUsageDesc(value) {
 return USAGE_INFO[value]?.desc || '';
}

const SUBTYPES = {
 animation: [['2d','2D Traditional'],['anime','Anime'],['motion','Motion Graphics'],['3d','3D Animation'],['cutout','Cutout / Rigged']],
 illustration: [['character','Character Art'],['cover','Cover Art'],['portrait','Portrait'],['concept','Concept Art'],['editorial','Editorial / Scene']],
 comic: [['pages','Interior Pages'],['cover','Comic Cover'],['manga','Manga Pages'],['lettering','Lettering'],['coloring','Coloring']],
 video: [['youtube','YouTube Video'],['shortform','Short-form / Reels'],['promo','Promo / Ad'],['musicvideo','Music Video'],['documentary','Documentary / Long-form']],
 graphic: [['logo','Logo'],['branding','Brand Identity'],['poster','Poster / Flyer'],['album','Album Cover'],['social','Social Graphics']],
 music: [['beat','Beat / Instrumental'],['score','Original Score'],['mix','Mixing'],['master','Mastering'],['song','Full Song Production']],
 website: [['landing','Landing Page'],['portfolio','Portfolio'],['business','Business Website'],['ecommerce','E-commerce'],['custom','Custom Web App']],
 writing: [['script','Script'],['copy','Website Copy'],['article','Article / Blog'],['editing','Editing'],['book','Book / Long-form']]
};

const SCOPES = {
 animation: [['15','15 seconds'],['30','30 seconds'],['60','60 seconds'],['120','2 minutes'],['300','5 minutes']],
 illustration: [['1','One simple piece'],['2','One detailed piece'],['3','2 to 3 pieces'],['5','4 to 5 pieces'],['10','6 to 10 pieces']],
 comic: [['1','1 page'],['5','5 pages'],['10','10 pages'],['20','20 pages'],['30','30+ pages']],
 video: [['30','30 seconds'],['60','1 minute'],['300','5 minutes'],['600','10 minutes'],['1200','20+ minutes']],
 graphic: [['1','One asset'],['3','3 assets'],['5','5 assets'],['10','10 assets'],['20','20+ assets']],
 music: [['30','30 seconds'],['60','1 minute'],['180','3 minutes'],['300','5 minutes'],['600','10+ minutes']],
 website: [['1','1 page'],['3','3 pages'],['5','5 pages'],['10','10 pages'],['20','10+ pages / custom']],
 writing: [['500','Up to 500 words'],['1000','~1,000 words'],['2500','~2,500 words'],['5000','~5,000 words'],['10000','10,000+ words']]
};

function estimateProject(data) {
 const categoryBase = {
 animation: [800, 2200], illustration: [90, 450], comic: [140, 450], video: [180, 700],
 graphic: [120, 550], music: [100, 600], website: [500, 1800], writing: [80, 400]
 };
 const complexityMult = { low: 0.8, medium: 1, high: 1.35 };
 const qualityMult = { basic: 0.75, indie: 1, pro: 1.3, studio: 1.7 };
 function getDeadlineMultiplier(deadlineDate) {
 if (!deadlineDate) return 1;
 const due = new Date(deadlineDate + 'T23:59:59');
 const now = new Date();
 const days = Math.max(0, (due - now) / 86400000);
 if (days <= 3) return 1.4;
 if (days <= 7) return 1.25;
 if (days <= 14) return 1.12;
 if (days >= 60) return 0.96;
 return 1;
 }
 const usageMult = { organic: 0.95, paid: 1.2, royaltyfree: 1.1, rightsmanaged: 1.05, creativecommons: 0.75 };
 const revisionsMult = { '0': 0.9, '1': 0.95, '2': 1, '3': 1.04, '4': 1.08, '5': 1.12, '6': 1.16, '7': 1.2, '8': 1.24, '9': 1.28, '10': 1.32, 'unlimited': 1.45 };

 const base = categoryBase[data.category] || [300, 1200];
 const scope = Number(data.scope || data.duration || 1);
 let scopeMult = 1;
 if (data.category === 'animation') scopeMult = Math.max(.55, scope / 30);
 if (data.category === 'illustration') scopeMult = Math.max(1, scope * .8);
 if (data.category === 'comic') scopeMult = Math.max(1, scope);
 if (data.category === 'video') scopeMult = Math.max(.7, scope / 60);
 if (data.category === 'graphic') scopeMult = Math.max(1, scope * .65);
 if (data.category === 'music') scopeMult = Math.max(.75, scope / 180);
 if (data.category === 'website') scopeMult = Math.max(1, scope * .55);
 if (data.category === 'writing') scopeMult = Math.max(.65, scope / 1000);

 const mult = scopeMult * (complexityMult[data.complexity] || 1) * (qualityMult[data.quality] || 1) *
 getDeadlineMultiplier(data.deadlineDate) * (usageMult[data.usage] || 1) * (revisionsMult[data.revisions] || 1);
 const low = Math.max(50, Math.round(base[0] * mult / 25) * 25);
 const high = Math.max(low + 50, Math.round(base[1] * mult / 25) * 25);
 const likely = Math.round(((low + high) / 2) / 25) * 25;
 return { low, high, likely };
}

function formatMoney(num) { return '$' + Number(num).toLocaleString(); }
function formatDeadlineDate(value) {
 if (!value) return 'Not set';
 const d = new Date(value + 'T12:00:00');
 return d.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' });
}


function guessCategoryFromText(text) {
 const q = String(text || '').toLowerCase();
 if (/(illustration|illustrator|portrait|character art|drawing|artwork|cover art)/.test(q)) return 'illustration';
 if (/(comic|manga|panel|lettering|colorist)/.test(q)) return 'comic';
 if (/(video edit|video editing|editor|youtube video|reel|short)/.test(q)) return 'video';
 if (/(graphic design|logo|branding|poster|album cover|flyer)/.test(q)) return 'graphic';
 if (/(music|song|beat|soundtrack|composer|audio|mix|master)/.test(q)) return 'music';
 if (/(website|web site|landing page|web design|developer|frontend|web app)/.test(q)) return 'website';
 if (/(writing|writer|script|copywriting|article|book|proofread)/.test(q)) return 'writing';
 return 'animation';
}

function attachHeroSearch() {
 const form = document.querySelector('#hero-search-form');
 const input = document.querySelector('#hero-project-input');
 if (!form || !input) return;
 form.addEventListener('submit', function (e) {
 e.preventDefault();
 const project = input.value.trim();
 if (!project) { input.focus(); return; }
 const params = new URLSearchParams({ category: guessCategoryFromText(project), scene: project });
 window.location.href = 'pages/calculator.html?' + params.toString();
 });
}

function initMultiCalculator() {
 const root = document.querySelector('#multi-calculator');
 const form = document.querySelector('#multi-estimate-form');
 if (!root || !form) return;

 let step = 1;
 const total = 7;
 const state = {
 category: '', subtype: '', scope: '', complexity: '', quality: '',
 scene: '', deadlineDate: '2026-11-05', revisions: '2', usage: 'organic', quote: ''
 };

 const currentEl = document.querySelector('#step-current');
 const totalEl = document.querySelector('#step-total');
 const progress = document.querySelector('#progress-fill');
 const backBtn = document.querySelector('#back-step');
 const nextBtn = document.querySelector('#next-step');
 const submitBtn = document.querySelector('#generate-estimate');
 const errorEl = document.querySelector('#step-error');
 totalEl.textContent = total;

 const usageHelpEl = document.querySelector('#usage-help');
 function refreshUsageHelp() {
 const value = document.querySelector('#usage')?.value || state.usage;
 if (usageHelpEl) {
 usageHelpEl.textContent = `${getUsageLabel(value)}, ${getUsageDesc(value)}`;
 }
 }

 function chooseCard(btn) {
 const field = btn.dataset.field;
 const value = btn.dataset.value;
 state[field] = value;
 document.querySelectorAll(`.choice-card[data-field="${field}"]`).forEach(el => el.classList.remove('selected'));
 btn.classList.add('selected');
 const hidden = document.querySelector(`#${field}-field`);
 if (hidden) hidden.value = value;
 errorEl.textContent = '';
 if (field === 'category') buildSubtypeGrid();
 }

 root.addEventListener('click', e => {
 const btn = e.target.closest('.choice-card');
 if (btn) chooseCard(btn);
 });

 function buildSubtypeGrid() {
 const grid = document.querySelector('#subtype-grid');
 grid.innerHTML = '';
 const items = SUBTYPES[state.category] || SUBTYPES.animation;
 items.forEach(([value,label]) => {
 const b = document.createElement('button');
 b.type='button'; b.className='choice-card'; b.dataset.field='subtype'; b.dataset.value=value;
 b.innerHTML=`<strong>${label}</strong><small>Select ${label.toLowerCase()} pricing</small>`;
 if (state.subtype === value) b.classList.add('selected');
 grid.appendChild(b);
 });
 document.querySelectorAll('[data-category-label]').forEach(el => el.textContent = CATEGORY_LABELS[state.category] || 'project');
 }

 function buildScopeGrid() {
 const grid = document.querySelector('#scope-grid');
 grid.innerHTML = '';
 const items = SCOPES[state.category] || SCOPES.animation;
 items.forEach(([value,label]) => {
 const b = document.createElement('button');
 b.type='button'; b.className='choice-card'; b.dataset.field='scope'; b.dataset.value=value;
 b.innerHTML=`<strong>${label}</strong><small>Choose this scope</small>`;
 if (state.scope === value) b.classList.add('selected');
 grid.appendChild(b);
 });
 }

 function syncRequirements() {
 state.scene = document.querySelector('#project-details')?.value || state.scene;
 state.deadlineDate = document.querySelector('#deadline-date')?.value || state.deadlineDate;
 state.revisions = document.querySelector('#revisions')?.value || state.revisions;
 state.usage = document.querySelector('#usage')?.value || state.usage;
 state.quote = document.querySelector('#quote')?.value || '';
 }

 document.querySelector('#usage')?.addEventListener('change', refreshUsageHelp);
 refreshUsageHelp();

 function reviewMarkup() {
 syncRequirements();
 const subtypeLabel = (SUBTYPES[state.category] || []).find(x=>x[0]===state.subtype)?.[1] || ', ';
 const scopeLabel = (SCOPES[state.category] || []).find(x=>x[0]===state.scope)?.[1] || ', ';
 const map = {low:'Low',medium:'Medium',high:'High',basic:'Basic',indie:'Indie',pro:'Professional Indie',studio:'Studio',flexible:'Flexible',normal:'Normal',rush:'Rush'};
 document.querySelector('#review-card').innerHTML = `
 <div class="review-row"><span>Category</span><strong>${CATEGORY_LABELS[state.category] || ', '}</strong></div>
 <div class="review-row"><span>Type</span><strong>${subtypeLabel}</strong></div>
 <div class="review-row"><span>Scope</span><strong>${scopeLabel}</strong></div>
 <div class="review-row"><span>Details</span><strong>${state.scene || 'Not specified'}</strong></div>
 <div class="review-row"><span>Complexity</span><strong>${map[state.complexity] || ', '}</strong></div>
 <div class="review-row"><span>Quality</span><strong>${map[state.quality] || ', '}</strong></div>
 <div class="review-row"><span>Estimated deadline</span><strong>${formatDeadlineDate(state.deadlineDate)}</strong></div>
 <div class="review-row"><span>Revisions</span><strong>${getRevisionLabel(state.revisions)}</strong></div>
 <div class="review-row"><span>Usage</span><strong>${getUsageLabel(state.usage)}</strong></div>
 <div class="review-row"><span>Usage details</span><strong>${getUsageDesc(state.usage)}</strong></div>
 ${state.quote ? `<div class="review-row"><span>Your existing quote</span><strong>${formatMoney(state.quote)}</strong></div>` : ''}`;
 }

 function validateStep() {
 const need = {1:'category',2:'subtype',3:'scope',4:'complexity',5:'quality'};
 const field = need[step];
 if (field && !state[field]) {
 errorEl.textContent = 'Choose an option to continue.';
 return false;
 }
 return true;
 }

 function showStep(n) {
 step = Math.max(1, Math.min(total, n));
 document.querySelectorAll('.calc-step').forEach(el => el.classList.toggle('active', Number(el.dataset.step) === step));
 currentEl.textContent = step;
 progress.style.width = `${(step / total) * 100}%`;
 backBtn.disabled = step === 1;
 nextBtn.classList.toggle('hidden', step === total);
 submitBtn.classList.toggle('hidden', step !== total);
 errorEl.textContent = '';
 if (step === 2) buildSubtypeGrid();
 if (step === 3) buildScopeGrid();
 if (step === 7) reviewMarkup();
 root.scrollIntoView({behavior:'smooth', block:'start'});
 }

 nextBtn.addEventListener('click', () => {
 if (!validateStep()) return;
 if (step === 3) syncRequirements();
 showStep(step + 1);
 });
 backBtn.addEventListener('click', () => showStep(step - 1));

 form.addEventListener('submit', e => {
 e.preventDefault();
 syncRequirements();
 const params = new URLSearchParams(state);
 window.location.href = form.dataset.results + '?' + params.toString();
 });

 const params = new URLSearchParams(window.location.search);
 const incomingCategory = params.get('category');
 const incomingScene = params.get('scene') || params.get('project');
 if (incomingCategory && CATEGORY_LABELS[incomingCategory]) {
 state.category = incomingCategory;
 document.querySelector('#category-field').value = incomingCategory;
 const btn = document.querySelector(`.choice-card[data-field="category"][data-value="${incomingCategory}"]`);
 if (btn) btn.classList.add('selected');
 }
 if (incomingScene) {
 state.scene = incomingScene;
 document.querySelector('#project-details').value = incomingScene;
 }
 showStep(1);
}

function fillResultsPage() {
 const wrap = document.querySelector('[data-results-page]');
 if (!wrap) return;
 const params = new URLSearchParams(window.location.search);
 const data = {
 category: params.get('category') || 'animation', subtype: params.get('subtype') || '',
 scope: params.get('scope') || params.get('duration') || '30', complexity: params.get('complexity') || 'high',
 quality: params.get('quality') || 'pro', scene: params.get('scene') || 'Project details not specified',
 deadlineDate: params.get('deadlineDate') || '2026-11-05', revisions: params.get('revisions') || '2', usage: params.get('usage') || 'organic'
 };
 const result = estimateProject(data);
 document.querySelectorAll('[data-price-low]').forEach(el => el.textContent = formatMoney(result.low));
 document.querySelectorAll('[data-price-high]').forEach(el => el.textContent = formatMoney(result.high));
 document.querySelectorAll('[data-price-likely]').forEach(el => el.textContent = formatMoney(result.likely));
 const qualityMap = { basic:'Basic', indie:'Indie', pro:'Professional Indie', studio:'Studio' };
 const complexityMap = { low:'Low', medium:'Medium', high:'High' };
 const scopeLabel = (SCOPES[data.category] || []).find(x=>x[0]===data.scope)?.[1] || data.scope;
 const subtypeLabel = (SUBTYPES[data.category] || []).find(x=>x[0]===data.subtype)?.[1] || 'General';
 document.querySelectorAll('[data-project-type]').forEach(el => el.textContent = `${CATEGORY_LABELS[data.category] || 'Project'}, ${subtypeLabel}`);
 document.querySelectorAll('[data-project-duration]').forEach(el => el.textContent = scopeLabel);
 document.querySelectorAll('[data-project-scene]').forEach(el => el.textContent = data.scene);
 document.querySelectorAll('[data-project-complexity]').forEach(el => el.textContent = complexityMap[data.complexity] || 'Medium');
 document.querySelectorAll('[data-project-quality]').forEach(el => el.textContent = qualityMap[data.quality] || 'Indie');

 const quoteValue = params.get('quote');
 const quoteBlock = document.querySelector('[data-quote-check]');
 if (quoteBlock) {
 if (quoteValue) {
 const quote = Number(quoteValue);
 const verdict = quote >= result.low && quote <= result.high ? 'Within the expected range' : (quote < result.low ? 'Below the expected range' : 'Above the expected range');
 quoteBlock.innerHTML = `<strong>${formatMoney(quote)}</strong>, ${verdict}`;
 } else {
 quoteBlock.textContent = 'No existing quote was entered. Use this range when comparing freelancer proposals.';
 }
 }
}

document.addEventListener('DOMContentLoaded', () => {
 attachHeroSearch();
 initMultiCalculator();
 fillResultsPage();
});


// Mobile hamburger menu, hidden by default, revealed only after tap
function initMobileMenu() {
 document.querySelectorAll('.topbar .nav').forEach(nav => {
 const menu = nav.querySelector('nav.menu');
 const toggle = nav.querySelector('.menu-toggle');
 if (!menu || !toggle) return;

 const sync = () => {
 if (window.innerWidth <= 840) {
 menu.hidden = toggle.getAttribute('aria-expanded') !== 'true';
 } else {
 menu.hidden = false;
 toggle.setAttribute('aria-expanded','false');
 }
 };

 // Always start CLOSED on mobile.
 toggle.setAttribute('aria-expanded','false');
 if (window.innerWidth <= 840) menu.hidden = true;

 toggle.addEventListener('click', e => {
 e.preventDefault();
 const opening = toggle.getAttribute('aria-expanded') !== 'true';
 toggle.setAttribute('aria-expanded', opening ? 'true' : 'false');
 toggle.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
 menu.hidden = !opening;
 });

 menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
 if (window.innerWidth <= 840) {
 menu.hidden = true;
 toggle.setAttribute('aria-expanded','false');
 }
 }));
 window.addEventListener('resize', sync);
 sync();
 });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMobileMenu);
else initMobileMenu();


/* v23: accessible front-end forms; no backend configured yet. */
function initCommunityForms() {
  function showMessage(form, message, kind) {
    const status = form.querySelector('.form-status');
    if (!status) return;
    status.hidden = false;
    status.dataset.kind = kind;
    status.textContent = message;
  }
  function validateEmail(input) {
    if (!input) return false;
    input.setCustomValidity('');
    const valid = input.checkValidity();
    input.setAttribute('aria-invalid', String(!valid));
    return valid;
  }
  document.querySelectorAll('[data-signup-form]').forEach(form => {
    const email = form.elements.namedItem('email');
    email.addEventListener('input', () => { email.setCustomValidity(''); email.removeAttribute('aria-invalid'); });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validateEmail(email)) {
        showMessage(form, 'Enter a valid email address to join the mailing list.', 'error');
        email.focus(); return;
      }
      showMessage(form, 'The mailing list is not accepting signups yet. Your email has not been submitted or saved.', 'error');
    });
  });
  const feedbackForm = document.querySelector('[data-feedback-form]');
  if (!feedbackForm) return;
  const message = feedbackForm.elements.namedItem('feedback');
  const email = feedbackForm.elements.namedItem('email');
  const optIn = feedbackForm.elements.namedItem('mailing_list_opt_in');
  [message, email].forEach(field => field.addEventListener('input', () => {
    field.setCustomValidity(''); field.removeAttribute('aria-invalid');
  }));
  feedbackForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!message.checkValidity()) {
      message.setAttribute('aria-invalid', 'true');
      showMessage(feedbackForm, 'Please enter at least 10 characters of feedback.', 'error');
      message.focus(); return;
    }
    if (email.value.trim() && !validateEmail(email)) {
      showMessage(feedbackForm, 'Enter a valid email address, or leave the email field blank.', 'error');
      email.focus(); return;
    }
    if (optIn.checked && !email.value.trim()) {
      email.setAttribute('aria-invalid', 'true');
      showMessage(feedbackForm, 'Enter your email address to opt in to the mailing list, or uncheck the box.', 'error');
      email.focus(); return;
    }
    showMessage(feedbackForm, 'Feedback submissions are not active yet. Your feedback and email have not been submitted or saved.', 'error');
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCommunityForms);
} else {
  initCommunityForms();
}
