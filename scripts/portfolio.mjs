const cardLinks = (p, e, safeUrl) => p.link ? `<a class="quiet-link" href="${e(safeUrl(p.link))}" target="_blank" rel="noopener noreferrer">${e(p.linkLabel || 'Explore project')} ↗</a>` : '';
const optionalImage = (src, alt, e) => src && /^\/[a-z0-9._/%-]+$/i.test(src)
  ? `<figure class="project-figure"><img src="${e(src)}" alt="${e(alt)} - research figure" loading="lazy" decoding="async"></figure>`
  : '';
const iconTags = (items, e) => `<div class="tag-list">${(items || []).map(s => `<span class="tag">${e(s)}</span>`).join('')}</div>`;
export function renderPortfolio(profile, posts, cv, e, safeUrl, listing) {
  const focus = (profile.focus || []).map((s,i) => `<div class="focus-row"><strong>${e(s)}</strong></div>`).join('');
  const projects = (profile.projects || []).map(p => `<article class="research-card" id="project-${e(p.number)}"><div class="research-card-grid"><div><p class="research-meta">${e(p.date)}</p><h3>${e(p.title)}</h3><p class="context">${e(p.context)}</p><p class="lead">${e(p.description)}</p><ul class="detail-list">${(p.details || []).map(d => `<li>${e(d)}</li>`).join('')}</ul>${p.link ? `<a class="quiet-link" href="${e(safeUrl(p.link))}" target="_blank" rel="noopener noreferrer">Research files ↗</a>` : ''}</div><div class="research-art">${optionalImage(p.image, p.title, e)}</div></div></article>`).join('');
  const experience = (profile.experience || []).map(item => `<div class="timeline-item"><div class="timeline-date">${e(item.date)}</div><div><h3>${e(item.role)}</h3><p class="timeline-place">${e(item.place)}</p><p class="timeline-mentor">${e(item.mentor)}</p><p>${e(item.summary)}</p></div></div>`).join('');
  const fabrication = (profile.cleanroom.items || []).map((item,i)=>`<div class="fabrication-item"><div><h3>${e(item.title)}</h3><p>${e(item.description)}</p></div></div>`).join('');
  const education = (profile.education || []).map(item => `<div class="education-item"><div class="ed-head"><h3>${e(item.school)}</h3><span>${e(item.date)}</span></div><div class="education-lines"><div class="ed-degree">${e(item.degree)}</div>${item.secondaryDegree ? `<div class="ed-program">${e(item.secondaryDegree)}</div>` : ""}<div class="ed-detail">${e(item.detail)}</div>${item.coursework ? `<div class="ed-coursework">${e(item.coursework)}</div>` : ""}<div class="ed-location">${e(item.location)}</div></div></div>`).join('');
  const awards = (profile.awards || []).map(item => `<div class="award-item"><div><strong>${e(item.name)}</strong><span>${e(item.detail)}</span></div><time>${e(item.date)}</time></div>`).join('');
  const skills = (profile.skills || []).map(group => `<div class="skill-group"><h3>${e(group.category)}</h3><p class="skill-values">${group.items.map(item => e(item)).join(', ')}</p></div>`).join('');
  const photo = profile.portrait && /^\/[a-z0-9._/-]+$/i.test(profile.portrait) ? `<img class="portrait" src="${e(profile.portrait)}" alt="Portrait of ${e(profile.name)}">` : '';
  return `
    <section class="hero hero-modern" id="about"><div class="hero-copy">
      <h1>${e(profile.name)}</h1>
      <p class="hero-bio">${e(profile.bio)}</p>
      <p class="hero-affiliation">${e(profile.affiliation)}</p>
      <div class="hero-contact" id="contact">
        ${profile.email ? `<a href="mailto:${e(profile.email)}">${e(profile.email)}</a>` : ''}
        ${profile.github ? `<a href="${e(safeUrl(profile.github))}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
        ${profile.linkedin ? `<a href="${e(safeUrl(profile.linkedin))}" target="_blank" rel="noopener noreferrer">LinkedIn</a>` : ''}
        ${cv}
      </div>
      </div><div class="hero-visual">${photo || `<div class="concept-art" aria-label="From sensory input through device dynamics to computation" role="img"><span class="concept-top">A RESEARCH TRAJECTORY</span><div class="concept-ring ring-1"></div><div class="concept-ring ring-2"></div><div class="concept-ring ring-3"></div><div class="concept-dot"></div><div class="concept-label concept-label-top">SENSORY SYSTEMS</div><div class="concept-label concept-label-mid">DEVICE PHYSICS</div><div class="concept-label concept-label-bottom">NEUROMORPHIC COMPUTATION</div><span class="concept-bottom">BRAIN → CHIP → DEVICE → SYSTEM</span></div>`}</div>
    </section>
    <section class="portfolio-section" id="education"><div class="section-title"><div><h2>Education & recognition</h2></div></div><div class="academic-grid"><div class="education-items">${education}</div><div class="awards"><h3>Selected scholarships</h3>${awards}<div class="mentoring"><span class="small-label">TEACHING & MENTORING</span><p>${e(profile.teaching)}</p></div></div></div></section>
<section class="two-column-section" id="interests"><div><h2>Research interests</h2><p class="section-lead">${e(profile.researchStatement)}</p></div><div class="focus-list"><p class="small-label">CURRENT RESEARCH INTERESTS</p>${focus}</div></section>
    <section class="portfolio-section" id="research"><div class="section-title"><div><h2>Selected research</h2></div></div><div class="research-list">${projects}</div></section>
    <section class="portfolio-section" id="experience"><div class="section-title"><div><h2>Research experience</h2></div></div><div class="timeline">${experience}</div></section>
    <section class="portfolio-section cleanroom-section" id="cleanroom"><div class="section-title"><div><h2>Fabrication & measurement</h2></div><p>${e(profile.cleanroom.intro)}</p></div><div class="fabrication-panel"><div class="fabrication-lead">${profile.cleanroom.image ? `<img class="fabrication-photo" src="${e(profile.cleanroom.image)}" alt="Semiconductor fabrication and cleanroom experience" loading="lazy" decoding="async">` : ''}<div class="fabrication-overlay"><h3>${e(profile.cleanroom.heading)}</h3><p>Semiconductor fabrication &amp; device characterization</p></div></div><div class="fabrication-list">${fabrication}</div></div></section>
    
    <section class="portfolio-section" id="skills"><div class="section-title"><div><h2>Technical skills</h2></div></div><div class="skills-grid">${skills}</div></section>
    ${posts.length ? `<section class="portfolio-section" id="writing"><div class="section-title"><div><h2>Writing & research notes</h2></div><a class="quiet-link" href="/writing/">All writing ↗</a></div>${listing(posts.slice(0,3))}</section>` : ''}
    <section class="personal-section" id="beyond-research"><div class="personal-heading"><h2>${e(profile.outsideResearch.title)}</h2></div><div class="personal-copy"><p>${e(profile.outsideResearch.description)}</p></div></section>
  `;
}
