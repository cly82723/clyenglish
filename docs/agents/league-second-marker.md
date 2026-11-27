# League papers: drafting and the blind second marker

How an agent prepares weekly challenge papers for CLY. The goal: **no student loses a mark for a right answer.**

## Never put answers in this repo

This repo is public and is the website. The question bank (`bank.json`), and everything made from it (`challenges.tsv`, `review.html`, `second-marker.md`, `blind/*.answers.json`), holds answers, so it lives **outside** the repo: on CLY's computer (`C:\Users\CaL\cly-league-bank\`) or in a private repository. `.gitignore` refuses those file names as a safety net. The tools and this procedure hold no answers and stay here.

## The steps

1. **Draft** (only when CLY asks for new sets): write sets into `bank.json` in the shape the existing sets use, following the league rules in `docs/weekly-challenge.md` and, for S.3, the topic limits at the top of `tools/challenge-bank.js`. Every new set has an empty `week` until CLY places it.
2. **Structural check:** `node tools/challenge-bank.js <bank folder>` (add `s3` for the S.3 league). Fix everything it reports. It must say "All N sets pass".
3. **Blind copies:** `node tools/second-marker.js blind <bank folder>` writes `blind/set-N.md`, each set exactly as students see it, with no answers.
4. **Second marker, one fresh agent per set:**
   - Start a new subagent for each set. Give it **only** the text of that `set-N.md`. Tell it not to read or search any files. It must never see `bank.json`, `review.html`, or another set's answers.
   - Save its reply, the JSON object alone, as `blind/set-N.answers.json`.
   - The agent that drafted the sets must not be the second marker: it knows the intended answers.
5. **Compare:** `node tools/second-marker.js compare <bank folder>` marks every second-marker answer with the web app's own marking and writes `second-marker.md`.
   - **Possibly unfair**: a right answer the key marks wrong, or an accidental mistake on a line meant to be correct. These must be settled before the set is used.
   - **Check the key**: the second marker did not accept one of the key's answers. Often fine, but read it.
6. **Propose fixes, don't make them:** for each "possibly unfair" item, suggest either adding the answer to the key (`answers` for a cloze blank, `alsoRight` for a proofreading line) or rewriting the sentence so only one answer fits. **CLY decides.** Apply only the fixes CLY approves, then go back to step 2.
7. **CLY approves:** CLY reads `review.html` and `second-marker.md`, then pastes `challenges.tsv` into the Challenges tab. Every row starts as `draft`.

## What the second marker is not

It is a second opinion, not a judge. It can be wrong in both directions. Its job is to make sure CLY looks at every blank where a fair teacher might disagree with the key, before a student meets it.
