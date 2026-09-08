(() => {
  const data = window.HICAL_DATA;
  const $ = (sel) => document.querySelector(sel);
  const esc = (v = "") => String(v).replace(/[&<>'"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[s]));

  // Basic lab information
  $("#heroStatement").textContent = data.lab.statement;
  $("#introTitle").textContent = data.lab.introTitle;
  $("#introText").textContent = data.lab.introText;
  $("#joinText").textContent = data.lab.joinText;
  $("#footerAffiliation").textContent = data.lab.university;
  $("#scholarLink").href = data.lab.scholar || "#";

  const emailLink = $("#emailLink");
  if (data.lab.email) {
    emailLink.href = `mailto:${data.lab.email}`;
  } else {
    emailLink.remove();
  }
  const cvLink = $("#cvLink");
  if (data.lab.cv) {
    cvLink.href = data.lab.cv;
  } else {
    cvLink.remove();
  }

  // Research
  $("#researchGrid").innerHTML = data.research.map(item => `
    <article class="research-card">
      <div class="card-number">${esc(item.number)}</div>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.text)}</p>
      <div class="tags">${item.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join("")}</div>
    </article>`).join("");

  // Selected work
  $("#workGrid").innerHTML = data.projects.map((item) => `
    <article class="work-card">
      <div class="work-visual">
        ${item.image ? `<img src="${esc(item.image)}" alt="Research visualization associated with ${esc(item.title)}" loading="lazy" onerror="this.style.display='none'; this.parentElement.classList.add('image-failed');"><div class="flow-placeholder"><div class="grid-warp"></div></div>` : `<div class="flow-placeholder" style="display:block"><div class="grid-warp"></div></div>`}
        ${item.credit ? `<div class="figure-credit">${esc(item.credit)}</div>` : ""}
      </div>
      <div class="work-copy">
        <div class="kicker">${esc(item.kicker)}</div>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.text)}</p>
        <div class="meta">${esc(item.meta)}</div>
        ${item.link && item.link !== "#" ? `<p><a class="text-link" href="${esc(item.link)}" target="_blank" rel="noreferrer">Open paper ↗</a></p>` : ""}
      </div>
    </article>`).join("");

  // People
  $("#peopleGrid").innerHTML = data.people.map(person => `
    <article class="person">
      <div class="person-photo">${person.image ? `<img src="${esc(person.image)}" alt="${esc(person.name)}">` : `<div class="pi-monogram" aria-hidden="true"><span>ALNP</span><small>CFD · HiCAL</small></div>`}</div>
      <div class="person-copy">
        <div class="person-role">${esc(person.role)}</div>
        <h3>${esc(person.name)}</h3>
        <div class="person-title">${esc(person.title)}</div>
        <p>${esc(person.text)}</p>
        <div class="person-links">${person.links.map(link => `<a href="${esc(link.href)}" target="_blank" rel="noreferrer">${esc(link.label)} ↗</a>`).join("")}</div>
      </div>
    </article>`).join("");

  // Publications
  $("#publicationList").innerHTML = data.publications.length ? data.publications.map(pub => `
    <a class="publication" href="${esc(pub.doi || '#')}" target="_blank" rel="noreferrer" aria-label="Open ${esc(pub.title)}">
      <div class="pub-year">${esc(pub.year)}</div>
      <div>
        <div class="pub-title">${esc(pub.title)}</div>
        <div class="pub-meta">${esc(pub.authors)} · ${esc(pub.venue)}</div>
      </div>
      <div class="pub-arrow">↗</div>
    </a>`).join("") : `<p class="muted">Add publications in <code>site-data.js</code>.</p>`;

  // Software / reproducibility
  $("#softwareGrid").innerHTML = data.software.map(item => `
    <article class="software-card">
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.text)}</p>
      ${item.href ? `<a href="${esc(item.href)}"${item.href.startsWith('http') ? ' target="_blank" rel="noreferrer"' : ''}>${esc(item.label)}</a>` : `<span class="muted">${esc(item.label)}</span>`}
    </article>`).join("");

  // Mobile nav
  const menuButton = $(".menu-button");
  const nav = $(".nav-links");
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));

  // Lightweight CFD-inspired canvas: advected streamlines + compression waves.
  const canvas = $("#flowCanvas");
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1;
  const lines = Array.from({length: 27}, (_, i) => ({
    y: .18 + i * .026,
    phase: Math.random() * Math.PI * 2,
    speed: .00045 + Math.random() * .00028,
    amp: 10 + Math.random() * 28
  }));

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const centerY = h * .48;
    const shockX = w * .66;

    for (let i = 0; i < 7; i++) {
      const off = i * 7;
      const g = ctx.createLinearGradient(shockX - 140, centerY, w, centerY);
      g.addColorStop(0, "rgba(25,200,255,0)");
      g.addColorStop(.35, `rgba(25,200,255,${.10 + i*.012})`);
      g.addColorStop(.72, `rgba(255,198,60,${.10 + i*.011})`);
      g.addColorStop(1, "rgba(255,90,20,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(shockX - 110, centerY + off);
      ctx.lineTo(w * .94, centerY - 170 + off * .35);
      ctx.stroke();
    }

    lines.forEach((line, idx) => {
      const base = line.y * h;
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, "rgba(25,200,255,0)");
      g.addColorStop(.45, "rgba(25,200,255,.13)");
      g.addColorStop(.78, idx % 4 === 0 ? "rgba(255,122,24,.22)" : "rgba(35,119,255,.16)");
      g.addColorStop(1, "rgba(25,200,255,0)");
      ctx.strokeStyle = g; ctx.lineWidth = idx % 5 === 0 ? 1.35 : .8;
      ctx.beginPath();
      for (let x = -20; x <= w + 20; x += 18) {
        const u = x / w;
        const bend = Math.exp(-Math.pow((u-.72)/.18, 2)) * (base-centerY) * -.18;
        const wave = Math.sin(x*.012 + t*line.speed + line.phase) * line.amp * Math.exp(-Math.pow((u-.78)/.32,2));
        const y = base + bend + wave * .18;
        if (x === -20) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    resize();
    window.addEventListener("resize", resize, {passive:true});
    requestAnimationFrame(draw);
  }
})();
