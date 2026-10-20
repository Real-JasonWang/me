document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initToolExplorer();
  initSnippetExplorer();
  initTroubleshooting();
  initLcpCalculator();
  initSimulation();
  initCopyButtons();
});

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabSections = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabSections.forEach(s => s.classList.add('hidden'));

      btn.classList.add('active');
      const targetSection = document.getElementById('tab-' + targetTab);
      if (targetSection) {
        targetSection.classList.remove('hidden');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function initToolExplorer() {
  const container = document.getElementById('tools-grid');
  const searchInput = document.getElementById('tool-search');
  const categoryFilters = document.getElementById('tool-category-filters');

  if (!container || !DEVTOOLS_DATA || !DEVTOOLS_DATA.tools) return;

  const categories = ['All', ...new Set(DEVTOOLS_DATA.tools.map(t => t.category))];
  let activeCategory = 'All';
  let searchTerm = '';

  if (categoryFilters) {
    categoryFilters.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'px-3 py-1.5 text-xs font-mono rounded-lg transition-all ' + 
        (cat === 'All' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        activeCategory = cat;
        categoryFilters.querySelectorAll('button').forEach(b => {
          b.className = 'px-3 py-1.5 text-xs font-mono rounded-lg transition-all bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60';
        });
        btn.className = 'px-3 py-1.5 text-xs font-mono rounded-lg transition-all bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
        renderTools();
      });
      categoryFilters.appendChild(btn);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchTerm = e.target.value.toLowerCase().trim();
      renderTools();
    });
  }

  function renderTools() {
    container.innerHTML = '';
    const filtered = DEVTOOLS_DATA.tools.filter(tool => {
      const matchesCat = activeCategory === 'All' || tool.category === activeCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm) || 
                            tool.description.toLowerCase().includes(searchTerm) ||
                            tool.category.toLowerCase().includes(searchTerm);
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div class="col-span-full p-8 text-center text-slate-500 font-mono text-sm">No DevTools MCP tools match your query.</div>';
      return;
    }

    filtered.forEach(tool => {
      const card = document.createElement('div');
      card.className = 'glass-panel p-5 flex flex-col justify-between';

      const paramRows = tool.params.length > 0
        ? tool.params.map(p => '<div class="text-xs font-mono text-slate-300 py-0.5"><span class="text-amber-400">' + p.name + '</span>: <span class="text-indigo-400">' + p.type + '</span> ' + (p.required ? '<span class="text-rose-400 text-[10px] uppercase font-bold">[req]</span>' : '<span class="text-slate-500 text-[10px] uppercase">[opt]</span>') + ' - <span class="text-slate-400">' + p.description + '</span></div>').join('')
        : '<div class="text-xs font-mono text-slate-500 italic">No parameters required</div>';

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="font-mono text-base font-bold text-white">${tool.name}</span>
              ${tool.readOnly ? '<span class="badge-emerald text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-bold">read-only</span>' : '<span class="badge-rose text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-bold">mutating</span>'}
            </div>
            <span class="badge-cyan text-[10px] px-2 py-0.5 rounded font-mono">${tool.category}</span>
          </div>
          <p class="text-xs text-slate-300 mb-4 leading-relaxed">${tool.description}</p>
          <div class="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 mb-3">
            <div class="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1.5 tracking-wider">Parameters</div>
            <div class="space-y-1">${paramRows}</div>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <button class="view-schema-btn text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors" data-tool="${tool.id}">
            <span>View Call Payload</span> &rarr;
          </button>
          <button class="copy-tool-btn text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/60 border border-slate-700/60 transition-colors" data-code="${encodeURIComponent(tool.example)}">
            Copy JSON
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.view-schema-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const toolId = btn.getAttribute('data-tool');
        const tool = DEVTOOLS_DATA.tools.find(t => t.id === toolId);
        if (tool) showToolModal(tool);
      });
    });

    container.querySelectorAll('.copy-tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = decodeURIComponent(btn.getAttribute('data-code'));
        navigator.clipboard.writeText(code).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          btn.classList.add('text-emerald-400', 'border-emerald-500/40');
          setTimeout(() => {
            btn.textContent = orig;
            btn.classList.remove('text-emerald-400', 'border-emerald-500/40');
          }, 1800);
        });
      });
    });
  }

  renderTools();
}

function showToolModal(tool) {
  let modal = document.getElementById('tool-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'tool-detail-modal';
    modal.className = 'fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="glass-panel w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar border-cyan-500/30">
      <button id="close-tool-modal" class="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-mono">&times;</button>
      <div class="flex items-center gap-3 mb-2">
        <h3 class="text-xl font-bold font-mono text-white">${tool.name}</h3>
        <span class="badge-cyan text-xs px-2.5 py-0.5 rounded font-mono">${tool.category}</span>
        ${tool.readOnly ? '<span class="badge-emerald text-xs px-2.5 py-0.5 rounded font-mono">read-only</span>' : '<span class="badge-rose text-xs px-2.5 py-0.5 rounded font-mono">mutating</span>'}
      </div>
      <p class="text-sm text-slate-300 mb-6 leading-relaxed">${tool.description}</p>
      
      <div class="mb-4">
        <div class="text-xs font-mono uppercase text-slate-400 font-bold mb-2">Sample Tool Call Payload</div>
        <pre class="code-block text-xs">${tool.example}</pre>
      </div>

      <div class="mb-6">
        <div class="text-xs font-mono uppercase text-slate-400 font-bold mb-2">Expected Response Output</div>
        <pre class="code-block text-xs text-emerald-400 border-emerald-500/30">${tool.returns}</pre>
      </div>

      <div class="flex justify-end">
        <button id="dismiss-tool-modal" class="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-mono rounded hover:bg-slate-700 transition-colors">Close</button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.getElementById('close-tool-modal').addEventListener('click', () => modal.classList.add('hidden'));
  document.getElementById('dismiss-tool-modal').addEventListener('click', () => modal.classList.add('hidden'));
}

function initSnippetExplorer() {
  const container = document.getElementById('snippets-container');
  if (!container || !DEVTOOLS_DATA || !DEVTOOLS_DATA.snippets) return;

  container.innerHTML = '';
  DEVTOOLS_DATA.snippets.forEach(snippet => {
    const card = document.createElement('div');
    card.className = 'glass-panel p-6 mb-6';
    card.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
        <div>
          <span class="badge-indigo text-[10px] px-2.5 py-0.5 rounded font-mono uppercase tracking-wider mb-1 inline-block">${snippet.category}</span>
          <h4 class="text-lg font-bold font-mono text-white">${snippet.title}</h4>
        </div>
        <div class="flex items-center gap-2">
          <button class="run-sim-btn px-3 py-1.5 bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-xs font-mono rounded hover:bg-cyan-900/80 transition-colors" data-snippet="${snippet.id}">
            Run Simulation
          </button>
          <button class="copy-snippet-btn px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono rounded hover:text-white transition-colors" data-code="${encodeURIComponent(snippet.code)}">
            Copy Script
          </button>
        </div>
      </div>
      <p class="text-xs text-slate-300 mb-4">${snippet.description}</p>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div class="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1 tracking-wider">Evaluation Script</div>
          <pre class="code-block text-xs h-60 custom-scrollbar">${snippet.code}</pre>
        </div>
        <div>
          <div class="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1 tracking-wider">Simulated Output Execution</div>
          <pre id="output-${snippet.id}" class="code-block text-xs h-60 custom-scrollbar text-emerald-400 border-emerald-500/30">${snippet.sampleOutput}</pre>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.run-sim-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const snippetId = btn.getAttribute('data-snippet');
      const snippet = DEVTOOLS_DATA.snippets.find(s => s.id === snippetId);
      const outBox = document.getElementById('output-' + snippetId);
      if (outBox && snippet) {
        outBox.textContent = 'Evaluating snippet in simulated browser runtime...';
        outBox.classList.add('text-amber-300');
        setTimeout(() => {
          outBox.textContent = snippet.sampleOutput;
          outBox.classList.remove('text-amber-300');
          outBox.classList.add('text-emerald-400');
        }, 600);
      }
    });
  });

  container.querySelectorAll('.copy-snippet-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = decodeURIComponent(btn.getAttribute('data-code'));
      navigator.clipboard.writeText(code).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('text-emerald-400');
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove('text-emerald-400');
        }, 1800);
      });
    });
  });
}

function initTroubleshooting() {
  const container = document.getElementById('troubleshoot-container');
  if (!container || !DEVTOOLS_DATA || !DEVTOOLS_DATA.troubleshooting) return;

  container.innerHTML = '';
  DEVTOOLS_DATA.troubleshooting.forEach(item => {
    const card = document.createElement('div');
    card.className = 'glass-panel p-6 mb-6 border-l-4 ' + 
      (item.severity === 'Critical' ? 'border-l-rose-500' : (item.severity === 'High' ? 'border-l-amber-500' : 'border-l-cyan-500'));

    const steps = item.diagnosticSteps.map((step, idx) => `
      <div class="flex items-start gap-3 py-1">
        <span class="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">${idx + 1}</span>
        <span class="text-xs text-slate-300 leading-relaxed">${step}</span>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
        <div class="flex items-center gap-3">
          <h4 class="text-base font-bold font-mono text-white">${item.title}</h4>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${item.severity === 'Critical' ? 'badge-rose' : (item.severity === 'High' ? 'badge-amber' : 'badge-cyan')}">${item.severity}</span>
        </div>
        <span class="badge-indigo text-[10px] px-2 py-0.5 rounded font-mono">${item.category}</span>
      </div>
      <div class="text-xs text-rose-300/90 mb-4 bg-rose-950/20 p-3 rounded border border-rose-900/30">
        <span class="font-bold text-rose-400 font-mono uppercase text-[10px] mr-1">[ROOT CAUSE]:</span> ${item.cause}
      </div>
      <div class="mb-4">
        <div class="text-[10px] font-mono uppercase text-slate-400 font-bold mb-2 tracking-wider">Diagnostic Triage Protocol</div>
        <div class="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800">${steps}</div>
      </div>
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Recommended Configuration Remediation</span>
          <button class="copy-conf-btn text-[10px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700" data-conf="${encodeURIComponent(item.solutionConfig)}">Copy JSON</button>
        </div>
        <pre class="code-block text-xs">${item.solutionConfig}</pre>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.copy-conf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const conf = decodeURIComponent(btn.getAttribute('data-conf'));
      navigator.clipboard.writeText(conf).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('text-emerald-400');
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove('text-emerald-400');
        }, 1800);
      });
    });
  });
}

function initLcpCalculator() {
  const ttfbSlider = document.getElementById('slider-ttfb');
  const delaySlider = document.getElementById('slider-delay');
  const durSlider = document.getElementById('slider-duration');
  const renderSlider = document.getElementById('slider-render');

  if (!ttfbSlider || !delaySlider || !durSlider || !renderSlider) return;

  function updateLcp() {
    const ttfb = parseInt(ttfbSlider.value, 10);
    const delay = parseInt(delaySlider.value, 10);
    const dur = parseInt(durSlider.value, 10);
    const render = parseInt(renderSlider.value, 10);
    const total = ttfb + delay + dur + render;

    document.getElementById('val-ttfb').textContent = ttfb + 'ms';
    document.getElementById('val-delay').textContent = delay + 'ms';
    document.getElementById('val-duration').textContent = dur + 'ms';
    document.getElementById('val-render').textContent = render + 'ms';
    document.getElementById('val-total').textContent = (total / 1000).toFixed(2) + 's (' + total + 'ms)';

    const pctTtfb = Math.round((ttfb / total) * 100);
    const pctDelay = Math.round((delay / total) * 100);
    const pctDur = Math.round((dur / total) * 100);
    const pctRender = Math.round((render / total) * 100);

    document.getElementById('bar-ttfb').style.width = pctTtfb + '%';
    document.getElementById('bar-delay').style.width = pctDelay + '%';
    document.getElementById('bar-duration').style.width = pctDur + '%';
    document.getElementById('bar-render').style.width = pctRender + '%';

    document.getElementById('lbl-pct-ttfb').textContent = pctTtfb + '%';
    document.getElementById('lbl-pct-delay').textContent = pctDelay + '%';
    document.getElementById('lbl-pct-duration').textContent = pctDur + '%';
    document.getElementById('lbl-pct-render').textContent = pctRender + '%';

    const statusBadge = document.getElementById('lcp-status-badge');
    const recBox = document.getElementById('lcp-recommendations');

    if (total <= 2500) {
      statusBadge.className = 'px-3 py-1 rounded-full text-xs font-mono font-bold uppercase badge-emerald';
      statusBadge.textContent = 'GOOD (<= 2.5s)';
    } else if (total <= 4000) {
      statusBadge.className = 'px-3 py-1 rounded-full text-xs font-mono font-bold uppercase badge-amber';
      statusBadge.textContent = 'NEEDS IMPROVEMENT (2.5s - 4.0s)';
    } else {
      statusBadge.className = 'px-3 py-1 rounded-full text-xs font-mono font-bold uppercase badge-rose';
      statusBadge.textContent = 'POOR (> 4.0s)';
    }

    const recs = [];
    if (delay > 250 || pctDelay > 10) {
      recs.push('High Resource Load Delay detected (' + delay + 'ms, ' + pctDelay + '%). Remove loading="lazy" from hero elements and add <link rel="preload" fetchpriority="high">.');
    }
    if (render > 350 || pctRender > 15) {
      recs.push('High Element Render Delay detected (' + render + 'ms, ' + pctRender + '%). Inline critical CSS, eliminate render-blocking synchronous scripts in <head>, and utilize SSR.');
    }
    if (dur > 1000 || pctDur > 45) {
      recs.push('High Resource Load Duration (' + dur + 'ms). Convert images to WebP/AVIF formats, apply responsive srcset, and distribute via CDN edge caches.');
    }
    if (ttfb > 800 || pctTtfb > 45) {
      recs.push('High Time to First Byte (' + ttfb + 'ms). Optimize server response generation, minimize redirect chains, and leverage CDN edge caching for HTML documents.');
    }
    if (recs.length === 0) {
      recs.push('Subpart distribution is optimal. The page exhibits balanced resource scheduling and meets Core Web Vitals thresholds.');
    }

    recBox.innerHTML = recs.map(r => '<li class="text-xs text-slate-300 leading-relaxed mb-1.5 flex items-start gap-2"><span class="text-cyan-400 font-bold">&bull;</span><span>' + r + '</span></li>').join('');
  }

  [ttfbSlider, delaySlider, durSlider, renderSlider].forEach(slider => {
    slider.addEventListener('input', updateLcp);
  });

  updateLcp();
}

function initSimulation() {
  const stageCounter = document.getElementById('sim-stage-counter');
  const stageName = document.getElementById('sim-stage-name');
  const stageActor = document.getElementById('sim-stage-actor');
  const stageDesc = document.getElementById('sim-stage-desc');
  const stageDetail = document.getElementById('sim-stage-detail');
  const stageAction = document.getElementById('sim-stage-action');
  const prevBtn = document.getElementById('sim-prev-btn');
  const nextBtn = document.getElementById('sim-next-btn');
  const playBtn = document.getElementById('sim-play-btn');
  const resetBtn = document.getElementById('sim-reset-btn');
  const progressBar = document.getElementById('sim-progress-bar');

  if (!stageCounter || !DEVTOOLS_DATA || !DEVTOOLS_DATA.simulationStages) return;

  let currentIdx = 0;
  let isPlaying = false;
  let playTimer = null;
  const stages = DEVTOOLS_DATA.simulationStages;

  function renderStage(idx) {
    const s = stages[idx];
    stageCounter.textContent = 'Stage ' + s.stage + ' of 08';
    stageName.textContent = s.name;
    stageActor.textContent = s.actor;
    stageDesc.textContent = s.description;
    stageDetail.textContent = s.detail;
    stageAction.textContent = s.actionCode;

    const pct = ((idx + 1) / stages.length) * 100;
    progressBar.style.width = pct + '%';

    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === stages.length - 1;
    prevBtn.classList.toggle('opacity-50', idx === 0);
    nextBtn.classList.toggle('opacity-50', idx === stages.length - 1);
  }

  function advance() {
    if (currentIdx < stages.length - 1) {
      currentIdx++;
      renderStage(currentIdx);
    } else {
      stopPlay();
    }
  }

  function stopPlay() {
    isPlaying = false;
    if (playTimer) clearInterval(playTimer);
    playBtn.textContent = 'Auto Play';
    playBtn.classList.remove('bg-rose-500/20', 'text-rose-300', 'border-rose-500/40');
    playBtn.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40');
  }

  function startPlay() {
    isPlaying = true;
    playBtn.textContent = 'Pause';
    playBtn.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40');
    playBtn.classList.add('bg-rose-500/20', 'text-rose-300', 'border-rose-500/40');
    playTimer = setInterval(() => {
      advance();
    }, 2800);
  }

  prevBtn.addEventListener('click', () => {
    stopPlay();
    if (currentIdx > 0) {
      currentIdx--;
      renderStage(currentIdx);
    }
  });

  nextBtn.addEventListener('click', () => {
    stopPlay();
    if (currentIdx < stages.length - 1) {
      currentIdx++;
      renderStage(currentIdx);
    }
  });

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopPlay();
    } else {
      if (currentIdx === stages.length - 1) currentIdx = 0;
      renderStage(currentIdx);
      startPlay();
    }
  });

  resetBtn.addEventListener('click', () => {
    stopPlay();
    currentIdx = 0;
    renderStage(currentIdx);
  });

  renderStage(0);
}

function initCopyButtons() {
  document.querySelectorAll('.copy-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const text = targetEl.textContent;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          btn.classList.add('text-emerald-400');
          setTimeout(() => {
            btn.textContent = orig;
            btn.classList.remove('text-emerald-400');
          }, 1800);
        });
      }
    });
  });
}

