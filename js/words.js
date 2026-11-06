/* Word bank and chapter alignment for the revision site.
   Word selections and chapter tags are the site's own editorial
   alignment with the course progression (approximate by design). */
(function (root) {
  'use strict';

  function w(l, cfg) { cfg.l = l; return cfg; }

  var nouns = [
    /* 1st declension */
    w('puella, -ae, f.',      { type: 'n', decl: 'd1', stem: 'puell',  g: 'f', c: 1, meaning: 'girl' }),
    w('villa, -ae, f.',       { type: 'n', decl: 'd1', stem: 'vill',   g: 'f', c: 1, meaning: 'house, farm' }),
    w('silva, -ae, f.',       { type: 'n', decl: 'd1', stem: 'silv',   g: 'f', c: 1, meaning: 'wood' }),
    w('aqua, -ae, f.',        { type: 'n', decl: 'd1', stem: 'aqu',    g: 'f', c: 1, meaning: 'water' }),
    w('terra, -ae, f.',       { type: 'n', decl: 'd1', stem: 'terr',   g: 'f', c: 1, meaning: 'land, earth' }),
    w('fēmina, -ae, f.',      { type: 'n', decl: 'd1', stem: 'fēmin',  g: 'f', c: 1, meaning: 'woman' }),
    w('bene, —',              { skip: true }),
    w('via, -ae, f.',         { type: 'n', decl: 'd1', stem: 'vi',     g: 'f', c: 2, meaning: 'road, street' }),
    w('cēna, -ae, f.',        { type: 'n', decl: 'd1', stem: 'cēn',    g: 'f', c: 2, meaning: 'dinner' }),
    w('poēta, -ae, m.',       { type: 'n', decl: 'd1', stem: 'poēt',   g: 'm', c: 9, meaning: 'poet' }),
    w('nauta, -ae, m.',       { type: 'n', decl: 'd1', stem: 'naut',   g: 'm', c: 6, meaning: 'sailor' }),
    w('agricola, -ae, m.',    { type: 'n', decl: 'd1', stem: 'agricol', g: 'm', c: 3, meaning: 'farmer' }),
    /* 2nd declension */
    w('servus, -ī, m.',       { type: 'n', decl: 'd2m', stem: 'serv',  g: 'm', c: 1, meaning: 'slave' }),
    w('dominus, -ī, m.',      { type: 'n', decl: 'd2m', stem: 'domin', g: 'm', c: 2, meaning: 'master, lord' }),
    w('amīcus, -ī, m.',       { type: 'n', decl: 'd2m', stem: 'amīc',  g: 'm', c: 1, meaning: 'friend' }),
    w('puer, -ī, m.',         { type: 'n', decl: 'd2ms', nom: 'puer', stem: 'puer', g: 'm', c: 1, meaning: 'boy' }),
    w('ager, -rī, m.',        { type: 'n', decl: 'd2ms', nom: 'ager', stem: 'agr', g: 'm', c: 2, meaning: 'field' }),
    w('liber, -rī, m.',       { type: 'n', decl: 'd2ms', nom: 'liber', stem: 'libr', g: 'm', c: 8, meaning: 'book' }),
    w('vir, -ī, m.',          { type: 'n', decl: 'd2ms', nom: 'vir', stem: 'vir', g: 'm', c: 5, meaning: 'man' }),
    w('fīlius, -ī, m.',       { type: 'n', decl: 'd2m', stem: 'fīli', g: 'm', c: 1, meaning: 'son' }),
    w('equus, -ī, m.',        { type: 'n', decl: 'd2m', stem: 'equ', g: 'm', c: 8, meaning: 'horse' }),
    w('lūdus, -ī, m.',        { type: 'n', decl: 'd2m', stem: 'lūd', g: 'm', c: 2, meaning: 'school, game' }),
    w('mūrus, -ī, m.',        { type: 'n', decl: 'd2m', stem: 'mūr', g: 'm', c: 7, meaning: 'wall' }),
    w('bellum, -ī, n.',       { type: 'n', decl: 'd2n', stem: 'bell', g: 'n', c: 7, meaning: 'war' }),
    w('auxilium, -ī, n.',     { type: 'n', decl: 'd2n', stem: 'auxili', g: 'n', c: 10, meaning: 'help' }),
    w('cōnsilium, -ī, n.',    { type: 'n', decl: 'd2n', stem: 'cōnsili', g: 'n', c: 11, meaning: 'plan, advice' }),
    /* 3rd declension */
    w('rēx, rēgis, m.',       { type: 'n', decl: 'd3c', nom: 'rēx', stem: 'rēg', g: 'm', c: 5, meaning: 'king' }),
    w('urbs, urbis, f.',      { type: 'n', decl: 'd3c', nom: 'urbs', stem: 'urb', g: 'f', c: 9, meaning: 'city' }),
    w('pāx, pācis, f.',       { type: 'n', decl: 'd3c', nom: 'pāx', stem: 'pāc', g: 'f', c: 12, meaning: 'peace' }),
    w('virtūs, virtūtis, f.', { type: 'n', decl: 'd3c', nom: 'virtūs', stem: 'virtūt', g: 'f', c: 12, meaning: 'courage, virtue' }),
    w('homō, hominis, m.',    { type: 'n', decl: 'd3c', nom: 'homō', stem: 'homin', g: 'm', c: 4, meaning: 'human being, man' }),
    w('clāmor, clāmōris, m.', { type: 'n', decl: 'd3c', nom: 'clāmor', stem: 'clāmor', g: 'm', c: 9, meaning: 'shout' }),
    w('mīles, mīlitis, m.',   { type: 'n', decl: 'd3c', nom: 'mīles', stem: 'mīlit', g: 'm', c: 9, meaning: 'soldier' }),
    w('corpus, corporis, n.', { type: 'n', decl: 'd3cn', nom: 'corpus', stem: 'corpor', g: 'n', c: 14, meaning: 'body' }),
    w('tempus, temporis, n.', { type: 'n', decl: 'd3cn', nom: 'tempus', stem: 'tempor', g: 'n', c: 18, meaning: 'time' }),
    w('cvis, cvis, m./f.',    { skip: true }),
    w('civis, civis, m./f.',  { type: 'n', decl: 'd3i', nom: 'civis', stem: 'civ', g: 'm', c: 15, meaning: 'citizen' }),
    w('hostis, hostis, m.',   { type: 'n', decl: 'd3i', nom: 'hostis', stem: 'host', g: 'm', c: 13, meaning: 'enemy' }),
    w('ignis, ignis, m.',     { type: 'n', decl: 'd3i', nom: 'ignis', stem: 'ign', g: 'm', c: 16, meaning: 'fire' }),
    w('avis, avis, f.',       { type: 'n', decl: 'd3i', nom: 'avis', stem: 'av', g: 'f', c: 17, meaning: 'bird' }),
    w('animal, animālis, n.', { type: 'n', decl: 'd3in', nom: 'animal', stem: 'animal', g: 'n', c: 19, meaning: 'living creature' }),
    /* 4th declension */
    w('portus, -ūs, m.',      { type: 'n', decl: 'd4', stem: 'port', g: 'm', c: 20, meaning: 'harbour' }),
    w('frūctus, -ūs, m.',     { type: 'n', decl: 'd4', stem: 'frūct', g: 'm', c: 24, meaning: 'fruit, produce' }),
    w('cornu, -ūs, n.',       { type: 'n', decl: 'd4', stem: '', g: 'n', c: 26, meaning: 'horn',
        forms: { 'nom:sg': 'cornu', 'acc:sg': 'cornu', 'gen:sg': 'cornūs', 'dat:sg': 'cornū', 'abl:sg': 'cornū',
                 'nom:pl': 'cornua', 'acc:pl': 'cornua', 'gen:pl': 'cornuum', 'dat:pl': 'cornibus', 'abl:pl': 'cornibus' } }),
    /* 5th declension */
    w('rēs, reī, f.',         { type: 'n', decl: 'd5', nom: 'rēs', stem: 'r', g: 'f', c: 25, meaning: 'thing, matter' }),
    w('diēs, diēī, m.',       { type: 'n', decl: 'd5', nom: 'diēs', stem: 'di', g: 'm', c: 25, meaning: 'day',
        frc: { 'gen:sg': 'diēī', 'dat:sg': 'diēī', 'abl:sg': 'diē' } }),
    w('spēs, speī, f.',       { type: 'n', decl: 'd5', nom: 'spēs', stem: 'sp', g: 'f', c: 27,
        frc: { 'gen:sg': 'spēī', 'dat:sg': 'spēī' }, meaning: 'hope' })
  ];

  var irregularVerbs = {
    sum:   { pres: ['sum', 'es', 'est', 'sumus', 'estis', 'sunt'],
             imp: ['eram', 'erās', 'erat', 'erāmus', 'erātis', 'erant'],
             fut: ['erō', 'eris', 'erit', 'erimus', 'eritis', 'erunt'],
             perf: ['fuī', 'fuistī', 'fuit', 'fuimus', 'fuistis', 'fuērunt'],
             plup: ['fueram', 'fuerās', 'fuerat', 'fuerāmus', 'fuerātis', 'fuerant'],
             fp: ['fuerō', 'fueris', 'fuerit', 'fuerimus', 'fueritis', 'fuerint'] ,
             spres: ['sim', 'sīs', 'sit', 'sīmus', 'sītis', 'sint'],
             simp: ['essem', 'essēs', 'esset', 'essēmus', 'essētis', 'essent'],
             sperf: ['fuerim', 'fuerīs', 'fuerit', 'fuerīmus', 'fuerītis', 'fuerint'],
             splup: ['fuissem', 'fuissēs', 'fuisset', 'fuissēmus', 'fuissētis', 'fuissent'] },
    possum:{ pres: ['possum', 'potes', 'potest', 'possumus', 'potestis', 'possunt'],
             imp: ['poteram', 'poterās', 'poterat', 'poterāmus', 'poterātis', 'poterant'],
             fut: ['poterō', 'poteris', 'poterit', 'poterimus', 'poteritis', 'poterunt'],
             perf: ['potuī', 'potuistī', 'potuit', 'potuimus', 'potuistis', 'potuērunt'],
             plup: ['potueram', 'potuerās', 'potuerat', 'potuerāmus', 'potuerātis', 'potuerant'],
             fp: ['potuerō', 'potueris', 'potuerit', 'potuerimus', 'potueritis', 'potuerint'] ,
             spres: ['possim', 'possīs', 'possit', 'possīmus', 'possītis', 'possint'],
             simp: ['possem', 'possēs', 'posset', 'possēmus', 'possētis', 'possent'],
             sperf: ['potuerim', 'potuerīs', 'potuerit', 'potuerīmus', 'potuerītis', 'potuerint'],
             splup: ['potuissem', 'potuissēs', 'potuisset', 'potuissēmus', 'potuissētis', 'potuissent'] },
    eō:    { pres: ['eō', 'īs', 'it', 'īmus', 'ītis', 'eunt'],
             imp: ['ībam', 'ībās', 'ībat', 'ībāmus', 'ībātis', 'ībant'],
             fut: ['ībō', 'ībis', 'ībit', 'ībimus', 'ībitis', 'ībunt'],
             perf: ['iī', 'iistī', 'iit', 'iimus', 'iistis', 'iērunt'],
             plup: ['ieram', 'ierās', 'ierat', 'ierāmus', 'ierātis', 'ierant'],
             fp: ['ierō', 'ieris', 'ierit', 'ierimus', 'ieritis', 'ierint'] ,
             spres: ['eam', 'eās', 'eat', 'eāmus', 'eātis', 'eant'],
             simp: ['īrem', 'īrēs', 'īret', 'īrēmus', 'īrētis', 'īrent'],
             sperf: ['ierim', 'ierīs', 'ierit', 'ierīmus', 'ierītis', 'ierint'],
             splup: ['iissem', 'iissēs', 'iisset', 'iissēmus', 'iissētis', 'iissent'] }
  };

  var verbs = [
    w('parō',     { type: 'v', p: ['parō', 'parāre', 'parāvī', 'parātum'], conj: 1, c: 1, meaning: 'prepare' }),
    w('portō',    { type: 'v', p: ['portō', 'portāre', 'portāvī', 'portātum'], conj: 1, c: 1, meaning: 'carry' }),
    w('vocō',     { type: 'v', p: ['vocō', 'vocāre', 'vocāvī', 'vocātum'], conj: 1, c: 1, meaning: 'call' }),
    w('spectō',   { type: 'v', p: ['spectō', 'spectāre', 'spectāvī', 'spectātum'], conj: 1, c: 1, meaning: 'watch, look at' }),
    w('laudō',    { type: 'v', p: ['laudō', 'laudāre', 'laudāvī', 'laudātum'], conj: 1, c: 2, meaning: 'praise' }),
    w('pugnō',    { type: 'v', p: ['pugnō', 'pugnāre', 'pugnāvī', 'pugnātum'], conj: 1, c: 9, meaning: 'fight' }),
    w('superō',   { type: 'v', p: ['superō', 'superāre', 'superāvī', 'superātum'], conj: 1, c: 4, meaning: 'overcome' }),
    w('servō',    { type: 'v', p: ['servō', 'servāre', 'servāvī', 'servātum'], conj: 1, c: 8, meaning: 'save' }),
    w('ambulō',   { type: 'v', p: ['ambulō', 'ambulāre', 'ambulāvī', 'ambulātum'], conj: 1, c: 1, meaning: 'walk' }),
    w('nāvigō',   { type: 'v', p: ['nāvigō', 'nāvigāre', 'nāvigāvī', 'nāvigātum'], conj: 1, c: 6, meaning: 'sail' }),
    w('esse',     { type: 'v', irr: irregularVerbs.sum, conj: 0, c: 1, meaning: 'be', p: ['sum', 'esse', 'fuī', 'futūrum'] }),
    w('habeō',    { type: 'v', p: ['habeō', 'habēre', 'habuī', 'habitum'], conj: 2, c: 2, meaning: 'have' }),
    w('doceō',    { type: 'v', p: ['doceō', 'docēre', 'docuī', 'doctum'], conj: 2, c: 3, meaning: 'teach' }),
    w('monēt',    { skip: true }),
    w('moneō',    { type: 'v', p: ['moneō', 'monēre', 'monuī', 'monitum'], conj: 2, c: 2, meaning: 'warn, advise' }),
    w('videō',    { type: 'v', p: ['videō', 'vidēre', 'vīdī', 'vīsum'], conj: 2, c: 1, meaning: 'see' }),
    w('maneō',    { type: 'v', p: ['maneō', 'manēre', 'mānsī', 'mānsum'], conj: 2, c: 4, meaning: 'stay, remain' }),
    w('rēspondeō',{ type: 'v', p: ['rēspondeō', 'rēspondēre', 'rēspondī', 'rēspōnsum'], conj: 2, c: 6, meaning: 'reply' }),
    w('regō',     { type: 'v', p: ['regō', 'regere', 'rēxī', 'rēctum'], conj: 3, c: 5, meaning: 'rule, guide' }),
    w('dūcō',     { type: 'v', p: ['dūcō', 'dūcere', 'dūxī', 'ductum'], conj: 3, c: 2, meaning: 'lead' }),
    w('trahō',    { type: 'v', p: ['trahō', 'trahere', 'trāxī', 'tractum'], conj: 3, c: 7, meaning: 'drag, pull' }),
    w('vincō',    { type: 'v', p: ['vincō', 'vincere', 'vīcī', 'victum'], conj: 3, c: 12, meaning: 'conquer, win' }),
    w('mittō',    { type: 'v', p: ['mittō', 'mittere', 'mīsī', 'missum'], conj: 3, c: 4, meaning: 'send' }),
    w('crēdō',    { type: 'v', p: ['crēdō', 'crēdere', 'crēdidī', 'crēditum'], conj: 3, c: 13, meaning: 'believe' }),
    w('capiō',    { type: 'v', p: ['capiō', 'capere', 'cēpī', 'captum'], conj: 33, c: 6, meaning: 'take, capture' }),
    w('faciō',    { type: 'v', p: ['faciō', 'facere', 'fēcī', 'factum'], conj: 33, c: 2, meaning: 'make, do', passOmit: true }),
    w('fugiō',    { type: 'v', p: ['fugiō', 'fugere', 'fūgī', 'fugitum'], conj: 33, c: 8, meaning: 'flee' }),
    w('audiō',    { type: 'v', p: ['audiō', 'audīre', 'audīvī', 'audītum'], conj: 4, c: 1, meaning: 'hear' }),
    w('veniō',    { type: 'v', p: ['veniō', 'venīre', 'vēnī', 'ventum'], conj: 4, c: 1, meaning: 'come' }),
    w('dormiō',   { type: 'v', p: ['dormiō', 'dormīre', 'dormīvī', 'dormītum'], conj: 4, c: 10, meaning: 'sleep' }),
    w('scīō',     { type: 'v', p: ['scīō', 'scīre', 'scīvī', 'scītum'], conj: 4, c: 14, meaning: 'know' }),
    w('possum',   { type: 'v', irr: irregularVerbs.possum, conj: 0, c: 3, meaning: 'am able, can', p: ['possum', 'posse', 'potuī', '—'] }),
    w('eō',       { type: 'v', irr: irregularVerbs.eō, conj: 0, c: 10, meaning: 'go', p: ['eō', 'īre', 'iī', 'itum'] })
  ];

  var adjectives = [
    w('bonus, -a, -um',     { type: 'adj', decl: 'adj12', stem: 'bon', c: 3, meaning: 'good' }),
    w('magnus, -a, -um',    { type: 'adj', decl: 'adj12', stem: 'magn', c: 3, meaning: 'big, great' }),
    w('fessus, -a, -um',    { type: 'adj', decl: 'adj12', stem: 'fess', c: 1, meaning: 'tired' }),
    w('laetus, -a, -um',    { type: 'adj', decl: 'adj12', stem: 'laet', c: 2, meaning: 'happy' }),
    w('longus, -a, -um',    { type: 'adj', decl: 'adj12', stem: 'long', c: 4, meaning: 'long' }),
    w('pulcher, -crī?' ,    { skip: true }),
    w('pulcher, -chra, -chrum', { type: 'adj', decl: 'adj12', nom: 'pulcher', stem: 'pulchr', c: 4, meaning: 'beautiful' }),
    w('fortis, forte',      { type: 'adj', decl: 'adj3', stem: 'fort', c: 7, meaning: 'brave' }),
    w('celer, celeris?',    { skip: true }),
    w('audāx, audācis?',    { skip: true }),
    w('grātus, -a, -um',    { type: 'adj', decl: 'adj12', stem: 'grāt', c: 6, meaning: 'pleasing, grateful' })
  ].concat(
    /* comparatives (forms only drilled from ch. 25) */
    [['fortis', 'fortior', 'fortiōr', 'braver'], ['bonus', 'melior', 'meliōr', 'better'],
     ['magnus', 'maior', 'maiōr', 'bigger'], ['malus', 'pēior', 'pēiōr', 'worse'],
     ['parvus', 'minor', 'minōr', 'smaller']].map(function (c) {
      return w(c[1], { type: 'adj', decl: 'comp', stem: c[2], c: 25, meaning: 'comparative of ' + c[0] + ': ' + c[3] });
    })
  ).concat(
    [['optimus', 'best', 'optim'], ['maximus', 'greatest', 'maxim'],
     ['pessimus', 'worst', 'pessim'], ['minimus', 'smallest', 'minim'],
     ['fortissimus', 'very brave', 'fortissim']].map(function (s) {
      return w(s[0] + ', -a, -um', { type: 'adj', decl: 'adj12', stem: s[2], c: 25, meaning: s[1] });
    })
  );

  var pronouns = [
    w('ego', { type: 'p', which: 'ego', c: 14, meaning: 'I, we' }),
    w('tū',  { type: 'p', which: 'tū', c: 14, meaning: 'you (sg), you (pl)' }),
    w('is, ea, id', { type: 'p', which: 'is', c: 14, meaning: 'he, she, it; they' }),
    w('hīc, haec, hōc', { type: 'p', which: 'hīc', c: 15, meaning: 'this, these' }),
    w('ille, illa, illud', { type: 'p', which: 'ille', c: 15, meaning: 'that, those' }),
    w('quī, quae, quod', { type: 'p', which: 'quī', c: 13, meaning: 'who, which (relative)' }),
    w('sē',  { type: 'p', which: 'sē', c: 14, meaning: 'himself, herself, itself, themselves (reflexive)' })
  ];

  var valid = function (list) { return list.filter(function (x) { return !x.skip; }); };

  var all = valid(nouns).concat(valid(verbs)).concat(valid(adjectives)).concat(pronouns);

  /* which grammar skills are met, keyed by last chapter reached */
  var intro = {
    d1: 1, d2m: 2, d2ms: 2, d2n: 2, d3c: 5, d3cn: 5, d3i: 10, d3in: 12,
    d4: 20, d5: 23, comp: 25,
    adj12: 3, adj3: 7,
    conj1: 1, conj2: 2, conj3: 4, conj33: 6, conj4: 5,
    tensePres: 1, tenseImp: 18, tenseFut: 19, tensePerf: 17, tensePlup: 18, tenseFp: 21,
    voicePass: 31, voicePassSynthetic: 32,
    irrSum: 1, irrPossum: 3, irrEo: 10,
    pron: { ego: 14, 'tū': 14, is: 14, 'hīc': 15, ille: 15, quī: 13, sē: 14 }
  };

  function chapterOk(chapter, w) { return (w.c || 1) <= chapter; }

  function month_select(words, chapter, kinds) {}

  function pick(words, chapter, types) {
    return words.filter(function (wd) {
      return types.indexOf(wd.type) >= 0 && chapterOk(chapter, wd);
    });
  }

  var api = {
    nouns: valid(nouns), verbs: valid(verbs), adjectives: valid(adjectives), pronouns: pronouns,
    all: all, intro: intro, chapterOk: chapterOk, pick: pick
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LRW = api;
})(typeof window !== 'undefined' ? window : globalThis);
