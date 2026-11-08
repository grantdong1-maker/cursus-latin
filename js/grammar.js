/* Latin morphology engine.
   Generates every nominal / verbal form used by the drills, plus a
   form -> parses index for the parse mode. Original content. */
(function (root) {
  'use strict';

  var CASES = ['nom', 'gen', 'dat', 'acc', 'abl'];   /* data order: the paradigm arrays below are keyed to this */
  var CASE_ORDER = ['nom', 'acc', 'gen', 'dat', 'abl'];  /* display order — NAGDA, as taught on this course */
  var CASE_LABEL = { nom: 'nominative', gen: 'genitive', dat: 'dative', acc: 'accusative', abl: 'ablative' };
  var NUMS = ['sg', 'pl'];
  var NUM_LABEL = { sg: 'singular', pl: 'plural' };
  var GENDERS = ['m', 'f', 'n'];
  var GENDER_LABEL = { m: 'masculine', f: 'feminine', n: 'neuter' };
  var TENSES = ['pres', 'imp', 'fut', 'perf', 'plup', 'fp'];
  var TENSE_LABEL = { pres: 'present', imp: 'imperfect', fut: 'future', perf: 'perfect', plup: 'pluperfect', fp: 'future perfect' };
  var PERSONS = [1, 2, 3];
  var PERSON_LABEL = { 1: '1st person', 2: '2nd person', 3: '3rd person' };

  /* ---------- nominal paradigms ---------- */

  var DECL = {
    d1:   { intro: 1, s: ['a', 'ae', 'ae', 'am', 'ā'], p: ['ae', 'ārum', 'īs', 'ās', 'īs'] },
    d2m:  { intro: 2, s: ['us', 'ī', 'ō', 'um', 'ō'], p: ['ī', 'ōrum', 'īs', 'ōs', 'īs'] },
    d2ms: { intro: 2, s: [null, 'ī', 'ō', 'um', 'ō'], p: ['ī', 'ōrum', 'īs', 'ōs', 'īs'] },
    d2n:  { intro: 2, s: ['um', 'ī', 'ō', 'um', 'ō'], p: ['a', 'ōrum', 'īs', 'a', 'īs'] },
    d3c:  { intro: 5, s: [null, 'is', 'ī', 'em', 'e'], p: ['ēs', 'um', 'ibus', 'ēs', 'ibus'] },
    d3cn: { intro: 5, s: [null, 'is', 'ī', null, 'e'], p: ['a', 'um', 'ibus', 'a', 'ibus'] },
    d3i:  { intro: 10, s: [null, 'is', 'ī', 'em', 'e'], p: ['ēs', 'ium', 'ibus', 'ēs', 'ibus'] },
    d3in: { intro: 12, s: [null, 'is', 'ī', null, 'e'], p: ['ia', 'ium', 'ibus', 'ia', 'ibus'] },
    d4:   { intro: 20, s: ['us', 'ūs', 'uī', 'um', 'ū'], p: ['ūs', 'uum', 'ibus', 'ūs', 'ūs'] },
    d5:   { intro: 23, s: ['ēs', 'eī', 'eī', 'em', 'ē'], p: ['ēs', 'ērum', 'ēbus', 'ēs', 'ēbus'] }
  };

  /* ---------- verbal paradigms (per conjugation, full strings) ---------- */

  var V = {
    1: {
      intro: 1,
      pres: ['ō', 'ās', 'at', 'āmus', 'ātis', 'ant'],
      p:    ['or', 'āris', 'ātur', 'āmur', 'āminī', 'antur'],
      imp:  ['ābam', 'ābās', 'ābat', 'ābāmus', 'ābātis', 'ābant'],
      ip:   ['ābar', 'ābāris', 'ābātur', 'ābāmur', 'ābāminī', 'ābantur'],
      fut:  ['ābo', 'ābis', 'ābit', 'ābimus', 'ābitis', 'ābunt'],
      fp:   ['ābor', 'āberis', 'ābitur', 'ābimur', 'ābiminī', 'ābuntur']
    },
    2: {
      intro: 2,
      pres: ['eō', 'ēs', 'et', 'ēmus', 'ētis', 'ent'],
      p:    ['eor', 'ēris', 'ētur', 'ēmur', 'ēminī', 'entur'],
      imp:  ['ēbam', 'ēbās', 'ēbat', 'ēbāmus', 'ēbātis', 'ēbant'],
      ip:   ['ēbar', 'ēbāris', 'ēbātur', 'ēbāmur', 'ēbāminī', 'ēbantur'],
      fut:  ['ēbo', 'ēbis', 'ēbit', 'ēbimus', 'ēbitis', 'ēbunt'],
      fp:   ['ēbor', 'ēberis', 'ēbitur', 'ēbimur', 'ēbiminī', 'ēbuntur']
    },
    3: {
      intro: 4,
      pres: ['ō', 'is', 'it', 'imus', 'itis', 'unt'],
      p:    ['or', 'eris', 'itur', 'imur', 'iminī', 'untur'],
      imp:  ['ēbam', 'ēbās', 'ēbat', 'ēbāmus', 'ēbātis', 'ēbant'],
      ip:   ['ēbar', 'ēbāris', 'ēbātur', 'ēbāmur', 'ēbāminī', 'ēbantur'],
      fut:  ['am', 'ēs', 'et', 'ēmus', 'ētis', 'ent'],
      fp:   ['ar', 'ēris', 'ētur', 'ēmur', 'ēminī', 'entur']
    },
    33: { /* -iō type of 3rd conjugation */
      intro: 6,
      pres: ['iō', 'is', 'it', 'imus', 'itis', 'iunt'],
      p:    ['ior', 'eris', 'itur', 'imur', 'iminī', 'iuntur'],
      imp:  ['iēbam', 'iēbās', 'iēbat', 'iēbāmus', 'iēbātis', 'iēbant'],
      ip:   ['iēbar', 'iēbāris', 'iēbātur', 'iēbāmur', 'iēbāminī', 'iēbantur'],
      fut:  ['iam', 'iēs', 'iet', 'iēmus', 'iētis', 'ient'],
      fp:   ['iar', 'iēris', 'iētur', 'iēmur', 'iēminī', 'iēntur']
    },
    4: {
      intro: 5,
      pres: ['iō', 'īs', 'it', 'īmus', 'ītis', 'iunt'],
      p:    ['ior', 'īris', 'ītur', 'īmur', 'īminī', 'iuntur'],
      imp:  ['iēbam', 'iēbās', 'iēbat', 'iēbāmus', 'iēbātis', 'iēbant'],
      ip:   ['iēbar', 'iēbāris', 'iēbātur', 'iēbāmur', 'iēbāminī', 'iēbantur'],
      fut:  ['iam', 'iēs', 'iet', 'iēmus', 'iētis', 'ient'],
      fp:   ['iar', 'iēris', 'iētur', 'iēmur', 'iēminī', 'iēntur']
    }
  };
  var PERF = ['ī', 'istī', 'it', 'imus', 'istis', 'ērunt'];
  var PLUP = ['eram', 'erās', 'erat', 'erāmus', 'erātis', 'erant'];
  var FPS = ['erō', 'eris', 'erit', 'erimus', 'eritis', 'erint'];
  var IMPERAT = { 1: ['ā', 'āte'], 2: ['ē', 'ēte'], 3: ['e', 'ite'], 33: ['e', 'ite'], 4: ['ī', 'īte'] };

  var SUM = {
    pres: ['sum', 'es', 'est', 'sumus', 'estis', 'sunt'],
    imp: ['eram', 'erās', 'erat', 'erāmus', 'erātis', 'erant'],
    fut: ['erō', 'eris', 'erit', 'erimus', 'eritis', 'erunt'],
    perf: ['fuī', 'fuistī', 'fuit', 'fuimus', 'fuistis', 'fuērunt'],
    plup: ['fueram', 'fuerās', 'fuerat', 'fuerāmus', 'fuerātis', 'fuerant'],
    fp: ['fuerō', 'fueris', 'fuerit', 'fuerimus', 'fueritis', 'fuerint']
  };
  var SIM = ['sim', 'sīs', 'sit', 'sīmus', 'sītis', 'sint'];
  var ESSEM = ['essem', 'essēs', 'esset', 'essēmus', 'essētis', 'essent'];
  /* present subjunctive: needs its own thematic per conjugation */
  var SUBJ_PRES = {
    1:  ['em', 'ēs', 'et', 'ēmus', 'ētis', 'ent'],
    2:  ['eam', 'eās', 'eat', 'eāmus', 'eātis', 'eant'],
    3:  ['am', 'ās', 'at', 'āmus', 'ātis', 'ant'],
    33: ['iam', 'iās', 'iat', 'iāmus', 'iātis', 'iant'],
    4:  ['iam', 'iās', 'iat', 'iāmus', 'iātis', 'iant']
  };
  var SUBJ_PRES_P = {
    1:  ['er', 'ēris', 'ētur', 'ēmur', 'ēminī', 'entur'],
    2:  ['ear', 'eāris', 'eātur', 'eāmur', 'eāminī', 'eantur'],
    3:  ['ar', 'āris', 'ātur', 'āmur', 'āminī', 'antur'],
    33: ['iar', 'iāris', 'iātur', 'iāmur', 'iāminī', 'iantur'],
    4:  ['iar', 'iāris', 'iātur', 'iāmur', 'iāminī', 'iantur']
  };
  var SUBJ_IMPF_A = ['em', 'ēs', 'et', 'ēmus', 'ētis', 'ent'];
  var SUBJ_IMPF_P = ['er', 'ēris', 'ētur', 'ēmur', 'ēminī', 'entur'];
  var SUBJ_PERF = ['erim', 'erīs', 'erit', 'erīmus', 'erītis', 'erint'];
  var SUBJ_PLUP = ['issem', 'issēs', 'isset', 'issēmus', 'issētis', 'issent'];

  /* ---------- helpers ---------- */

  function verbStems(w) {
    var pres = w.p[0].replace(/[ō]$/, '');
    if (w.conj === 2) pres = pres.replace(/[e]$/, '');
    if (w.conj === 33 || w.conj === 4) pres = pres.replace(/[i]$/, ''); /* capiō, audiō keep theme i in endings */
    var perfS = w.p[2].replace(/[ī]$/, '');
    var supS = w.p[3].replace(/um$/, '');
    return { pres: pres, perfS: perfS, supS: supS };
  }

  function nominalForm(w, cs, num, g) {
    var key = cs + ':' + num + (g ? ':' + g : '');
    if (w.forms && w.forms[key]) return w.forms[key];
    if (w.frc && w.frc[key]) return w.frc[key];
    var decl;
    if (w.decl === 'adj12') decl = (g === 'm' ? DECL.d2m : (g === 'f' ? DECL.d1 : DECL.d2n));
    else if (w.decl === 'adj3') decl = (num === 'sg' && g === 'n') ? DECL.d3in : DECL.d3i;
    else decl = DECL[w.decl];
    if (!decl) return null;
    var end = decl[num === 'sg' ? 's' : 'p'][CASES.indexOf(cs)];
    if (end === null) return w.nom || w.stem;
    return w.stem + end;
  }

  function compAdjectiveForm(w, cs, num, g) {
    /* comparative adjectives: stem 'fortiōr' -> fortior, fortiōris, ..., fortius, fortiōra */
    var key = cs + ':' + num + ':' + g;
    if (w.frc && w.frc[key]) return w.frc[key];
    var st = w.stem, n = g === 'n';
    if (num === 'sg') {
      if (cs === 'nom') return n ? st.replace(/[ō]r$/, '') + 'us' : st.replace(/[ō]r$/, 'or');
      if (cs === 'acc') return n ? st.replace(/[ō]r$/, '') + 'us' : st + 'em';
      if (cs === 'gen') return st + 'is';
      if (cs === 'dat') return st + 'ī';
      return st + 'e';
    }
    if (cs === 'gen') return st + 'um';
    if (cs === 'dat' || cs === 'abl') return st + 'ibus';
    return st + (n ? 'a' : 'ēs'); /* nom/acc pl */
  }
  function sumForm(tense, i) { return SUM[tense][i]; }

  /* ---------- verb generation ---------- */

  function verbForm(w, person, num, tense, voice) {
    var i = (person - 1) + (num === 'pl' ? 3 : 0);
    if (w.irr) {
      var tbl = w.irr[tense];
      return tbl ? tbl[i] : null;
    }
    if (w.conj === 0) return null;
    var s = verbStems(w), T = V[w.conj];
    if (voice === 'act') {
      if (tense === 'pres') return s.pres + T.pres[i];
      if (tense === 'imp') return s.pres + T.imp[i];
      if (tense === 'fut') return s.pres + T.fut[i];
      if (tense === 'perf') return s.perfS + PERF[i];
      if (tense === 'plup') return s.perfS + PLUP[i];
      if (tense === 'fp') return s.perfS + FPS[i];
      return null;
    }
    /* passive */
    if (tense === 'pres') return s.pres + T.p[i];
    if (tense === 'imp') return s.pres + T.ip[i];
    if (tense === 'fut') return s.pres + T.fp[i];
    /* analytic perfect passive: PPP + sum */
    var aux = tense === 'perf' ? 'pres' : tense === 'plup' ? 'imp' : tense === 'fp' ? 'fut' : null;
    if (!aux) return null;
    var g = w.pppG || 'm';
    var ppp = nominalForm({ decl: 'adj12', stem: s.supS }, 'nom', num, g);
    return ppp + ' ' + sumForm(aux, i);
  }

  function imperativeForm(w, num) {
    if (!V[w.conj]) return null;
    var s = verbStems(w);
    return s.pres + IMPERAT[w.conj][num === 'sg' ? 0 : 1];
  }

  /* ---------- non-finite & subjunctive generation (regular verbs) ---------- */

  function presInfAct(w) {
    if (w.irr || !V[w.conj]) return null;
    var s = verbStems(w);
    if (w.conj === 1) return s.pres + 'āre';
    if (w.conj === 2) return s.pres + 'ēre';
    if (w.conj === 4) return s.pres + 'īre';
    return s.pres + 'ere'; /* 3 and 33 */
  }

  function infinitiveForm(w, tense, voice) {
    if (w.irr || !V[w.conj]) return null;
    var s = verbStems(w);
    if (tense === 'pres' && voice === 'act') return presInfAct(w);
    if (tense === 'pres' && voice === 'pass') {
      if (w.conj === 1) return s.pres + 'ārī';
      if (w.conj === 2) return s.pres + 'ērī';
      if (w.conj === 4) return s.pres + 'īrī';
      return s.pres + 'ī'; /* 3, 33 */
    }
    if (tense === 'perf' && voice === 'act') return s.perfS + 'isse';
    return null;
  }

  function subjunctiveForm(w, tense, voice, person, num) {
    if (w.irr || !V[w.conj]) return null;
    var i = (person - 1) + (num === 'pl' ? 3 : 0);
    var s = verbStems(w);
    if (tense === 'pres') return s.pres + (voice === 'act' ? SUBJ_PRES[w.conj][i] : SUBJ_PRES_P[w.conj][i]);
    var infS = presInfAct(w).slice(0, -1); /* amāre → amār- */
    if (tense === 'imp') return infS + (voice === 'act' ? SUBJ_IMPF_A[i] : SUBJ_IMPF_P[i]);
    if ((tense === 'perf' || tense === 'plup') && !s.perfS) return null;   /* no perfect stem, no perfect subjunctive */
    if (tense === 'perf' && voice === 'act') return s.perfS + SUBJ_PERF[i];
    if (tense === 'plup' && voice === 'act') return s.perfS + SUBJ_PLUP[i];
    if ((tense === 'perf' || tense === 'plup') && voice === 'pass') {
      var ppp = nominalForm({ decl: 'adj12', stem: s.supS }, 'nom', num, w.pppG || 'm');
      return ppp + ' ' + (tense === 'perf' ? SIM[i] : ESSEM[i]);
    }
    return null;
  }

  function participleForm(w, tense, voice) {
    if (w.irr || !V[w.conj]) return null;
    var s = verbStems(w);
    if (tense === 'pres' && voice === 'act') {
      var st = s.pres + (w.conj === 1 ? 'ānt' : (w.conj === 33 || w.conj === 4) ? 'iēnt' : 'ēnt');
      return st.slice(0, -1) + 's'; /* amānt → amāns */
    }
    if (tense === 'perf' && voice === 'pass') return nominalForm({ decl: 'adj12', stem: s.supS }, 'nom', 'sg', 'm');
    if (tense === 'fut' && voice === 'act') return nominalForm({ decl: 'adj12', stem: s.supS + 'ūr' }, 'nom', 'sg', 'm');
    return null;
  }

  /* ---------- API: all forms of a word ---------- */

  function skillsOf(w) {
    var out = [];
    function add(form, kind, meta) {
      if (!form || form === '—') return;
      out.push({ form: form, kind: kind, meta: meta });
    }
    if (w.type === 'n') {
      NUMS.forEach(function (num) {
        CASES.forEach(function (cs) { add(nominalForm(w, cs, num), 'noun', { cs: cs, num: num }); });
      });
      if (w.decl === 'adj3') { /* handled as adj */ }
    } else if (w.type === 'adj') {
      GENDERS.forEach(function (g) {
        NUMS.forEach(function (num) {
          CASES.forEach(function (cs) {
            add(nominalForm(w, cs, num, g), 'noun', { cs: cs, num: num, g: g });
          });
        });
      });
    } else if (w.type === 'p') {
      out = out.concat(pronounForms(w));
    } else if (w.type === 'v') {
      if (w.irr) {
        TENSES.forEach(function (t) {
          var tbl = w.irr[t];
          if (!tbl) return;
          tbl.forEach(function (f, i) {
            add(f, 'verb', { mood: 'ind', person: PERSONS[i % 3], num: i < 3 ? 'sg' : 'pl', tense: t, voice: 'act' });
          });
        });
      } else {
        PERSONS.forEach(function (pn) {
          NUMS.forEach(function (num) {
            TENSES.forEach(function (t) {
              ['act', 'pass'].forEach(function (vo) {
                if (vo === 'pass' && (w.passOmit || [1, 2, 3, 33, 4].indexOf(w.conj) === -1)) return;
                var f = verbForm(w, pn, num, t, vo);
                if (f) add(f, 'verb', { mood: 'ind', person: pn, num: num, tense: t, voice: vo });
              });
            });
          });
        });
        add(imperativeForm(w, 'sg'), 'verb', { mood: 'imp', imperative: 'sg' });
        add(imperativeForm(w, 'pl'), 'verb', { mood: 'imp', imperative: 'pl' });
        /* infinitives: present (act+pass) and perfect (act) */
        ['pres', 'perf'].forEach(function (t) {
          ['act', 'pass'].forEach(function (vo) {
            if (vo === 'pass' && t === 'perf') return;
            if (vo === 'pass' && (w.passOmit || [1, 2, 3, 33, 4].indexOf(w.conj) === -1)) return;
            var f = infinitiveForm(w, t, vo);
            if (f) add(f, 'verb', { mood: 'inf', tense: t, voice: vo });
          });
        });
        /* subjunctive: present, imperfect, perfect, pluperfect (act+pass) */
        ['pres', 'imp', 'perf', 'plup'].forEach(function (t) {
          PERSONS.forEach(function (pn) {
            NUMS.forEach(function (num) {
              ['act', 'pass'].forEach(function (vo) {
                if (vo === 'pass' && (w.passOmit || [1, 2, 3, 33, 4].indexOf(w.conj) === -1)) return;
                var f = subjunctiveForm(w, t, vo, pn, num);
                if (f) add(f, 'verb', { mood: 'subj', person: pn, num: num, tense: t, voice: vo });
              });
            });
          });
        });
        /* participles: present act, perfect pass, future act (citation forms) */
        [['pres', 'act'], ['perf', 'pass'], ['fut', 'act']].forEach(function (pv) {
          var f = participleForm(w, pv[0], pv[1]);
          if (f) add(f, 'verb', { mood: 'part', tense: pv[0], voice: pv[1] });
        });
      }
    }
    return out;
  }

    /* forms with a classical plural variant that schools don't drill — accepted, never shown */
    var PRON_ALTS = {
      'sē':  { 'gen|pl': ['suōrum', 'suārum'] },
      'ego': { 'gen|pl': ['nostrī'] },
      'tū':  { 'gen|pl': ['vestrī'] }
    };
  function pronounForms(w) {
    var tabs = {
      ego: {
        m: { sg: ['ego', 'meī', 'mihi', 'mē', 'mē'], pl: ['nōs', 'nostrum', 'nōbīs', 'nōs', 'nōbīs'] }
      },
      'tū': {
        m: { sg: ['tū', 'tuī', 'tibi', 'tē', 'tē'], pl: ['vōs', 'vestrum', 'vōbīs', 'vōs', 'vōbīs'] }
      },
      sē: {
        m: { sg: ['—', 'suī', 'sibi', 'sē', 'sē'], pl: ['—', 'suī', 'sibi', 'sē', 'sē'] }
      },
      is: {
        m: { sg: ['is', 'eius', 'eī', 'eum', 'eō'], pl: ['eī', 'eōrum', 'eīs', 'eōs', 'eīs'] },
        f: { sg: ['ea', 'eius', 'eī', 'eam', 'eā'], pl: ['eae', 'eārum', 'eīs', 'eās', 'eīs'] },
        n: { sg: ['id', 'eius', 'eī', 'id', 'eō'], pl: ['ea', 'eōrum', 'eīs', 'ea', 'eīs'] }
      },
      quī: {
        m: { sg: ['quī', 'cuius', 'cui', 'quem', 'quō'], pl: ['quī', 'quōrum', 'quibus', 'quōs', 'quibus'] },
        f: { sg: ['quae', 'cuius', 'cui', 'quam', 'quā'], pl: ['quae', 'quārum', 'quibus', 'quās', 'quibus'] },
        n: { sg: ['quod', 'cuius', 'cui', 'quod', 'quō'], pl: ['quae', 'quōrum', 'quibus', 'quae', 'quibus'] }
      },
      'hīc': {
        m: { sg: ['hīc', 'hūius', 'huic', 'hunc', 'hōc'], pl: ['hī', 'hōrum', 'hīs', 'hōs', 'hīs'] },
        f: { sg: ['haec', 'hūius', 'huic', 'hanc', 'hāc'], pl: ['hae', 'hārum', 'hīs', 'hās', 'hīs'] },
        n: { sg: ['hōc', 'hūius', 'huic', 'hōc', 'hōc'], pl: ['haec', 'hōrum', 'hīs', 'haec', 'hīs'] }
      },
      ille: {
        m: { sg: ['ille', 'illīus', 'illī', 'illum', 'illō'], pl: ['illī', 'illōrum', 'illīs', 'illōs', 'illīs'] },
        f: { sg: ['illa', 'illīus', 'illī', 'illam', 'illā'], pl: ['illae', 'illārum', 'illīs', 'illās', 'illīs'] },
        n: { sg: ['illud', 'illīus', 'illī', 'illud', 'illō'], pl: ['illa', 'illōrum', 'illīs', 'illa', 'illīs'] }
      }
    };
    var out = [];
    var t = tabs[w.which];
    if (!t) return out;
    GENDERS.forEach(function (g) {
      if (!t[g]) return;
      NUMS.forEach(function (num) {
        CASES.forEach(function (cs) {
          var f = t[g][num][CASES.indexOf(cs)];
          if (f && f !== '—') out.push({ form: f, kind: 'noun', meta: { cs: cs, num: num, g: g } });
        });
      });
    });
    var alts = PRON_ALTS[w.which];
    if (alts) out.forEach(function (x) {
      var k = x.meta.cs + '|' + x.meta.num;
      if (alts[k]) x.meta.alt = alts[k];
    });
    return out;
  }

  /* universal form fetch: 'noun' (case/number/gender), 'verb' (person etc.) */
  function formOf(w, spec) {
    if (w.type === 'n') return nominalForm(w, spec.cs, spec.num);
    if (w.type === 'adj') return w.decl === 'comp' ? compAdjectiveForm(w, spec.cs, spec.num, spec.g) : nominalForm(w, spec.cs, spec.num, spec.g);
    if (w.type === 'p') {
      var tr = { cs: spec.cs, num: spec.num }, p = w.which, g = spec.g === undefined ? undefined : spec.g;
      var hit = pronounForms(w).find(function (x) {
        return x.meta.cs === tr.cs && x.meta.num === tr.num && x.meta.g === g;
      });
      return hit ? hit.form : null;          /* must be the string, like every other type */
    }
    if (w.type === 'v') {
      if (spec.imperative) return imperativeForm(w, spec.imperative);
      if (spec.mood === 'subj') {
        if (w.irr) {
          var st = w.irr['s' + spec.tense];
          return st ? st[(spec.person - 1) + (spec.num === 'pl' ? 3 : 0)] : null;
        }
        return subjunctiveForm(w, spec.tense, spec.voice, spec.person, spec.num);
      }
      return verbForm(w, spec.person, spec.num, spec.tense, spec.voice);
    }
    return null;
  }

  /* ---------- descriptive helpers for the parse mode ---------- */

  function describeParse(it) {
    var m = it.meta || {};
    var mood = m.mood || 'ind';
    if (it.kind === 'verb') {
      if (mood === 'imp') return m.imperative === 'sg' ? 'imperative singular' : 'imperative plural';
      if (mood === 'inf') return TENSE_LABEL[m.tense] + ' ' + (m.voice === 'pass' ? 'passive' : 'active') + ' infinitive';
      if (mood === 'part') return TENSE_LABEL[m.tense] + ' ' + (m.voice === 'pass' ? 'passive' : 'active') + ' participle';
      return PERSON_LABEL[m.person] + ' ' + NUM_LABEL[m.num] + ' ' + TENSE_LABEL[m.tense] + ' ' +
        (m.voice === 'pass' ? 'passive' : 'active') + ' ' + (mood === 'subj' ? 'subjunctive' : 'indicative');
    }
    var s = CASE_LABEL[m.cs] + ' ' + NUM_LABEL[m.num];
    if (m.g) s += ', ' + GENDER_LABEL[m.g];
    return s;
  }

  function buildIndex(allWords) {
    var map = {};
    allWords.forEach(function (word) {
      skillsOf(word).forEach(function (it) {
        var k = normalize(it.form);
        if (!map[k]) map[k] = [];
        map[k].push({
          word: word.l, head: word.l.split(',')[0], kind: it.kind,
          parse: describeParse(it), meta: it.meta
        });
      });
    });
    return map;
  }

  function normalize(s) {
    return String(s).toLowerCase()
      .replace(/[āáǎ]/g, 'a').replace(/[ēéě]/g, 'e').replace(/[īíǐ]/g, 'i')
      .replace(/[ōóǒ]/g, 'o').replace(/[ūúǔ]/g, 'u').replace(/ȳ/g, 'y')
      .replace(/j/g, 'i').replace(/v/g, 'u');
  }

  var api = {
    CASES: CASES, CASE_ORDER: CASE_ORDER, NUMS: NUMS, GENDERS: GENDERS, TENSES: TENSES, PERSONS: PERSONS,
    CASE_LABEL: CASE_LABEL, NUM_LABEL: NUM_LABEL, GENDER_LABEL: GENDER_LABEL,
    TENSE_LABEL: TENSE_LABEL, PERSON_LABEL: PERSON_LABEL,
    DECL: DECL, CONJ: V, SUM: SUM,
    nominalForm: nominalForm,
    compAdjectiveForm: compAdjectiveForm,
    verbForm: verbForm,
    imperativeForm: imperativeForm,
    formOf: formOf,
    skillsOf: skillsOf,
    pronounForms: pronounForms,
    describeParse: describeParse,
    buildIndex: buildIndex,
    normalize: normalize
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LRG = api;
})(typeof window !== 'undefined' ? window : globalThis);
