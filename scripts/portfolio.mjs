const cardLinks = (p, e, safeUrl) => p.link ? `<a class="quiet-link" href="${e(safeUrl(p.link))}" target="_blank" rel="noopener noreferrer">${e(p.linkLabel || 'Explore project')} ↗</a>` : '';
const optionalImage = (src, alt, e) => src && /^\/[a-z0-9._/%-]+$/i.test(src)
  ? `<figure class="project-figure"><img src="${e(src)}" alt="${e(alt)} - research figure" loading="lazy" decoding="async"></figure>`
  : '';
const iconTags = (items, e) => `<div class="tag-list">${(items || []).map(s => `<span class="tag">${e(s)}</span>`).join('')}</div>`;
export function renderPortfolio(profile, posts, cv, e, safeUrl, listing) {
  const focus = (profile.focus || []).map((s,i) => `<div class="focus-row"><span>0${i+1}</span><strong>${e(s)}</strong></div>`).join('');
  const projects = (profile.projects || []).map((p, i) => `
    <article class="research-card" id="project-${e(p.number)}">
      <div class="research-meta"><span>${e(p.number)} / ${e(p.category)}</span><span>${e(p.date)}</span></div>
      <div class="research-card-grid"><div>
        <h3>${e(p.title)}</h3><p class="context">${e(p.context)}</p>
        <p class="lead">${e(p.description)}</p>
        <ul class="detail-list">${(p.details || []).map(s => `<li>${e(s)}</li>`).join('')}</ul>
        ${iconTags(p.tags, e)}${cardLinks(p, e, safeUrl)}
      </div><div class="research-art">${optionalImage(p.image, p.title, e) || `<div class="signal-art signal-art-${i%4+1}" aria-hidden="true"><span class="art-label">${e(p.category.split(' / ')[0])}</span><div class="signal-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="art-caption">NEURAL SIGNALS · PHYSICAL DYNAMICS</span></div>`}</div></div>
    </article>`).join('');
  const experience = (profile.experience || []).map(item => `<div class="timeline-item"><div class="timeline-date">${e(item.date)}</div><div><h3>${e(item.role)}</h3><p class="timeline-place">${e(item.place)}</p><p class="timeline-mentor">${e(item.mentor)}</p><p>${e(item.summary)}</p></div></div>`).join('');
  const fabrication = (profile.cleanroom.items || []).map((item,i)=>`<div class="fabrication-item"><span class="fabrication-number">0${i+1}</span><div><h3>${e(item.title)}</h3><p>${e(item.description)}</p></div></div>`).join('');
  const education = (profile.education || []).map(item => `<div class="education-item"><div class="ed-head"><h3>${e(item.school)}</h3><span>${e(item.date)}</span></div><div class="education-lines"><div class="ed-degree">${e(item.degree)}</div>${item.secondaryDegree ? `<div class="ed-program">${e(item.secondaryDegree)}</div>` : ""}<div class="ed-detail">${e(item.detail)}</div>${item.coursework ? `<div class="ed-coursework">${e(item.coursework)}</div>` : ""}<div class="ed-location">${e(item.location)}</div></div></div>`).join('');
  const awards = (profile.awards || []).map(item => `<div class="award-item"><div><strong>${e(item.name)}</strong><span>${e(item.detail)}</span></div><time>${e(item.date)}</time></div>`).join('');
  const skills = (profile.skills || []).map(group => `<div class="skill-group"><h3>${e(group.category)}</h3>${iconTags(group.items, e)}</div>`).join('');
  const photo = profile.portrait && /^\/[a-z0-9._/-]+$/i.test(profile.portrait) ? `<img class="portrait" src="${e(profile.portrait)}" alt="Portrait of ${e(profile.name)}">` : '';
  return `
    <section class="hero hero-modern" id="about"><div class="hero-copy">
      <h1>${e(profile.name)}</h1>
      <p class="hero-bio">${e(profile.bio)}</p>
      <div class="actions"><a class="button" href="#research">Explore research <span>↘</span></a>${cv}<a class="button secondary" href="mailto:${e(profile.email)}">Get in touch ↗</a></div>
      <p class="hero-affiliation">${e(profile.affiliation)}</p>
      </div><div class="hero-visual">${photo || `<div class="concept-art" aria-label="From sensory input through device dynamics to computation" role="img"><span class="concept-top">A RESEARCH TRAJECTORY</span><div class="concept-ring ring-1"></div><div class="concept-ring ring-2"></div><div class="concept-ring ring-3"></div><div class="concept-dot"></div><div class="concept-label concept-label-top">SENSORY SYSTEMS</div><div class="concept-label concept-label-mid">DEVICE PHYSICS</div><div class="concept-label concept-label-bottom">NEUROMORPHIC COMPUTATION</div><span class="concept-bottom">BRAIN → CHIP → DEVICE → SYSTEM</span></div>`}</div>
    </section>
    <section class="portfolio-section" id="education"><div class="section-title"><div><p class="eyebrow">01 / Academic background</p><h2>Education & recognition</h2></div></div><div class="academic-grid"><div class="education-items">${education}</div><div class="awards"><h3>Selected scholarships</h3>${awards}<div class="mentoring"><span class="small-label">TEACHING & MENTORING</span><p>${e(profile.teaching)}</p></div></div></div></section>
<section class="two-column-section" id="interests"><div><p class="eyebrow">02 / Research vision</p><h2>Computation that emerges from physics.</h2><p class="section-lead">${e(profile.researchStatement)}</p><blockquote class="vision-quote">“${e(profile.vision)}”</blockquote></div><div class="focus-list"><p class="small-label">CURRENT RESEARCH INTERESTS</p>${focus}</div></section>
    <section class="portfolio-section" id="research"><div class="section-title"><div><p class="eyebrow">03 / Selected research</p><h2>Research, across scales.</h2></div><p>Selected projects from semiconductor physics to spiking systems and brain-inspired machine learning.</p></div><div class="research-list">${projects}</div></section>
    <section class="portfolio-section" id="experience"><div class="section-title"><div><p class="eyebrow">04 / Research background</p><h2>Experience</h2></div><p>Research appointments and project-based work across KAIST and ETH Zürich.</p></div><div class="timeline">${experience}</div></section>
    <section class="portfolio-section cleanroom-section" id="cleanroom"><div class="section-title"><div><p class="eyebrow">05 / Hands-on experience</p><h2>Cleanroom & fabrication</h2></div><p>${e(profile.cleanroom.intro)}</p></div><div class="fabrication-panel"><div class="fabrication-lead">${profile.cleanroom.image ? `<img class="fabrication-photo" src="${e(profile.cleanroom.image)}" alt="Semiconductor fabrication and cleanroom experience" loading="lazy" decoding="async">` : ''}<div class="fabrication-overlay"><h3>${e(profile.cleanroom.heading)}</h3><p>Semiconductor fabrication &amp; device characterization</p></div></div><div class="fabrication-list">${fabrication}</div></div></section>
    
    <section class="portfolio-section" id="skills"><div class="section-title"><div><p class="eyebrow">06 / Technical toolkit</p><h2>Methods & tools</h2></div></div><div class="skills-grid">${skills}</div></section>
    ${posts.length ? `<section class="portfolio-section" id="writing"><div class="section-title"><div><p class="eyebrow">07 / Notebook</p><h2>Writing & research notes</h2></div><a class="quiet-link" href="/writing/">All writing ↗</a></div>${listing(posts.slice(0,3))}</section>` : ''}
    <section class="contact contact-modern" id="contact"><div><p class="eyebrow">Start a conversation</p><h2>Let's connect.</h2><p>I welcome conversations and collaborations in neuromorphic devices, neural computation, and brain-inspired hardware.</p></div><div class="contact-links"><a class="button" href="mailto:${e(profile.email)}">${e(profile.email)} ↗</a><a class="button secondary" href="${e(safeUrl(profile.github))}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a class="button secondary" href="${e(safeUrl(profile.linkedin))}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>${cv}</div></section>
  `;
}
