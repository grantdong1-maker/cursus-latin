/* Cursus — Latin revision trainer. Original content; single-page app. */
(function () {
  'use strict';

  var G = window.LRG, W = window.LRW, C = window.LRC, P = window.LRP, X = window.LRX;
  var CASES = G.CASES, CASE_ORDER = G.CASE_ORDER, NUMS = G.NUMS, TENSES = G.TENSES, PERSONS = G.PERSONS;
  var SUBJ_TENSES = ['pres', 'imp', 'perf', 'plup'];
  var rawStore = window.localStorage;

  /* session + per-user namespaced storage: swapping users swaps progress */
  var session = null;
  try { session = JSON.parse(rawStore.getItem('cursus_session') || 'null'); } catch (e) { session = null; }
  var NS = session ? 'cursus_u_' + session.id + '_' : 'cursusanon_';
  var store = {
    getItem: function (k) { return rawStore.getItem(NS + k); },
    setItem: function (k, v) { rawStore.setItem(NS + k, String(v)); },
    removeItem: function (k) { rawStore.removeItem(NS + k); }
  };

  /* gamification ledger */
  var prog = {
    xp: parseInt(store.getItem('cursus_xp') || '0', 10) || 0,
    streak: parseInt(store.getItem('cursus_streak') || '0', 10) || 0,
    lastDay: store.getItem('cursus_lastday') || ''
  };

  var state = {
    chapter: parseInt(store.getItem('cursus_chapter') || '32', 10) || 32,
    tab: 'drills',
    round: [],           // current quickfire round queue
    roundIdx: 0,
    roundStats: { asked: 0, right: 0 },
    total: JSON.parse(store.getItem('cursus_total') || '{"asked":0,"right":0}'),
    tableState: null,
    parseState: null,
    vocabMode: store.getItem('cursus_vocabMode') || 'le',   // le | el
    reader: { part1: null, part2: null, part3: null, page: {} }
  };
  function save() {
    store.setItem('cursus_chapter', state.chapter);
    store.setItem('cursus_total', JSON.stringify(state.total));
    store.setItem('cursus_vocabMode', state.vocabMode);
  }

  /* ---------- helpers ---------- */
  function el(id) { return document.getElementById(id); }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function chapterGate(word) { return state.chapter >= (word.c || 1); }
  function tenseGate(t) {
    return state.chapter >= C.featureIntro[t === 'pres' ? 'pres' : t]; /* chapters keys match tense names */
  }
  function tenseOk(t) {
    var intro = { pres: 1, imp: 18, fut: 19, perf: 17, plup: 18, fp: 21 };
    return state.chapter >= (intro[t] || 1);
  }
  function declOk(decl) {
    return state.chapter >= (C.featureIntro[decl] || 1);
  }
  function wordEligible(w) {
    if (!chapterGate(w)) return false;
    if (w.type === 'n' && !declOk(w.decl)) return false;
    if (w.type === 'adj') {
      if (!(declOk(w.decl === 'comp' ? 'comp' : w.decl === 'adj3' ? 'adj3' : 'adj12'))) return false;
    }
    if (w.type === 'p') {
      var map = { ego: 'pronPerson', 'tū': 'pronPerson', sē: 'pronPerson', is: 'pronIs', 'hīc': 'pronHic', ille: 'pronIlle', quī: 'pron' };
      return state.chapter >= (C.featureIntro[map[w.which]] || 1);
    }
    if (w.type === 'v') {
      var cc = w.conj === 33 ? 'conj33' : 'conj' + w.conj;
      if (w.conj !== 0 && !declOk(cc)) return false;
      if (w.irr) return true;
      var intro = C.featureIntro;
      var hasTense = TENSES.some(function (t) { return tenseOk(t); });
      if (!hasTense) return false;
    }
    return true;
  }
  function featureEligible(w, meta) {
    if (meta.tense && !tenseOk(meta.tense)) return false;
    if (meta.voice === 'pass') {
      if (state.chapter < C.featureIntro.analyticPass) return false;
      /* analytic perfect passive from 31, synthetic others from 32 */
      if (meta.tense && ['pres', 'imp', 'fut'].indexOf(meta.tense) >= 0 && state.chapter < C.featureIntro.syntheticPass) return false;
    }
    if (meta.imperative && state.chapter < C.featureIntro.imperative) return false;
    return true;
  }

  function eligibleSkills() {
    var out = [];
    W.all.forEach(function (w) {
      if (!wordEligible(w)) return;
      G.skillsOf(w).forEach(function (s) {
        if (s.kind === 'verb' && s.meta) {
          var md = s.meta.mood || 'ind';
          if (s.meta.tense && !tenseOk(s.meta.tense)) return;
          if (md === 'subj' && state.chapter < C.featureIntro.subj) return;
          if (md === 'inf' && state.chapter < (s.meta.tense === 'perf' ? C.featureIntro.infinitivePerf : C.featureIntro.infinitive)) return;
          if (md === 'part' && state.chapter < (s.meta.tense === 'pres' ? C.featureIntro.participlePres : s.meta.tense === 'perf' ? C.featureIntro.participlePerf : C.featureIntro.participleFut)) return;
          if (s.meta.voice === 'pass' && state.chapter < C.featureIntro.analyticPass) return;
          if (s.meta.imperative && state.chapter < C.featureIntro.imperative) return;
          if (!w.irr && !featureEligible(w, s.meta)) return;
        }
        out.push({ word: w, skill: s });
      });
    });
    return out;
  }

  function describeRequest(meta) {
    return G.describeParse({ kind: 'verb', meta: meta });
  }

  function promptFor(entry) {
    var w = entry.word, s = entry.skill;
    if (s.kind === 'verb') {
      if (w.irr) return w.p[1] + ' — ' + describeRequest(s.meta);
      if (s.meta.imperative) return w.p[1] + ' — ' + describeRequest(s.meta);
      return w.p[1] + ' — ' + describeRequest(s.meta);
    }
    if (w.type === 'adj') {
      if (w.decl === 'comp') {
        return w.stem.replace(/[ō]r$/, 'ius') + ' / ' + w.stem.replace(/[ō]r$/, '') + 'us — ' +
          G.CASE_LABEL[s.meta.cs] + ' ' + G.NUM_LABEL[s.meta.num] + ' (' + G.GENDER_LABEL[s.meta.g] + ')';
      }
      return w.l.split(',')[0] + ' — ' + G.CASE_LABEL[s.meta.cs] + ' ' + G.NUM_LABEL[s.meta.num] + ' (' + G.GENDER_LABEL[s.meta.g] + ')';
    }
    if (w.type === 'p') {
      if (w.which === 'sē') return 'sē (reflexive) — ' + G.CASE_LABEL[s.meta.cs] + ' ' + G.NUM_LABEL[s.meta.num];
      var dictHead = { ego: 'ego', 'tū': 'tū', is: 'is / ea / id', 'hīc': 'hīc, haec, hōc', ille: 'ille, illa, illud', quī: 'quī, quae, quod' }[w.which];
      return dictHead + ' — ' + G.CASE_LABEL[s.meta.cs] + ' ' + G.NUM_LABEL[s.meta.num] + (s.meta.g ? ' (' + G.GENDER_LABEL[s.meta.g] + ')' : '');
    }
    return w.l + ' — ' + G.CASE_LABEL[s.meta.cs] + ' ' + G.NUM_LABEL[s.meta.num];
  }

  /* ---------- tab plumbing ---------- */
  var tabs = ['dash', 'exam', 'drills', 'tables', 'parse', 'vocab', 'unseen', 'grammar', 'reader'];
  var tabTitles = { dash: 'Dashboard', exam: 'Exam', drills: 'Quick-fire', tables: 'Full tables', parse: 'Parse', vocab: 'Vocabulary', unseen: 'Unseen translation', grammar: 'Grammar reference', reader: 'Reader' };
  function setTab(t) {
    state.tab = t;
    el('hdr-title').textContent = tabTitles[t] || t;
    tabs.forEach(function (tt) {
      el('tab-' + tt).classList.toggle('active', tt === t);
      el('panel-' + tt).classList.toggle('hidden', tt !== t);
    });
    if (t === 'grammar') renderGrammar();
    if (t === 'vocab') renderVocab();
    if (t === 'dash') renderDash();
    if (t === 'unseen') renderUnseen();
    if (t === 'exam') renderExam();
    else stopClock();
    if (t === 'reader') renderReader();
    if (t === 'tables' && !state.tableState) renderTablesPick();
    if (t === 'parse' && !state.parseState) renderParse();
    if (t === 'drills' && !state.qitem) nextQuestion();
  }

  /* ---------- QUICK FIRE ---------- */
  var pool = null;
  function poolFor() { if (!pool || pool._ch !== state.chapter) { pool = eligibleSkills(); pool._ch = state.chapter; } return pool; }

  function nextQuestion() {
    var p = poolFor();
    if (!p.length) { el('q-prompt').textContent = 'Set a higher chapter in the header to unlock forms.'; el('q-answer').value = ''; return; }
    state.qitem = p[Math.floor(Math.random() * p.length)];
    state.roundIdx++;
    el('q-prompt').innerHTML = esc(promptFor(state.qitem));
    el('q-count').textContent = (state.roundIdx) + ' · ' + accuracy();
    var input = el('q-answer');
    input.value = '';
    input.disabled = false;
    input.focus();
    el('q-check').classList.remove('hidden');
    el('q-next').classList.add('hidden');
    el('q-feedback').innerHTML = '';
    el('q-feedback').className = 'feedback';
  }

  function normalizeSans(s) {
    return G.normalize(String(s)).replace(/[!.,?;:'"()\[\]]/g, '').replace(/\s+/g, ' ').trim();
  }

  function checkAnswer() {
    if (!state.qitem) return;
    var input = el('q-answer');
    var given = normalizeSans(input.value);
    var want = normalizeSans(state.qitem.skill.form);
    state.roundIdx = state.roundIdx || 0;
    state.total.asked++;
    var ok = given === want;
    if (ok) { state.total.right++; award(10); }
    state.round.push({ prompt: promptFor(state.qitem), given: input.value, want: state.qitem.skill.form, ok: ok });
    statsBadge();
    el('q-feedback').className = 'feedback ' + (ok ? 'good' : 'bad');
    el('q-feedback').innerHTML = ok
      ? ['✓', '✓ bene!', 'correct', 'exact'][Math.floor(Math.random() * 4)]
      : '✗ wanted: <strong>' + esc(state.qitem.skill.form) + '</strong>';
    input.disabled = true;
    el('q-check').classList.add('hidden');
    el('q-next').classList.remove('hidden');
    el('q-next').focus();
    var host = el('q-hist');
    host.innerHTML = '';
    renderRoundHistory().forEach(function (r) { host.appendChild(r); });
  }
  function accuracy() {
    return state.total.asked ? Math.round(100 * state.total.right / state.total.asked) + '% accuracy' : '—';
  }
  function statsBadge() { save(); el('hdr-stats').textContent = accuracy() + ' · ' + state.total.asked + ' answered'; }

  function renderRoundHistory() {
    var hist = state.round.slice(-8).reverse().map(function (r) {
      return h('div', 'hist-row' + (r.ok ? ' good' : 'bad'),
        '<span>' + esc(r.prompt) + '</span><b>' + (r.ok ? '✓ ' + esc(r.given || r.want) : '✗ ' + esc(r.given || '—') + ' → ' + esc(r.want)) + '</b>');
    });
    return hist;
  }

  /* ---------- TABLES ---------- */
  function tableWords() { return W.all.filter(wordEligible); }

  function renderTablesPick() {
    var host = el('tables-pick');
    host.innerHTML = '';
    if (!state.tablePick) state.tablePick = { cat: '', sub: '' };

    /* step 1 — category cards */
    var cats = [
      { id: 'nouns', label: 'Nouns', hint: '5 declensions' },
      { id: 'verbs', label: 'Verbs', hint: '5 conjugations, active & passive' },
      { id: 'adjectives', label: 'Adjectives', hint: '1st/2nd, 3rd, comparisons' },
      { id: 'pronouns', label: 'Pronouns', hint: 'personal, demonstrative, relative' }
    ];
    var crow = h('div', 'tcat-row');
    cats.forEach(function (c) {
      var card = h('button', 'tcat' + (state.tablePick.cat === c.id ? ' active' : ''));
      card.appendChild(h('b', null, c.label));
      card.appendChild(h('span', 'pmeta', c.hint));
      card.onclick = function () {
        state.tablePick = { cat: c.id, sub: '' };
        renderTablesPick();
      };
      crow.appendChild(card);
    });
    host.appendChild(crow);

    var tw = tableWords();
    var pool = tw.filter(function (x) { return catOf(x) === state.tablePick.cat; });
    if (!state.tablePick.cat) return;

    /* step 2 — subtype chips */
    var subs = SUB_TYPES[state.tablePick.cat] || [];
    if (subs.length > 1) {
      var srow = h('div', 'tsub-row');
      subs.forEach(function (s) {
        var count = pool.filter(function (x) { return s.match.indexOf(subOf(x)) >= 0; }).length;
        if (!count) return;
        var chip = h('button', 'tsub' + (state.tablePick.sub === s.id ? ' active' : ''), s.label + ' · ' + count);
        chip.onclick = function () {
          state.tablePick.sub = state.tablePick.sub === s.id ? '' : s.id;
          renderTablesPick();
        };
        srow.appendChild(chip);
      });
      if (srow.childNodes.length) host.appendChild(srow);
    } else if (subs.length === 1) {
      state.tablePick.sub = subs[0].id;
    }

    /* step 3 — word cards */
    var words = pool.filter(function (x) {
      var s = state.tablePick.sub;
      if (!s) return true;
      var sub = subs.filter(function (q) { return q.id === s; })[0];
      return !sub || !sub.match.length || sub.match.indexOf(subOf(x)) >= 0;
    });
    if (!words.length) return;
    var wrow = h('div', 'tword-row');
    words.forEach(function (wd) {
      var chip = h('button', 'tword');
      chip.appendChild(h('b', 'latin', esc(wd.l)));
      chip.appendChild(h('span', 'pmeta', esc(wd.meaning || '')));
      chip.onclick = function () { buildTable(wd); };
      wrow.appendChild(chip);
    });
    host.appendChild(wrow);
  }

  function catOf(w) {
    return w.type === 'n' ? 'nouns' : w.type === 'v' ? 'verbs' : w.type === 'adj' ? 'adjectives' : 'pronouns';
  }
  function subOf(w) {
    if (w.type === 'n') return w.decl;
    if (w.type === 'v') return w.irr ? 'irr' : String(w.conj);
    if (w.type === 'adj') return w.decl;
    return String(w.conj);
  }
  var SUB_TYPES = {
    nouns: [
      { id: 'd1', label: '1st (-a)', match: ['d1'] },
      { id: 'd2m', label: '2nd masc.', match: ['d2m', 'd2ms'] },
      { id: 'd2n', label: '2nd neuter', match: ['d2n'] },
      { id: 'd3', label: '3rd consonant', match: ['d3c', 'd3cn'] },
      { id: 'd3i', label: '3rd i-stem', match: ['d3i', 'd3in'] },
      { id: 'd4', label: '4th (-us)', match: ['d4'] },
      { id: 'd5', label: '5th (-ēs)', match: ['d5'] }
    ],
    verbs: [
      { id: '1', label: '1st conj.', match: ['1'] },
      { id: '2', label: '2nd conj.', match: ['2'] },
      { id: '3', label: '3rd conj.', match: ['3'] },
      { id: '33', label: '3rd -iō', match: ['33'] },
      { id: '4', label: '4th conj.', match: ['4'] },
      { id: 'irr', label: 'irregular', match: ['irr'] }
    ],
    adjectives: [
      { id: 'adj12', label: '1st & 2nd (-a, -um)', match: ['adj12'] },
      { id: 'adj3', label: '3rd', match: ['adj3'] },
      { id: 'comp', label: 'comparatives', match: ['comp'] }
    ],
    pronouns: [{ id: 'p', label: 'pronouns', match: [] }]
  };

  function featureSpecsFor(w) {
    var specs = [];
    if (w.type === 'n') {
      NUMS.forEach(function (n) { CASE_ORDER.forEach(function (c) { specs.push({ cs: c, num: n, label: G.NUM_LABEL[n].slice(0, 3).replace('sin', 'sing') + ' ' + G.CASE_LABEL[c] }); }); });
    } else if (w.type === 'adj') {
      ['m', 'f', 'n'].forEach(function (g) {
        NUMS.forEach(function (n) { CASE_ORDER.forEach(function (c) { specs.push({ cs: c, num: n, g: g, label: g + ' ' + (n === 'sg' ? 'sg' : 'pl') + ' ' + G.CASE_LABEL[c] }); }); });
      });
    } else if (w.type === 'p') {
      var list = G.pronounForms(w).filter(function (x) { return x.form !== '—'; });
      list.forEach(function (x) {
        specs.push({ cs: x.meta.cs, num: x.meta.num, g: x.meta.g, label: x.meta.g + ' ' + (x.meta.num === 'sg' ? 'sg' : 'pl') + ' ' + G.CASE_LABEL[x.meta.cs] });
      });
    } else if (w.type === 'v') {
      if (w.irr) {
        TENSES.forEach(function (t) {
          if (!tenseOk(t)) return;
          PERSONS.forEach(function (p) { ['sg', 'pl'].forEach(function (n) {
            specs.push({ person: p, num: n, tense: t, voice: 'act', label: G.TENSE_LABEL[t] + ' ' + p + (n === 'pl' ? 'pl' : 'sg') });
          }); });
        });
        if (state.chapter >= (C.featureIntro.subj || 33)) {
          ['pres', 'imp', 'perf', 'plup'].forEach(function (t) {
            if (!w.irr['s' + t]) return;
            PERSONS.forEach(function (p) { ['sg', 'pl'].forEach(function (n) {
              specs.push({ person: p, num: n, tense: t, voice: 'act', mood: 'subj', label: G.TENSE_LABEL[t] + ' subjunctive ' + p + (n === 'pl' ? 'pl' : 'sg') });
            }); });
          });
        }
      } else {
        var voices = w.passOmit ? ['act'] : (state.chapter >= C.featureIntro.analyticPass ? ['act', 'pass'] : ['act']);
        voices.forEach(function (vo) {
          TENSES.forEach(function (t) {
            if (!tenseOk(t)) return;
            if (vo === 'pass' && ['pres', 'imp', 'fut'].indexOf(t) >= 0 && state.chapter < C.featureIntro.syntheticPass) return;
            PERSONS.forEach(function (p) { ['sg', 'pl'].forEach(function (n) {
              specs.push({ person: p, num: n, tense: t, voice: vo, label: (vo === 'pass' ? 'pass ' : '') + G.TENSE_LABEL[t] + ' ' + p + (n === 'pl' ? 'pl' : 'sg') });
            }); });
          });
        });
        if (state.chapter >= (C.featureIntro.subj || 33)) {
          SUBJ_TENSES.forEach(function (t) {
            voices.forEach(function (vo) {
              PERSONS.forEach(function (p) { ['sg', 'pl'].forEach(function (n) {
                specs.push({ person: p, num: n, tense: t, voice: vo, mood: 'subj', label: (vo === 'pass' ? 'pass ' : '') + G.TENSE_LABEL[t] + ' subjunctive ' + p + (n === 'pl' ? 'pl' : 'sg') });
              }); });
            });
          });
        }
        if (state.chapter >= C.featureIntro.imperative && !w.irr) {
          specs.push({ imperative: 'sg', label: 'imperative sg' });
          specs.push({ imperative: 'pl', label: 'imperative pl' });
        }
      }
    }
    return specs;
  }

  function buildTable(w) {
    var specs = featureSpecsFor(w);
    var host = el('tables-grid');
    host.innerHTML = '';
    state.tableState = { l: w.l };

    host.appendChild(h('h3', 'latin', esc(w.l)));
    host.appendChild(h('p', 'muted', esc(w.meaning || '')));

    var cells = [];
    var deks = h('div', 'par-tables');
    var kind = catOf(w);

    function cell(spec) {
      var inp = h('input', 'cell');
      inp.autocomplete = 'off';
      inp.spellcheck = false;
      inp.dataset.key = JSON.stringify(spec);
      cells.push({ spec: spec, input: inp });
      return inp;
    }
    function lookup(list, pred) {
      for (var i = 0; i < list.length; i++) if (pred(list[i])) return list[i];
      return null;
    }

    function caseTable(title, cols, finder) {
      /* cols: array of {id,label} — finder(col, cs) -> spec | null */
      var sec = h('div', 'par-sec');
      if (title) sec.appendChild(h('h4', null, esc(title)));
      var tbl = h('table', 'par');
      var hd = h('tr');
      hd.appendChild(h('th', null, ''));
      cols.forEach(function (c) { hd.appendChild(h('th', null, esc(c.label))); });
      tbl.appendChild(hd);
      CASE_ORDER.forEach(function (cs) {
        var tr = h('tr');
        tr.appendChild(h('th', null, esc(G.CASE_LABEL[cs])));
        cols.forEach(function (c) {
          var td = h('td');
          var sp = finder(c, cs);
          if (sp) td.appendChild(cell(sp));
          else td.appendChild(h('span', 'dash', '—'));
          tr.appendChild(td);
        });
        tbl.appendChild(tr);
      });
      sec.appendChild(tbl);
      return sec;
    }

    if (kind === 'nouns') {
      deks.appendChild(caseTable('',
        NUMS.map(function (n) { return { id: n, label: G.NUM_LABEL[n] }; }),
        function (c, cs) { return lookup(specs, function (s) { return s.num === c.id && s.cs === cs; }); }));
    } else if (kind === 'adjectives') {
      ['m', 'f', 'n'].forEach(function (g) {
        deks.appendChild(caseTable({ m: 'masculine', f: 'feminine', n: 'neuter' }[g],
          NUMS.map(function (n) { return { id: n, label: G.NUM_LABEL[n] }; }),
          function (c, cs) { return lookup(specs, function (s) { return s.g === g && s.num === c.id && s.cs === cs; }); }));
      });
    } else if (kind === 'pronouns') {
      deks.appendChild(h('p', 'order-note', 'Rows run in your course order: nominative · accusative · genitive · dative · ablative (NAGDA). Some printed reference tables use nominative · genitive · dative · accusative · ablative, so read the label before you write.'));
      /* only the genders this pronoun actually has: ego and sē get no empty columns */
      var gs = ['m', 'f', 'n'].filter(function (g) {
        return specs.some(function (s) { return s.g === g; });
      });
      if (gs.length > 1) {
        NUMS.forEach(function (n) {
          deks.appendChild(caseTable(G.NUM_LABEL[n],
            gs.map(function (g) { return { id: g, label: g }; }),
            function (c, cs) { return lookup(specs, function (s) { return s.num === n && s.g === c.id && s.cs === cs; }); }));
        });
      } else {
        deks.appendChild(caseTable('',
          NUMS.map(function (n) { return { id: n, label: G.NUM_LABEL[n] }; }),
          function (c, cs) { return lookup(specs, function (s) { return s.num === c.id && s.cs === cs; }); }));
      }
    } else {
      /* verbs: indicative mini-tables per tense under Active/Passive, then the subjunctive set */
      var voices = [];
      specs.forEach(function (s) { if (!s.mood && s.voice && voices.indexOf(s.voice) < 0) voices.push(s.voice); });
      voices.forEach(function (vo) {
        var wrap = h('div', 'par-voice');
        if (voices.length > 1) wrap.appendChild(h('h4', 'vhead', vo === 'act' ? 'Active' : 'Passive'));
        var inner = h('div', 'par-tables');
        TENSES.forEach(function (t) {
          var tspecs = specs.filter(function (s) { return !s.mood && s.voice === vo && s.tense === t; });
          if (!tspecs.length) return;
          var sec = h('div', 'par-sec');
          sec.appendChild(h('h4', null, esc(G.TENSE_LABEL[t])));
          var tbl = h('table', 'par');
          var hd = h('tr');
          hd.appendChild(h('th', null, ''));
          ['sg', 'pl'].forEach(function (n) { hd.appendChild(h('th', null, n === 'sg' ? 'sing.' : 'pl.')); });
          tbl.appendChild(hd);
          PERSONS.forEach(function (p) {
            var tr = h('tr');
            tr.appendChild(h('th', null, ordinal(p)));
            ['sg', 'pl'].forEach(function (n) {
              var td = h('td');
              var sp = lookup(tspecs, function (s) { return s.person === p && s.num === n; });
              if (sp) td.appendChild(cell(sp));
              else td.appendChild(h('span', 'dash', '—'));
              tr.appendChild(td);
            });
            tbl.appendChild(tr);
          });
          sec.appendChild(tbl);
          inner.appendChild(sec);
        });
        wrap.appendChild(inner);
        deks.appendChild(wrap);
      });
      /* subjunctive: present, imperfect, perfect, pluperfect, active and passive */
      var subj = specs.filter(function (s) { return s.mood === 'subj'; });
      if (subj.length) {
        var sVS = [];
        subj.forEach(function (s) { if (sVS.indexOf(s.voice) < 0) sVS.push(s.voice); });
        deks.appendChild(h('h3', 'moodhead', 'Subjunctive'));
        sVS.forEach(function (vo) {
          var wrap = h('div', 'par-voice');
          if (sVS.length > 1) wrap.appendChild(h('h4', 'vhead', vo === 'act' ? 'Active' : 'Passive'));
          var inner = h('div', 'par-tables');
          SUBJ_TENSES.forEach(function (t) {
            var tspecs = subj.filter(function (s) { return s.voice === vo && s.tense === t; });
            if (!tspecs.length) return;
            var sec = h('div', 'par-sec');
            sec.appendChild(h('h4', null, esc(G.TENSE_LABEL[t])));
            var tbl = h('table', 'par');
            var hd = h('tr');
            hd.appendChild(h('th', null, ''));
            ['sg', 'pl'].forEach(function (n) { hd.appendChild(h('th', null, n === 'sg' ? 'sing.' : 'pl.')); });
            tbl.appendChild(hd);
            PERSONS.forEach(function (p) {
              var tr = h('tr');
              tr.appendChild(h('th', null, ordinal(p)));
              ['sg', 'pl'].forEach(function (n) {
                var td = h('td');
                var sp = lookup(tspecs, function (s) { return s.person === p && s.num === n; });
                if (sp) td.appendChild(cell(sp));
                else td.appendChild(h('span', 'dash', '—'));
                tr.appendChild(td);
              });
              tbl.appendChild(tr);
            });
            sec.appendChild(tbl);
            inner.appendChild(sec);
          });
          wrap.appendChild(inner);
          deks.appendChild(wrap);
        });
      }
      var imps = specs.filter(function (s) { return s.imperative; });
      if (imps.length) {
        var isec = h('div', 'par-sec');
        isec.appendChild(h('h4', null, 'Imperative'));
        var it = h('table', 'par');
        var itr = h('tr');
        itr.appendChild(h('th', null, 'command'));
        ['sg', 'pl'].forEach(function (n) {
          var td = h('td');
          var sp = lookup(imps, function (s) { return s.imperative === n; });
          if (sp) td.appendChild(cell(sp));
          else td.appendChild(h('span', 'dash', '—'));
          itr.appendChild(td);
        });
        it.appendChild(itr);
        isec.appendChild(it);
        deks.appendChild(isec);
      }
    }
    host.appendChild(deks);

    var bar = h('div', 'row gap');
    var btn = h('button', 'btn', 'Check');
    var rm = h('button', 'btn ghost', '← pick another word');
    rm.onclick = function () { state.tableState = null; host.innerHTML = ''; renderTablesPick(); };
    bar.appendChild(btn); bar.appendChild(rm);
    var msg = h('div', 'feedback');
    var awarded = false;
    btn.onclick = function () {
      var right = 0, total = cells.length;
      cells.forEach(function (c) {
        var want = G.formOf(w, c.spec) || '—';
        var got = normalizeSans(c.input.value) || '—';
        var ok = got === normalizeSans(want);
        c.input.classList.remove('wrong', 'right');
        c.input.classList.add(ok ? 'right' : 'wrong');
        if (ok) right++;
        c.input.title = want;
        /* the right form sits under the cell: no hover roulette while revising */
        var fix = c.input.parentNode.querySelector('.cellfix');
        if (!fix) { fix = h('span', 'cellfix'); c.input.parentNode.appendChild(fix); }
        fix.textContent = ok ? '' : want;
      });
      msg.className = 'feedback ' + (right === total ? 'good' : (right > total / 2 ? '' : 'bad'));
      msg.textContent = right + '/' + total + ' correct' + (right === total ? ' — omnīnia rēcta!' : ' — the green form under each red cell is the answer');
      if (right === total && !awarded) { awarded = true; award(25); }
      cells.forEach(function (c) {
        c.input.onfocus = function () { c.input.placeholder = G.formOf(w, c.spec) || ''; };
      });
    };
    host.appendChild(bar); host.appendChild(msg);
  }
  function ordinal(p) { return p === 1 ? '1st' : p === 2 ? '2nd' : '3rd'; }

  /* ---------- PARSE ---------- */
  var parsePool = null, parseCh = null;
  var PFIELDS = {
    mood:   { id: 'mood', label: 'type', opts: [['ind', 'indicative'], ['subj', 'subjunctive'], ['imp', 'imperative'], ['inf', 'infinitive'], ['part', 'participle']] },
    person: { id: 'person', label: 'person', opts: [['1', '1st'], ['2', '2nd'], ['3', '3rd']] },
    num:    { id: 'num', label: 'number', opts: [['sg', 'singular'], ['pl', 'plural']] },
    tense:  { id: 'tense', label: 'tense', opts: [['pres', 'present'], ['imp', 'imperfect'], ['fut', 'future'], ['perf', 'perfect'], ['plup', 'pluperfect'], ['fp', 'future perfect']] },
    voice:  { id: 'voice', label: 'voice', opts: [['act', 'active'], ['pass', 'passive']] },
    cs:     { id: 'cs', label: 'case', opts: CASE_ORDER.map(function (c) { return [c, G.CASE_LABEL[c]]; }) },
    g:      { id: 'g', label: 'gender', opts: [['m', 'masculine'], ['f', 'feminine'], ['n', 'neuter']] }
  };
  /* sensible tense option subsets per form type (the user's own guess may differ; the
     pool item's real mood drives which options make sense to offer) */
  function tenseOptsFor(mood) {
    if (mood === 'subj') return ['pres', 'imp', 'perf', 'plup'];
    if (mood === 'inf') return ['pres', 'perf'];
    if (mood === 'part') return ['pres', 'perf', 'fut'];
    return ['pres', 'imp', 'fut', 'perf', 'plup', 'fp'];
  }
  function parseFieldsFor(meta, kind) {
    var mood = meta.mood || 'ind';
    if (kind === 'noun') return ['cs', 'num', 'g'];
    if (mood === 'ind' || mood === 'subj') return ['mood', 'person', 'num', 'tense', 'voice'];
    if (mood === 'imp') return ['mood', 'num'];
    return ['mood', 'tense', 'voice']; /* inf, part */
  }
  function parsePoolFor() {
    if (parseCh === state.chapter && parsePool) return parsePool;
    parsePool = {};
    poolFor().forEach(function (entry) {
      var s = entry.skill, w = entry.word, kind = s.kind;
      var src = s.meta || {};
      var meta;
      if (kind === 'verb') {
        meta = { mood: src.mood || 'ind', person: src.person, num: src.num, tense: src.tense, voice: src.voice };
        if (src.imperative) { meta.mood = 'imp'; meta.num = src.imperative; }
      } else {
        meta = { cs: src.cs, num: src.num, g: src.g || w.g };
        if (!meta.g) return;
      }
      var k = G.normalize(s.form);
      if (!parsePool[k]) parsePool[k] = {
        form: s.form,
        prompt: w.type === 'v' ? w.p[1] : w.l,
        kind: kind,
        fields: parseFieldsFor(meta, kind),
        metas: []
      };
      var dupe = parsePool[k].metas.some(function (m) {
        return parsePool[k].fields.every(function (id) { return String(m[id]) === String(meta[id]); });
      });
      if (!dupe) parsePool[k].metas.push(meta);
    });
    parseCh = state.chapter;
    return parsePool;
  }
  function renderParseBoxes(item) {
    var host = el('parse-boxes');
    host.innerHTML = '';
    var moods = {};
    item.metas.forEach(function (m) { moods[m.mood || 'ind'] = true; });
    var mlist = Object.keys(moods);
    var realMood = mlist.length === 1 ? mlist[0] : null;
    item.fields.forEach(function (id) {
      var base = PFIELDS[id];
      var opts = base.opts;
      if (id === 'tense' && realMood) opts = opts.filter(function (o) { return tenseOptsFor(realMood).indexOf(o[0]) >= 0; });
      var fs = h('fieldset', null);
      var lg = document.createElement('legend');
      lg.textContent = base.label;
      fs.appendChild(lg);
      opts.forEach(function (o) {
        var lab = h('label', null);
        var r = document.createElement('input');
        r.type = 'radio'; r.name = 'pf-' + base.id; r.value = o[0];
        lab.appendChild(r);
        lab.appendChild(document.createTextNode(' ' + o[1]));
        fs.appendChild(lab);
      });
      host.appendChild(fs);
    });
  }
  function newParse() {
    var p = parsePoolFor();
    var keys = Object.keys(p).filter(function (k) { return p[k].metas.length && p[k].prompt; });
    if (!keys.length) { el('parse-form').textContent = 'No parseable forms at this chapter yet.'; state.parse = null; return; }
    var key = keys[Math.floor(Math.random() * keys.length)];
    var item = p[key];
    state.parse = { key: key, item: item };
    el('parse-form').textContent = item.form || key;
    el('parse-wordhint').textContent = '';
    el('p-check').disabled = false;
    renderParseBoxes(item);
    el('parse-feedback').className = 'feedback';
    el('parse-feedback').textContent = '';
  }
  function renderParse() { newParse(); }
  function checkParse() {
    if (!state.parse) return;
    var item = state.parse.item;
    var vals = {}, missing = false;
    item.fields.forEach(function (id) {
      var sel = document.querySelector('input[name="pf-' + id + '"]:checked');
      if (sel) vals[id] = sel.value; else missing = true;
    });
    var fb = el('parse-feedback');
    if (missing) { fb.className = 'feedback'; fb.textContent = 'choose one option in every box'; return; }
    var hit = item.metas.find(function (m) {
      return item.fields.every(function (id) { return String(m[id]) === vals[id]; });
    });
    /* one award per form: lock the boxes until "Another form" */
    el('p-check').disabled = true;
    Array.prototype.forEach.call(document.querySelectorAll('#parse-boxes input'), function (r) { r.disabled = true; });
    if (hit) {
      fb.className = 'feedback good';
      fb.textContent = '✓ correct — ' + G.describeParse({ kind: item.kind, meta: hit });
      award(10);
    } else {
      var best = item.metas[0];
      fb.className = 'feedback bad';
      fb.innerHTML = '✗ that wasn\'t it — <b>' + esc(G.describeParse({ kind: item.kind, meta: best })) + '</b>' +
        (item.prompt ? ' <span class="muted">(' + esc(item.prompt) + ')</span>' : '');
      el('parse-wordhint').textContent = 'from ' + item.prompt;
    }
  }

  /* ---------- VOCAB (SRS) ---------- */
  function vocabDeck() { return W.all.filter(function (w) { return chapterGate(w) && w.meaning; }); }
  function vsKey(id) { return 'cursus_v_' + id; }
  function vsState(w) {
    var raw = store.getItem(vsKey(w.l));
    return raw ? JSON.parse(raw) : { box: 0, due: 0, seen: 0, right: 0 };
  }
  function vsStore(w, st) { store.setItem(vsKey(w.l), JSON.stringify(st)); }

  function currentCard() {
    var due = vocabDeck().map(function (w) { return { w: w, st: vsState(w) }; }).filter(function (x) { return x.st.box < 5; })
      .sort(function (a, b) { return a.st.due - b.st.due; });
    if (!due.length) return null;
    /* pick the most overdue incl. never-seen */
    return due.find(function (x) { return x.st.seen === 0; }) || due[0];
  }
  function dueCount() {
    var n = vocabDeck().filter(function (w) { var st = vsState(w); return st.box < 5; }).length;
    return n;
  }

  function renderVocab() {
    var host = el('vocab-body');
    host.innerHTML = '';
    var card = currentCard();
    var meta = h('div', 'row gap spread');
    var dc = h('span', 'muted', dueCount() + ' cards not yet mastered at your chapter');
    var modeBtn = h('button', 'btn ghost', state.vocabMode === 'le' ? 'Latin → English' : 'English → Latin');
    modeBtn.onclick = function () { state.vocabMode = state.vocabMode === 'le' ? 'el' : 'le'; save(); renderVocab(); };
    meta.appendChild(dc); meta.appendChild(modeBtn);
    host.appendChild(meta);
    if (!card) { host.appendChild(h('div', 'bigcard', 'All mastered for this chapter')); host.appendChild(h('p', 'muted', 'Raise your chapter level or reset progress to keep going.')); return; }
    var w = card.w;
    var face, answer;
    if (state.vocabMode === 'le') {
      face = esc(w.l.split(',')[0]);
      answer = esc(w.meaning) + (w.type === 'v' ? ' <span class="muted">(' + esc(w.l) + ')</span>' : '');
    } else {
      face = esc(w.meaning) + ' <span class="muted">(' + esc(w.l.split(',')[0]) + ')</span>';
      answer = esc(w.l) + (w.type === 'v' ? ' <span class="muted">raw conj ' + w.conj + '</span>' : '');
    }
    var box = h('div', 'bigcard');
    box.appendChild(h('div', 'vocab-face', face));
    var inp = h('input', 'tin wide');
    inp.placeholder = 'type the answer (Enter = check)';
    inp.autocomplete = 'off';
    inp.spellcheck = false;
    box.appendChild(inp);
    var fb = h('div', 'feedback');
    box.appendChild(fb);
    var row = h('div', 'row gap spread');
    var lbtns = h('div', 'row gap');
    var chk = h('button', 'btn', 'Check');
    var nxt = h('button', 'btn hidden', 'Next card →');
    lbtns.appendChild(chk); lbtns.appendChild(nxt);
    var skip = h('button', 'btn ghost small', 'peek / skip');
    var editor = h('button', 'btn ghost small', 'reset this card');
    var rbtns = h('div', 'row gap');
    rbtns.appendChild(skip); rbtns.appendChild(editor);
    row.appendChild(lbtns); row.appendChild(rbtns);
    box.appendChild(row);
    function glossOk(given) {
      /* Latin→English: accept any gloss, lenient on parentheses & word order fragments */
      var v = normalizeSans(String(given).trim());
      if (!v) return false;
      var parts = String(w.meaning || '').split(/[,;]/);
      for (var i = 0; i < parts.length; i++) {
        var g = normalizeSans(parts[i].replace(/\(.*?\)/g, '').trim());
        if (!g) continue;
        if (g === v) return true;
        if (v.length >= 3 && (g.indexOf(v) === 0 || v.indexOf(g) === 0)) return true;
      }
      return false;
    }
    chk.onclick = function () {
      var st = vsState(w);
      st.seen++;
      var ok = state.vocabMode === 'le'
        ? glossOk(inp.value)
        : normalizeSans(inp.value).indexOf(normalizeSans(w.l.split(',')[0])) === 0;
      st.right += ok ? 1 : 0;
      var now = Date.now();
      var intervals = [0, 1000 * 3600 * 12, 1000 * 3600 * 24 * 3, 1000 * 3600 * 24 * 7, 1000 * 3600 * 24 * 16, 0];
      if (ok) { st.box = Math.min(5, st.box + 1); st.due = now + (intervals[st.box] || 0); award(12); }
      else { st.box = 0; st.due = now + 60000; }
      vsStore(w, st);
      fb.className = 'feedback ' + (ok ? 'good' : 'bad');
      fb.innerHTML = (ok ? '✓ ' : '✗ ') + answer;
      inp.disabled = true;
      chk.classList.add('hidden');
      nxt.classList.remove('hidden');
      nxt.focus();
    };
    inp.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') { ev.preventDefault(); if (!chk.classList.contains('hidden')) chk.click(); else nxt.click(); }
    });
    nxt.onclick = function () { renderVocab(); };
    skip.onclick = function () { fb.className = 'feedback'; fb.innerHTML = answer; inp.disabled = true; chk.classList.add('hidden'); nxt.classList.remove('hidden'); };
    editor.onclick = function () { store.removeItem(vsKey(w.l)); renderVocab(); };
    host.appendChild(box);
    var recent = h('details', null);
    recent.appendChild(h('summary', null, 'what sits in each box'));
    var lst = h('ul', 'vocab-legend');
    [[0, 'new / wrong — seen again within an hour'], [1, 'half-learned — returns after 12h'], [2, 'learned-ish — returns after 3 days'], [3, 'solid — 1 week'], [4, 'strong — 16 days'], [5, 'mastered (retired at your chapter)']]
      .forEach(function (x) { lst.appendChild(h('li', null, '<b>box ' + (x[0] + 1) + '</b> — ' + x[1])); });
    recent.appendChild(lst);
    host.appendChild(recent);
  }

  /* ---------- GRAMMAR REFERENCE ---------- */
  function renderGrammar() {
    var host = el('grammar-body');
    host.innerHTML = '';
    var ch = state.chapter;
    host.appendChild(h('p', 'muted', 'Chapters are the site\'s own alignment with the course; check yours against the book.'));
    /* chapter note */
    var note = C.chapters[ch];
    if (note) host.appendChild(h('p', 'chapter-note', '<b>Chapter ' + ch + '</b> — ' + esc(note.skills)));

    /* declension tables */
    var heads = CASE_ORDER;
    var decls = [['d1', 'puella'], ['d2m', 'servus'], ['d2n', 'bellum'], ['d3c', 'rēx'], ['d3cn', 'corpus'], ['d3i', 'hostis'], ['d3in', 'animal'], ['d4', 'portus'], ['d5', 'rēs']];
    var ex = { d1: ['puella', 'puell'], d2m: ['servus', 'serv'], d2n: ['bellum', 'bell'], d3c: ['rēx', 'rēg' + ''], d3cn: ['corpus', 'corpor'], d3i: ['hostis', 'host'], d3in: ['animal', 'animal'], d4: ['portus', 'port'], d5: ['rēs', 'r'] };
    var grid = h('div', 'gtables');
    decls.forEach(function (d) {
      if (state.chapter < (C.featureIntro[d[0]] || 1)) return;
      var word = { decl: d[0], stem: ex[d[0]][1], nom: ex[d[0]][0] };
      var t = h('table', 'gtable');
      var trh = h('tr', null, '<th></th>');
      heads.forEach(function (c) { trh.appendChild(h('th', null, c)); });
      t.appendChild(trh);
      NUMS.forEach(function (n) {
        var tr = h('tr', null, '<td>' + (n === 'sg' ? 'sg' : 'pl') + '</td>');
        heads.forEach(function (c) { tr.appendChild(h('td', null, esc(G.nominalForm(word, c, n) || '—'))); });
        t.appendChild(tr);
      });
      var labels = { d1: '-a', d2m: '-us', d2n: '-um', d3c: 'rēgis', d3cn: 'corporis', d3i: '-is', d3in: '-is', d4: '-ūs', d5: 'reī' };
      var cell = h('div', 'gcell', '<b class="latin">' + esc(ex[d[0]][0] + ', ' + labels[d[0]]) + '</b>');
      cell.appendChild(t);
      grid.appendChild(cell);
    });
    host.appendChild(grid);

    /* verb samples */
    var verbhost = h('div', 'gtables verbs');
    var conjSamples = [1, 2, 3, 33, 4].filter(function (cj) { return state.chapter >= (C.featureIntro['conj' + (cj === 33 ? 33 : cj)] || 1); });
    var sampleWords = W.verbs;
    conjSamples.forEach(function (cj) {
      var w = sampleWords.find(function (x) { return !x.irr && x.conj === cj; });
      if (!w) return;
      var t = h('table', 'gtable');
      var top = h('tr', null, '');
      ['', 'pres', 'imp', 'fut', 'perf', 'plup', 'fp'].forEach(function (hh) { top.appendChild(h('th', null, hh)); });
      t.appendChild(top);
      PERSONS.forEach(function (per) {
        ['sg', 'pl'].forEach(function (n) {
          if (per === 1 && n === 'pl') return;
          var tr = h('tr', null, '');
          tr.appendChild(h('td', null, (n === 'sg' ? 'sing ' : 'pl ') + per));
          TENSES.forEach(function (tn) {
            tr.appendChild(h('td', null, esc(tenseOk(tn) ? (G.verbForm(w, per, n, tn, 'act') || '—') : '—')));
          });
          t.appendChild(tr);
        });
      });
      var vcell = h('div', 'gcell', '<b class="latin">' + esc(w.l) + '</b>');
      vcell.appendChild(t);
      verbhost.appendChild(vcell);
    });
    host.appendChild(verbhost);
  }

  /* ---------- READER ---------- */
  function renderReader() {
    var names = { part1: 'Book I', part2: 'Book II', part3: 'Book III' };
    var textFiles = { part1: 'book1.txt', part2: 'book2.txt', part3: 'book3.txt' };
    var pdfFiles = { part1: 'part1.pdf', part2: 'part2.pdf', part3: 'part3.pdf' };
    ['part1', 'part2', 'part3'].forEach(function (part) {
      var host = el('load-' + part);
      host.innerHTML = '';
      var r = state.reader[part];
      var inp = h('input');
      inp.type = 'file';
      inp.accept = '.txt,.md,.pdf,text/plain,application/pdf';
      inp.style.display = 'none';
      inp.onchange = function (ev) {
        var f = ev.target.files[0];
        if (!f) return;
        if (/\.pdf$/i.test(f.name) || f.type === 'application/pdf') { state.readerTried = state.readerTried || {}; ingestPdfFile(part, f); }
        else readFileText(part, f.name, f);
      };
      var lab = h('label', 'btn small');
      lab.appendChild(inp);
      lab.appendChild(document.createTextNode(
        r ? names[part] + ' \u00b7 ' + (r.kind === 'pdf' ? (r.name || 'pdf') : r.pages + ' pages') + ' \u2713'
          : names[part] + ' \u2014 import once'
      ));
      host.appendChild(lab);
      /* lazy book loading: 1) same folder (local use), 2) imported copy kept in this browser, 3) give up -> picker */
      if (!r && !(state.readerTried || {})[part]) {
        state.readerTried = state.readerTried || {};
        state.readerTried[part] = true;
        loadLocalPdf(part, pdfFiles[part], function () {
          idbGet(part).then(function (rec) {
            if (rec && !state.reader[part]) {
              state.reader[part] = { kind: 'pdf', name: rec.name, url: URL.createObjectURL(rec.blob) };
              showReaderView(part);
              renderReader();
            }
          }).catch(function () {}).then(function () {
            if (!state.reader[part]) {
              tryLocalCopy(part, textFiles[part], function (txt) {
                ingestTextLocal(part, textFiles[part], txt);
              }, null);
            }
          });
        });
      }
    });
  }
  function loadLocalPdf(part, file, onFail) {
    fetch(file).then(function (res) { if (!res.ok) throw 0; return res.blob(); })
      .then(function (blob) { if (state.reader[part]) return; ingestPdfBlob(part, file, blob, false); })
      .catch(onFail || function () {});
  }
  function tryLocalCopy(part, file, then, onFail) {
    fetch(file).then(function (res) { if (!res.ok) throw 0; return res.text(); })
      .then(function (txt) { if (state.reader[part]) return; then(txt); })
      .catch(onFail || function () {});
  }
  /* -- one-time import storage (browser-only, per device) -- */
  function bookDb() {
    return new Promise(function (res, rej) {
      if (typeof indexedDB === 'undefined') { rej(new Error('no indexedDB')); return; }
      var rq = indexedDB.open('cursus-books', 1);
      rq.onupgradeneeded = function () { rq.result.createObjectStore('books'); };
      rq.onsuccess = function () { res(rq.result); };
      rq.onerror = function () { rej(rq.error); };
    });
  }
  function idbPut(part, blob, name) {
    return bookDb().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction('books', 'readwrite');
        tx.objectStore('books').put({ blob: blob, name: name }, part);
        tx.oncomplete = function () { res(); };
        tx.onerror = function () { rej(tx.error); };
      });
    });
  }
  function idbGet(part) {
    return bookDb().then(function (db) {
      return new Promise(function (res, rej) {
        var rq = db.transaction('books').objectStore('books').get(part);
        rq.onsuccess = function () { res(rq.result || null); };
        rq.onerror = function () { rej(rq.error); };
      });
    });
  }
  function idbDel(part) {
    return bookDb().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction('books', 'readwrite');
        tx.objectStore('books').delete(part);
        tx.oncomplete = function () { res(); };
        tx.onerror = function () { rej(tx.error); };
      });
    });
  }
  function ingestPdfFile(part, f) {
    if (state.reader[part] && state.reader[part].url) URL.revokeObjectURL(state.reader[part].url);
    state.reader[part] = { kind: 'pdf', name: f.name, url: URL.createObjectURL(f) };
    idbPut(part, f, f.name).catch(function () {}); /* remember for next visits, stays in this browser */
    showReaderView(part);
    renderReader();
  }
  function ingestPdfBlob(part, name, blob, persist) {
    if (state.reader[part] && state.reader[part].url) URL.revokeObjectURL(state.reader[part].url);
    state.reader[part] = { kind: 'pdf', name: name, url: URL.createObjectURL(blob) };
    if (persist) idbPut(part, blob, name).catch(function () {});
    showReaderView(part);
    renderReader();
  }
  function readFileText(part, name, f) {
    var fr = new FileReader();
    fr.onload = function () { ingestTextLocal(part, name, String(fr.result)); };
    fr.readAsText(f);
  }
  function ingestTextLocal(part, name, txt) {
    var pages = txt.split('\f').map(function (x, i) { return { n: i + 1, text: x.trim() }; }).filter(function (x) { return x.text.length > 0; });
    if (!pages.length) pages = [{ n: 1, text: txt.trim() }];
    state.reader[part] = { kind: 'text', txt: txt, pages: pages, name: name };
    showReaderPage(part, 1);
    renderReader();
  }
  function showReaderView(part) {
    var r = state.reader[part];
    if (!r) return;
    if (r.kind === 'pdf') {
      el('reader-current').innerHTML = '<div class="reader-pdf-host"><embed class="pdfview" src="' + r.url + '" type="application/pdf"></div>' +
        '<div class="row gap" style="margin-top:10px"><button class="btn ghost small" id="pdf-clear">close book</button>' +
        '<button class="btn ghost small" id="pdf-forget">remove from this device</button>' +
        '<span class="muted small">' + esc(r.name || 'pdf') + ' \u2014 read from your own files, never uploaded</span></div>';
      el('pdf-clear').onclick = function () {
        URL.revokeObjectURL(r.url);
        state.reader[part] = null;
        el('reader-current').innerHTML = '';
        renderReader();
      };
      el('pdf-forget').onclick = function () {
        URL.revokeObjectURL(r.url);
        state.reader[part] = null;
        el('reader-current').innerHTML = '';
        idbDel(part).catch(function () {}).then(function () { renderReader(); });
      };
    } else {
      showReaderPage(part, 1);
    }
  }
  function showReaderPage(part, pageNo) {
    var r = state.reader[part];
    if (!r) return;
    pageNo = Math.max(1, Math.min(r.pages.length, pageNo));
    var page = r.pages[pageNo - 1];
    el('reader-current').innerHTML = '<div class="reader-page"><pre>' + esc(page.text) + '</pre></div>' +
      '<div class="row gap spread"><button class="btn ghost small" id="page-prev">←</button><span>' + pageNo + '/' + r.pages.length + '</span><button class="btn ghost small" id="page-next">→</button></div>';
    el('page-prev').onclick = function () { showReaderPage(part, pageNo - 1); };
    el('page-next').onclick = function () { showReaderPage(part, pageNo + 1); };
  }

  /* ---------- chapter selector ---------- */
  function buildChapterSelect() {
    var sel = el('hdr-ch');
    sel.innerHTML = '';
    [1, 16].forEach(function () {});
    var groups = [['Part I', 1, 16], ['Part II', 17, 32], ['Part III', 33, 54]];
    groups.forEach(function (g) {
      var og = h('optgroup', null, g[0] + ' (to ch. ' + g[2] + ')');
      for (var i = g[1]; i <= g[2]; i++) {
        var o = h('option', null, 'Chapter ' + i);
        o.value = i;
        og.appendChild(o);
      }
      sel.appendChild(og);
    });
    sel.value = state.chapter;
    sel.onchange = function () {
      state.chapter = parseInt(sel.value, 10) || 32;
      save();
      pool = null; parsePool = null;
      headers();
      state.qitem = null;
      if (state.tab === 'drills') nextQuestion();
      if (state.tab === 'tables') { state.tableState = null; el('tables-grid').innerHTML = ''; renderTablesPick(); }
      if (state.tab === 'parse') newParse();
      if (state.tab === 'vocab') renderVocab();
      if (state.tab === 'grammar') renderGrammar();
    };
  }
  function headers() {
    el('hdr-ch-val').textContent = 'up to ch. ' + state.chapter;
    statsBadge();
    var xpPill = el('hdr-stat-xp'), stPill = el('hdr-stat-streak');
    if (xpPill) xpPill.textContent = prog.xp + ' XP · lvl ' + levelOf(prog.xp);
    if (stPill) stPill.textContent = prog.streak + '-day streak';
    var exPill = el('hdr-exam');
    if (exPill && X) {
      var cd = daysToExam();
      exPill.textContent = cd.past ? 'exam over' : cd.days + ' days to exam';
      exPill.classList.toggle('warn', !cd.past && cd.days <= 10);
      exPill.classList.toggle('hidden', cd.past);
    }
  }


  /* ══════════════ EXAM · Year 9 Semester 2 mock ══════════════
     Real conditions: no dictionary, strict per-section timers, a mark scheme
     for the sections a computer can't judge and auto-marking for those it can. */
  var run = null, runClock = null;

  function examLog() { try { return JSON.parse(store.getItem('cursus_exams') || '[]') || []; } catch (e) { return []; } }
  function examLogSave(list) { store.setItem('cursus_exams', JSON.stringify(list.slice(-20))); }
  function draft(k, v) {
    var o = {};
    try { o = JSON.parse(store.getItem('cursus_edraft') || '{}') || {}; } catch (e) { o = {}; }
    if (v === undefined) return o[k] || '';
    o[k] = v;
    store.setItem('cursus_edraft', JSON.stringify(o));
  }
  function stopClock() { if (runClock) { clearInterval(runClock); runClock = null; } }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function daysToExam() {
    var ms = new Date(X.meta.whenISO).getTime() - Date.now();
    return { ms: ms, days: Math.ceil(ms / 86400000), past: ms < 0 };
  }
  function fmtLeft(ms) {
    if (ms < 0) ms = 0;
    var sec = Math.floor(ms / 1000), m = Math.floor(sec / 60), h = Math.floor(m / 60);
    if (h > 0) return h + ':' + String(m % 60).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
    return m + ':' + String(sec % 60).padStart(2, '0');
  }
  function examHost() { return el('exam-body'); }
  /* Transition buttons outlive their screen when clicked twice. Each screen stamps
     run.view; a handler from an older screen is a no-op, so marks already captured
     can never be recomputed from a wiped DOM. */
  /* analytic passives are cited masculine (laudātus est); a bare accidence question
     fixes no gender, so -a/-um/-ae/-ōrum readings are equally right */
  function formVariants(form) {
    var list = [form];
    if (form.indexOf(' ') < 0) return list;
    var parts = form.split(' ');
    var p1 = parts[0], aux = parts.slice(1).join(' ');
    /* -us is singular (fem -a, neut -um); -ī is masculine plural (fem -ae, neut -a) */
    var m = /us$/.test(p1) ? ['a', 'um'] : /ī$/.test(p1) ? ['ae', 'a'] : null;
    if (!m) return list;
    var cut = /us$/.test(p1) ? 2 : 1;            /* 'us' is two letters, 'ī' is one */
    m.forEach(function (t) { list.push(p1.slice(0, p1.length - cut) + t + ' ' + aux); });
    return list;
  }

  function onRun(fn) {
    return function () {
      if (!run) return;
      return fn.apply(null, arguments);
    };
  }
  function onView(v, fn) {
    return function () {
      if (!run || run.view !== v) return;
      return fn.apply(null, arguments);
    };
  }

  function examChrome(sec, sub, right) {
    var host = examHost();
    host.innerHTML = '';
    var head = h('div', 'exam-head');
    var t = h('div');
    t.appendChild(h('h2', null, esc(sec)));
    t.appendChild(h('p', 'muted small', esc(sub)));
    head.appendChild(t);
    var r = h('div', 'row gap exam-head-right');
    if (right) r.appendChild(right);
    var clock = h('span', 'pill exam-clock hidden');
    clock.id = 'exam-clock';
    r.appendChild(clock);
    head.appendChild(r);
    host.appendChild(head);
    var bar = h('div', 'exam-body-inner');
    host.appendChild(bar);
    return bar;
  }

  function startClock(ms, onEnd) {
    stopClock();
    var c = el('exam-clock');
    c.classList.remove('hidden');
    var ends = Date.now() + ms;
    var paint = function () {
      var left = ends - Date.now();
      var e = el('exam-clock');
      if (!e) return;
      if (left <= 0) { e.textContent = 'time'; e.classList.add('warn'); }
      else { e.textContent = fmtLeft(left); e.classList.remove('warn'); }
      if (run && run.phaseAt) {
        var ph = left <= 0 || (Date.now() - run.started) >= run.phaseAt ? run.phaseLate : run.phaseEarly;
        var pe = el('exam-phase');
        if (pe && ph) pe.textContent = ph;
      }
    };
    paint();
    runClock = setInterval(function () {
      var left = ends - Date.now();
      paint();
      if (left <= 0) { stopClock(); if (onEnd && run && run.view === onEnd._view) onEnd(); }
    }, 1000);
  }

  /* ---------- overview ---------- */
  function renderExam() {
    stopClock();
    if (!X) { examHost().innerHTML = '<p class="muted">Exam material failed to load.</p>'; return; }
    var cd = daysToExam(), M = X.meta;
    var host = examHost();
    host.innerHTML = '';

    var top = h('div', 'exam-brief');
    top.appendChild(h('h2', null, esc(M.title)));
    var when = h('p', 'exam-when');
    when.innerHTML = '<strong>' + esc(M.whenLabel) + '</strong> · ' + esc(M.venue) +
      ' · ' + (cd.past ? 'this exam date has passed' : '<span class="exam-days">' + cd.days + ' days to go</span>');
    top.appendChild(when);
    top.appendChild(h('p', 'muted small', esc(M.conditions)));
    host.appendChild(top);

    var rows = h('div', 'exfmt');
    M.sections.forEach(function (sc) {
      var r = h('div', 'exfmt-row');
      r.appendChild(h('div', 'exfmt-n', 'Section ' + sc.n));
      var mid = h('div', 'exfmt-mid');
      mid.appendChild(h('b', null, esc(sc.name)));
      mid.appendChild(h('span', 'muted small', esc(sc.marks + ' marks · ' + sc.minutes + ' min · ' + sc.split)));
      mid.appendChild(h('span', 'muted small', esc(sc.brief)));
      r.appendChild(mid);
      r.appendChild(h('div', 'exfmt-mk', String(sc.marks)));
      rows.appendChild(r);
    });
    rows.appendChild((function () {
      var r = h('div', 'exfmt-row exfmt-total');
      r.appendChild(h('div', 'exfmt-n', 'Total'));
      r.appendChild(h('div', 'exfmt-mid', h('b', null, '80 marks · 65–80 minutes').outerHTML));
      r.appendChild(h('div', 'exfmt-mk', String(M.total)));
      return r;
    })());
    host.appendChild(rows);

    var acts = h('div', 'row gap exam-acts');
    var full = h('button', 'btn primary', 'Sit the full mock (80 marks)');
    full.onclick = function () { examBegin('full'); };
    acts.appendChild(full);
    M.sections.forEach(function (sc) {
      var b = h('button', 'btn ghost', 'Section ' + sc.n);
      b.onclick = function () { examBegin(sc.id === 's3' ? 's3' : sc.id, false); };
      acts.appendChild(b);
    });
    var sprint = h('button', 'btn ghost', '10-minute form sprint');
    sprint.onclick = function () { examBegin('sprint', false); };
    acts.appendChild(sprint);
    host.appendChild(acts);

    /* what the section is testing, in revision order */
    var check = h('div', 'exam-check');
    check.appendChild(h('h3', null, 'Chapter 43 revision checklist'));
    var ul = h('ul', 'checklist');
    [
      'Result clauses: adeō / ita … ut + subjunctive — keep "so … that" in English.',
      'Purpose clauses: ut / nē + subjunctive; negative purpose is nē, not ut nōn.',
      'Cum with the subjunctive: "when / since / although" — spot which sense fits.',
      'Two conditionals: si + indicative (live) vs si + subjunctive (unreal); past unreal uses the pluperfect subjunctive in BOTH halves.',
      'Indirect statement: accusative + infinitive; present -re/-rī, perfect -isse, periphrastic -tūrus esse / fōre.',
      'Deponents still mean active: proficīscī, laudārī, auxiliārī, cōnārir.',
      'Idioms with the dative: grātiās alicuī agere, īrāscī alicuī, crēdere alicuī.',
      'Imperatives: tē / vōs (present) and nē + perfect subjunctive for the negative.',
      'Dictation traps from the vocab list: -āvit vs -ābat, -isset vs -īnit, eī vs eius.'
    ].forEach(function (t) { ul.appendChild(h('li', null, esc(t))); });
    check.appendChild(ul);
    check.appendChild(h('p', 'muted small', 'Section 2 asks about the chapter 43 story in your own book. The site never stores or displays textbook text — open the Reader with your copy, then answer the questions here.'));
    host.appendChild(check);

    var log = examLog();
    if (log.length) {
      var hist = h('div', 'exam-hist');
      hist.appendChild(h('h3', null, 'Your past sits'));
      var tb = h('div', 'exfmt exlog');
      log.slice().reverse().slice(0, 8).forEach(function (a) {
        var r = h('div', 'exfmt-row');
        r.appendChild(h('div', 'exfmt-n', esc(a.when)));
        var mid = h('div', 'exfmt-mid');
        mid.appendChild(h('b', null, esc(a.mode === 'full' ? 'Full mock' : a.label)));
        mid.appendChild(h('span', 'muted small', 'S1 ' + a.s1 + ' · S2 ' + a.s2 + ' · S3 ' + a.s3 + (a.mins ? ' · ' + a.mins + ' min' : '')));
        r.appendChild(mid);
        r.appendChild(h('div', 'exfmt-mk', a.total + '/' + a.max));
        tb.appendChild(r);
      });
      hist.appendChild(tb);
      var best = log.reduce(function (m, a) { return a.mode === 'full' ? Math.max(m, a.total) : m; }, 0);
      if (best) hist.appendChild(h('p', 'muted small', 'Best full mock: ' + best + ' / ' + M.total + ' · ' + bandOf(best)));
      host.appendChild(hist);
    }
  }

  function bandOf(pct) {
    if (pct >= 75) return 'distinction — exam-ready';
    if (pct >= 60) return 'merit — solid, tighten the unseen';
    if (pct >= 45) return 'pass — keep the daily drills going';
    return 'needs work — focus on Section 3 first, it is the quickest marks';
  }

  /* ---------- run controller ---------- */
  function examBegin(mode, strict) {
    run = {
      mode: mode, timed: mode === 'full' || strict === true, started: Date.now(),
      s1: 0, s2: 0, s3: 0, max: 80, done: { s1: false, s2: false, s3: false }
    };
    if (mode === 's1' || mode === 'full') return sec1();
    if (mode === 's2') return sec2();
    if (mode === 's3') return sec3();
    if (mode === 'sprint') return sec3(true);
    return sec1();
  }

  /* ---------- SECTION 1 · unseen translation ---------- */
  function sec1() {
    run.view = 's1';
    var p = X.unseens[Math.floor(Math.random() * X.unseens.length)];
    run.p = p;
    run.phaseEarly = 'reading time';
    run.phaseLate = 'writing time';
    run.phaseAt = 15 * 60000;
    var head = examChrome('Section 1 · Unseen translation', X.meta.sections[0].marks + ' marks · no dictionary',
      backBtn());
    var info = h('p', 'muted small');
    info.textContent = p.title + ' · ' + p.words + ' words · read it through first, then write your translation. Your draft is saved as you type.';
    head.appendChild(info);

    var box = h('div', 'exam-text latin');
    box.textContent = p.latin;
    head.appendChild(box);

    /* vocabulary aids — the paper provides them; tricky words, about one in five */
    if (p.aids && p.aids.length) {
      var ab = h('div', 'exam-aids');
      ab.appendChild(h('h4', 'aids-head', 'Words you may need'));
      var ul = h('ul', 'aids-list');
      p.aids.forEach(function (a) { ul.appendChild(h('li', null, esc(a[0] + ' — ' + a[1]))); });
      ab.appendChild(ul);
      head.appendChild(ab);
    }

    var ta = h('textarea', 'exam-writer');
    ta.id = 'exam-w1';
    ta.placeholder = 'Your English translation…';
    ta.value = draft('s1-' + p.id);
    ta.oninput = function () { draft('s1-' + p.id, ta.value); };
    head.appendChild(ta);

    var row = h('div', 'row gap');
    var fin = h('button', 'btn primary', 'Finish section 1 & mark');
    fin.onclick = onView('s1', function () { draft('s1-' + p.id, ta.value); mark1(); });
    row.appendChild(fin);
    if (run.timed) {
      var skip = h('button', 'btn ghost', 'Time up');
      skip.onclick = onView('s1', function () { draft('s1-' + p.id, ta.value); mark1(); });
      row.appendChild(skip);
      var end1 = function () { mark1(); }; end1._view = 's1';
      startClock(X.meta.sections[0].minutes * 60000, end1);
      var ph = h('span', 'pill', 'reading time');
      ph.id = 'exam-phase';
      el('exam-clock').parentNode.insertBefore(ph, el('exam-clock'));
    } else {
      var nt = h('span', 'muted small', 'untimed practice — sit the full mock for exam conditions');
      row.appendChild(nt);
    }
    head.appendChild(row);
    var fb = h('div', 'feedback');
    fb.id = 'exam-fb1';
    head.appendChild(fb);
  }

  function backBtn() {
    var b = h('button', 'btn ghost small', '← Exam');
    b.onclick = function () { stopClock(); run = null; renderExam(); };
    return b;
  }

  function mark1() {
    stopClock();
    if (!run || !run.p) return;
    run.view = 's1mark';
    var p = run.p;
    var head = examChrome('Section 1 · mark scheme', 'tick each point your translation earned · ' + X.meta.sections[0].marks + ' marks available');
    var mo = h('div', 'exam-model');
    mo.appendChild(h('h3', null, 'Model translation'));
    var mt = h('p', 'latin-lite');
    mt.textContent = p.translation;
    mo.appendChild(mt);
    var tips = h('ul', 'checklist');
    p.notes.forEach(function (n) { tips.appendChild(h('li', null, esc(n))); });
    mo.appendChild(tips);
    head.appendChild(mo);

    var tbl = h('div', 'markscheme');
    var total = h('div', 'ms-total');
    p.points.forEach(function (pt, i) {
      var r = h('div', 'ms-row');
      r.appendChild(h('div', 'ms-la latin', esc(pt.la)));
      r.appendChild(h('div', 'ms-en', esc(pt.en)));
      var opts = h('div', 'ms-opts');
      var kinds = pt.m >= 2 ? [['full', pt.m], ['part', Math.floor(pt.m / 2)], ['no', 0]] : [['yes', pt.m], ['no', 0]];
      kinds.forEach(function (k) {
        var lab = h('label', 'ms-opt');
        var inp = h('input');
        inp.type = 'radio'; inp.name = 'ms-' + i; inp.value = String(k[1]);
        inp.onchange = function () {
          var got = 0;
          p.points.forEach(function (_, j) {
            var c = document.querySelector('input[name="ms-' + j + '"]:checked');
            if (c) got += parseInt(c.value, 10);
          });
          el('ms-tot').textContent = got + ' / ' + 40;
          el('ms-go').disabled = false;
        };
        lab.appendChild(inp);
        lab.appendChild(h('span', null, k[0] === 'full' ? '✓' : k[0] === 'part' ? '½' : '✗'));
        opts.appendChild(lab);
      });
      r.appendChild(opts);
      tbl.appendChild(r);
    });
    total.innerHTML = 'Section 1 so far: <b id="ms-tot">0 / 40</b>';
    tbl.appendChild(total);
    head.appendChild(tbl);

    var go = h('button', 'btn primary', 'Save & continue →');
    go.id = 'ms-go';
    go.disabled = true;
    go.onclick = onView('s1mark', function () {
      var got = 0;
      p.points.forEach(function (_, j) {
        var c = document.querySelector('input[name="ms-' + j + '"]:checked');
        if (c) got += parseInt(c.value, 10);
      });
      var full = run.mode === 'full';
      run.s1 = got; run.done.s1 = true;
      if (full) return sec2();
      examFinish();
    });
    head.appendChild(go);
  }

  /* ---------- SECTION 2 · comprehension of chapter 43 ---------- */
  function sec2() {
    if (!run) return;
    run.view = 's2';
    var qs = X.comprehension.map(function (q) {
      return { q: q, opts: q.kind === 'a' ? shuffle(q.opts.slice()) : null, correct: q.kind === 'a' ? q.opts[q.ans] : null };
    });
    run.c2 = qs;
    var head = examChrome('Section 2 · Comprehension — chapter 43', X.meta.sections[1].brief + ' · ' + X.meta.sections[1].marks + ' marks', backBtn());
    var need = h('div', 'exam-need');
    need.appendChild(h('p', null, 'Have your own copy of the story open — Reader tab, or a second browser window — before you start the clock. Nothing from the textbook is stored here: this site asks the questions, your book supplies the text.'));
    head.appendChild(need);

    var list = h('div', 'cmp-list');
    qs.forEach(function (it, i) {
      var q = it.q;
      var blk = h('div', 'cmp-q');
      blk.appendChild(h('div', 'cmp-n', (i + 1) + '.'));
      var body = h('div', 'cmp-body');
      body.appendChild(h('p', 'cmp-text', esc(q.q) + ' '));
      var mk = h('span', 'muted small', q.m + ' mark' + (q.m > 1 ? 's' : ''));
      body.firstChild.appendChild(mk);
      if (q.kind === 'a') {
        it.opts.forEach(function (o) {
          var lab = h('label', 'cmp-opt');
          var inp = h('input');
          inp.type = 'radio'; inp.name = 'cmp-' + i; inp.value = o;
          lab.appendChild(inp); lab.appendChild(h('span', null, esc(o)));
          body.appendChild(lab);
        });
      } else {
        var ta = h('textarea', 'cmp-writer');
        ta.id = 'cmp-in-' + i;
        ta.placeholder = 'Answer in English…';
        ta.value = draft('s2-' + q.id);
        ta.oninput = function () { draft('s2-' + q.id, ta.value); };
        body.appendChild(ta);
      }
      blk.appendChild(body);
      list.appendChild(blk);
    });
    head.appendChild(list);

    var row = h('div', 'row gap');
    var fin = h('button', 'btn primary', 'Finish section 2 & mark');
    fin.onclick = onView('s2', mark2);
    row.appendChild(fin);
    head.appendChild(row);
    if (run.timed) { var end2 = mark2; end2._view = 's2'; startClock(X.meta.sections[1].minutes * 60000, end2); }
  }

  function mark2() {
    stopClock();
    if (!run || !run.c2) return;
    var qs = run.c2;
    run.view = 's2mark';
    /* read everything while the inputs still exist: examChrome() below empties the panel */
    qs.forEach(function (it, i) {
      if (it.q.kind === 'a') it.chosen = (document.querySelector('input[name="cmp-' + i + '"]:checked') || {}).value;
      else { var w = el('cmp-in-' + i); if (w) { it.wrote = w.value; draft('s2-' + it.q.id, w.value); } }
    });
    var head = examChrome('Section 2 · answers', 'auto-marked grammar first, then mark your written answers against the notes');
    var auto = 0, list = h('div', 'cmp-list');
    qs.forEach(function (it, i) {
      var q = it.q;
      var blk = h('div', 'cmp-q');
      blk.appendChild(h('div', 'cmp-n', (i + 1) + '.'));
      var body = h('div', 'cmp-body');
      body.appendChild(h('p', 'cmp-text', esc(q.q)));
      if (q.kind === 'a') {
        var chosen = it.chosen;
        var ok = chosen === it.correct;
        if (ok) auto += q.m;
        var st = h('span', 'feedback ' + (ok ? 'good' : 'bad'), ok ? '✓ correct' : '✗ ' + esc(it.correct));
        body.appendChild(st);
        body.appendChild(h('span', 'muted small', esc(q.explain || '')));
      } else {
        body.appendChild(h('p', 'exam-model-line', esc(q.a)));
        var sels = h('div', 'ms-opts');
        for (var k = q.m; k >= 0; k--) {
          (function (val) {
            var lab = h('label', 'ms-opt');
            var inp = h('input');
            inp.type = 'radio'; inp.name = 'cmk-' + i; inp.value = String(val);
            lab.appendChild(inp); lab.appendChild(h('span', null, String(val)));
            sels.appendChild(lab);
          })(k);
        }
        body.appendChild(sels);
      }
      blk.appendChild(body);
      list.appendChild(blk);
    });
    head.appendChild(list);
    var tot = h('div', 'ms-total');
    tot.innerHTML = 'Grammar analysis ' + auto + ' · written answers: <b id="cm-tot">0</b> / ' + (20 - auto);
    head.appendChild(tot);
    var go = h('button', 'btn primary', 'Save & continue →');
    go.onclick = onView('s2mark', function () {
      var got = auto;
      qs.forEach(function (it, i) {
        if (it.q.kind !== 'w') return;
        var c = document.querySelector('input[name="cmk-' + i + '"]:checked');
        if (c) got += parseInt(c.value, 10);
      });
      var full = run.mode === 'full';
      run.s2 = got; run.done.s2 = true;
      if (full) return sec3();
      examFinish();
    });
    head.appendChild(go);
    var recompute = function () {
      var w = 0;
      qs.forEach(function (it, i) {
        if (it.q.kind !== 'w') return;
        var c = document.querySelector('input[name="cmk-' + i + '"]:checked');
        if (c) w += parseInt(c.value, 10);
      });
      var e = el('cm-tot'); if (e) e.textContent = String(w);
    };
    Array.prototype.forEach.call(list.querySelectorAll('input[type=radio]'), function (r) { r.onchange = recompute; });
  }

  /* ---------- SECTION 3 · accidence & grammar ---------- */
  function sec3(sprint) {
    if (!run) return;
    run.view = 's3';
    var forms = [];
    var pool = shuffle(poolFor().filter(function (e) {
      var m = e.skill.meta || {};
      if (e.skill.kind === 'verb') return !(m.person === 1 && m.num === 'sg' && m.tense === 'pres' && (m.mood || 'ind') === 'ind');
      return !(m.cs === 'nom' && m.num === 'sg');   /* never ask the dictionary form */
    }).slice());
    /* exam accidence must span the four categories the syllabus names */
    [['v', 4], ['n', 3], ['adj', 2], ['p', 1]].forEach(function (pair) {
      var take = pair[1];
      pool.forEach(function (e) {
        if (take > 0 && e.word.type === pair[0] && forms.indexOf(e) < 0 &&
            !forms.some(function (f) { return f.word === e.word; })) {
          forms.push(e); take--;
        }
      });
    });
    pool.forEach(function (e) {
      if (forms.length < 10 && forms.indexOf(e) < 0 && !forms.some(function (f) { return f.word === e.word; })) forms.push(e);
    });
    forms = forms.slice(0, 10);
    run.forms = forms;
    run.gq = shuffle(X.grammarQ.slice()).slice(0, sprint ? 5 : 5);

    var head = examChrome(sprint ? 'Form sprint' : 'Section 3 · Accidence & grammar',
      sprint ? 'ten forms, five grammar questions · no mark claim' : X.meta.sections[2].brief + ' · 10 + 10 marks', backBtn());

    var f = h('div', 'acc-list');
    f.appendChild(h('h3', null, 'Accidence — give the form (1 mark each)'));
    forms.forEach(function (e, i) {
      var r = h('div', 'acc-row');
      r.appendChild(h('div', 'acc-q', esc(promptFor(e))));
      var inp = h('input', 'tin acc-in');
      inp.id = 'acc-in-' + i;
      inp.autocomplete = 'off'; inp.spellcheck = false;
      r.appendChild(inp);
      f.appendChild(r);
    });
    head.appendChild(f);

    var g = h('div', 'acc-list');
    g.appendChild(h('h3', null, 'Grammar — short answers (2 marks each)'));
    run.gq.forEach(function (q, i) {
      var r = h('div', 'acc-row');
      r.appendChild(h('div', 'acc-q', esc(q.q)));
      var inp = h('input', 'tin acc-in');
      inp.id = 'gq-in-' + i;
      inp.autocomplete = 'off'; inp.spellcheck = false;
      r.appendChild(inp);
      g.appendChild(r);
    });
    head.appendChild(g);

    var row = h('div', 'row gap');
    var fin = h('button', 'btn primary', 'Mark section 3');
    fin.onclick = onView('s3', function () { mark3(sprint); });
    row.appendChild(fin);
    head.appendChild(row);
    if (run.timed && !sprint) { var end3 = function () { mark3(false); }; end3._view = 's3'; startClock(X.meta.sections[2].minutes * 60000, end3); }
    var inp0 = el('acc-in-0');
    if (inp0) inp0.focus();
  }

  function mark3(sprint) {
    stopClock();
    if (!run || !run.forms) return;
    run.view = 's3mark';
    var right = 0, notes = [];
    run.forms.forEach(function (e, i) {
      var inp = el('acc-in-' + i);
      var want = e.skill.form;
      var alts = formVariants(want).map(normalizeSans);
      var ok = inp && alts.indexOf(normalizeSans(inp.value)) >= 0;
      if (ok) right++;
      else notes.push(promptFor(e) + ' → ' + want);
      if (inp) { inp.classList.remove('wrong', 'right'); inp.classList.add(ok ? 'right' : 'wrong'); inp.title = want; }
    });
    var gr = 0;
    run.gq.forEach(function (q, i) {
      var inp = el('gq-in-' + i);
      var v = inp ? normalizeSans(inp.value) : '';
      var ok = !!v && q.accept.some(function (a) { return v === normalizeSans(a) || v.indexOf(normalizeSans(a)) >= 0; });
      if (ok) gr += q.m;
      if (inp) { inp.classList.remove('wrong', 'right'); inp.classList.add(ok ? 'right' : 'wrong'); inp.title = q.a; }
    });
    var total = sprint ? null : Math.min(20, right + gr);
    if (total !== null) { run.s3 = total; run.done.s3 = true; }

    var head = examChrome(sprint ? 'Sprint results' : 'Section 3 · marked',
      sprint ? right + '/10 forms · ' + gr + '/10 grammar — not counted as an exam sit'
             : right + '/10 forms · ' + gr + '/10 grammar → ' + total + ' / 20');
    if (notes.length) {
      var nl = h('div', 'exam-model');
      nl.appendChild(h('h3', null, 'Look these up'));
      var ul = h('ul', 'checklist');
      notes.slice(0, 12).forEach(function (n) { ul.appendChild(h('li', null, esc(n))); });
      nl.appendChild(ul);
      head.appendChild(nl);
    }
    var row = h('div', 'row gap');
    var go = h('button', 'btn primary', run.mode === 'full' ? 'See my paper score →' : 'Done');
    go.onclick = onView('s3mark', function () { if (run.mode === 'full') examFinish(); else { stopClock(); run = null; renderExam(); } });
    row.appendChild(go);
    var again = h('button', 'btn ghost', sprint ? 'Another sprint' : 'Same section again');
    var mode = run.mode, timed = run.timed;
    again.onclick = function () { run = null; examBegin(mode, timed); };
    row.appendChild(again);
    head.appendChild(row);
  }

  /* ---------- scorecard ---------- */
  function examFinish() {
    if (!run) return;
    run.view = 'done';
    stopClock();
    var mins = Math.round((Date.now() - run.started) / 60000);
    var total = run.s1 + run.s2 + run.s3;
    var max = run.mode === 'full' ? 80 : (run.done.s1 ? 40 : 0) + (run.done.s2 ? 20 : 0) + (run.done.s3 ? 20 : 0);
    var head = examChrome('Paper score', run.mode === 'full'
      ? 'full mock · ' + mins + ' minutes used · ' + bandOf(Math.round(total * 100 / 80))
      : 'partial sit · ' + mins + ' minutes used');
    var grid = h('div', 'exscore');
    [['Unseen translation', run.s1, 40], ['Comprehension · ch. 43', run.s2, 20], ['Accidence & grammar', run.s3, 20]].forEach(function (r) {
      var c = h('div', 'exscore-cell');
      c.appendChild(h('span', 'muted small', esc(r[0])));
      c.appendChild(h('b', null, r[1] + ' / ' + r[2]));
      var pct = r[2] ? Math.round(100 * r[1] / r[2]) : 0;
      var bar = h('div', 'bar');
      var fg = h('div', 'bar-fg');
      fg.style.width = pct + '%';
      bar.appendChild(fg);
      c.appendChild(bar);
      grid.appendChild(c);
    });
    var big = h('div', 'exscore-total');
    big.appendChild(h('b', null, String(total)));
    big.appendChild(h('span', 'muted', ' / ' + (max || 80)));
    head.appendChild(grid);
    head.appendChild(big);

    /* one XP claim per sitting, and only for a real sitting */
    var xp = 0, why = '';
    if (run.mode === 'full') {
      if (mins < 25) { xp = 0; why = ' — finished in under 25 minutes, so no XP: that is not exam pace'; }
      else if (total < 20) { xp = 0; why = ' — under 20 marks, so no XP; the marks are the point, not the sitting'; }
      else { xp = Math.max(5, Math.round(total / 4)); }
    } else {
      why = ' — partial sits earn no XP';
    }

    var entry = {
      when: new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      mode: run.mode, label: run.mode === 'full' ? 'Full mock' : 'Section ' + (run.done.s2 ? 2 : run.done.s3 ? 3 : 1),
      s1: run.s1, s2: run.s2, s3: run.s3, total: total, max: max || 80, mins: mins
    };
    var log = examLog();
    log.push(entry);
    examLogSave(log);

    var row = h('div', 'row gap');
    var again = h('button', 'btn primary', 'Sit another paper');
    again.onclick = function () { examBegin('full'); };
    row.appendChild(again);
    var back = h('button', 'btn ghost', '← Exam home');
    back.onclick = function () { renderExam(); };
    row.appendChild(back);
    if (xp) { award(xp); }
    else if (why) row.appendChild(h('span', 'muted small', 'no XP' + why));
    head.appendChild(row);

    var fixit = h('p', 'muted small', 'Weakest section first: ' + weakest());
    head.appendChild(fixit);
    run = null;
  }

  function weakest() {
    var r = [];
    if (run) {
      if (run.s1 < 28) r.push('unseen translation — do one original unseen every day, out loud, then compare');
      if (run.s2 < 14) r.push('comprehension — reread ch. 43 and answer in full English sentences');
      if (run.s3 < 14) r.push('accidence — the Quick-fire and Full tables drills are the fastest fix');
    }
    return r.length ? r.join(' · ') : 'nothing obvious — keep the pace and rest the night before';
  }

  /* ---------- XP & streak ---------- */
  function levelOf(xp) { return Math.floor(Math.sqrt(xp / 50)) + 1; }
  function levelFloor(lvl) { return 50 * (lvl - 1) * (lvl - 1); }
  function today() { return new Date().toISOString().slice(0, 10); }

  function award(n) {
    if (!n) return;
    prog.xp += n;
    var t = today();
    if (prog.lastDay !== t) {
      var y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      prog.streak = prog.lastDay === y ? prog.streak + 1 : 1;
      prog.lastDay = t;
    }
    store.setItem('cursus_xp', String(prog.xp));
    store.setItem('cursus_streak', String(prog.streak));
    store.setItem('cursus_lastday', t);
    toast('+' + n + ' XP');
    headers();
  }

  function toast(msg) {
    var t = el('xp-toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    t.style.animation = 'none';
    void t.offsetWidth; /* reflow restarts the animation */
    t.style.animation = '';
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(function () { t.classList.add('hidden'); }, 1500);
  }

  /* ---------- DASHBOARD ---------- */
  function renderDash() {
    var pct = state.total.asked ? Math.round(100 * state.total.right / state.total.asked) : 0;
    el('dash-acc').textContent = state.total.asked ? pct + '%' : '—';
    el('ring-acc').style.strokeDashoffset = String(327 * (1 - pct / 100));
    el('dash-greeting').innerHTML = 'Salve, <span class="accent">' + esc(session ? (session.name || 'navigator') : 'navigator') + '</span>';
    el('dash-sub').textContent = state.total.asked
      ? state.total.right + ' of ' + state.total.asked + ' forms right so far'
      : 'Start drilling and this fills up.';

    var lvl = levelOf(prog.xp), cur = levelFloor(lvl), next = levelFloor(lvl + 1);
    el('dash-level').textContent = lvl;
    el('dash-xp').textContent = prog.xp;
    el('dash-levelbar').style.width = Math.round(100 * (prog.xp - cur) / (next - cur)) + '%';
    el('dash-tonext').textContent = (next - prog.xp) + ' XP to level ' + (lvl + 1);

    var deck = vocabDeck();
    var mastered = deck.filter(function (w) { return vsState(w).box >= 5; }).length;
    el('dash-cards').textContent = mastered;
    el('dash-cards-total').textContent = deck.length;
    el('dash-vocabbar').style.width = (deck.length ? Math.round(100 * mastered / deck.length) : 0) + '%';

    var doneMap = passDone();
    var done = P.list.filter(function (p) { return doneMap[p.id]; }).length;
    el('dash-pass').textContent = done;
    el('dash-pass-total').textContent = P.list.length;
    el('dash-passbar').style.width = (P.list.length ? Math.round(100 * done / P.list.length) : 0) + '%';

    el('dash-streak').textContent = prog.streak;

    var host = el('dash-history');
    host.innerHTML = '';
    if (X) {
      var cd = daysToExam();
      var log = examLog();
      var full = log.filter(function (a) { return a.mode === 'full'; });
      var best = full.reduce(function (m, a) { return Math.max(m, a.total); }, 0);
      var er = h('div', 'hist-row dash-exam' + (!cd.past && cd.days <= 10 ? ' warn' : ''));
      er.appendChild(h('span', null, cd.past
        ? 'Semester 2 exam has passed'
        : 'Semester 2 exam in ' + cd.days + ' days · ' + X.meta.whenLabel.split(',')[0]));
      er.appendChild(h('b', null, best ? 'best mock ' + best + ' / 80' : 'no mock sat yet'));
      host.appendChild(er);
    }
    Array.prototype.forEach.call(host.childNodes, function () {});
    host.appendChild(h('h3', null, esc('Recent answers')));
    if (state.round.length) {
      state.round.slice(-6).reverse().forEach(function (r) {
        host.appendChild(h('div', 'hist-row' + (r.ok ? ' good' : ' bad'),
          '<span>' + esc(r.prompt) + '</span><b>' + (r.ok ? '✓ ' + esc(r.given) : '✗ ' + esc(r.given || '—') + ' → ' + esc(r.want)) + '</b>'));
      });
    } else {
      host.appendChild(h('p', 'muted small', 'Your latest quick-fire answers will appear here.'));
    }
  }

  /* ---------- UNSEEN TRANSLATION ---------- */
  var formIdx = null;
  function formIndex() {
    if (!formIdx) formIdx = G.buildIndex(W.all);
    return formIdx;
  }
  function passDoneMapId() { return 'cursus_pass'; }
  function passDone() {
    try { return JSON.parse(store.getItem(passDoneMapId()) || '{}'); } catch (e) { return {}; }
  }
  function passSave(map) { store.setItem(passDoneMapId(), JSON.stringify(map)); }

  function tokenize(text) {
    /* tokens: {word, gloss?, pre, post} — [word|gloss] syntax;
       the gloss itself may contain spaces, and quotes may hug the bracket */
    var parts = text.split(/\s+/), out = [];
    function pushPlain(chunk) {
      var lead = (chunk.match(/^[.,!?;:"“”]+/) || [''])[0];
      var core = chunk.slice(lead.length).replace(/[.,!?;:"“”]+$/, '');
      var post = chunk.slice(lead.length + core.length);
      if (core) out.push({ word: core, pre: lead, post: post });
    }
    for (var i = 0; i < parts.length; i++) {
      var c = parts[i], at = c.indexOf('[');
      if (at < 0) { pushPlain(c); continue; }
      var pre = c.slice(0, at), rest = c.slice(at);
      var guard = 0;
      while (rest.indexOf(']') < 0 && i + 1 < parts.length && guard++ < 12) {
        i++; rest += ' ' + parts[i];
      }
      var m = rest.match(/^\[([^|\]]+)\|([^\]]+)\]([.,!?;:”"]*)$/);
      if (m) {
        var leadQ = pre && /[“”"]$/.test(pre) ? pre.charAt(pre.length - 1) : '';
        if (leadQ) pre = pre.slice(0, -1);
        out.push({ word: m[1], gloss: m[2], pre: pre + leadQ, post: m[3] });
      } else {
        pushPlain(rest);   /* malformed bracket — show it literally */
      }
    }
    return out.filter(function (tk) { return tk.word; });
  }

  function renderUnseen() {
    var host = el('unseen-pick');
    var done = passDone();
    host.innerHTML = '';
    host.appendChild(h('h3', null, esc('Choose a passage')));
    host.appendChild(h('p', 'muted small', 'Original unseen passages written for this site, graded by chapter. Click a word for meaning; the model translation stays hidden until you ask for it.'));
    var grid = h('div', 'pass-grid');
    var anyVisible = false;
    P.byTier('A').concat(P.byTier('B')).concat(P.byTier('C')).forEach(function (p) {
      var locked = state.chapter < p.min;
      if (!locked) anyVisible = true;
      var card = h('div', 'pass-card' + (locked ? ' lockpass' : ''));
      card.appendChild(h('span', 'tierchip tier-' + p.tier, 'Tier ' + p.tier));
      card.appendChild(h('div', 'ptitle latin', esc(p.title)));
      if (locked) {
        card.appendChild(h('div', 'pmeta', 'unlocks at chapter ' + p.min + ' — raise the chapter in the header'));
      } else {
        card.appendChild(h('div', 'pmeta', '≈ ' + p.text.split(/\s+/).length + ' words · chapter ' + p.min + '+'));
        if (done[p.id]) card.appendChild(h('div', 'pass-done', '✓ read — rated "' + done[p.id] + '"'));
        card.onclick = function () { openPassage(p); };
      }
      grid.appendChild(card);
    });
    host.appendChild(grid);
    if (!anyVisible) host.appendChild(h('p', 'muted', 'No passages unlocked yet — raise your chapter level in the header.'));
    el('unseen-view').innerHTML = '';
  }

  function openPassage(p) {
    el('unseen-pick').classList.add('hidden');
    var host = el('unseen-view');
    host.innerHTML = '';
    var head = h('div', 'pass-header');
    head.appendChild(h('h3', 'latin', esc(p.title)));
    var hx = h('div', 'row gap');
    hx.appendChild(h('span', 'tierchip tier-' + p.tier, 'Tier ' + p.tier));
    var back = h('button', 'btn ghost small', '← All passages');
    back.onclick = function () {
      el('unseen-view').innerHTML = '';
      el('unseen-pick').classList.remove('hidden');
      hideGloss();
    };
    hx.appendChild(back);
    head.appendChild(hx);
    host.appendChild(head);
    host.appendChild(h('p', 'muted small', esc(p.note || '')));

    var text = h('div', 'pass-text latin');
    var idx = formIndex();
    tokenize(p.text).forEach(function (tk) {
      if (tk.pre) text.appendChild(document.createTextNode(tk.pre));
      var span = h('span', 'tok' + (tk.gloss ? ' glossed' : ''), esc(tk.word));
      span.onclick = function (ev) {
        ev.stopPropagation(); /* keep the document-level dismiss from eating this click */
        var html = '<b>' + esc(tk.word) + '</b>';
        if (tk.gloss) html += '<span class="gparse">' + esc(tk.gloss) + '</span>';
        else {
          var hits = idx[G.normalize(tk.word)];
          if (hits && hits.length) html += '<span class="gparse">' + esc(hits[0].parse) + ' · from ' + esc(hits[0].word) + '</span>';
          else html += '<span class="gparse muted">not glossed — guess from context</span>';
        }
        showGloss(html, ev.clientX, ev.clientY);
      };
      text.appendChild(span);
      if (tk.post) text.appendChild(document.createTextNode(tk.post + ' '));
      else text.appendChild(document.createTextNode(' '));
    });
    host.appendChild(text);

    var tr = h('div', 'tr-box muted hidden', esc(p.translation));
    var row = h('div', 'row gap');
    var reveal = h('button', 'btn ghost', 'Reveal model translation');
    reveal.onclick = function () {
      tr.classList.toggle('hidden');
      reveal.textContent = tr.classList.contains('hidden') ? 'Reveal model translation' : 'Hide translation';
    };
    row.appendChild(reveal);
    host.appendChild(row);
    host.appendChild(tr);

    host.appendChild(h('p', 'muted small', 'Translate away from the screen or on paper, then rate yourself:'));
    var rate = h('div', 'rate-row');
    var alreadyDone = !!passDone()[p.id];
    [['nailed it', 'nailed it', 40], ['shaky but done', 'shaky', 15], ['again tomorrow', 'again', 0]].forEach(function (r) {
      var b = h('button', 'btn ghost', r[0]);
      b.onclick = function () {
        var map = passDone();
        var firstTime = !map[p.id];
        map[p.id] = r[1];
        passSave(map);
        if (firstTime) award(r[2]);
        Array.prototype.forEach.call(rate.querySelectorAll('button'), function (x) { x.disabled = true; });
        rate.appendChild(h('span', 'feedback good', '✓ saved' + (firstTime && r[2] ? ' (+' + r[2] + ' XP)' : (map[p.id] ? ' (already rated — no XP)' : ''))));
      };
      rate.appendChild(b);
    });
    if (alreadyDone) {
      Array.prototype.forEach.call(rate.querySelectorAll('button'), function (x) { x.disabled = true; });
      rate.appendChild(h('span', 'feedback', 'already rated — re-rate for practice, no XP'));
    }
    host.appendChild(rate);
  }

  function showGloss(html, x, y) {
    var tip = el('unseen-gloss');
    tip.innerHTML = html;
    tip.classList.remove('hidden');
    tip.style.display = 'block';
    var pad = 12, w = tip.offsetWidth, hgt = tip.offsetHeight;
    var left = Math.min(x + pad, window.innerWidth - w - 10);
    var top = y + pad + hgt > window.innerHeight ? y - hgt - pad : y + pad;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }
  function hideGloss() {
    var tip = el('unseen-gloss');
    tip.classList.remove('hidden');
    tip.style.display = 'none';
  }
  document.addEventListener('click', function (ev) {
    var tip = el('unseen-gloss');
    if (tip && tip.style.display === 'block' && !tip.contains(ev.target)) hideGloss();
  });

  /* ---------- AUTH ---------- */
  var fbApp = null, fbAuth = null;
  function fbConfigured() {
    return typeof window.FB_CONFIG === 'object' && window.FB_CONFIG.apiKey &&
      String(window.FB_CONFIG.apiKey).indexOf('PASTE') === -1;
  }
  function loadFirebase(cb) {
    if (window.firebase && window.firebase.auth) return cb();
    var s1 = document.createElement('script');
    s1.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js';
    s1.onload = function () {
      var s2 = document.createElement('script');
      s2.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js';
      s2.onload = function () {
        try { window.firebase.initializeApp(window.FB_CONFIG); cb(); } catch (err) { cb('error'); }
      };
      s2.onerror = function () { cb('error'); };
      document.head.appendChild(s2);
    };
    s1.onerror = function () { cb('error'); };
    document.head.appendChild(s1);
  }

  function authError(msg) { el('auth-error').textContent = msg || ''; }
  function authMode(m) {
    m = m === 'up' ? 'up' : 'in';
    if (typeof authMode._m === 'undefined') authMode._m = 'in';
    authMode._m = m;
    el('auth-mode-in').classList.toggle('active', m === 'in');
    el('auth-mode-up').classList.toggle('active', m === 'up');
    el('auth-go').textContent = m === 'in' ? 'Sign in' : 'Create account';
    el('auth-name-row').classList.toggle('hidden', !(m === 'up' || !fbConfigured()));
    el('auth-name').autocomplete = 'name';
  }
  function friendlyFbErr(e) {
    var code = (e && e.code || '').replace('auth/', '');
    if (code === 'email-already-in-use') return 'That email already has an account — sign in instead.';
    if (code === 'weak-password') return 'Password must be at least 6 characters.';
    if (code === 'invalid-email') return 'That email address does not look right.';
    if (code === 'user-not-found' || code === 'wrong-password' || code === 'invalid-credential') return 'Email or password is wrong.';
    if (code === 'too-many-requests') return 'Too many attempts — wait a minute.';
    if (code === 'operation-not-allowed') return 'Enable Email/Password sign-in in the Firebase console (Authentication → Sign-in method).';
    if (code === 'configuration-not-found') return 'Authentication is not set up for this Firebase project yet. In the console open Build → Authentication, click "Get started", then enable Email/Password.';
    return 'Something went wrong: ' + (code || 'unknown');
  }
  function migrateTo(user) {
    var to = 'cursus_u_' + user.id + '_';
    if (rawStore.getItem(to + 'cursus_chapter')) return; /* profile already exists */
    ['cursus_chapter', 'cursus_total', 'cursus_vocabMode', 'cursus_xp', 'cursus_streak', 'cursus_lastday', 'cursus_pass'].forEach(function (k) {
      var anon = rawStore.getItem('cursusanon_' + k);
      if (anon === null) anon = rawStore.getItem(k); /* even older global keys */
      if (anon !== null && rawStore.getItem(to + k) === null) rawStore.setItem(to + k, anon);
    });
    for (var i = 0; i < rawStore.length; i++) {
      var key = rawStore.key(i);
      if (key && key.indexOf('cursusanon_cursus_v_') === 0) {
        rawStore.setItem(to + key.slice('cursusanon_'.length), rawStore.getItem(key));
      }
    }
  }
  function startSession(user) {
    migrateTo(user);
    rawStore.setItem('cursus_session', JSON.stringify(user));
    window.location.reload();
  }
  function localProfile() {
    var name = (el('auth-name').value || '').trim();
    if (!name) { authError('Give a name so your profile has a face.'); return; }
    var id = 'local_' + G.normalize(name).replace(/[^a-z0-9]+/g, '');
    startSession({ mode: 'local', id: id, name: name });
  }
  function fbSubmit() {
    loadFirebase(function (err) {
      if (err) { authError('Could not reach Firebase — continue without an account for now.'); return; }
      fbAuth = window.firebase.auth();
      var email = el('auth-email').value.trim(), pass = el('auth-pass').value;
      var finish = function (user) {
        var name = authMode._m === 'up' ? (el('auth-name').value.trim() || email.split('@')[0]) : (user.displayName || email.split('@')[0]);
        if (authMode._m === 'up' && el('auth-name').value.trim()) {
          user.updateProfile({ displayName: el('auth-name').value.trim() });
        }
        startSession({ mode: 'fb', id: user.uid, name: name });
      };
      if (authMode._m === 'up') {
        fbAuth.createUserWithEmailAndPassword(email, pass).then(function (cred) { finish(cred.user); }).catch(function (e) { authError(friendlyFbErr(e)); });
      } else {
        fbAuth.signInWithEmailAndPassword(email, pass).then(function (cred) { finish(cred.user); }).catch(function (e) { authError(friendlyFbErr(e)); });
      }
    });
  }
  function logoutUser() {
    rawStore.removeItem('cursus_session');
    if (fbAuth) fbAuth.signOut().catch(function () {});
    window.location.reload();
  }
  function initAuth() {
    if (session) {
      el('auth-gate').classList.add('hidden');
      el('user-name').textContent = session.name || 'navigator';
      el('user-avatar').textContent = (session.name || '?').charAt(0).toUpperCase();
      setTab('dash');
      return;
    }
    el('auth-gate').classList.remove('hidden');
    authMode('in');
    if (!fbConfigured()) {
      el('auth-localhint').classList.remove('hidden');
      el('auth-email-row').classList.add('hidden'); /* local mode: name is the only field that matters */
      el('auth-pass-row').classList.add('hidden');
      el('auth-go').onclick = function (ev) { ev.preventDefault(); localProfile(); };
    } else {
      el('auth-localhint').classList.add('hidden');
      el('auth-email-row').classList.remove('hidden');
      el('auth-pass-row').classList.remove('hidden');
      el('auth-go').onclick = function (ev) { ev.preventDefault(); authError(''); fbSubmit(); };
    }
    el('auth-mode-in').onclick = function () { authMode('in'); };
    el('auth-mode-up').onclick = function () { authMode('up'); };
    el('auth-local').onclick = function () {
      startSession({ mode: 'local', id: 'anon', name: 'Guest' });
    };
    el('auth-form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      el('auth-go').click();
    });
  }

  /* ---------- wire-up ---------- */
  window.addEventListener('DOMContentLoaded', function () {
    buildChapterSelect();
    headers();
    tabs.forEach(function (t) { el('tab-' + t).onclick = function () { setTab(t); }; });
    el('q-check').onclick = checkAnswer;
    el('q-next').onclick = nextQuestion;
    el('q-answer').addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') { ev.preventDefault(); if (!el('q-check').classList.contains('hidden')) checkAnswer(); else nextQuestion(); }
    });
    el('p-check').onclick = checkParse;
    el('p-next').onclick = newParse;
    /* theme toggle (light is the default; choice persists per device) */
    el('theme-btn').onclick = function () {
      var t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = t;
      try { localStorage.setItem('cursus-theme', t); } catch (e) {}
      this.textContent = t === 'light' ? 'Dark' : 'Light';
    };
    el('theme-btn').textContent = document.documentElement.dataset.theme === 'dark' ? 'Light' : 'Dark';
    el('user-logout').onclick = logoutUser;
    Array.prototype.forEach.call(document.querySelectorAll('[data-goto]'), function (b) {
      b.onclick = function () { setTab(b.getAttribute('data-goto')); };
    });
    initAuth();
    /* dev handle for tests / console poking — harmless to leave in */
    window.__cursus = { state: state, prog: prog };
    Object.defineProperty(window.__cursus, 'run', { get: function () { return run; } });
  });
})();
