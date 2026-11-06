# Cursus — Latin revision trainer

A fast, chapter-aware revision site for Latin (built around the Oxford Latin Course
structure, chapters 1–54). Everything runs client-side — no server needed.

## What's inside

- **Dashboard** — accuracy ring, XP level, streak flame, vocab & passage mastery, recent answers.
- **Quick-fire** — one form at a time, typed answers, instant feedback, running accuracy.
- **Full tables** — pick any word, fill the whole paradigm, check and reveal.
- **Parse** — tick person/number/tense/voice; parse pool is generated from the same data.
- **Vocabulary** — spaced-repetition flashcards (Latin→English or English→Latin), boxed decks in `localStorage`.
- **Unseen translation** — original Latin passages graded in three tiers; click-to-gloss words
  (authored glosses, falling back to the morphology engine), hidden model translation,
  self-rating for XP.
- **Grammar reference** — declension and conjugation tables, unlocked as your chapter rises.
- **Reader** — load your own text files (e.g. your OCR'd scans) locally; form-feed (\f) splits pages.

Gamification: XP per correct answer (+10 quick-fire, +10 parse, +12 vocab card,
+25 full-table clear, +40/−0 passage self-rating), levels, and day-streak tracking.
All drills, tables, vocabulary and passages are original site content, aligned
(approximately, by design — edit `js/chapters.js`) to the course progression. Grammar
itself is universal Latin; nothing copyrighted is shipped with the site.

## Accounts

Two login modes, chosen at the gate:

| mode | status | what you get |
|---|---|---|
| **Local profile** (default) | works with zero setup | name-only login; progress kept in this browser under your own namespace |
| **Firebase Auth** | once you paste a config | email + password accounts, progress follows your login on any device with the same browser profile |

To enable Firebase Auth:

1. Create a project at console.firebase.google.com (Web App → copy config).
2. Paste the values into `js/firebase-config.js`.
3. In the console: Authentication → Sign-in method → enable **Email/Password**.

Until a valid config is present the gate shows the local-profile option only, and it
works fully. Progress is namespaced per user (`cursus_u_<id>_*`); your pre-login
progress is automatically carried over the first time you log in.

## Files

```
index.html            page shell (auth gate, sidebar, dashboard, panels)
styles.css            styling (Fraunces + Inter, gold/oxblood theme)
js/grammar.js         morphology engine (declensions, conjugations, parse index)
js/words.js           word bank (~100 lemmas, chapter-tagged)
js/chapters.js        chapter ↔ grammar alignment
js/passages.js        original unseen passages with gloss + translation
js/firebase-config.js Firebase web config (placeholder until you paste yours)
js/app.js             UI + drills + XP + auth logic
firebase.json         hosting config (public = current dir; txt/pdf ignored)
```

## Run locally

Any static server works:

```bash
cd latin-revision
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy to Firebase

No Firebase project is needed until you actually want the site (or cloud accounts) live.
At that point:

```bash
# 1. install the CLI once
npm install -g firebase-tools

# 2. log in and create/choose a project at console.firebase.google.com
firebase login

# 3. edit .firebaserc → replace YOUR-FIREBASE-PROJECT-ID with your project id
#    (or run `firebase use --add <project-id>`)

# 4. deploy
firebase deploy
```

Your site will be at `https://<project-id>.web.app`.

Notes:
- `firebase.json`'s `ignore` list keeps your local text/PDF scans out of hosting — they
  are personal copies and are only ever read locally in the Reader tab.
- `firebase init hosting` is *not* needed; config is already provided.
- To add more words, append to the lists in `js/words.js`
  (nouns: `{decl, stem, nom?, g, c}` · verbs: `{p:[4 parts], conj, c}` ·
  adjectives `{decl:'adj12'|'adj3'|'comp', stem, c, meaning}` — `c` = first chapter).
- Chapter gate: everything unlocks cumulatively from the chapter chosen in the header.

## Progress data

Stored in the browser's `localStorage`, namespaced per account
(`cursus_u_<id>_cursus_*` keys, session marker `cursus_session`).
Clearing site data resets stats.
