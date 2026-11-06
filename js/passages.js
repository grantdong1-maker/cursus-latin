/* Unseen translation passages — ORIGINAL compositions written for this site.
   Authoring syntax: [word|gloss] marks a gloss; unmarked words fall back to the
   site's parse engine when the form is known. min = chapter gate. */
(function (root) {
  'use strict';

  var passages = [
    /* ---------- TIER A: present/imperative/infinitive only ---------- */
    {
      id: 'a-forum', tier: 'A', min: 8, title: 'Ad forum',
      text: 'Servus dominum [exspectat|waits for]. dominus servum vocat et [iubet|orders (+ inf.)]: "[ī|go!], serve; [pānem|loaf of bread] [eme|buy!] in forō!" servus celeriter in urbem [festīnat|hurries]. in forō multī hominēs sunt; pānis [cārus|expensive] est. servus duōs panēs [emit|buys] in [tabernā|shop] parvā. mox domum festīnat; [dominō|to his master] pānem dat. dominus, quod pānis bonus est, laetus est et servum laudat. "bene facis!" [inquit|he says]. servus laetus rīdet.',
      translation: 'The slave is waiting for his master. The master calls the slave and orders: "Go, slave! Buy a loaf of bread in the forum!" The slave hurries quickly into the city. In the forum there are many people; the bread is expensive. The slave buys two loaves in a small shop. Soon he hurries home; he gives the bread to his master. Because the bread is good, the master is pleased and praises the slave. "Well done!" he says. The happy slave smiles.',
      note: 'Notice iubet + infinitive, and the dative after dare.'
    },
    {
      id: 'a-litus', tier: 'A', min: 13, title: 'Puellae in lītore',
      text: 'In lītore parvō puellae lūdunt, [dum|while] mātrēs cibum parant. nauta quī [iūxtā|nearby] sedet, [fābulam|story] nārrat. puellae eum [circumstant|stand around] et audiunt. "nāvēs nostrae ad Graeciam nāvigant," inquit nauta. "in [īnsulīs|islands] multīs nautae [diū|for a long time] manent, quod ventus [lēvis|light] est. sed bona [fortūna|luck] nautās servat." puella [audāx|bold] rogat: "ubi nāvēs nostrae sunt?" nauta respondet: "[procul|far off] ā lītore nāvigant. bonō [animō|courage] [estōte|be]! iam ventus fortis venit."',
      translation: 'On a small shore the girls are playing, while the mothers prepare food. An old sailor who sits nearby tells a story. The girls stand around him and listen. "Our ships are sailing to Greece," says the sailor. "On many islands the sailors stay for a long time, because the wind is light. But good luck saves sailors." A bold girl asks: "Where are our ships?" The sailor replies: "They are sailing far from the shore. Be of good courage! Already a strong wind is coming."',
      note: 'Focus on the relative clause (quī … sedet) and the dative (bonō animō).'
    },
    /* ---------- TIER B: past tenses ---------- */
    {
      id: 'b-ursus', tier: 'B', min: 20, title: 'Ursus in montibus',
      text: '[Quondam|once upon a time] viātor per montēs dūros iter [faciēbat|was making]. ursus ingēns appāruit. viātor [timuit|was afraid] et [arborem|tree] magnam ascendit. ursus trēs hōrās sub arbore [custōdiēbat|kept watch]. sōl [occidēbat|was setting] et ursus [dēfessus|tired] tandem abiit. viātor descendit et domum celeriter cucurrit. [posthāc|after that] numquam per eōs montēs ambulāvit.',
      translation: 'Once upon a time a traveller was making a journey through the rough mountains. Suddenly a huge bear appeared. The traveller was afraid and climbed a big tree. For three hours the bear kept watch under the tree. The sun was setting and, tired, the bear finally went away. The traveller came down and ran home quickly. After that he never walked through those mountains again.',
      note: 'The imperfect (faciēbat, custōdiēbat) gives background; the perfects give events.'
    },
    {
      id: 'b-mercator', tier: 'B', min: 26, title: 'Mercātor Rōmānus',
      text: 'Mercātor [quīdam|a certain] Rōmam vēnit. equum [agēbat|was driving]; in [vehīculō|cart] vīna optima et [oleum|olive oil] portābat. in forō multī [emere|to buy] [volēbant|were wanting]; sed quīdam Rōmānī dubitābant. "vīna [vēra|genuine] sunt!" mercātor. "[gustāte|taste] [vidēbitis|you will see]!" senator quīdam vīnum gustāvit et rīsit. "vēra sunt," inquit, "sed pretium nimium magnum est!" mercātor respondit: "tibī vīnum [grātīs|for free] dabō, sī nōmen tuum mihi scrībis]." senātor [iterum|a second time] rīsit: "nōmen meum est [multō|by much] [pretiōsius|more costly] quam vīnum tuum!"',
      translation: 'A certain merchant came to Rome. He was driving a quick horse; in his cart he was carrying excellent wine and oil. In the forum many were wanting to buy; but certain Romans were doubting. "The wines are genuine!" the merchant was shouting. "Taste them! You will see!" A certain senator tasted the wine and laughed. "They are genuine," he said, "but the price is too great!" The merchant replied: "I will give you the wine for free, if you write your name for me." The senator laughed a second time: "My name is far more costly than your wine!"',
      note: 'Watch volēbant + infinitive and the -bi- future (vidēbitis, dabō).'
    },
    {
      id: 'b-civis', tier: 'B', min: 30, title: 'Cīvis Rōmānus',
      text: 'Cīvis Rōmānus [quīdam|a certain] in forō stābat. subitō [fūr|thief] [sacculum|purse] eius [ēripuit|snatched] et per viās [cucurrit|ran]. cīvis clāmāvit: "Sta, fūr!" multī cīvēs, quī [clāmōrem|the shout] [audīverant|had heard], per viās cucurrērunt. mīlitēs in forō stabant; fūrem cēpērunt. cīvis [suum|his own] sacculum recēpit et tandem [sēcūrus|at ease] domum rediit.',
      translation: 'A certain Roman citizen was standing in the forum. Suddenly a thief snatched his purse and ran through the streets. The citizen shouted: "Stop, thief!" Many citizens, who had heard the shout, ran through the streets. The soldiers were standing in the forum; quickly they caught the thief. The citizen took back his purse and finally returned home at ease.',
      note: 'The pluperfect (audīverant) marks what happened first; the imperfect paints the scene.'
    },
    /* ---------- TIER C: subjunctive, indirect statement, cum-clauses ---------- */
    {
      id: 'c-proculus', tier: 'C', min: 36, title: 'Iuvenis philosophus',
      text: 'Proculus, iuvenis Rōmānus, ad Graeciam [nāvigāverat|had sailed] [ut|so that] philosophum clārum audīret. [Athēnīs|at Athens] multōs annōs [manēbat|was staying]: cum in scholā sedēret, cotīdiē librōs philosophōrum legēbat. magister eum rogāvit quid dē [virtūte|virtue] [putāret|he thought]. Proculus respondit: "vīta sine virtūte [nūllō|at no] pretiō [valet|is worth]." magister rīsit: "[animō|in spirit] Rōmānus es, sed bene putās!" post multōs annōs Proculus Rōmam rediit; verba magistrī semper [memoriā|in memory] [tenuit|he held].',
      translation: 'Proculus, a young Roman, had sailed to Greece so that he might hear a famous philosopher. He was staying in Athens for many years: whenever he sat in the school, he used to read the books of the philosophers daily. The master asked him what he thought about virtue. Proculus replied: "Life without virtue is worth nothing." The master smiled: "You are a Roman in spirit, but you think well!" After many years Proculus returned to Rome; he always held the words of his master in memory.',
      note: 'ut + subjunctive (audīret), indirect question (putāret), and cum + subjunctive (sedēret).'
    },
    {
      id: 'c-epistula', tier: 'C', min: 40, title: 'Epistula ad amīcum',
      text: 'Gāius Lūciō [salūtem|greetings] [plūrimam|fullest] dīcit. cum Rōmam vēnī, [nūntium|messenger] dē tē [quaesīvī|I sought]. nūntius mihi dīxit tē valēre; sed scrībe mihi [legās|you are reading] et ubi maneās. nam scīō tē studia tua nōn neglegere. dē mē: [negōtium|business] meum Rōmae [prōcēdit|goes on]; sī [dīvitiās|riches] [parābō|I gain], tibī dōnum mittam. vēnī [ut|in order that] tē vidērem. Valē, mī amīce!',
      translation: 'Gaius sends the fullest greetings to Lucius. When I came to Rome, I sought a messenger about you. The messenger told me that you were well; but write to me what you are reading and where you are staying. For I know that you do not neglect your studies. About me: my business goes on in Rome; if I gain wealth, I will send you a gift. I came in order that I might see you. Farewell, my friend!',
      note: 'Indirect statement (tē valēre), indirect questions (legās, maneās), purpose clause (ut … vidērem).'
    }
  ];

  var api = {
    list: passages,
    byTier: function (t) {
      return this.list.filter(function (p) { return p.tier === t; });
    },
    forChapter: function (ch) {
      return this.list.filter(function (p) { return ch >= p.min; });
    }
  };
  if (typeof module !== 'undefined' && module.exports && !root.document) module.exports = api;
  else root.LRP = api;
})(typeof window !== 'undefined' ? window : globalThis);
