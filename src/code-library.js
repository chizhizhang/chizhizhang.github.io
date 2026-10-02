'use strict';
const $ = (id) => document.getElementById(id);
const escapeHTML = (text) => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeFile = (name) => /^[A-Za-z0-9_.-]+\.zip$/.test(name) ? name : '';
const safeURL = (url) => {try {const u = new URL(url);return u.protocol === 'https:' ? u.href : '';}catch {return '';}};
const downloadIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"></path></svg>';
let records = [];
let activeFilter = 'All';
function render() {
  const query = $('search').value.trim().toLowerCase();
  const visible = records.filter(p => (activeFilter === 'All' || p.area === activeFilter) && [p.id,p.title,p.short,p.authors,p.venue,p.journal,p.description,p.language,p.status,...p.includes].join(' ').toLowerCase().includes(query));
  $('result-count').textContent = `${visible.length} of ${records.length} projects`;
  $('empty').hidden = visible.length !== 0;
  $('projects').innerHTML = visible.map(p => {
    const article = safeURL(p.article);
    const doi = p.doi && safeURL('https://doi.org/' + p.doi);
    const size = p.bytes < 1e6 ? `${(p.bytes/1024).toFixed(0)} KB` : `${(p.bytes/1048576).toFixed(1)} MB`;
    return `<article class="project" id="${escapeHTML(p.id)}"><div class="project-code">[${p.referenceNumber}]<span>${escapeHTML(p.area)}</span></div><div class="project-main"><h3>${escapeHTML(p.short)}</h3><p class="citation">${escapeHTML(p.authors)}, “${escapeHTML(p.title)},” <em>${escapeHTML(p.venue)}</em>, ${escapeHTML(p.referenceDetails)}.</p><p class="description">${escapeHTML(p.description)}</p><div class="meta"><span>${escapeHTML(p.journal)}</span><span class="separator" aria-hidden="true">·</span><span class="status">${escapeHTML(p.status)}</span><span class="separator" aria-hidden="true">·</span><span>${escapeHTML(p.language)}</span></div></div><div class="download-box"><a class="download" href="${safeFile(p.file)}" download aria-label="Download ${escapeHTML(p.short)} code ZIP">${downloadIcon}Download ZIP</a><span class="file-size">${size}</span>${article ? `<a class="article-link" href="${escapeHTML(article)}">Read article</a>` : ''}${doi ? `<a class="article-link" href="${escapeHTML(doi)}">Archive DOI</a>` : ''}</div><details><summary>Package and run instructions</summary><div class="detail-content"><div><h4>In the package</h4><ul>${p.includes.map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ul><p class="data-note">${escapeHTML(p.data)}</p></div><div><h4>Run from the extracted project root</h4><pre class="commands">${p.commands.map(escapeHTML).join('\n')}</pre></div><p class="checksum">SHA-256 ${escapeHTML(p.sha256)}</p></div></details></article>`;
  }).join('');
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  activeFilter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  render();
}));
$('search').addEventListener('input',render);
fetch('projects.json',{cache:'no-cache'}).then(response=>{if(!response.ok)throw new Error('Registry unavailable');return response.json();}).then(data=>{
  records = data.projects;
  $('project-count').textContent = records.length;
  $('updated').dateTime = data.updated;
  $('updated').textContent = new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(data.updated+'T00:00:00Z'));
  render();
  if(location.hash){document.getElementById(location.hash.slice(1))?.scrollIntoView();}
}).catch(()=>{
  $('result-count').textContent = 'Project list unavailable';
  $('projects').innerHTML = '<p class="empty">The project list could not load. <a href="https://github.com/chizhizhang/chizhizhang.github.io/tree/main/src">Browse the download files on GitHub</a> or refresh this page.</p>';
});
