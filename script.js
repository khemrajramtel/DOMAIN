/* ================================================================
   AREA 69 — SPA ENGINE v2
   Routes · Components · Pages
================================================================ */

// -- MOCK API SERVICE -----------------------------------------
const ApiService = {
  async getStats() {
    try {
      const res = await fetch('https://area69.wisp.uno/api/stats');
      if (!res.ok) throw new Error('API down');
      return await res.json();
    } catch (e) {
      console.error('Failed to fetch stats:', e);
      return { members: '...', online: '...', boostLevel: '?' };
    }
  },
  async getStaff() {
    try {
      const res = await fetch('https://area69.wisp.uno/api/staff');
      if (!res.ok) throw new Error('API down');
      return await res.json();
    } catch (e) {
      console.error('Failed to fetch staff:', e);
      return []; // Return empty array if failed
    }
  }
};

// -- ROUTER ---------------------------------------------------
const routes = {
  '/': renderHome,
  '/features': renderFeatures,
  '/staff': renderStaff,
  '/faq': renderFAQ,
  '/support': renderSupport
};

function navigateTo(url) {
  if (location.protocol === 'file:') {
    const page = url === '/' ? 'home' : url.substring(1);
    location.hash = page;
  } else {
    history.pushState(null, null, url);
    router();
  }
}

async function router() {
  let path = location.pathname;

  if (location.protocol === 'file:') {
    const hash = location.hash.replace('#', '');
    path = hash ? '/' + hash : '/';
    if (path === '/home') path = '/';
  } else {
    if (path.endsWith('index.html')) path = '/';
  }

  const app = document.getElementById('app');
  const old = app.querySelector('.page.active');
  if (old) {
    old.style.opacity = '0';
    old.style.transform = 'translateY(-10px)';
    old.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    await new Promise(r => setTimeout(r, 250));
    app.innerHTML = '';
  } else {
    app.innerHTML = '';
  }

  const container = document.createElement('div');
  container.className = 'page active';
  app.appendChild(container);

  const renderFn = routes[path] || renderNotFound;
  await renderFn(container);

  updateNavActive(path);
  window.scrollTo(0, 0);
  attachBtnListeners();
}

// -- SHELL COMPONENTS ----------------------------------------

function renderNavbar() {
  document.getElementById('navbar-container').innerHTML = `
    <nav class="navbar">
      <a href="/" class="nav-brand" data-link>
        <img src="logo.png" alt="Area 69" class="nav-brand-logo">
        <span>Area 69</span>
      </a>
      <div class="nav-links">
        <a href="/"         class="nav-link" data-link>Home</a>
        <a href="/features" class="nav-link" data-link>Features</a>
        <a href="/staff"    class="nav-link" data-link>Staff</a>
        <a href="/faq"      class="nav-link" data-link>FAQ</a>
        <a href="/support"  class="nav-link" data-link>Support</a>
      </div>
      <a href="https://discord.gg/area69" target="_blank" rel="noreferrer" class="nav-cta">
        <i class="bi bi-discord"></i> Join Discord
      </a>
      <button class="hamburger" id="mobile-menu-btn" aria-label="Toggle menu">
        <i class="bi bi-list"></i>
      </button>
    </nav>
    <div class="mobile-nav-overlay" id="mobile-nav">
      <a href="/"         class="nav-link" data-link>Home</a>
      <a href="/features" class="nav-link" data-link>Features</a>
      <a href="/staff"    class="nav-link" data-link>Staff</a>
      <a href="/faq"      class="nav-link" data-link>FAQ</a>
      <a href="/support"  class="nav-link" data-link>Support</a>
      <a href="https://discord.gg/2GZ84WyFJp" target="_blank" rel="noreferrer" class="mobile-cta">
        <i class="bi bi-discord"></i> Join Discord
      </a>
    </div>
  `;

  const btn = document.getElementById('mobile-menu-btn');
  const mobile = document.getElementById('mobile-nav');

  btn.addEventListener('click', () => {
    mobile.classList.toggle('open');
    btn.innerHTML = mobile.classList.contains('open')
      ? '<i class="bi bi-x-lg"></i>'
      : '<i class="bi bi-list"></i>';
  });

  mobile.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobile.classList.remove('open');
      btn.innerHTML = '<i class="bi bi-list"></i>';
    });
  });
}

function updateNavActive(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === path);
  });
}

function renderFooter() {
  document.getElementById('footer-container').innerHTML = `
    <footer class="footer">
      <p>Thank You For Visiting Us</p>
    </footer>
  `;
}

function showNotification(message) {
  const container = document.getElementById('notification-container');
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.innerHTML = `<i class="bi bi-broadcast notification-icon"></i><span>${message}</span>`;
  container.appendChild(notif);
  setTimeout(() => notif.classList.add('show'), 80);
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 420);
  }, 5500);
}

// -- PAGE: HOME ----------------------------------------------

async function renderHome(container) {
  container.innerHTML = `
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-eyebrow">
          <span class="pill-badge"><span class="status-dot"></span>Live Server</span>
        </div>
        <h1 class="hero-title">
          <span class="gradient-text">Area 69</span>
          <span class="hero-subtitle-line">No Filters. No Limits. Just Vibes.</span>
        </h1>
        <p class="hero-desc">
          A chill, unrestricted Discord community built around gaming, memes, voice channels, and genuine connections. We're growing, so join early and help shape something great.
        </p>
        <div class="hero-actions">
          <a href="https://discord.gg/2GZ84WyFJp" target="_blank" rel="noreferrer" class="btn btn-primary">
            <i class="bi bi-discord"></i> Join Discord
          </a>
          <a href="/features" class="btn btn-ghost" data-link>
            <i class="bi bi-arrow-right"></i> Explore Features
          </a>
        </div>
      </div>

      <div class="hero-stats">
        <div class="stat-card">
          <div class="stat-icon-wrap"><i class="bi bi-people-fill"></i></div>
          <div class="stat-body">
            <span class="stat-value" id="s-members">...</span>
            <span class="stat-label">Total Members</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background:rgba(67,181,129,0.1); border-color:rgba(67,181,129,0.2); color:#43b581;">
            <i class="bi bi-circle-fill" style="font-size:0.7rem;"></i>
          </div>
          <div class="stat-body">
            <span class="stat-value" id="s-online">...</span>
            <span class="stat-label">Online Now</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap" style="background:rgba(244,127,255,0.1); border-color:rgba(244,127,255,0.2); color:#f47fff;">
            <i class="bi bi-rocket-takeoff-fill"></i>
          </div>
          <div class="stat-body">
            <span class="stat-value" id="s-boost">...</span>
            <span class="stat-label">Server Boosts</span>
          </div>
        </div>
      </div>
    </section>
  `;

  try {
    const stats = await ApiService.getStats();
    const set = (id, val) => { const el = container.querySelector(id); if (el) el.textContent = val; };
    set('#s-members', stats.members.toLocaleString());
    set('#s-online', stats.online.toLocaleString());
    set('#s-boost', stats.boostCount !== undefined ? `${stats.boostCount} (Lvl ${stats.boostLevel})` : `Level ${stats.boostLevel}`);
  } catch (e) {
    console.error('Stats fetch failed', e);
  }
}

// -- PAGE: FEATURES ------------------------------------------

function renderFeatures(container) {
  const features = [
    { icon: 'bi-controller', title: 'Gaming Community', body: 'Find teammates, discuss your favorite games, and compete with like-minded players from around the world.' },
    { icon: 'bi-emoji-laughing', title: 'Memes & Entertainment', body: 'A dedicated space for the best memes, funny clips, and daily content to keep the community vibes high.' },
    { icon: 'bi-chat-dots', title: 'Unrestricted Chat', body: 'Active text channels for all sorts of conversations. No heavy filtering, just genuine respect.' },
    { icon: 'bi-mic', title: 'Voice Channels', body: 'High-quality voice rooms for gaming sessions, music listening, or just hanging out with the community.' },
    { icon: 'bi-robot', title: 'Custom Bots', body: 'Leveling systems, economy features, music, and custom utilities built specifically for Area 69.' },
    { icon: 'bi-stars', title: 'Always Evolving', body: 'Leaderboards, community events, giveaways, and more are on the roadmap as we continue to grow.' }
  ];

  container.innerHTML = `
    <div class="page-section">
      <div class="section-header">
        <span class="section-eyebrow">What We Offer</span>
        <h2 class="section-title">Everything in one place</h2>
        <p class="section-subtitle">Area 69 is more than a server; it's a platform built around community, fun, and continuous improvement.</p>
      </div>
      <div class="feature-grid">
        ${features.map(f => `
          <div class="card feature-card">
            <div class="feature-icon-wrap"><i class="bi ${f.icon}"></i></div>
            <h3>${f.title}</h3>
            <p>${f.body}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// -- PAGE: STAFF ---------------------------------------------

// Discord-accurate status SVGs
function statusSVG(status) {
  const s = {
    online:  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#23a559"/></svg>`,
    idle:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#f0b232"/><circle cx="10" cy="5" r="5" fill="#111318"/></svg>`,
    dnd:     `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#f23f43"/><rect x="3" y="6.5" width="10" height="3" rx="1.5" fill="#111318"/></svg>`,
    offline: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#80848e"/><circle cx="8" cy="8" r="4" fill="#111318"/></svg>`,
  };
  return s[status] || s.offline;
}

// Render Discord-style activity block
function renderActivityBlock(act, customStatus) {
  const parts = [];

  if (customStatus) {
    parts.push(`<div class="act-custom">${customStatus}</div>`);
  }

  if (!act) return parts.join('');

  if (act.type === 'spotify') {
    const cover = act.albumCover
      ? `<img src="${act.albumCover}" class="act-spotify-cover" alt="album" loading="lazy">`
      : '';
    parts.push(`
      <div class="act-block act-spotify">
        <div class="act-label"><i class="bi bi-spotify"></i> LISTENING TO SPOTIFY</div>
        <div class="act-spotify-inner">
          ${cover}
          <div class="act-spotify-text">
            <div class="act-name">${act.name}</div>
            <div class="act-detail">by ${act.artist}</div>
            <div class="act-detail">${act.album}</div>
          </div>
        </div>
      </div>`);
  } else if (act.type === 'streaming') {
    parts.push(`
      <div class="act-block act-streaming">
        <div class="act-label act-live"><span class="act-live-dot"></span> LIVE</div>
        <div class="act-name">${act.name}</div>
        ${act.details ? `<div class="act-detail">${act.details}</div>` : ''}
      </div>`);
  } else if (act.type === 'game') {
    parts.push(`
      <div class="act-block">
        <div class="act-label">PLAYING A GAME</div>
        <div class="act-name">${act.name}</div>
      </div>`);
  } else if (act.type === 'activity') {
    parts.push(`
      <div class="act-block">
        <div class="act-label">PLAYING</div>
        ${act.image ? `<img src="${act.image}" class="act-app-icon" alt="" loading="lazy">` : ''}
        <div class="act-name">${act.name}</div>
        ${act.details ? `<div class="act-detail">${act.details}</div>` : ''}
        ${act.state  ? `<div class="act-detail">${act.state}</div>` : ''}
      </div>`);
  }

  return parts.join('');
}

// Render guild tag badge
function renderGuildTag(tag) {
  if (!tag) return '';
  const icon = tag.icon
    ? `<img src="${tag.icon}" class="act-tag-icon" alt="" loading="lazy">`
    : '';
  return `<span class="staff-tag-badge" title="${tag.name || tag.tag}">${icon}${tag.tag}</span>`;
}

async function renderStaff(container) {
  container.innerHTML = `
    <div class="page-section">
      <div class="section-header">
        <span class="section-eyebrow">The Team</span>
        <h2 class="section-title">Meet the people behind Area 69</h2>
        <p class="section-subtitle">Our team keeps the server running, the community safe, and the vibes immaculate.</p>
      </div>
      <div class="staff-grid" id="staff-grid">
        <div class="card" style="text-align:center; padding:2rem; grid-column:1/-1;">
          <p style="color:var(--text-muted); font-family:var(--font-mono); font-size:0.85rem;">// fetching staff data...</p>
        </div>
      </div>
    </div>
  `;

  try {
    const rawStaff = await ApiService.getStaff();
    const grid  = container.querySelector('#staff-grid');

    const ROLE_MAP = {
      "1476496400198926366": "Appeal Mod",
      "1476303275337847038": "Ticket Mod",
      "1502195809817726986": "Application Mod"
    };

    const staffMap = {};
    const orderedStaff = [];

    rawStaff.forEach(m => {
      if (!staffMap[m.id]) {
        const { roles: apiRoles, ...rest } = m;
        staffMap[m.id] = { ...rest, roles: [], apiRoles: apiRoles || [] };
        orderedStaff.push(staffMap[m.id]);
      }

      const target = staffMap[m.id];
      const addRole = (rName, rColor) => {
        const mappedName = ROLE_MAP[rName] || rName;
        if (!target.roles.find(existing => existing.name === mappedName)) {
          target.roles.push({ name: mappedName, color: rColor || '#7b61ff' });
        }
      };

      if (m.role) {
        const rawRoles = m.role.split(',').map(s => s.trim());
        const rawColors = m.roleColor ? m.roleColor.split(',').map(s => s.trim()) : [];
        rawRoles.forEach((r, idx) => {
          addRole(r, rawColors[idx] || rawColors[0] || m.roleColor);
        });
      }

      if (Array.isArray(target.apiRoles)) {
        target.apiRoles.forEach(r => {
          if (typeof r === 'string') addRole(r, '#7b61ff');
          else if (r && r.name) addRole(r.name, r.color);
          else if (r && r.id) addRole(r.id, r.color);
        });
      }
    });

    if (orderedStaff.length > 0) {
      grid.innerHTML = orderedStaff.map(m => `
        <div class="card staff-card">
          <div class="staff-avatar-wrap">
            <img src="${m.avatar}" alt="${m.name}" class="staff-avatar" loading="lazy">
            ${m.avatarDecoration ? `<img src="${m.avatarDecoration}" class="staff-avatar-decoration" alt="" loading="lazy">` : ''}
            <span class="staff-status-svg" title="${m.status}">${statusSVG(m.status)}</span>
          </div>
          <div class="staff-info">
            <div class="staff-name-row">
              <h3>${m.name}</h3>
            </div>
            <p class="staff-username">@${m.username}</p>
            <div class="staff-roles-wrap" style="display:flex; flex-direction:column; align-items:center; gap:6px; margin-top:8px;">
              ${m.roles.map(r => `
                <span class="role-badge" style="background:${r.color}18; color:${r.color}; border-color:${r.color}40;">
                  ${r.name}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('');
    } else {
      grid.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No staff members found.</p>';
    }
  } catch (e) {
    console.error('Staff fetch failed', e);
  }
}

// -- PAGE: FAQ -----------------------------------------------

function renderFAQ(container) {
  const faqs = [
    { q: 'How do I join Area 69?', a: 'Click the "Join Discord" button in the navigation bar or on the homepage. It will take you directly to our server invite.' },
    { q: 'Is the server free to join?', a: 'Yes, joining and participating in Area 69 is completely free. No subscriptions, no paywalls.' },
    { q: 'What kind of community is this?', a: 'We are a chill, unrestricted space built around gaming, memes, and real conversations. No heavy moderation, just respect and good vibes.' },
    { q: 'How can I become a staff member?', a: 'We recruit from active, helpful community members. Stay engaged, help others out, and keep an eye out for staff application announcements.' },
    { q: 'Where do I get support or help?', a: 'Inside the server, ping a Staff member in the help channels. For website-related questions, you can reach out to the Owner directly.' }
  ];

  container.innerHTML = `
    <div class="page-section">
      <div class="section-header">
        <span class="section-eyebrow">Need Help?</span>
        <h2 class="section-title">Frequently Asked Questions</h2>
        <p class="section-subtitle">Quick answers to the most common questions about Area 69.</p>
      </div>
      <div class="faq-list">
        ${faqs.map(f => `
          <div class="faq-item">
            <button class="faq-question">
              <span>${f.q}</span>
              <i class="bi bi-chevron-down"></i>
            </button>
            <div class="faq-answer"><p>${f.a}</p></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      container.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// -- PAGE: SUPPORT -------------------------------------------

function renderSupport(container) {
  container.innerHTML = `
    <div class="page-section">
      <div class="support-banner">
        <div class="support-banner-icon"><i class="bi bi-heart-fill"></i></div>
        <h2>Support Area 69</h2>
        <p>Area 69 is built by the community, and every bit of support helps us continue improving the server and creating a better place for everyone. Your contribution goes directly toward making the server bigger and better.</p>
        <a href="https://www.buymemomo.com/unknown" target="_blank" rel="noreferrer" class="btn btn-support">
          <i class="bi bi-fork-knife"></i> Buy Me a Momo
        </a>
      </div>

      <div class="support-cards">
        <div class="support-item">
          <div class="support-item-icon"><i class="bi bi-server"></i></div>
          <h4>Server Perks & Maintenance</h4>
          <p>Your support helps us maintain and improve Area 69's server perks, including boosts, custom features, server upgrades, and other improvements that enhance the community experience.</p>
        </div>
        <div class="support-item">
          <div class="support-item-icon"><i class="bi bi-gift"></i></div>
          <h4>Community Giveaways</h4>
          <p>Support helps us host giveaways and special community events, giving members more opportunities to participate, have fun, and enjoy rewards together.</p>
        </div>
        <div class="support-item">
          <div class="support-item-icon"><i class="bi bi-lightbulb"></i></div>
          <h4>Future Improvements</h4>
          <p>Your support helps us bring new ideas to life, improve existing features, and continue building a better experience for the Area 69 community.</p>
        </div>
      </div>

      <div class="support-cta-row">
        <div>
          <p style="font-family:var(--font-mono); font-size:0.7rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--text-dim); margin-bottom:0.4rem;">Contribute</p>
          <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:0.2rem;">Buy Me a Momo</h3>
          <p style="color:var(--text-muted); font-size:0.9rem;">Your support directly impacts the future of Area 69.</p>
        </div>
        <a href="https://www.buymemomo.com/unknown" target="_blank" rel="noreferrer" class="btn btn-support" style="flex-shrink:0;">
          <i class="bi bi-fork-knife"></i> Buy Me a Momo
        </a>
      </div>
    </div>
  `;
}

// -- PAGE: 404 -----------------------------------------------

function renderNotFound(container) {
  container.innerHTML = `
    <div class="not-found-wrap">
      <div class="not-found-code">404</div>
      <h2 style="font-size:1.5rem; font-weight:700; margin-bottom:0.5rem;">Page Not Found</h2>
      <p style="color:var(--text-muted); max-width:380px; margin-bottom:2rem;">The coordinates you entered don't match any known sector. Return to Home.</p>
      <a href="/" class="btn btn-primary" data-link>
        <i class="bi bi-arrow-left"></i> Return to Home
      </a>
    </div>
  `;
}

// -- INIT ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  renderNavbar();
  renderFooter();

  document.body.addEventListener('click', e => {
    const target = e.target.closest('[data-link]');
    if (target) {
      e.preventDefault();
      navigateTo(target.getAttribute('href'));
    }
  });

  window.addEventListener('popstate', router);
  window.addEventListener('hashchange', router);

  router();
  startEventPoller();
});

// -- JOIN EVENT POLLER ----------------------------------------

function startEventPoller() {
  // Start 10s in the past to avoid missing events due to clock skew
  let lastSeen = Math.floor(Date.now() / 1000) - 10;

  async function poll() {
    try {
      const res = await fetch(`https://area69.wisp.uno/api/events?since=${lastSeen}`);
      if (!res.ok) return;
      const data = await res.json();
      console.log('[Area69] Events poll:', data.events.length, 'new join(s)');
      lastSeen = data.now;

      for (const ev of data.events) {
        showJoinNotification(ev);
        await new Promise(r => setTimeout(r, 800));
      }
    } catch (err) {
      console.warn('[Area69] Events poll failed:', err);
    }
  }

  poll();
  setInterval(poll, 10000); // every 10 seconds
}

function showJoinNotification(member) {
  const container = document.getElementById('notification-container');
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.innerHTML = `
    <img src="${member.avatar}" class="notif-avatar" alt="${member.name}" loading="lazy">
    <div class="notif-text">
      <span class="notif-label">New Member</span>
      <strong>${member.name}</strong>
      <span>just joined Area 69</span>
    </div>
  `;
  container.appendChild(notif);
  setTimeout(() => notif.classList.add('show'), 60);
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 420);
  }, 6000);
}

// -- BUTTON HOVER GLOW ----------------------------------------

function attachBtnListeners() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--px', `${((e.clientX - r.left) / r.width) * 100}%`);
      btn.style.setProperty('--py', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.removeProperty('--px');
      btn.style.removeProperty('--py');
    });
  });
}

// -- PARTICLES ------------------------------------------------

function initParticles() {
  const field = document.querySelector('.particle-field');
  if (!field) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const count = window.innerWidth > 1024 ? 32 : 18;
  for (let i = 0; i < count; i++) field.appendChild(createParticle());
}

function createParticle() {
  const p = document.createElement('span');
  p.className = 'particle';
  p.style.setProperty('--size', `${(Math.random() * 4 + 2).toFixed(2)}px`);
  p.style.setProperty('--top', `${Math.random() * 100}%`);
  p.style.setProperty('--left', `${Math.random() * 100}%`);
  p.style.setProperty('--duration', `${(Math.random() * 10 + 12).toFixed(2)}s`);
  p.style.setProperty('--delay', `${(Math.random() * 6).toFixed(2)}s`);
  p.style.setProperty('--dx', `${(Math.random() * 80 - 40).toFixed(1)}px`);
  p.style.setProperty('--dy', `${(Math.random() * -130).toFixed(1)}px`);
  return p;
}
