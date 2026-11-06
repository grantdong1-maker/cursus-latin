/* Chapter map for the Oxford Latin Course structure (Parts I–III).
   Descriptions are the site's own summaries of what each chapter introduces.
   The alignment is approximate by design — tweak freely to match your copy. */
(function (root) {
  'use strict';

  var chapters = {};

  function describe(ch, skills) { chapters[ch] = { skills: skills }; }

  /* Part I */
  describe(1, 'introduces 1st-declension nouns (-a), the 3rd person singular of the present tense, and est — subject focus: puella, aqua, casa, ager');
  describe(2, 'adds 2nd-declension nouns, domus/datives and est fully — focus: servus, dominus, amīcus, puer');
  describe(3, 'introduces adjectives (masc/fem/neuter agreement) and the 1st/2nd-declension adjective set');
  describe(4, 'frequency of singular vs plural, plural endings of nouns and verbs, place phrases');
  describe(5, 'introduces 3rd-declension nouns (rēx, urbs style), genitive singular; the pluperfect meaning via "had + past participle"');
  describe(6, 'introduces the infinitive and questions with quid? / quis? / quōmodo?');
  describe(7, 'introduces 3rd-declension adjectives');
  describe(8, 'introduces imperatives and word order; more 3rd-decl noun practice');
  describe(9, 'introduces adverbs and the local case use of the ablative');
  describe(10, 'introduces neuter 3rd-declension nouns; imperfect idea via past context');
  describe(11, 'introduces dative usage with verbs of giving/serving');
  describe(12, 'perfect/meaning of completed actions; more subjunctive uses? no — adds ablative of means');
  describe(13, 'introduces the relative pronoun quī, quae, quod');
  describe(14, 'introduces personal and reflexive pronouns, and is, ea, id');
  describe(15, 'introduces hīc and ille; demonstratives fully worked');
  describe(16, 'revision and richer ablative/genitive variety');

  /* Part II */
  describe(17, 'introduces the PERFECT tense fully (all persons): parāvī, parāvistī, portāvērunt');
  describe(18, 'introduces the IMPERFECT tense');
  describe(19, 'introduces the FUTURE tense');
  describe(20, 'introduces 4th-declension nouns (portus style)');
  describe(21, 'introduces the FUTURE PERFECT and magis/plus?');
  describe(22, 'perfect-stem wrinkles (reduplication, v-stems, guttural stems)');
  describe(23, 'perfect-stem wrinkles (short-vowel stems); i-stem 3rd declension)');
  describe(24, 'introduced 5th-declension? focus on story structure and subordinate clauses');
  describe(25, 'introduces comparatives and superlatives');
  describe(26, 'introduces the ablative absolute');
  describe(27, 'introduced deponents? introduces indirect statement? approx.');
  describe(28, 'introduced the gerund/gerundive? approximate');
  describe(29, 'introduced impersonal verbs? plus vocabulary of stages; approximate');
  describe(30, 'introduces the perfect passive participle (portātum family)');
  describe(31, 'introduces the perfect passive (portātus sum / eram / future erō)');
  describe(32, 'introduces the synthetic passive: future/imperfect/passive forms');

  /* Part III (approximate) */
  describe(33, 'subjunctive context: purpose clauses begin');
  describe(34, 'imperfect subjunctive and cum-clauses');
  describe(35, 'indirect statements (accusative + infinitive)');
  describe(36, 'indirect questions? plus reading of the Brutus story');
  describe(37, 'conditional sentences; subjunctive in conditions');
  describe(38, 'gerunds and gerundives in more depth');
  describe(39, 'perfect-stem formations in -s-, -x- and -u- revised through the readings');
  describe(40, 'vocabulary & syntax of the Horace chapters');
  /* For remaining chapters, the map is generic */
  for (var ch = 41; ch <= 54; ch++) describe(ch, 'revision, reading strategies & remaining syntax (approximate: see the grammar reference)');

  var api = {
    chapters: chapters,
    totalSteps: { partI: [1, 16], partII: [17, 32], partIII: [33, 54] },
    featureIntro: {
      d1: 1, d2m: 2, d2ms: 2, d2n: 2, d3c: 5, d3cn: 10, d3i: 10, d3in: 12, d4: 20, d5: 23,
      adj12: 3, adj3: 7, comp: 25,
      conj1: 1, conj2: 2, conj3: 4, conj33: 6, conj4: 5,
      pres: 1, imp: 18, fut: 19, perf: 17, plup: 18, fp: 21,
      analyticPass: 31, syntheticPass: 32,
      imperative: 8, subj: 33,
      infinitive: 18, infinitivePerf: 30,
      participlePres: 24, participlePerf: 28, participleFut: 34,
      pron: 13, pronPerson: 14, pronIs: 14, pronHic: 15, pronIlle: 15
    }
  };
  if (typeof module !== 'undefined' && module.exports && !root.document) module.exports = api;
  else root.LRC = api;
})(typeof window !== 'undefined' ? window : globalThis);
