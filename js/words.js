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
        frc: { 'gen:sg': 'spēī', 'dat:sg': 'spēī' }, meaning: 'hope' }),
    /* --- vocabulary compiled for ch. 1–43 --- */
    w('pater, patris, m.',    { type: 'n', decl: 'd3c', nom: 'pater', stem: 'patr', g: 'm', c: 1, meaning: 'father' }),
    w('māter, mātris, f.',    { type: 'n', decl: 'd3c', nom: 'māter', stem: 'mātr', g: 'f', c: 1, meaning: 'mother' }),
    w('mēnsa, -ae, f.',       { type: 'n', decl: 'd1', stem: 'mēns', g: 'f', c: 2, meaning: 'table' }),
    w('domus, -ūs, f.',       { type: 'n', decl: 'd4', stem: 'dom', g: 'f', c: 2, meaning: 'house, home',
        frc: { 'gen:sg': 'domī', 'dat:sg': 'domō', 'abl:sg': 'domō', 'gen:pl': 'domōrum' } }),
    w('frāter, frātris, m.',  { type: 'n', decl: 'd3c', nom: 'frāter', stem: 'frātr', g: 'm', c: 2, meaning: 'brother' }),
    w('soror, sorōris, f.',   { type: 'n', decl: 'd3c', nom: 'soror', stem: 'sorōr', g: 'f', c: 2, meaning: 'sister' }),
    w('deus, -ī, m.',         { type: 'n', decl: 'd2m', stem: 'de', g: 'm', c: 6, meaning: 'god',
        forms: { 'nom:pl': 'deī', 'gen:pl': 'deōrum', 'dat:pl': 'deīs', 'abl:pl': 'deīs' } }),
    w('nāvis, nāvis, f.',     { type: 'n', decl: 'd3i', nom: 'nāvis', stem: 'nāv', g: 'f', c: 6, meaning: 'ship' }),
    w('porta, -ae, f.',       { type: 'n', decl: 'd1', stem: 'port', g: 'f', c: 7, meaning: 'gate' }),
    w('platea, -ae, f.',      { type: 'n', decl: 'd1', stem: 'plate', g: 'f', c: 9, meaning: 'street' }),
    w('arbor, arboris, f.',   { type: 'n', decl: 'd3c', nom: 'arbor', stem: 'arbor', g: 'f', c: 10, meaning: 'tree' }),
    w('nōmen, nōminis, n.',   { type: 'n', decl: 'd3cn', nom: 'nōmen', stem: 'nōmin', g: 'n', c: 10, meaning: 'name' }),
    w('somnus, -ī, m.',       { type: 'n', decl: 'd2m', stem: 'somn', g: 'm', c: 10, meaning: 'sleep' }),
    w('epistula, -ae, f.',    { type: 'n', decl: 'd1', stem: 'epistul', g: 'f', c: 14, meaning: 'letter' }),
    w('cīvitās, cīvitātis, f.',{ type: 'n', decl: 'd3c', nom: 'cīvitās', stem: 'cīvitāt', g: 'f', c: 15, meaning: 'state, citizenship' }),
    w('oculus, -ī, m.',       { type: 'n', decl: 'd2m', stem: 'ocul', g: 'm', c: 15, meaning: 'eye' }),
    w('ovis, ovis, f.',       { type: 'n', decl: 'd3i', nom: 'ovis', stem: 'ov', g: 'f', c: 17, meaning: 'sheep' }),
    w('hōra, -ae, f.',        { type: 'n', decl: 'd1', stem: 'hōr', g: 'f', c: 20, meaning: 'hour, time' }),
    w('īnsula, -ae, f.',      { type: 'n', decl: 'd1', stem: 'īnsul', g: 'f', c: 20, meaning: 'island' }),
    w('vīnum, -ī, n.',        { type: 'n', decl: 'd2n', stem: 'vīn', g: 'n', c: 20, meaning: 'wine' }),
    w('mare, maris, n.',      { type: 'n', decl: 'd3in', nom: 'mare', stem: 'mar', g: 'n', c: 20, meaning: 'sea',
        frc: { 'acc:sg': 'mare' } }),
    w('flūmen, flūminis, n.', { type: 'n', decl: 'd3cn', nom: 'flūmen', stem: 'flūmin', g: 'n', c: 20, meaning: 'river' }),
    w('sōl, sōlis, m.',       { type: 'n', decl: 'd3c', nom: 'sōl', stem: 'sōl', g: 'm', c: 20, meaning: 'sun' }),
    w('labor, labōris, m.',   { type: 'n', decl: 'd3c', nom: 'labor', stem: 'labōr', g: 'm', c: 20, meaning: 'work, toil' }),
    w('exercitus, -ūs, m.',   { type: 'n', decl: 'd4', stem: 'exercit', g: 'm', c: 20, meaning: 'army' }),
    w('timor, timōris, m.',   { type: 'n', decl: 'd3c', nom: 'timor', stem: 'timōr', g: 'm', c: 21, meaning: 'fear' }),
    w('vōx, vōcis, f.',       { type: 'n', decl: 'd3c', nom: 'vōx', stem: 'vōc', g: 'f', c: 21, meaning: 'voice' }),
    w('caelum, -ī, n.',       { type: 'n', decl: 'd2n', stem: 'cael', g: 'n', c: 21, meaning: 'sky, heaven' }),
    w('fuga, -ae, f.',        { type: 'n', decl: 'd1', stem: 'fug', g: 'f', c: 21, meaning: 'flight' }),
    w('annus, -ī, m.',        { type: 'n', decl: 'd2m', stem: 'ann', g: 'm', c: 22, meaning: 'year' }),
    w('fāma, -ae, f.',        { type: 'n', decl: 'd1', stem: 'fām', g: 'f', c: 22, meaning: 'report, rumour, fame' }),
    w('senātus, -ūs, m.',     { type: 'n', decl: 'd4', stem: 'senāt', g: 'm', c: 22, meaning: 'senate' }),
    w('cōnsul, cōnsulis, m.', { type: 'n', decl: 'd3c', nom: 'cōnsul', stem: 'cōnsul', g: 'm', c: 22, meaning: 'consul' }),
    w('praeda, -ae, f.',      { type: 'n', decl: 'd1', stem: 'praed', g: 'f', c: 22, meaning: 'plunder, booty' }),
    w('gladius, -ī, m.',      { type: 'n', decl: 'd2m', stem: 'gladi', g: 'm', c: 24, meaning: 'sword' }),
    w('signum, -ī, n.',       { type: 'n', decl: 'd2n', stem: 'sign', g: 'n', c: 24, meaning: 'sign, signal, standard' }),
    w('imperātor, -ōris, m.', { type: 'n', decl: 'd3c', nom: 'imperātor', stem: 'imperātōr', g: 'm', c: 24, meaning: 'commander' }),
    w('dux, ducis, m.',       { type: 'n', decl: 'd3c', nom: 'dux', stem: 'duc', g: 'm', c: 24, meaning: 'leader' }),
    w('mōns, montis, m.',     { type: 'n', decl: 'd3i', nom: 'mōns', stem: 'mont', g: 'm', c: 24, meaning: 'mountain' }),
    w('victōria, -ae, f.',    { type: 'n', decl: 'd1', stem: 'victōri', g: 'f', c: 24, meaning: 'victory' }),
    w('amīcitia, -ae, f.',    { type: 'n', decl: 'd1', stem: 'amīciti', g: 'f', c: 24, meaning: 'friendship' }),
    w('mānus, -ūs, f.',       { type: 'n', decl: 'd4', stem: 'mān', g: 'f', c: 24, meaning: 'hand' }),
    w('patria, -ae, f.',      { type: 'n', decl: 'd1', stem: 'patri', g: 'f', c: 24, meaning: 'fatherland' }),
    w('iter, itineris, n.',   { type: 'n', decl: 'd3cn', nom: 'iter', stem: 'itiner', g: 'n', c: 26, meaning: 'journey, march' }),
    w('gens, gentis, f.',     { type: 'n', decl: 'd3i', nom: 'gens', stem: 'gent', g: 'f', c: 26, meaning: 'tribe, nation' }),
    w('lacrima, -ae, f.',     { type: 'n', decl: 'd1', stem: 'lacrim', g: 'f', c: 26, meaning: 'tear' }),
    w('lūx, lūcis, f.',       { type: 'n', decl: 'd3c', nom: 'lūx', stem: 'lūc', g: 'f', c: 28, meaning: 'light, daylight' }),
    w('metus, -ūs, m.',       { type: 'n', decl: 'd4', stem: 'met', g: 'm', c: 30, meaning: 'fear' }),
    w('mōs, mōris, m.',       { type: 'n', decl: 'd3c', nom: 'mōs', stem: 'mōr', g: 'm', c: 30, meaning: 'custom, habit' }),
    w('pars, partis, f.',     { type: 'n', decl: 'd3i', nom: 'pars', stem: 'part', g: 'f', c: 30, meaning: 'part, share' }),
    w('mors, mortis, f.',     { type: 'n', decl: 'd3i', nom: 'mors', stem: 'mort', g: 'f', c: 30, meaning: 'death' }),
    w('vulnus, vulneris, n.', { type: 'n', decl: 'd3cn', nom: 'vulnus', stem: 'vulner', g: 'n', c: 36, meaning: 'wound' }),
    w('sanguis, sanguinis, m.',{ type: 'n', decl: 'd3i', nom: 'sanguis', stem: 'sanguin', g: 'm', c: 36, meaning: 'blood' }),
    w('glōria, -ae, f.',      { type: 'n', decl: 'd1', stem: 'glōri', g: 'f', c: 31, meaning: 'glory' }),
    w('lēx, lēgis, f.',       { type: 'n', decl: 'd3i', nom: 'lēx', stem: 'lēg', g: 'f', c: 38, meaning: 'law' })
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
    w('eō',       { type: 'v', irr: irregularVerbs.eō, conj: 0, c: 10, meaning: 'go', p: ['eō', 'īre', 'iī', 'itum'] }),
    /* --- vocabulary compiled for ch. 1–43 --- */
    w('dīcō',     { type: 'v', p: ['dīcō', 'dīcere', 'dīxī', 'dictum'], conj: 3, c: 3, meaning: 'say, speak' }),
    w('agō',      { type: 'v', p: ['agō', 'agere', 'ēgī', 'actum'], conj: 3, c: 5, meaning: 'do, drive' }),
    w('rogō',     { type: 'v', p: ['rogō', 'rogāre', 'rogāvī', 'rogātum'], conj: 1, c: 3, meaning: 'ask' }),
    w('properō',  { type: 'v', p: ['properō', 'properāre', 'properāvī', 'properātum'], conj: 1, c: 3, meaning: 'hurry' }),
    w('exspectō', { type: 'v', p: ['exspectō', 'exspectāre', 'exspectāvī', 'exspectātum'], conj: 1, c: 4, meaning: 'wait for, expect' }),
    w('clāmō',    { type: 'v', p: ['clāmō', 'clāmāre', 'clāmāvī', 'clāmātum'], conj: 1, c: 4, meaning: 'shout' }),
    w('cēnō',     { type: 'v', p: ['cēnō', 'cēnāre', 'cēnāvī', 'cēnātum'], conj: 1, c: 2, meaning: 'dine' }),
    w('cōgitō',   { type: 'v', p: ['cōgitō', 'cōgitāre', 'cōgitāvī', 'cōgitātum'], conj: 1, c: 11, meaning: 'think' }),
    w('nārrō',    { type: 'v', p: ['nārrō', 'nārrāre', 'nārrāvī', 'nārrātum'], conj: 1, c: 11, meaning: 'tell, relate' }),
    w('scrībō',   { type: 'v', p: ['scrībō', 'scrībere', 'scrīpsī', 'scrīptum'], conj: 3, c: 10, meaning: 'write' }),
    w('legō',     { type: 'v', p: ['legō', 'legere', 'lēgī', 'lēctum'], conj: 3, c: 8, meaning: 'read' }),
    w('discō',    { type: 'v', p: ['discō', 'discere', 'didicī', '—'], conj: 3, c: 8, meaning: 'learn' }),
    w('emō',      { type: 'v', p: ['emō', 'emere', 'ēmī', 'emptum'], conj: 3, c: 9, meaning: 'buy' }),
    w('timeō',    { type: 'v', p: ['timeō', 'timēre', 'timuī', '—'], conj: 2, c: 21, meaning: 'fear' }),
    w('iubeō',    { type: 'v', p: ['iubeō', 'iubēre', 'iussī', 'iussum'], conj: 2, c: 22, meaning: 'order' }),
    w('terreō',   { type: 'v', p: ['terreō', 'terrēre', 'terruī', 'territum'], conj: 2, c: 26, meaning: 'frighten' }),
    w('dēbeō',    { type: 'v', p: ['dēbeō', 'dēbēre', 'dēbuī', 'dēbitum'], conj: 2, c: 30, meaning: 'ought, owe' }),
    w('dīmittō',  { type: 'v', p: ['dīmittō', 'dīmittere', 'dīmīsī', 'dīmissum'], conj: 3, c: 22, meaning: 'send away, dismiss' }),
    w('āmittō',   { type: 'v', p: ['āmittō', 'āmittere', 'āmīsī', 'āmissum'], conj: 3, c: 24, meaning: 'lose' }),
    w('petō',     { type: 'v', p: ['petō', 'petere', 'petīvī', 'petītum'], conj: 3, c: 24, meaning: 'seek, attack' }),
    w('occīdō',   { type: 'v', p: ['occīdō', 'occīdere', 'occīdī', 'occīsum'], conj: 3, c: 24, meaning: 'kill' }),
    w('relinquō', { type: 'v', p: ['relinquō', 'relinquere', 'relīquī', 'relictum'], conj: 3, c: 24, meaning: 'leave behind' }),
    w('iaciō',    { type: 'v', p: ['iaciō', 'iacere', 'iēcī', 'iactum'], conj: 33, c: 24, meaning: 'throw' }),
    w('īnveniō',  { type: 'v', p: ['īnveniō', 'īnvenīre', 'īnvenī', 'īnventum'], conj: 33, c: 25, meaning: 'find' }),
    w('perveniō', { type: 'v', p: ['perveniō', 'pervenīre', 'pervēnī', '—'], conj: 4, c: 26, meaning: 'arrive, reach' }),
    w('custōdiō', { type: 'v', p: ['custōdiō', 'custōdīre', 'custōdīvī', 'custōdītum'], conj: 4, c: 26, meaning: 'guard' }),
    w('cadō',     { type: 'v', p: ['cadō', 'cadere', 'cecidī', '—'], conj: 3, c: 26, meaning: 'fall' }),
    w('vīvō',     { type: 'v', p: ['vīvō', 'vīvere', 'vīxī', '—'], conj: 3, c: 30, meaning: 'live' }),
    w('cognōscō', { type: 'v', p: ['cognōscō', 'cognōscere', 'cognōvī', 'cognitum'], conj: 3, c: 28, meaning: 'get to know, recognize' }),
    w('incendō',  { type: 'v', p: ['incendō', 'incendere', 'incendī', 'incēnsum'], conj: 3, c: 33, meaning: 'set fire to, burn' }),
    w('accūsō',   { type: 'v', p: ['accūsō', 'accūsāre', 'accūsāvī', 'accūsātum'], conj: 1, c: 33, meaning: 'accuse' }),
    w('resistō',  { type: 'v', p: ['resistō', 'resistere', 'restitī', '—'], conj: 3, c: 35, meaning: 'resist (+ dative)' }),
    w('interficiō',{ type: 'v', p: ['interficiō', 'interficere', 'interfēcī', 'interfectum'], conj: 33, c: 36, meaning: 'kill' }),
    w('negō',     { type: 'v', p: ['negō', 'negāre', 'negāvī', 'negātum'], conj: 1, c: 36, meaning: 'deny, say that ... not' })
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
    w('grātus, -a, -um',    { type: 'adj', decl: 'adj12', stem: 'grāt', c: 6, meaning: 'pleasing, grateful' }),
    w('Graecus, -a, -um',   { type: 'adj', decl: 'adj12', stem: 'Graec', c: 2, meaning: 'Greek' }),
    w('īrātus, -a, -um',    { type: 'adj', decl: 'adj12', stem: 'īrāt', c: 4, meaning: 'angry' }),
    w('meus, -a, -um',      { type: 'adj', decl: 'adj12', stem: 'me', c: 5, meaning: 'my' }),
    w('parvus, -a, -um',    { type: 'adj', decl: 'adj12', stem: 'parv', c: 9, meaning: 'small' }),
    w('stultus, -a, -um',   { type: 'adj', decl: 'adj12', stem: 'stult', c: 7, meaning: 'foolish, stupid' }),
    w('tuus, -a, -um',      { type: 'adj', decl: 'adj12', stem: 'tu', c: 10, meaning: 'your (sg)' }),
    w('multus, -a, -um',    { type: 'adj', decl: 'adj12', stem: 'mult', c: 11, meaning: 'much, many' }),
    w('cārus, -a, -um',     { type: 'adj', decl: 'adj12', stem: 'cār', c: 13, meaning: 'dear' }),
    w('suus, -a, -um',      { type: 'adj', decl: 'adj12', stem: 'su', c: 14, meaning: '(his/her/their) own' }),
    w('omnis, -e',          { type: 'adj', decl: 'adj3', stem: 'omn', c: 19, meaning: 'all, every' }),
    w('noster, -stra, -um', { type: 'adj', decl: 'adj12', nom: 'noster', stem: 'nostr', c: 20, meaning: 'our' }),
    w('vester, -tra, -um',  { type: 'adj', decl: 'adj12', nom: 'vester', stem: 'vestr', c: 20, meaning: 'your (pl)' }),
    w('novus, -a, -um',     { type: 'adj', decl: 'adj12', stem: 'nov', c: 21, meaning: 'new' }),
    w('celer, celeris, celere', { type: 'adj', decl: 'adj3', nom: 'celer', stem: 'celer', c: 9, meaning: 'fast, swift',
        frc: { 'nom:pl:n': 'celera', 'acc:pl:n': 'celera', 'gen:pl:n': 'celerum' } }),
    w('barbarus, -a, -um',  { type: 'adj', decl: 'adj12', stem: 'barbar', c: 22, meaning: 'foreign, barbarian' }),
    w('audāx, audācis',     { type: 'adj', decl: 'adj3', nom: 'audāx', stem: 'audāc', c: 22, meaning: 'bold, audacious' }),
    w('difficilis, -e',     { type: 'adj', decl: 'adj3', stem: 'difficil', c: 25, meaning: 'difficult' }),
    w('incolumis, -e',      { type: 'adj', decl: 'adj3', stem: 'incolum', c: 26, meaning: 'safe, unharmed' }),
    w('miser, -era, -um',   { type: 'adj', decl: 'adj12', nom: 'miser', stem: 'miser', c: 26, meaning: 'wretched, unhappy' }),
    w('gravis, -e',         { type: 'adj', decl: 'adj3', stem: 'grav', c: 28, meaning: 'heavy, serious' }),
    w('trīstis, -e',        { type: 'adj', decl: 'adj3', stem: 'trīst', c: 28, meaning: 'sad' }),
    w('vetus, veteris',     { type: 'adj', decl: 'adj3', nom: 'vetus', stem: 'veter', c: 30, meaning: 'old',
        frc: { 'nom:pl:n': 'vetera', 'acc:pl:n': 'vetera', 'gen:pl:n': 'veterum' } }),
    w('cēterus, -a, -um',   { type: 'adj', decl: 'adj12', stem: 'cēter', c: 30, meaning: 'the rest, the other (usu. pl.)' })
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

  var particles = [
    w('et',     { type: 'conj', c: 1, meaning: 'and' }),
    w('sed',    { type: 'conj', c: 2, meaning: 'but' }),
    w('in',     { type: 'prep', c: 1, meaning: 'in, into (+ acc.)' }),
    w('ā / ab', { type: 'prep', c: 3, meaning: 'from, by (+ abl.)' }),
    w('ē / ex', { type: 'prep', c: 3, meaning: 'out of, from (+ abl.)' }),
    w('ad',     { type: 'prep', c: 3, meaning: 'to, towards (+ acc.)' }),
    w('cum',    { type: 'prep', c: 3, meaning: 'with (+ abl.)' }),
    w('etiam',  { type: 'adv', c: 4, meaning: 'even, also' }),
    w('quoque', { type: 'adv', c: 5, meaning: 'also, too' }),
    w('semper', { type: 'adv', c: 5, meaning: 'always' }),
    w('iam',    { type: 'adv', c: 6, meaning: 'now, already' }),
    w('numquam',{ type: 'adv', c: 6, meaning: 'never' }),
    w('cūr',    { type: 'adv', c: 6, meaning: 'why' }),
    w('saepe',  { type: 'adv', c: 7, meaning: 'often' }),
    w('per',    { type: 'prep', c: 9, meaning: 'through, along (+ acc.)' }),
    w('inter',  { type: 'prep', c: 9, meaning: 'between, among (+ acc.)' }),
    w('ubi',    { type: 'adv', c: 9, meaning: 'where; when' }),
    w('aut',    { type: 'conj', c: 9, meaning: 'or' }),
    w('nunc',   { type: 'adv', c: 11, meaning: 'now' }),
    w('sī',     { type: 'conj', c: 17, meaning: 'if' }),
    w('crās',   { type: 'adv', c: 21, meaning: 'tomorrow' }),
    w('hērī',   { type: 'adv', c: 21, meaning: 'yesterday' }),
    w('post',   { type: 'prep', c: 21, meaning: 'after (+ acc.)' }),
    w('mox',    { type: 'adv', c: 22, meaning: 'soon' }),
    w('dē',     { type: 'prep', c: 22, meaning: 'down from; about (+ abl.)' }),
    w('iterum', { type: 'adv', c: 24, meaning: 'again' }),
    w('simul',  { type: 'adv', c: 24, meaning: 'at the same time' }),
    w('prope',  { type: 'prep', c: 24, meaning: 'near (+ acc.)' }),
    w('circum', { type: 'prep', c: 26, meaning: 'around (+ acc.)' }),
    w('statim', { type: 'adv', c: 26, meaning: 'at once' }),
    w('tamen',  { type: 'conj', c: 26, meaning: 'however, nevertheless' }),
    w('diū',    { type: 'adv', c: 30, meaning: 'for a long time' }),
    w('sine',   { type: 'prep', c: 30, meaning: 'without (+ abl.)' }),
    w('contrā', { type: 'prep', c: 30, meaning: 'against (+ acc.)' }),
    w('quod',   { type: 'conj', c: 30, meaning: 'because' }),
    w('nam',    { type: 'conj', c: 30, meaning: 'for' }),
    w('igitur', { type: 'conj', c: 30, meaning: 'therefore' }),
    w('ut',     { type: 'conj', c: 33, meaning: 'as; when; that' }),
    w('nē',     { type: 'conj', c: 33, meaning: 'that ... not; so that ... not' })
  ];

  var valid = function (list) { return list.filter(function (x) { return !x.skip; }); };

  var all = valid(nouns).concat(valid(verbs)).concat(valid(adjectives)).concat(pronouns).concat(particles);

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
