// ── UTILS ──
function go(id){document.getElementById(id).scrollIntoView({behavior:'smooth',block:'start'})}
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',scrollY>20));
const obs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('vis')}),{threshold:.1});
document.querySelectorAll('.fu').forEach(e=>obs.observe(e));

// ── SOLUTIONS TABS ──
function showSol(key,btn){
  document.querySelectorAll('.sol-panel').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.ct').forEach(b=>b.classList.remove('on'));
  document.getElementById('sol-'+key).classList.add('on');
  btn.classList.add('on');
}

// ── FILL HELPERS ──
function fillAnalyser(t){document.getElementById('reqText').value=t}
function loadPain(n){
  const scenarios={
    1:'We signed with a tier-1 vendor for ISO 20022 migration 14 months ago and are still not live. We need a custom-built MT to MX migration with parallel coexistence, integrated into our existing core banking system and correspondent banking flows.',
    2:'We have a regulatory deadline in 90 days for real-time sanctions screening against OFAC and local lists for all cross-border SWIFT payments. We need an accelerated delivery with minimal disruption to existing payment operations.',
    3:'Our payment infrastructure is non-standard with a custom RTGS connector, proprietary message formats, and a legacy core banking system. We need a bespoke solution that fits around what we have, not the other way around.'
  };
  fillAnalyser(scenarios[n]);go('analyser');
}

// ── ANALYSER ──
const KB={
  migration:{kw:['mt103','mt202','mt ','iso 20022','pacs','camt','mx','migrat','message transform','swift message format','coexistence','uetr','gpi track'],
    title:'SWIFT MT → ISO 20022 MX Migration',
    desc:(org,vol)=>`${org||'Your organisation'} needs to migrate legacy SWIFT MT messages to ISO 20022 MX format. At ${vl[vol]} this involves field mapping, enrichment for missing MX elements, parallel coexistence, and downstream core banking integration.`,
    mods:['Message Interface (MT/MX Engine)','Archival Vault (Coexistence Archive)','Payment Workflow (Dual-Rail Orchestration)'],
    base:24,vm:{low:.7,mid:1,high:1.3,very:1.7},
    flag:'ISO 20022 migrations frequently uncover data quality gaps in legacy MT messages during analysis. Budget for a 1–2 week gap assessment before confirming the go-live date.',
    next:'A technical discovery call to map your MT message types, volumes, and downstream systems is the right first step. Typically 2 days of analysis produces a precise delivery plan.'
  },
  compliance:{kw:['aml','sanction','ofac','un list','eu list','anti money','laundering','sar','str','typology','screen','watchlist','fatf','compliance screen'],
    title:'AML & Sanctions Compliance',
    desc:(org,vol)=>`${org||'Your organisation'} requires real-time AML monitoring and sanctions screening. At ${vl[vol]}, screening latency directly impacts STP rates — the solution must be payment-speed, not batch-speed.`,
    mods:['Sanction Screening (OFAC/UN/EU/Local)','Anti Money Laundering (ML Scoring + Rules)','RBAC (Compliance Case Management)'],
    base:20,vm:{low:.8,mid:1,high:1.25,very:1.6},
    flag:'At high volumes, false positive rates can destroy STP throughput. We recommend a calibration sprint using your historical payment data before go-live to tune the ML model to your portfolio.',
    next:'A live screening demo against anonymised test data from your payment types validates fit within a week. This is the fastest path to a signed engagement.'
  },
  archival:{kw:['archiv','archive','retain','retention','regulatory hold','legal discovery','10 year','7 year','tamper','immutable','audit trail','rbi','hkma','ecb','gdpr','message store'],
    title:'Regulatory Message Archival & Audit',
    desc:(org,vol)=>`${org||'Your organisation'} needs long-term, tamper-proof archival of SWIFT messages and payment records to meet regulatory retention requirements at ${vl[vol]}.`,
    mods:['Archival Vault (Immutable Storage)','Message Interface (Ingest & Normalise)','RBAC (Access & Purge Control)'],
    base:16,vm:{low:.8,mid:1,high:1.3,very:1.65},
    flag:'Projects archiving historical records (backfill) add 2–4 weeks to delivery depending on data volume and format consistency. Plan for a data quality assessment before scoping.',
    next:'A data volume and schema call with your operations team — 2 hours — gives us everything needed to size the storage infrastructure and indexing strategy.'
  },
  workflow:{kw:['workflow','stp','rtgs','instant pay','exception','repair','orchestrat','payment engine','routing','payment rail','sepa','gpi','multi-rail'],
    title:'Payment Workflow & STP Orchestration',
    desc:(org,vol)=>`${org||'Your organisation'} needs a unified orchestration layer across multiple payment rails, replacing manual exception handling and fragmented scripts at ${vl[vol]}.`,
    mods:['Payment Workflow (Visual STP Engine)','RBAC (4-Eyes & Maker-Checker)','Message Interface (Rail Transformation)'],
    base:22,vm:{low:.8,mid:1,high:1.3,very:1.65},
    flag:'Core banking integration complexity is the biggest variable in workflow projects. We need a technical API assessment of your CBS before confirming the effort estimate.',
    next:'A 2-hour current-state mapping workshop with your payments ops team identifies the STP bottlenecks and exception patterns we need to design around.'
  },
  connectivity:{kw:['swift connect','alliance','lite2','csp','customer security','swift bureau','gpi','uetr','swift access','correspondent','bic'],
    title:'SWIFT Connectivity & CSP Compliance',
    desc:(org,vol)=>`${org||'Your organisation'} needs SWIFT connectivity setup, CSP assessment support, or gpi implementation. This is a targeted engagement with defined deliverables and a clear timeline.`,
    mods:['SWIFT Connectivity Setup (Lite2/Access/Bureau)','CSP Assessment & Remediation Package','SWIFT gpi Implementation'],
    base:10,vm:{low:1,mid:1.1,high:1.2,very:1.3},
    flag:'SWIFT CSP assessments require evidence collection from multiple teams. Start at least 8 weeks before your assessment deadline to allow for remediation.',
    next:'Share your current SWIFT infrastructure topology and last CSP self-assessment result. We can provide a gap analysis within 3 business days.'
  },
  blockchain:{kw:['blockchain','dlt','hyperledger','corda','ethereum','evm','token','cbdc','on-chain','smart contract','distributed ledger'],
    title:'Blockchain / DLT Payment Integration',
    desc:(org,vol)=>`${org||'Your organisation'} is integrating blockchain or DLT with existing payment infrastructure. This requires bridging traditional rails with on-chain settlement while maintaining compliance integrity.`,
    mods:['Blockchain Bridge (Custom Protocol Layer)','Payment Workflow (On-chain Orchestration)','Sanction Screening (Chain Boundary Compliance)'],
    base:36,vm:{low:1,mid:1.2,high:1.5,very:1.9},
    flag:'Blockchain integration projects carry higher architectural uncertainty. A paid 2-week architecture design sprint before full delivery estimate significantly de-risks the engagement.',
    next:'A 60-minute architecture discovery call with our blockchain and payments engineers — no cost, no commitment — is the right starting point.'
  }
};
const vl={low:'under 10K payments/day',mid:'10K–100K/day',high:'100K–500K/day',very:'500K+/day'};
const tll={'3':'within 3 months','6':'3–6 months','12':'6–12 months','18':'12–18 months',flex:'on a flexible timeline'};

function analyseReq(){
  const req=document.getElementById('reqText').value.trim();
  const org=document.getElementById('reqOrg').value.trim();
  const vol=document.getElementById('reqVol').value;
  const tl=document.getElementById('reqTL').value;
  if(!req){alert('Please describe your requirement first.');return}
  const lower=req.toLowerCase();
  let match=null,best=0;
  for(const[k,kb] of Object.entries(KB)){const s=kb.kw.filter(w=>lower.includes(w)).length;if(s>best){best=s;match={k,kb}}}
  if(!match)match={k:'custom',kb:{title:'Custom / Bespoke Requirement',desc:(org)=>`${org||'Your organisation'} has a requirement that spans multiple domains or involves unique integration not covered by our standard solutions. NXD specialises in exactly these engagements.`,mods:['Custom Architecture Design','Bespoke Integration Layer','Relevant Core Components'],base:30,vm:{low:1,mid:1.2,high:1.55,very:1.9},flag:'Custom requirements need a discovery sprint before we can commit to a delivery estimate. We do this collaboratively — typically 1–2 weeks.',next:'A free 60-minute technical discovery call with our solution architects. We assess feasibility, complexity, and risk — honestly.'}};
  const {kb}=match;
  const weeks=Math.round(kb.base*(kb.vm[vol]||1));
  const team=Math.min(Math.max(Math.ceil(kb.mods.length+1),3),7);
  const months=Math.ceil(weeks/team);
  const costL=weeks*team*2400,costH=Math.round(costL*1.38);
  document.getElementById('aPlaceholder').style.display='none';
  const r=document.getElementById('aResult');r.classList.add('show');
  document.getElementById('arTitle').textContent=kb.title;
  document.getElementById('arDesc').textContent=kb.desc(org,vol);
  document.getElementById('arMods').innerHTML=kb.mods.map(m=>`<span class="ar-mod">${m}</span>`).join('');
  document.getElementById('arMetrics').innerHTML=`<div class="ar-met"><div class="v">${weeks}</div><div class="l">Person-weeks</div></div><div class="ar-met"><div class="v">${months} mo</div><div class="l">Timeline</div></div><div class="ar-met"><div class="v">$${Math.round(costL/1000)}K–$${Math.round(costH/1000)}K</div><div class="l">Indicative cost</div></div>`;
  const f=document.getElementById('arFlag');
  let flagMsg=kb.flag||'';
  const tlNum=parseInt(tl)||12;
  if(tlNum<months)flagMsg+=(flagMsg?' · ':'')+`Your target of ${tll[tl]} is tighter than the estimated ${months}-month delivery. Discuss phased delivery or parallel workstreams with our team.`;
  if(flagMsg){f.style.display='flex';document.getElementById('arFlagTxt').textContent=flagMsg}else{f.style.display='none'}
  document.getElementById('arNext').textContent=kb.next;
}

// ── PROPOSAL ──
function togglePill(el){el.classList.toggle('on')}
function selectModel(lbl){
  document.querySelectorAll('#modelPicker label').forEach(l=>{
    l.style.borderColor='var(--border)';l.style.background='transparent';
  });
  lbl.style.borderColor='var(--vivid)';lbl.style.background='rgba(37,99,235,.04)';
}
const modelDetails={
  'Product Licence':{
    delivery:'NXD licenses the production-ready product to your organisation. Your team handles infrastructure provisioning, deployment, and integration. NXD provides full documentation, configuration guides, product updates, and principal support as the SLA-backed product owner. A mandatory 1-month go-live support window is included.',
    support:'Principal Support included — NXD acts as product owner, supplying patches, resolving product-level incidents, and answering configuration questions. Annual Maintenance & Support contract available separately.',
    scope_extra:'Product configuration & setup guide · Product licence agreement · Principal support SLA'
  },
  'Managed Implementation':{
    delivery:'NXD manages the full delivery lifecycle: requirements workshop, solution design, build, all integrations, SIT, UAT support, production deployment, and cutover. A 30-day go-live hypercare period is mandatory and included in this engagement — NXD engineers are on-call for the first month in production.',
    support:'30-day Go-Live Hypercare — mandatory and included. Annual Maintenance & Support contract (L1–L3, SLA-backed patch updates, minor enhancements) available as a separate annual contract.',
    scope_extra:'SIT plan & execution · UAT support & defect resolution · Production cutover runbook · 30-day hypercare'
  },
  'Resource Augmentation':{
    delivery:'NXD embeds domain specialists into your team — working under your management, processes, and direction. Resources available include SWIFT Operations Specialists, ISO 20022/MT Migration Engineers, AML & Compliance Application Support, Payment Infrastructure Developers, and L2/L3 Application Support Analysts. Engagements are monthly or quarterly with flexibility to scale.',
    support:'Resources work as part of your team under your management structure. NXD provides continuity, skills transfer, and can scale headcount as project phases evolve.',
    scope_extra:'SWIFT Operations · ISO 20022 Engineering · AML Application Support · Payment Infrastructure Development · L2/L3 Application Support'
  }
};
function buildProposal(){
  const org=document.getElementById('pOrg').value.trim();
  const name=document.getElementById('pName').value.trim();
  const obj=document.getElementById('pObj').value.trim();
  const con=document.getElementById('pConst').value.trim();
  const bud=document.getElementById('pBudget').value;
  if(!org){alert('Please enter your organisation name.');return}
  const pills=[...document.querySelectorAll('.mpill.on')].map(p=>p.textContent);
  if(!pills.length){alert('Please select at least one solution area.');return}
  const modelRadio=document.querySelector('input[name="engModel"]:checked');
  const model=modelRadio?modelRadio.value:'Managed Implementation';
  const md=modelDetails[model];
  document.getElementById('propPh').style.display='none';
  const doc=document.getElementById('propDoc');doc.classList.add('show');
  document.getElementById('pdTitle').textContent=`Payment & Compliance Solution Proposal — ${org}`;
  document.getElementById('pdSub').textContent=`Prepared for ${name||org} · ${new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})} · Engagement: ${model}`;
  document.getElementById('pdExec').textContent=`${org} is seeking a ${pills.join(', ')} solution to ${obj||'address payment infrastructure and compliance challenges'}. NXD Enterprise proposes a ${model} engagement — delivering a modular, production-ready solution tailored to ${org}'s specific infrastructure${con?' within the stated constraints: '+con:''}, with an indicative investment of ${bud}.`;
  const scope=['Requirements mapping and integration architecture design (Weeks 1–2)','Solution design, API assessment and sign-off (Weeks 3–4)',...pills.map(p=>`${p} — build, configure, integration and testing`),'User acceptance testing (UAT) support and sign-off','Production go-live, cutover support and hypercare',md.scope_extra];
  document.getElementById('pdScope').innerHTML=scope.map(s=>`<li>${s}</li>`).join('');
  document.getElementById('pdDelivery').textContent=md.delivery;
  document.getElementById('pdInvest').textContent=`Engagement Model: ${model}. Based on the scope and stated budget of ${bud}, NXD will provide a detailed effort breakdown and fixed-price or time-and-materials options following the initial discovery session. ${md.support}`;
}
function copyProposal(){navigator.clipboard.writeText(document.getElementById('propDoc').innerText).then(()=>alert('Proposal copied to clipboard.'))}

// ── CALENDAR ──
let calDate=new Date();
const DN=['S','M','T','W','T','F','S'];
function renderCal(){
  const y=calDate.getFullYear(),m=calDate.getMonth(),td=new Date();
  document.getElementById('calLabel').textContent=new Date(y,m,1).toLocaleDateString('en-US',{month:'long',year:'numeric'});
  const g=document.getElementById('calGrid');
  g.innerHTML=DN.map(d=>`<div class="cdl">${d}</div>`).join('');
  const first=new Date(y,m,1).getDay(),tot=new Date(y,m+1,0).getDate();
  for(let i=0;i<first;i++)g.innerHTML+=`<div class="cd empty"></div>`;
  for(let d=1;d<=tot;d++){
    const past=new Date(y,m,d)<new Date(td.getFullYear(),td.getMonth(),td.getDate());
    const today=d===td.getDate()&&m===td.getMonth()&&y===td.getFullYear();
    g.innerHTML+=`<div class="cd${past?' dis':''}${today?' tod':''}" onclick="pickDay(this,${d})">${d}</div>`;
  }
}
function chgMonth(d){calDate=new Date(calDate.getFullYear(),calDate.getMonth()+d,1);renderCal()}
function pickDay(el,d){if(el.classList.contains('dis'))return;document.querySelectorAll('.cd').forEach(c=>c.classList.remove('sel'));el.classList.add('sel')}
function pickSlot(el){if(el.classList.contains('full'))return;document.querySelectorAll('.slot').forEach(s=>s.classList.remove('on'));el.classList.add('on')}
renderCal();

function confirmDemo(){
  const n=document.getElementById('dName').value.trim(),
        o=document.getElementById('dOrg').value.trim(),
        e=document.getElementById('dEmail').value.trim(),
        sc=document.getElementById('dScope').value.trim(),
        sol=document.getElementById('dSol').value;
  const day=document.querySelector('.cd.sel'),slot=document.querySelector('.slot.on');
  if(!n||!o||!e){alert('Please fill in Name, Organisation and Email.');return}
  if(!day||!slot){alert('Please select a date and time slot.');return}
  if(!sc){alert('Please describe what you want to see in the demo — it helps us prepare.');return}

  const mo=document.getElementById('calLabel').textContent.split(' ')[0];
  const dateStr=mo+' '+day.textContent;
  const slotTxt=slot.textContent;

  const btn=document.querySelector('[onclick="confirmDemo()"]');
  const origLabel=btn.innerHTML;
  btn.disabled=true;
  btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Sending booking…';

  function showConfirm(){
    btn.innerHTML='<i class="fa-solid fa-circle-check"></i> Booking Confirmed';
    btn.style.background='#059669';
    document.getElementById('dConf').style.display='block';
    document.getElementById('dConfTxt').textContent=
      'Your '+sol+' demo is confirmed for '+dateStr+' at '+slotTxt+
      ' (SGT). We\'ll prepare a tailored walkthrough covering: "'+
      sc.substring(0,100)+(sc.length>100?'…':'')+
      '". A confirmation email has been sent to '+e+'.';
    addMsg('b','✅ Demo confirmed for '+n+' at '+o+' — '+sol+' on '+dateStr+
      ' at '+slotTxt+' SGT. Confirmation sent to '+e+
      '. Our team will follow up with a calendar invite. See you there.');
  }

  const params={
    to_name: n,
    email: e,
    client_name: n,
    client_email: e,
    organisation: o,
    solution: sol,
    date: dateStr,
    time: slotTxt+' SGT',
    scope: sc.substring(0,300),
    booked_at: new Date().toUTCString()
  };

  emailjs.send('service_vr3q4ms','template_hsvgtwt',params)
  .then(function(){
    // Notify NXD team via contact@ with full client details
    emailjs.send('service_vr3q4ms','template_hsvgtwt',Object.assign({},params,{
      to_name: 'NXD Team',
      email: 'contact@nextdimensionenterprise.com'
    })).catch(function(err){console.warn('Team notify:',err);});
    showConfirm();
  })
  .catch(function(err){
    console.error('EmailJS error:',err);
    btn.disabled=false;btn.innerHTML=origLabel;
    alert('Booking noted — but the confirmation email had a hiccup. Please also email contact@nextdimensionenterprise.com directly to lock in your slot.');
    showConfirm();
  });
}

// ── CHAT ──
let chatOpen=false;
function toggleChat(){chatOpen?closeChat():openChat()}
function openChat(){chatOpen=true;document.getElementById('cwWin').classList.add('open');document.getElementById('cwBadge').style.display='none';document.getElementById('cwIco').className='fa-solid fa-xmark'}
function closeChat(){chatOpen=false;document.getElementById('cwWin').classList.remove('open');document.getElementById('cwIco').className='fa-solid fa-robot'}
function cqAsk(q){addMsg('u',q);setTimeout(()=>botReply(q),900)}
function cwSend(){const i=document.getElementById('cwInp');const v=i.value.trim();if(!v)return;i.value='';addMsg('u',v);setTimeout(()=>botReply(v),900)}
function addMsg(r,t){
  const c=document.getElementById('cwMsgs'),d=document.createElement('div');
  d.className=`cm ${r}`;d.innerHTML=`<div class="cb">${t}</div>`;
  c.appendChild(d);c.scrollTop=c.scrollHeight;
}
function showTyping(){
  const c=document.getElementById('cwMsgs'),d=document.createElement('div');
  d.className='cm b';d.id='td';d.innerHTML='<div class="cb"><div class="tdot"><span></span><span></span><span></span></div></div>';
  c.appendChild(d);c.scrollTop=c.scrollHeight;return d;
}
const CW={
  migration:{kw:['mt103','mt202','iso 20022','mx','pacs','migrat','mt to'],reply:'For MT → ISO 20022 MX, NXD has delivered this for banks at every volume level. Our approach covers three things most vendors skip: (1) field enrichment for MX elements that have no MT equivalent, (2) SWIFT gpi / UETR preservation across the migration, and (3) downstream CBS adapter so your core banking doesn\'t break.<br><br>Key question: are you still in the planning phase, or do you have a failed or stalled migration from another vendor? The answer changes the approach significantly.'},
  sanctions:{kw:['sanction','ofac','un list','eu list','screening','watchlist','pep'],reply:'Our Sanction Screening module runs at sub-50ms against OFAC, UN, EU, and local lists — with fuzzy and phonetic matching. At high payment volumes this matters: a 200ms screening engine degrades your STP rate measurably.<br><br>The hold/release/escalation workflow is fully configurable by your compliance team — no IT tickets for rule changes. We typically go live in 5–8 weeks from project start.<br><br>What\'s your daily cross-border volume, and which lists are mandated by your regulator?'},
  aml:{kw:['aml','anti money','laundering','sar','str','typology','transaction monitor','false positive'],reply:'Our AML module combines a configurable typology rule engine with ML-based transaction scoring calibrated to your specific portfolio. The ML model is trained on your historical payment data — which typically reduces false positives by 40–60% versus generic rule-only engines.<br><br>SAR/STR generation is automated, with compliance officer review and approval workflow built in.<br><br>What\'s your biggest pain right now — false positive volume, SAR turnaround time, or keeping up with regulatory typology changes?'},
  archival:{kw:['archiv','archive','retain','7 year','10 year','immutable','legal discover','regulatory hold','tamper'],reply:'Our Archival Vault stores SWIFT MT/MX and payment records immutably — cryptographic audit chain, so every record is legally defensible. Sub-second query across billions of records.<br><br>We\'ve built this for banks under RBI, HKMA, ECB, and DFSA mandates. Regulatory hold, legal discovery export, and GDPR-compliant purge are all standard, not bolt-ons.<br><br>How many messages per day are you archiving, and which regulatory mandate is driving the requirement?'},
  workflow:{kw:['workflow','stp','rtgs','instant pay','exception','repair','orchestrat','multi-rail','sepa'],reply:'Our Payment Workflow module is a visual, no-code STP engine. Your ops team designs payment flows through a browser — no custom scripts, no IT dependency for rule changes.<br><br>Exception queues with repair UI, intelligent rail selection, and real-time tracking across RTGS/Instant/SWIFT gpi/SEPA. Most STP rate improvements we see are 15–25% in the first 3 months.<br><br>Which rails are in scope, and what\'s your current STP rate? That gives me a realistic picture of what\'s achievable.'},
  csp:{kw:['csp','customer security','swift csp','csp assess','swift compliance','swift certif'],reply:'SWIFT CSP assessments are time-sensitive — if you miss the deadline, your SWIFT connectivity is at risk. We support the full cycle: gap analysis against current mandatory controls, remediation roadmap, evidence package compilation, and independent assessment preparation.<br><br>We typically need 4–6 weeks minimum before an assessment deadline for a comfortable engagement. How far out is your assessment?'},
  competitors:{kw:['competitor','better than','difference','why nxd','vs ','other vendor','alternative'],reply:'The honest difference comes down to one thing: every established vendor in this space sells you a product and asks your bank to adapt to it. Configuration takes months. Custom requirements go on the roadmap. Integrations cost extra.<br><br>NXD works the other way around. Our products are already built and production-tested — but we configure them to your infrastructure, your message flows, and your regulatory requirements. We don\'t have a catalogue you must fit into.<br><br>The result: most clients go live in 6–20 weeks. Not 12–18 months.<br><br>What specific capability are you evaluating? I can give you a precise view of what NXD delivers for that area.'},
  timeline:{kw:['how long','timeline','duration','weeks','months','when','deliver','implement'],reply:'Typical delivery ranges:<br>• Sanctions screening alone: 5–8 weeks<br>• ISO 20022 migration: 10–18 weeks<br>• AML full suite: 10–16 weeks<br>• Payment workflow: 10–18 weeks<br>• Full compliance + messaging suite: 18–26 weeks<br><br>These are from project start to production go-live — not from first conversation. Use the Requirement Analyser for a more precise estimate based on your scope.'},
  pricing:{kw:['price','cost','how much','budget','invest','fee'],reply:'Indicative ranges:<br>• Single solution (e.g. sanctions only): $30K–$80K<br>• 2–3 modules: $80K–$200K<br>• Full suite + enterprise integrations: custom<br><br>We give you a real range from day one — no 3-month discovery before you see a number. Use the Requirement Analyser on this page for a precise estimate based on your specific scope.'},
  bespoke:{kw:['bespoke','custom','unique','non-standard','unusual','nobody','no vendor','specific'],reply:'Bespoke is actually where NXD does its best work. When the standard vendors say "out of scope" or "future roadmap", that\'s usually our starting point.<br><br>Describe what you need in as much detail as you have. I\'ll give you an honest view of whether it\'s feasible, roughly how complex it is, and how we\'d approach it — no commitment required.'},
  models:{kw:['model','how do you work','engagement','commercial','contract','licence','license','augment','resource aug','lend','embed','staff','your team','your people'],reply:'NXD offers three engagement models — and our products are pre-built, not built from scratch for each client:<br><br><strong>Model 01 — Product Licence:</strong> You license the ready-made product. Your team deploys and manages it; we provide principal support as the product owner. Best if you have a strong in-house SWIFT/payment technical team.<br><br><strong>Model 02 — Managed Implementation (most popular):</strong> NXD delivers everything — requirements, build, SIT, UAT, production go-live. Includes mandatory 30-day hypercare. Annual support available separately. You use the product; we deliver it.<br><br><strong>Model 03 — Resource Augmentation:</strong> We embed SWIFT specialists, ISO 20022 engineers, AML application support, or developers into your team. Monthly or quarterly. Your direction, our expertise.<br><br>Which model sounds closest to what you need?'},
  support:{kw:['support','hypercare','amc','annual','maintenance','post go','after go live','sla','incident','patch'],reply:'Every NXD engagement includes a structured support offering:<br><br><strong>Go-Live Hypercare (30 days):</strong> Mandatory in Managed Implementation. Our engineers are on-call in your first month of production — incidents, tuning, and user questions.<br><br><strong>Annual Maintenance & Support (AMC):</strong> Available for all models as a separate annual contract. Covers L1–L3 incident management, patch updates, minor enhancements, and SLA-backed response times.<br><br><strong>Principal Support:</strong> Included in Product Licence engagements. NXD owns product-level incident resolution and supplies all patches and releases.<br><br>All engagements include at minimum 1 month of go-live support. What\'s your current support arrangement, and what are the gaps?'},
  plugplay:{kw:['already built','pre built','prebuilt','ready','off the shelf','plug','play','out of the box','existing product','your product'],reply:'Yes — NXD\'s products are fully built and production-tested. They\'re not built from scratch for each client.<br><br>Think of it as: <strong>we give you the house; you fill the furniture.</strong> The structure is proven and ready. What we do for each engagement is configure it to your requirements, build the integration adapters for your infrastructure, and deploy. That\'s what makes delivery 6–20 weeks instead of 18 months.<br><br>The products live and deployed at banks today include: Message Interface (MT/MX), Archival Vault, Payment Workflow, Sanction Screening, AML, and RBAC.<br><br>Would you like to know which products are relevant to your specific use case?'},
};

function botReply(q){
  const lo=q.toLowerCase(),t=showTyping();
  setTimeout(()=>{
    t.remove();
    let r=null;
    for(const[,kb] of Object.entries(CW)){if(kb.kw.some(k=>lo.includes(k))){r=kb.reply;break}}
    if(!r){
      if(lo.match(/^(hi|hello|hey|good)/i))r='Hello — good to connect. I\'m NXD\'s solution advisor, with deep knowledge of SWIFT, ISO 20022, AML, and payment infrastructure. What\'s the challenge you\'re trying to solve today?';
      else if(lo.includes('demo')||lo.includes('book')||lo.includes('meeting'))r='Happy to set up a demo — use the booking section above or click <strong>Book Demo</strong>. Tell me a bit about your environment first and I\'ll make sure the team prepares a session that\'s actually relevant to your stack.';
      else if(lo.includes('contact')||lo.includes('email')||lo.includes('reach')||lo.includes('talk'))r='You can reach us at <a href="mailto:contact@nextdimensionenterprise.com" style="color:var(--vivid)">contact@nextdimensionenterprise.com</a> or book a demo slot directly on this page. What would you like to discuss?';
      else r='That\'s a good question — let me make sure I give you a useful answer rather than a generic one. Could you share a bit more context? For example: what\'s your core banking system, which payment rails are in scope, and what\'s the primary compliance mandate you\'re working against? That helps me zero in on what NXD can specifically do for you.';
    }
    addMsg('b',r);
  },900);
}

// ── SWIFT WORLD NEWS ──────────────────────────────────────────────────
const TAG_COLORS={
  'ISO 20022':      {bg:'rgba(37,99,235,.08)',  col:'#1e40af',bar:'#2563eb'},
  'AML':            {bg:'rgba(245,158,11,.08)', col:'#92400e',bar:'#f59e0b'},
  'Sanctions':      {bg:'rgba(239,68,68,.08)',  col:'#991b1b',bar:'#ef4444'},
  'SWIFT gpi':      {bg:'rgba(16,185,129,.08)', col:'#065f46',bar:'#10b981'},
  'SWIFT CSP':      {bg:'rgba(99,102,241,.08)', col:'#3730a3',bar:'#6366f1'},
  'CBDC / DLT':     {bg:'rgba(139,92,246,.08)', col:'#5b21b6',bar:'#8b5cf6'},
  'Regulation':     {bg:'rgba(6,182,212,.08)',  col:'#155e75',bar:'#06b6d4'},
  'Instant Payments':{bg:'rgba(16,185,129,.08)',col:'#065f46',bar:'#10b981'},
  'Payments':       {bg:'rgba(13,33,69,.07)',   col:'#0d2145',bar:'#1e40af'},
};
let allArticles=[];
function newsTagStyle(tag){return TAG_COLORS[tag]||{bg:'rgba(13,33,69,.07)',col:'#0d2145',bar:'#1e40af'};}
function renderNewsCard(a){
  const ts=newsTagStyle(a.tag);
  return '<a class="news-card" href="'+a.link+'" target="_blank" rel="noopener" data-tag="'+a.tag+'">'+
    '<div class="news-card-top" style="background:'+ts.bar+'"></div>'+
    '<div class="news-card-body">'+
    '<span class="news-tag-label" style="background:'+ts.bg+';color:'+ts.col+'">'+a.tag+'</span>'+
    '<div class="news-title">'+a.title+'</div>'+
    '<div class="news-summary">'+a.summary+'</div>'+
    '<div class="news-meta">'+
    '<span class="news-source-lbl"><i class="fa-solid fa-newspaper" style="margin-right:4px;font-size:.65rem"></i>'+a.source+' &nbsp;&middot;&nbsp; '+a.display_date+'</span>'+
    '<span class="news-read">Read <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:.6rem"></i></span>'+
    '</div></div></a>';
}
function filterNews(tag,btn){
  document.querySelectorAll('.news-tag-btn').forEach(function(b){b.classList.remove('on')});
  btn.classList.add('on');
  var filtered=tag==='all'?allArticles:allArticles.filter(function(a){return a.tag===tag});
  var grid=document.getElementById('newsGrid');
  var empty=document.getElementById('newsEmpty');
  if(filtered.length===0){grid.innerHTML='';empty.style.display='block';}
  else{empty.style.display='none';grid.innerHTML=filtered.map(renderNewsCard).join('');}
}
async function loadSwiftNews(){
  var grid=document.getElementById('newsGrid');
  try{
    var resp=await fetch('swift-news.json?v='+Date.now());
    var data=await resp.json();
    allArticles=data.articles||[];
    grid.innerHTML=allArticles.map(renderNewsCard).join('');
    var upd=document.getElementById('newsUpdated');
    if(upd)upd.textContent='Updated '+(data.updated||'recently');
  }catch(err){
    grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--sub)"><i class="fa-solid fa-satellite-dish" style="font-size:2rem;opacity:.2;margin-bottom:12px;display:block"></i>Feed refreshing — check back shortly.</div>';
  }
}
loadSwiftNews();
