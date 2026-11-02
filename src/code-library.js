(function () {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL = value => {try {const u = new URL(value);return u.protocol === 'https:' ? u.href : '';} catch {return '';}};
  const safeFile = value => /^[A-Za-z0-9_./-]+\.(zip|csv|tsv|gz|7z)$/.test(value || '') && !value.split('/').includes('..') ? value : safeURL(value);
  const size = bytes => bytes < 1e6 ? `${(bytes/1024).toFixed(0)} KB` : `${(bytes/1048576).toFixed(1)} MB`;
  const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/></svg>';
  const plural = (n,word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  function datasetCard(d) {
    const citation=d.citation || {};let text=esc(citation.text || '');
    if(citation.journal)text=text.replace(esc(citation.journal),`<em>${esc(citation.journal)}</em>`);
    if(citation.doi)text=text.replace(esc(citation.doi),`<a href="${esc(safeURL('https://doi.org/'+citation.doi))}">${esc(citation.doi)}</a>`);
    return `<article class="dataset-card" id="${esc(d.id)}"><div class="dataset-card-main"><div class="dataset-card-kicker"><span>${esc(d.category || 'Dataset')}</span><span>${esc(d.format || 'CSV')}</span></div><h3>${esc(d.title)}</h3><div class="dataset-stats"><strong>${esc(d.sampleCount ?? '')}</strong><span>${esc(d.sampleLabel || 'trajectories')}</span></div><p class="dataset-description">${esc(d.description)}</p><div class="data-tags">${(d.tags || []).map(t=>`<span>${esc(t)}</span>`).join('')}</div></div><div class="dataset-card-actions"><a class="button button-primary" href="${esc(safeFile(d.file))}" download>Download dataset ${icon}</a><span class="dataset-file-size">${esc(d.format || 'CSV')} · ZIP · ${size(d.bytes)}</span><p class="dataset-cite-request">Please cite the associated article when using this dataset.</p></div><div class="dataset-body"><div class="citation-box"><div class="citation-heading"><h4>IEEE citation</h4><button type="button" class="copy-citation" data-copy="${esc(d.id)}-citation">Copy citation</button></div><p class="citation" id="${esc(d.id)}-citation">${text}</p><p class="copy-status" role="status" aria-live="polite"></p></div><details class="dataset-details"><summary>Files & variables <span aria-hidden="true">+</span></summary><div class="dataset-detail-grid"><div><h4>Files</h4><p>${esc(d.coverage || '')}</p><div class="file-tree">${(d.structure || []).map(t=>`<span>${esc(t)}</span>`).join('')}</div></div><div><h4>Variables</h4><table class="field-table"><thead><tr><th scope="col">Field</th><th scope="col">Description</th></tr></thead><tbody>${(d.fields || []).map(f=>`<tr><td>${esc(f.name)}</td><td>${esc(f.description)}</td></tr>`).join('')}</tbody></table></div></div><p class="checksum">SHA-256 <span>${esc(d.sha256)}</span></p></details></div></article>`;
  }
  function codeCard(p,index) {
    const article=safeURL(p.article);const title=article?`<a href="${esc(article)}">${esc(p.title)}</a>`:esc(p.title);
    const citation=`${esc((p.authors || '').replace(/\*/g,''))}. <em>${esc(p.venue)}</em>, ${esc(p.referenceDetails)}.`;
    return `<article class="code-card" id="${esc(p.id)}"><span class="code-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><div class="code-main"><div class="code-meta"><span class="area">${esc(p.area)}</span><span class="meta-divider" aria-hidden="true">/</span><span>${esc(p.journal)}</span><span class="meta-divider" aria-hidden="true">/</span><span>${esc(p.status)}</span></div><h3>${title}</h3><p class="article-reference">${citation}</p><p class="code-description">${esc(p.description)}</p></div><div class="code-download"><a class="button button-outline" href="${esc(safeFile(p.file))}" download aria-label="Download ${esc(p.short || p.title)} ZIP">Download ZIP ${icon}</a><span class="code-size">${esc(p.language)} · ${size(p.bytes)}</span></div><details class="code-details"><summary>Package details</summary><div class="code-detail-body"><div class="code-detail-grid"><div><h4>In the package</h4><ul>${(p.includes || []).map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p class="code-data-note">${esc(p.data)}</p></div><div><h4>Run from the extracted project root</h4><pre class="commands">${(p.commands || []).map(esc).join('\n')}</pre></div></div><p class="archive-checksum">SHA-256 ${esc(p.sha256)}</p></div></details></article>`;
  }
  if(typeof module!=='undefined'&&module.exports){module.exports={datasetCard,codeCard};return;}
  const catalogs={
    datasets:{items:[],filter:'All',query:'',limit:6,step:6,key:'category',list:'dataset-list',search:'dataset-search',filters:'dataset-filters',count:'dataset-result-count',empty:'dataset-empty',more:'dataset-more',noun:'dataset'},
    projects:{items:[],filter:'All',query:'',limit:10,step:10,key:'area',list:'code-projects',search:'code-search',filters:'code-filters',count:'result-count',empty:'empty-state',more:'code-more',noun:'code package'}
  };
  const byId=id=>document.getElementById(id);
  const searchable=p=>[p.id,p.title,p.short,p.authors,p.venue,p.journal,p.category,p.area,p.description,p.language,p.status,...(p.tags || []),...(p.includes || [])].join(' ').toLowerCase();
  function render(name){
    const c=catalogs[name],matches=c.items.filter(p=>(c.filter==='All'||(p[c.key] || 'Other')===c.filter)&&searchable(p).includes(c.query));
    byId(c.list).innerHTML=matches.slice(0,c.limit).map((p,i)=>name==='datasets'?datasetCard(p):codeCard(p,i)).join('');
    byId(c.count).textContent=matches.length===c.items.length?plural(matches.length,c.noun):`${matches.length} of ${plural(c.items.length,c.noun)}`;
    byId(c.empty).hidden=matches.length!==0;byId(c.more).hidden=matches.length<=c.limit;
    byId(c.more).textContent=`Show ${Math.min(c.step,Math.max(0,matches.length-c.limit))} more`;
  }
  function filters(name){
    const c=catalogs[name],values=[...new Set(c.items.map(p=>p[c.key] || 'Other'))].sort();byId(c.filters).hidden=values.length<2;
    byId(c.filters).innerHTML=['All',...values].map(v=>`<button type="button" data-filter="${esc(v)}" aria-pressed="${v===c.filter}">${esc(v)}</button>`).join('');
  }
  Object.entries(catalogs).forEach(([name,c])=>{
    byId(c.search).addEventListener('input',e=>{c.query=e.target.value.trim().toLowerCase();c.limit=c.step;render(name);});
    byId(c.filters).addEventListener('click',e=>{const button=e.target.closest('[data-filter]');if(!button)return;c.filter=button.dataset.filter;c.limit=c.step;byId(c.filters).querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render(name);});
    byId(c.more).addEventListener('click',()=>{c.limit+=c.step;render(name);});
  });
  document.addEventListener('click',async e=>{
    const button=e.target.closest('[data-copy]');if(!button)return;const text=byId(button.dataset.copy),status=button.closest('.citation-box').querySelector('.copy-status');
    try{await navigator.clipboard.writeText(text.textContent.trim());status.textContent='IEEE citation copied.';button.textContent='Copied';setTimeout(()=>{button.textContent='Copy citation';status.textContent='';},2500);}
    catch{const range=document.createRange();range.selectNodeContents(text);const s=window.getSelection();s.removeAllRanges();s.addRange(range);status.textContent='Citation selected. Copy it using your browser.';}
  });
  fetch('projects.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error('Catalog unavailable');return r.json();}).then(data=>{
    Object.keys(catalogs).forEach(name=>{catalogs[name].items=(data[name] || []).slice().sort((a,b)=>(b.updated || '').localeCompare(a.updated || ''));filters(name);render(name);});
    byId('dataset-count').textContent=String(catalogs.datasets.items.length).padStart(2,'0');byId('code-count').textContent=String(catalogs.projects.items.length).padStart(2,'0');byId('dataset-count-label').textContent=catalogs.datasets.items.length===1?'Dataset':'Datasets';
    if(data.updated){byId('updated').dateTime=data.updated;byId('updated').textContent=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(data.updated+'T00:00:00Z'));}
    if(location.hash){const id=decodeURIComponent(location.hash.slice(1));Object.entries(catalogs).forEach(([name,c])=>{const i=c.items.findIndex(p=>p.id===id);if(i>=c.limit){c.limit=i+1;render(name);}});requestAnimationFrame(()=>byId(id)?.scrollIntoView());}
  }).catch(()=>document.querySelectorAll('.catalog-controls').forEach(n=>n.hidden=true));
})();
