/* Year 9 Semester 2 Latin exam — mock material.
   Everything here is ORIGINAL to this site: the unseen passages, their model
   translations and mark schemes were composed for Cursus; the comprehension
   questions about chapter 43 are our own wording. No textbook text is stored
   or served — candidates read their own copy of the book. */
(function (root) {
  'use strict';

  var meta = {
    title: 'Year 9 · Semester 2 Latin Exam',
    whenISO: '2026-11-26T13:00:00',
    whenLabel: 'Thursday 26 November, 1pm–2:15pm',
    venue: 'South Room',
    total: 80,
    conditions: 'No dictionaries permitted.',
    sections: [
      {
        id: 's1', n: 1, name: 'Unseen translation', marks: 40, minutes: 50,
        split: '15 minutes reading time + 35 minutes writing time',
        brief: 'A 75-word unseen passage. Translate into English; then mark yourself against our model and mark scheme.'
      },
      {
        id: 's2', n: 2, name: 'Comprehension · Chapter 43', marks: 20, minutes: 15,
        split: 'reading comprehension and grammar analysis',
        brief: 'Questions on the story Quintus Maecenati commendatur — content, then analysis of the grammar in it.'
      },
      {
        id: 's3', n: 3, name: 'Accidence & grammar', marks: 20, minutes: 15,
        split: 'tables of verbs, pronouns, nouns, adjectives + short answers',
        brief: 'Give the requested forms and answer short grammar questions. Marked automatically.'
      }
    ]
  };

  /* ---------- Section 1: original ~75-word unseens with mark schemes ---------- */
  /* points: la = the word/phrase being credited, en = what the credit needs, m = marks */
  var unseens = [
    {
      id: 'x-marcus', title: 'Marcus et fīlius', words: 75,
      latin: 'Marcus, vir sāpēns, ex Rōmā prōfectus est ut fīlium quārēret. diū per prōvīnciam errāvit; tandem ad māre vēnit, cum nāvem parātam vidisset. mīlitēs eum vidēbant, sed nēmo auxilium prāebēbat. "sī hīc manēbis," inquit nāuta, "tempestās veniet; nunc prōficīscī dēbēmus." Marcus grātiās nāutae ēgit et cum eō nāvigāvit. postrīdiē fīlium in īnsulā cōnspexit. puer adeō laetus erat ut lacrimās effunderet. "pater mē invenit!" clāmāvit. "nunc domum redīre possumus." domum rediērunt; Marcus crēdēbat sē fīlium custōdītūrum esse.',
      aids: [
        ['sāpēns', 'wise'], ['prōfectus est', 'set out, departed'], ['quārēret', 'was looking for (with ut: in order to look for)'],
        ['errāvit', 'wandered, went astray'], ['māre', 'sea'], ['parātam', 'made ready, prepared'],
        ['prāebēbat', 'was offering, providing'], ['tempestās', 'storm, bad weather'], ['prōficīscī', 'to set out, depart'],
        ['dēbēmus', 'we must, we owe'], ['grātiās … ēgit', 'thanked (idiom)'], ['cōnspexit', 'caught sight of, noticed'],
        ['adeō', 'so, to such an extent'], ['lacrimās', 'tears'], ['effunderet', 'was shedding, pouring out']
      ],
      translation: 'Marcus, a wise man, set out from Rome in order to look for his son. He wandered for a long time through the province; at last he came to the sea, when he had seen a ship ready. The soldiers were watching him, but nobody was offering help. "If you stay here," said the sailor, "a storm will come; now we must set out." Marcus thanked the sailor and sailed with him. The next day he caught sight of his son on the island. The boy was so happy that he shed tears. "Father found me!" he shouted. "Now we can return home." They returned home; Marcus believed that he was going to look after his son.',
      notes: [
        'ut fīlium quārēret — purpose clause: "in order to look for", not "so that he seeks".',
        'cum nāvem parātam vidisset — cum + pluperfect subjunctive: "when / after he had seen".',
        'sī manēbis … veniet — live condition: both verbs indicative, future sense.',
        'adeō laetus erat ut lacrimās effunderet — result clause: "so happy that …".',
        'crēdēbat sē custōdītūrum esse — indirect statement: accusative sē + infinitive.'
      ],
      points: [
        { la: 'Marcus, vir sāpēns', en: 'Marcus, a wise man', m: 1 },
        { la: 'ex Rōmā prōfectus est', en: 'set out / departed from Rome', m: 2 },
        { la: 'ut fīlium quārēret', en: 'in order to look for his son (purpose must be explicit)', m: 2 },
        { la: 'diū', en: 'for a long time', m: 1 },
        { la: 'per prōvīnciam errāvit', en: 'he wandered through the province', m: 2 },
        { la: 'tandem ad māre vēnit', en: 'at last he came to the sea', m: 2 },
        { la: 'cum nāvem parātam vidisset', en: 'when/after he had seen a ship ready', m: 2 },
        { la: 'mīlitēs eum vidēbant', en: 'the soldiers were watching him (imperfect)', m: 2 },
        { la: 'sed nēmo auxilium prāebēbat', en: 'but nobody was offering help', m: 2 },
        { la: 'sī hīc manēbis', en: 'if you will stay / stay here', m: 1 },
        { la: 'tempestās veniet', en: 'a storm will come', m: 1 },
        { la: 'nunc prōficīscī dēbēmus', en: 'now we must set out', m: 2 },
        { la: 'inquit nāuta', en: 'said the sailor', m: 1 },
        { la: 'grātiās nāutae ēgit', en: 'thanked the sailor (dative)', m: 2 },
        { la: 'et cum eō nāvigāvit', en: 'and sailed with him', m: 1 },
        { la: 'postrīdiē', en: 'the next day / on the following day', m: 1 },
        { la: 'fīlium in īnsulā cōnspexit', en: 'he caught sight of / saw his son on the island', m: 2 },
        { la: 'adeō laetus erat', en: 'he was so happy', m: 1 },
        { la: 'ut lacrimās effunderet', en: 'that he shed/overflowed with tears (result)', m: 2 },
        { la: 'pater mē invenit', en: 'father found me', m: 1 },
        { la: 'clāmāvit', en: 'he shouted/exclaimed', m: 1 },
        { la: 'nunc domum redīre possumus', en: 'now we can/are able to return home', m: 2 },
        { la: 'domum rediērunt', en: 'they returned home', m: 1 },
        { la: 'Marcus crēdēbat', en: 'Marcus believed (imperfect)', m: 1 },
        { la: 'sē fīlium custōdītūrum esse', en: 'that he would/was going to look after his son', m: 2 },
        { la: 'style & sense overall', en: 'fluent English with the tense sequence kept (up to 2)', m: 2 }
      ]
    },
    {
      id: 'x-lucius', title: 'Epistula: Lūcius Amāntiae', words: 75,
      latin: 'Lūcius Amāntiae salūtem plūrimam dīcit. cum heri in forō tē vīdēret, nōn agnōvī. adeō mūtāta es ut tē nēmō agnōscat. scrībō autem dē lūdīs quōs crās spectātūrī sumus. sī plūvia gravis vēnisset, ad spectacula nōn vēnissēmus. sed advenīmus et gladiātōrem vīdimus quem tū laudābās. is adeō fortis erat ut omnēs eum laudārent. nunc amīcī meī crēdunt sē victōrēs fore. veni crās māne ut tēcum loquar; est enim mihi negōtium dē tē. dīc mihi ubi hābitēs.',
      aids: [
        ['salūtem plūrimam dīcit', 'sends the fullest greetings (letter opening)'], ['heri', 'yesterday'],
        ['mūtāta es', 'you have changed'], ['lūdīs', 'games'], ['spectātūrī sumus', 'we are going to watch'],
        ['plūvia', 'rain'], ['gravis', 'heavy, severe'], ['spectacula', 'shows, spectacles'],
        ['gladiātōrem', 'gladiator'], ['victōrēs', 'winners, victors'], ['fore', 'will be (fut. inf. of esse)'],
        ['tēcum', 'with you'], ['loquar', 'I may speak'], ['hābitēs', 'you live']
      ],
      translation: 'Lucius sends fullest greetings to Amanda. When I saw you yesterday in the forum, I did not recognise you. You are so changed that nobody recognises you. However, I am writing about the games which we are going to watch tomorrow. If heavy rain had come, we would not have come to the spectacle. But we arrived and we saw the gladiator whom you used to praise. He was so brave that all were praising him. Now my friends believe that they will be winners. Come tomorrow morning so that I may speak with you; for I have business concerning you. Tell me where you live.',
      notes: [
        'salūtem plūrimam dīcit — the standard opening of a Latin letter.',
        'cum … vīdēret — cum + subjunctive (temporal/causal): "when I saw".',
        'adeō … ut … agnōscat — result clause; keep "so … that".',
        'sī vēnisset … nōn vēnissēmus — both subjunctive: a condition contrary to fact in the past ("if … had …, we would not have …").',
        'crēdunt sē victōrēs fore — indirect statement with fore (= futūrum esse).',
        'ubi hābitēs — indirect question takes the subjunctive.'
      ],
      points: [
        { la: 'Lūcius Amāntiae', en: 'Lucius to Amanda (letter form)', m: 1 },
        { la: 'salūtem plūrimam dīcit', en: 'sends fullest greetings', m: 2 },
        { la: 'cum heri in forō tē vīdēret', en: 'when he saw you yesterday in the forum', m: 2 },
        { la: 'nōn agnōvī', en: 'I did not recognise you', m: 2 },
        { la: 'adeō mūtāta es', en: 'you are so changed/altered', m: 2 },
        { la: 'ut tē nēmō agnōscat', en: 'that nobody recognises you (result)', m: 2 },
        { la: 'scrībō autem', en: 'however/and yet I am writing', m: 1 },
        { la: 'dē lūdīs', en: 'about the games', m: 1 },
        { la: 'quōs crās spectātūrī sumus', en: 'which we are going to watch tomorrow', m: 2 },
        { la: 'sī plūvia gravis vēnisset', en: 'if heavy/severe rain had come', m: 2 },
        { la: 'ad spectacula nōn vēnissēmus', en: 'we would not have come to the shows', m: 2 },
        { la: 'sed advenīmus', en: 'but we arrived', m: 1 },
        { la: 'gladiātōrem vīdimus', en: 'we saw the gladiator', m: 1 },
        { la: 'quem tū laudābās', en: 'whom you used to praise / were praising', m: 2 },
        { la: 'is adeō fortis erat', en: 'he was so brave', m: 1 },
        { la: 'ut omnēs eum laudārent', en: 'that all praised/were praising him', m: 2 },
        { la: 'nunc amīcī meī crēdunt', en: 'now my friends believe', m: 1 },
        { la: 'sē victōrēs fore', en: 'that they will be winners/victors', m: 2 },
        { la: 'veni crās māne', en: 'come tomorrow morning/early', m: 2 },
        { la: 'ut tēcum loquar', en: 'so that I may speak with you (purpose)', m: 2 },
        { la: 'est mihi negōtium', en: 'I have business (dative of possession)', m: 2 },
        { la: 'dē tē', en: 'concerning/about you', m: 1 },
        { la: 'dīc mihi', en: 'tell me', m: 1 },
        { la: 'ubi hābitēs', en: 'where you live (indirect question)', m: 2 },
        { la: 'style & sense overall', en: 'fluent English, letter tone kept (up to 1)', m: 1 }
      ]
    },
    {
      id: 'x-quintus', title: 'Quīntus in Britannia', words: 75,
      latin: 'Quīntus, mīles audāx, in Britanniam vēnit ut pācem cum īnsulānīs faceret. īnsula ab ītāliā procul erat. dux, quī longē aberat, eī mūnera glōriamque contulit. multī autem Rōmānī hīs verbīs nōn crēdēbant. "sī in silvīs manēbimus," inquit dux, "hostēs nōs invenient; celeriter ā mari recēdēre dēbēmus." Quīntus audāx erat et in silvās cum paucīs iīvit. hostēs eum circumvēnērunt; sed mīlitēs, quī prope stabant, celeriter eī auxiliātī sunt. Quīntus laetus est quod glōriam, quam quaesīvit, tandem invenit.',
      aids: [
        ['audāx', 'bold, daring'], ['īnsulānīs', 'the islanders (dat.)'], ['procul', 'far away'],
        ['aberat', 'was away, distant'], ['mūnera', 'gifts'], ['contulit', 'bestowed, granted'],
        ['silvīs', 'woods, forests'], ['invenient', 'they will find'], ['recēdēre', 'to withdraw, fall back'],
        ['paucīs', 'with a few (men)'], ['iīvit', 'went (from eō)'], ['circumvēnērunt', 'surrounded'],
        ['auxiliātī sunt', 'helped'], ['quaesīvit', 'sought, looked for']
      ],
      translation: 'Quintus, a bold soldier, came to Britain in order to make peace with the islanders. The island was far from Italy. The general, who was far away, bestowed gifts and glory on him. But many Romans did not believe these words. "If we stay in the woods," said the general, "the enemy will find us; we must withdraw quickly from the sea." Quintus was bold and went into the woods with a few men. The enemy surrounded him; but the soldiers, who were standing nearby, quickly came to his aid. Quintus was glad because at last he found the glory which he had sought.',
      notes: [
        'ut pācem fīceret — purpose clause after a past-tense main verb.',
        'ab ītāliā procul — procul + ā/ab: "far from".',
        'eī … contulit — dative: bestowed ON HIM.',
        'crēdere + dative (hīs verbīs) and the -bimus/-ent future pair in the condition.',
        'circumvenīre = surround; auxiliārī (deponent) = come to someone\'s help.'
      ],
      points: [
        { la: 'Quīntus, mīles audāx', en: 'Quintus, a bold/brave soldier', m: 1 },
        { la: 'in Britanniam vēnit', en: 'came to Britain (in + acc.)', m: 1 },
        { la: 'ut pācem cum īnsulānīs fīceret', en: 'in order to make peace with the islanders', m: 2 },
        { la: 'īnsula ab ītāliā procul erat', en: 'the island was far from Italy', m: 2 },
        { la: 'dux, quī longē aberat', en: 'the general/commander, who was far away', m: 2 },
        { la: 'eī mūnera glōriamque contulit', en: 'bestowed gifts and glory on him (dative)', m: 2 },
        { la: 'multī autem Rōmānī', en: 'but/however many Romans', m: 1 },
        { la: 'hīs verbīs nōn crēdēbant', en: 'did not believe these words (imperfect)', m: 2 },
        { la: 'sī in silvīs manēbimus', en: 'if we stay/will stay in the woods', m: 1 },
        { la: 'hostēs nōs invenient', en: 'the enemy will find us', m: 2 },
        { la: 'inquit dux', en: 'says/said the general', m: 1 },
        { la: 'celeriter ā mari recēdēre dēbēmus', en: 'we must withdraw quickly from the sea', m: 2 },
        { la: 'Quīntus audāx erat', en: 'Quintus was bold', m: 1 },
        { la: 'in silvās cum paucīs iīvit', en: 'went into the woods with a few (men)', m: 2 },
        { la: 'hostēs eum circumvēnērunt', en: 'the enemy surrounded him', m: 2 },
        { la: 'mīlitēs, quī prope stabant', en: 'the soldiers who were standing nearby', m: 2 },
        { la: 'celeriter eī auxiliātī sunt', en: 'quickly came to HIS aid (deponent + dative)', m: 2 },
        { la: 'Quīntus laetus est', en: 'Quintus was happy/glad', m: 1 },
        { la: 'quod … tandem invenit', en: 'because at last he found', m: 2 },
        { la: 'glōriam quam quaesīvit', en: 'the glory which he had sought (relative + perfect)', m: 2 },
        { la: 'style & sense overall', en: 'fluent English, no Latin word-order left behind (up to 7)', m: 7 }
      ]
    }
  ];

  /* ---------- Section 2: comprehension, chapter 43 (20 marks) ---------- */
  /* kind 'w' = written answer, self-marked against model · kind 'a' = auto-marked */
  var comprehension = [
    {
      id: 'c1', kind: 'w', m: 2,
      q: 'Who was Maecenas, and what was his relationship with Octavian?',
      a: 'A wealthy, influential Roman of equestrian birth (with Etruscan roots on his mother\'s side) who became Octavian\'s closest friend and adviser: he negotiated on his behalf, held Rome and Italy for him while he was abroad, and ran his cultural circle.'
    },
    {
      id: 'c3', kind: 'w', m: 2,
      q: 'Why is Maecenas\' name still used in English today, and what did he do to earn it?',
      a: '"Maecenas" means a generous patron of the arts. He gathered talented writers round him — notably Virgil and Horace — encouraged and funded them, and (tactfully) put their talents to work celebrating Octavian and the new age he was bringing.'
    },
    {
      id: 'c4', kind: 'w', m: 2,
      q: 'What does the extract of Horace tell us about the poet\'s father?',
      a: 'That he was poor by Roman standards — a smallholder on a tiny farm — yet he was determined to give his son a proper education, and had him taken to Rome to be taught the subjects that any knight or senator taught his own children.'
    },
    {
      id: 'c5', kind: 'w', m: 2,
      q: 'In the story, how does Quintus behave towards his father despite his new friends?',
      a: 'He keeps praising him and thanking him, and is never ashamed of him, even though he is now friendly with very important men — and with the ruler himself.'
    },
    {
      id: 'c7', kind: 'a', m: 2, q: 'The form laudāret in the story is:',
      opts: ['3rd person singular imperfect subjunctive (active)', '3rd person singular imperfect indicative', '3rd person plural present subjunctive', '3rd person singular pluperfect subjunctive'],
      ans: 0, explain: '-aret- is the imperfect subjunctive marker: ā + ret.'
    },
    {
      id: 'c8', kind: 'a', m: 2, q: 'Why is laudāret subjunctive here?',
      opts: ['it is in a result clause after adeō', 'it is in a purpose clause', 'after cum meaning "since"', 'it is an indirect question'],
      ans: 0, explain: 'adeō … ut + subjunctive = result: "so much … that he always praised him".'
    },
    {
      id: 'c9', kind: 'a', m: 2, q: 'In cum amicus esset, the verb esset is:',
      opts: ['imperfect subjunctive of sum', 'imperfect indicative of sum', 'pluperfect subjunctive', 'present subjunctive'],
      ans: 0, explain: 'esset = imperfect subjunctive; cum here describes circumstance ("although / since he was a friend").'
    },
    {
      id: 'c10', kind: 'a', m: 2, q: 'grātiāsque ei ageret: why is ei dative?',
      opts: ['grātiās agere takes a dative of the person thanked', 'ei is the subject of ageret', 'possessive dative', 'dative of reference with a compound verb'],
      ans: 0, explain: 'Fixed idiom: grātiās + agere + dative = "to thank someone".'
    },
    {
      id: 'c11', kind: 'a', m: 2, q: 'In sī māturīus vēnisset, iter cum eō fēcisset, the two verbs show:',
      opts: ['a past condition contrary to fact (both pluperfect subjunctive)', 'a simple future condition', 'a present unreal condition', 'two indirect questions'],
      ans: 0, explain: '"if he had come earlier, he would have made the journey" — -isset / -isset = pluperfect subjunctive in both halves.'
    },
    {
      id: 'c12', kind: 'a', m: 2, q: 'cognōvit eum iam prōfectum esse: how is the underlined infinitive best explained?',
      opts: ['perfect infinitive in an indirect statement (eum … profectum esse)', 'present infinitive after a modal verb', 'historical infinitive', 'imperative plural'],
      ans: 0, explain: 'Accusative (eum) + infinitive after a verb of knowing/telling = indirect statement; -isse marks completed action.'
    }
  ];

  /* ---------- Section 3: short-answer grammar (auto-marked) ---------- */
  var grammarQ = [
    { q: 'What mood is used in a result clause after ut?', accept: ['subjunctive', 'subj'], m: 2,
      a: 'The subjunctive (indicative only when the result is stated as a fact).' },
    { q: 'Which word introduces a NEGATIVE purpose clause?', accept: ['ne'], m: 2,
      a: 'nē + subjunctive ("so that … not / in order that … not").' },
    { q: 'Give the Latin for the result conjunction: "so great / so … that"', accept: ['ut', 'adeo ut', 'ita ut', 'tam ut'], m: 2,
      a: 'ut — with adeō / ita / tam in the main clause.' },
    { q: 'In an indirect statement (after sciō, crēdō, audiō …), in what case does the subject of the infinitive appear?', accept: ['accusative', 'acc', 'accusativeus'], m: 2,
      a: 'The accusative: sciō eum vēnisse — "I know that he came".' },
    { q: 'Which of these two English words must appear to show a Latin purpose clause has been translated correctly?', accept: ['to', 'in order', 'so that', 'might', 'should'], m: 2,
      a: 'A purpose marker: "to …", "in order to …", "so that … might".' },
    { q: 'si + pluperfect subjunctive … pluperfect subjunctive: what sort of condition is this?', accept: ['contrary to fact', 'unreal', 'past unreal', 'impossible', 'counterfactual'], m: 2,
      a: 'Condition contrary to fact in the past: "if … had …, … would have …".' },
    { q: 'Give the pluperfect subjunctive 3rd singular of amō.', accept: ['amavisset', 'amavīset'], m: 2,
      a: 'amāvisset — perfect stem + -isse- + personal ending.' },
    { q: 'Give the imperfect subjunctive 3rd plural of audiō.', accept: ['audirent', 'audīrent'], m: 2,
      a: 'audīrent — present stem + long vowel of the conjugation + -rent.' },
    { q: 'What English ending usually translates the gerundive (e.g. cōnsilium capiendum)?', accept: ['to be', 'must', 'being', 'should be'], m: 2,
      a: 'Necessity: "to be taken", "must be taken".' },
    { q: 'Give the present passive infinitive of capiō.', accept: ['capi'], m: 2,
      a: 'capi — third conjugation: stem + -i.' },
    { q: 'Which case does the comparative use for "than"?', accept: ['ablative', 'abl'], m: 2,
      a: 'Ablative of degree difference: hōc melior ("better than this").' },
    { q: 'What is the supine/periphrastic future active infinitive of veniō?', accept: ['venturum esse', 'venturam esse', 'venturum esse'], m: 2,
      a: 'ventūrus esse — future participle + esse.' }
  ];

  var api = { meta: meta, unseens: unseens, comprehension: comprehension, grammarQ: grammarQ };
  if (typeof module !== 'undefined' && module.exports && !root.document) module.exports = api;
  else root.LRX = api;
})(typeof window !== 'undefined' ? window : globalThis);
