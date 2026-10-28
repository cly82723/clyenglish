# Weekly Challenge backend: setup guide

The league runs on a Google Sheet with a small script attached. You set it up once, about 15 minutes in total.
The full design is in `docs/weekly-challenge.md`.

Use your **personal Gmail** for everything below. Nothing needs the school's IT. The sheet holds students' school emails, classes, numbers and results, and lives in your own Google Drive; it is cleared automatically on 31 August.

## Before you start: check the codes will arrive

Students sign in with a 6-digit code emailed to their school address from your Gmail. Some schools only let student mailboxes receive mail from inside the school.
Send an ordinary email from your Gmail to one student's school address and ask them whether it arrived (inbox or spam). If it never arrives, stop here and tell me; we'll switch to printed codes instead.

## Step 1. Create the Sheet and paste in the script

1. Go to <https://sheets.new>. Name the sheet `CLY English League`.
2. Click **Extensions → Apps Script**. A code editor opens.
3. Click the gear icon (**Project Settings**) and tick **Show "appsscript.json" manifest file in editor**.
4. Back in the **Editor**, create one file for each file in this folder and paste its contents in:

   | File in this folder | In the Apps Script editor |
   |---|---|
   | `appsscript.json` | Replace the contents of the existing `appsscript.json` |
   | `Logic.gs` | **+ → Script**, name it `Logic` |
   | `Sheets.gs` | **+ → Script**, name it `Sheets` |
   | `Auth.gs` | **+ → Script**, name it `Auth` |
   | `Code.gs` | Replace the contents of the existing `Code.gs` |
   | `Actions.gs` | **+ → Script**, name it `Actions` |
   | `Setup.gs` | **+ → Script**, name it `Setup` |

5. Click **Save** (the disk icon).

## Step 2. Run the setup once

1. At the top of the editor, choose the function **setup** from the drop-down and click **Run**.
2. Google asks for permission. Click **Review permissions** and choose your account.
   Google may say **"Google hasn't verified this app"**. That is normal for a script you wrote yourself: click **Advanced → Go to CLY English League (unsafe)**, then **Allow**.
   The script asks to: edit this one spreadsheet, send email as you (the sign-in codes) and run on a schedule (to delete student data on 31 August).
3. Go back to the Sheet and reload it. You'll see five tabs: **Season, Students, Attempts, Challenges, Sessions**, and a **CLY League** menu.
4. In the **Season** tab, type the season start date (e.g. `2026-11-02`) next to "Season start". Leave "Season end" empty until you know it.

## Step 3. Fill in the class list

The **Students** tab is the class list: only these emails can sign in.
Each row is one student: `Email` (their school email), `Class` (e.g. `4C`) and `Number` (e.g. `12`). I'll prepare this from your list so you can paste it in.

## Step 4. Publish the web app

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
   - Description: `CLY League v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
3. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`). Send it to me; it goes into `challenge.html`.
4. To check it works, open the URL in your browser. You should see:
   `{"ok":true,"service":"CLY English Weekly Challenge"}`

When you change the script later, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**, so the URL stays the same.

## How students sign in

1. They type their school email (just the part before the @ is enough).
2. A 6-digit code arrives in their school inbox. It works for 10 minutes; after 5 wrong tries it stops working and they ask for a new one.
3. They type the code. That device stays signed in for the rest of the year, until they press **Sign out** (do this on shared school computers).

A classmate who types someone else's email gets nowhere without access to that inbox.

## Using the Sheet during the year

- **Students tab**: add a student by adding a row. Fix a wrong class or number here; their results follow them. Deleting a student's row signs them out everywhere.
- **Challenges tab**: one row per challenge.
  - `Week`: the Monday it runs (e.g. `2026-11-09`). Leave it empty for backups.
  - `Format`: `cloze` or `proofreading`.
  - `Status`: `approved` (runs in its week), `backup` (used automatically if a week has no approved set), `used` (a backup that has run), or `draft` (ignored).
  - If a backup has already gone live for a week, a set you approve later for that same week is ignored, so nobody is marked against a different passage. Give it a later Monday instead.
  - `Data`: the challenge content. I prepare this for you; you don't need to edit it by hand.
- **Attempts tab**: one row per student per week.
  - `Switches` and `Away (s)`: how many times they left the page for more than 3 seconds, and for how long in total.
  - `Reopened`: how many times they closed and reopened the challenge.
  - `Late`: their answers arrived after the 20 minutes.
  - To disqualify an attempt, type `yes` in **Disqualified**. It drops out of the board and the league.
- **Sessions tab**: one row per signed-in device. You can ignore it. Deleting a row signs that device out. It never holds anything that could be used to sign in.
- **CLY League → Show league table**: writes the season table, with emails, into a **League** tab, so you know who to give prizes to.
- **31 August**: the Students, Attempts, League and Sessions tabs are cleared automatically. Challenges and season dates are kept. **CLY League → Delete all student data now** does the same thing straight away.

## Teacher trial page

`challenge-trial.html` is the student page for invited testers, with a cloze and a proofreading set to try once each. Nothing on it counts towards the students' league, and testers see the answers as soon as they hand in.

- In the **Students** tab, type `Tester` in the first empty heading cell of row 1 (column D), then `yes` in that column for each tester. Testers must be on the class list; nobody else can sign in on the trial page.
- In the **Challenges** tab, the trial sets are rows with Status `trial` (one `cloze`, one `proofreading`).
- To let a tester try a paper again, delete their row in the **Attempts** tab (its Week is `trial-cloze` or `trial-proofreading`).
- Before launch, clear the `yes` marks (or leave them: testers only differ on the trial page).

## If something goes wrong

- **A student's code doesn't arrive**: ask them to check spam, and to wait a minute before asking again. If no student ever gets one, the school blocks outside mail; tell me and we'll switch to printed codes.
- **"That email isn't on the class list"**: check the spelling in the Students tab.
- **"No more codes can be sent today"**: a personal Gmail can send about 100 script emails a day. Each student needs one only when signing in on a new device, so this should only happen if lots of students sign in on many devices on the same day.
