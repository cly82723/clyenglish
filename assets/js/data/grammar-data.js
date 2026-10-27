/* S.4 grammar content, carried over from the earlier CLY English revision app. */

(function () {

"use strict";

const normalise = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim();

const TIMES = ["Past", "Present", "Future"];
const ASPECTS = ["Simple", "Continuous", "Perfect", "Perfect Continuous"];

const tenseMatrix = {
    "Past Simple": { formula: "S + V2", use: "A completed action at a specific time in the past.", signals: "yesterday, last week, in 2010, ago", examples: ["He finished the paper yesterday.", "I visited Tai O last summer."], tip: "Don't mix it with 'since' or 'ever': those usually need the Present Perfect." },
    "Past Continuous": { formula: "S + was/were + V-ing", use: "An action in progress at a past moment, often interrupted by a Past Simple action.", signals: "while, when, at 8 pm yesterday", examples: ["I was studying when the phone rang.", "While I was revising, the power went out."], tip: "The long background action takes Past Continuous; the short interruption takes Past Simple." },
    "Past Perfect": { formula: "S + had + V3", use: "An action completed before another past action: the \"past of the past\".", signals: "by the time, before, after, already", examples: ["He had left before I arrived.", "The bus had left before we reached the stop."], tip: "Only use it when there are two past events and you need to show which happened first." },
    "Past Perfect Continuous": { formula: "S + had been + V-ing", use: "The duration of an ongoing action up to a point in the past.", signals: "for hours before, since, how long", examples: ["They had been waiting for an hour before the bus came.", "She had been studying for hours before she took a break."], tip: "Look for a duration (for an hour) plus a later past event (before the bus came)." },
    "Present Simple": { formula: "S + V1 (s/es)", use: "Facts, habits, routines and fixed timetables.", signals: "always, usually, every day, often", examples: ["She writes excellent essays.", "The MTR runs every three minutes during rush hour."], tip: "Remember the -s/-es with he, she and it: a very common Paper 2 slip." },
    "Present Continuous": { formula: "S + am/is/are + V-ing", use: "Actions happening now, temporary situations, or fixed future arrangements.", signals: "now, at the moment, currently, these days", examples: ["We are practising for the DSE now.", "We are meeting our tutor this Friday."], tip: "Stative verbs (know, believe, own, need) are rarely used in the continuous form." },
    "Present Perfect": { formula: "S + have/has + V3", use: "Past actions with present relevance, life experiences, or unfinished time periods.", signals: "already, yet, ever, never, recently, since, for", examples: ["I have already finished Paper 1.", "Hong Kong has become more environmentally aware."], tip: "Never use it with a finished time expression like 'yesterday' or 'in 2019'." },
    "Present Perfect Continuous": { formula: "S + have/has been + V-ing", use: "An action that started in the past and is still continuing, stressing duration.", signals: "lately, all morning, for, since, recently", examples: ["She has been studying all morning.", "Residents have been protesting for months."], tip: "Choose it over the Present Perfect when you want to stress how long, not how much." },
    "Future Simple": { formula: "S + will + V1", use: "Predictions, promises and spontaneous decisions.", signals: "tomorrow, next year, I think, probably", examples: ["They will announce the results tomorrow.", "I think technology will replace many jobs."], tip: "For predictions based on evidence you can see now, use 'be going to' instead." },
    "Future Continuous": { formula: "S + will be + V-ing", use: "An action in progress at a specific future time.", signals: "at this time tomorrow, at 9 am next Monday", examples: ["At 9 AM tomorrow, I will be sitting the exam.", "In five years, I will be working as an engineer."], tip: "Picture yourself in the middle of the action at that future moment." },
    "Future Perfect": { formula: "S + will have + V3", use: "An action that will be completed before a future point.", signals: "by next month, by 2030, by the time", examples: ["By April, I will have completed all past papers.", "By June, I will have completed my SBA."], tip: "'By + future time' is the key signal: the action is finished before that point." },
    "Future Perfect Continuous": { formula: "S + will have been + V-ing", use: "The duration of an action up to a future point.", signals: "by next year … for X years", examples: ["By next year, I will have been learning English for 12 years.", "By 2030, I will have been living here for 15 years."], tip: "You need both a future point (by next year) and a duration (for 12 years)." }
};

// Timeline for each tense, drawn from its first example. Positions run 0 (past) → 50 (now) → 100 (future).
// point = a single completed action, span = an action in progress / lasting, result = past action still relevant now,
// ref = a reference time (shown below the axis), repeat = a habit.
const tenseTimelines = {
    "Past Simple": [{ type: "point", at: 25, label: "finished the paper" }, { type: "ref", at: 25, label: "yesterday" }],
    "Past Continuous": [{ type: "span", from: 10, to: 38, label: "was studying" }, { type: "point", at: 28, label: "phone rang", below: true }],
    "Past Perfect": [{ type: "point", at: 14, label: "① had left" }, { type: "point", at: 34, label: "② I arrived" }],
    "Past Perfect Continuous": [{ type: "span", from: 8, to: 34, label: "had been waiting (an hour)" }, { type: "point", at: 34, label: "bus came", below: true }],
    "Present Simple": [{ type: "repeat", from: 10, to: 90, label: "writes excellent essays (habit)" }],
    "Present Continuous": [{ type: "span", from: 40, to: 60, label: "are practising now" }],
    "Present Perfect": [{ type: "result", from: 30, to: 50, label: "have already finished Paper 1" }],
    "Present Perfect Continuous": [{ type: "span", from: 22, to: 50, label: "has been studying (all morning)" }],
    "Future Simple": [{ type: "point", at: 74, label: "will announce the results" }, { type: "ref", at: 74, label: "tomorrow" }],
    "Future Continuous": [{ type: "span", from: 62, to: 86, label: "will be sitting the exam" }, { type: "ref", at: 72, label: "9 AM tomorrow" }],
    "Future Perfect": [{ type: "point", at: 66, label: "will have completed" }, { type: "ref", at: 84, label: "by April" }],
    "Future Perfect Continuous": [{ type: "span", from: 10, to: 84, label: "will have been learning English (12 years)" }, { type: "ref", at: 84, label: "by next year" }]
};

const GENERIC_TENSE_HINT = "Find the time signal in the sentence. When does the action happen, and is it finished, in progress or repeated?";

const PASSIVE_EXAMPLES = [
    { doer: "The government", action: "built", passive: "was built", receiver: "the new MTR line", tail: "in 2022", tense: "Past Simple" },
    { doer: "Students", action: "recycle", passive: "are recycled", receiver: "plastic bottles", tail: "every week", tense: "Present Simple" },
    { doer: "The principal", action: "will announce", passive: "will be announced", receiver: "the results", tail: "tomorrow", tense: "Future Simple" },
    { doer: "Someone", action: "has stolen", passive: "has been stolen", receiver: "my Octopus card", tail: "", tense: "Present Perfect", dropBy: true }
];

const PASSIVE_TENSES = [
    ["Present Simple", "am/is/are + V3", "English **is spoken** in many countries."],
    ["Present Continuous", "am/is/are being + V3", "The library **is being renovated** this month."],
    ["Present Perfect", "have/has been + V3", "Ten new cycle tracks **have been opened** since 2020."],
    ["Past Simple", "was/were + V3", "The Peak Tram **was opened** in 1888."],
    ["Past Continuous", "was/were being + V3", "The hall **was being cleaned** when we arrived."],
    ["Past Perfect", "had been + V3", "The tickets **had been sold out** before we got there."],
    ["Future Simple", "will be + V3", "The winners **will be announced** on Friday."],
    ["Future Perfect", "will have been + V3", "By 2030, the old pier **will have been replaced**."],
    ["Modal verbs", "can/must/should + be + V3", "Plastic bottles **can be recycled**."]
];

const NOUN_SLOTS = [
    { role: "Subject", before: "", noun: "Football", gerund: "Playing football", after: " is popular in Hong Kong." },
    { role: "Object of a verb", before: "I really enjoy ", noun: "music", gerund: "listening to music", after: " after school." },
    { role: "After a preposition", before: "She is good at ", noun: "maths", gerund: "solving problems", after: "." },
    { role: "After \"to\" (a preposition)", before: "We are looking forward to ", noun: "the holidays", gerund: "going to Japan", after: "." },
    { role: "Complement", before: "My favourite hobby is ", noun: "photography", gerund: "taking photos", after: "." }
];

const MEANING_PAIRS = [
    { verb: "remember", ing: { s: "I **remember locking** the door.", m: "I locked it, and now I have the memory.", t: ["locked the door", "remember it"] }, to: { s: "**Remember to lock** the door.", m: "Remember first, then do the job.", t: ["remember", "lock the door"] } },
    { verb: "forget", ing: { s: "I'll never **forget meeting** my idol.", m: "It happened; the memory stays.", t: ["met my idol", "(never) forget it"] }, to: { s: "He **forgot to bring** his calculator.", m: "He didn't remember, so it never happened.", t: ["forgot", "(didn't) bring it"] } },
    { verb: "stop", ing: { s: "My dad **stopped smoking** last year.", m: "Smoking was going on, then it ended.", t: ["smoking", "stopped"] }, to: { s: "We **stopped to buy** some fish balls.", m: "We stopped walking in order to buy them.", t: ["stopped walking", "buy fish balls"] } },
    { verb: "regret", ing: { s: "I **regret not revising** harder.", m: "Something in the past I now feel bad about.", t: ["didn't revise", "regret it"] }, to: { s: "We **regret to inform** you that the trip is cancelled.", m: "Formal: sorry about what I'm about to say.", t: ["feel sorry", "inform you"] } },
    { verb: "try", ing: { s: "**Try drinking** some warm water for your sore throat.", m: "Do it as an experiment and see if it works.", t: null }, to: { s: "I **tried to open** the window, but it was stuck.", m: "Make an effort to do something difficult.", t: null } }
];

const VERB_PATTERNS = [
    { label: "+ V-ing", style: "bg-emerald-50 border-emerald-200 text-emerald-900", verbs: ["enjoy", "avoid", "finish", "mind", "consider", "suggest", "deny", "keep", "practise", "admit", "risk", "miss", "imagine", "give up", "put off", "can't help", "can't stand", "feel like"], example: "Would you **mind turning** down the music?" },
    { label: "+ to-infinitive", style: "bg-blue-50 border-blue-200 text-blue-900", verbs: ["want", "decide", "hope", "plan", "agree", "refuse", "promise", "manage", "afford", "offer", "seem", "learn", "fail", "expect", "aim", "tend", "arrange", "pretend"], example: "We **decided to take** the ferry to Lamma Island." },
    { label: "+ object + to-infinitive", style: "bg-indigo-50 border-indigo-200 text-indigo-900", verbs: ["ask", "tell", "allow", "encourage", "advise", "remind", "persuade", "invite", "warn", "teach", "force", "want"], example: "My teacher **encouraged me to join** the debate team." },
    { label: "+ object + bare infinitive (no \"to\")", style: "bg-rose-50 border-rose-200 text-rose-900", verbs: ["make", "let", "help (to optional)", "see / hear sb"], example: "Mum **let me stay** up late, but she **made me finish** my homework first." },
    { label: "Both, same meaning", style: "bg-slate-50 border-slate-200 text-slate-800", verbs: ["begin", "start", "continue", "like", "love", "hate", "prefer"], example: "It **started raining / started to rain** at noon." }
];

const LESSONS = {
    passive: {
        title: "The Passive Voice",
        intro: "In an active sentence, the subject does the action. In a passive sentence, the subject receives the action. Use the passive when the action, or the thing it happened to, matters more than who did it.",
        form: [
            { label: "Basic formula", formula: "receiver + be + V3 (+ by + doer)", example: "The bridge **was built** (by a Japanese company)." },
            { label: "Negative", formula: "be + not + V3", example: "Food **is not allowed** in the library." },
            { label: "Question", formula: "be + receiver + V3?", example: "**Were** you **chosen** for the team?" },
            { label: "With a modal", formula: "modal + be + V3", example: "Masks **must be worn** in the clinic." }
        ],
        visualTitle: "See it: how active becomes passive",
        visual: "passive-diagram",
        extraTitle: "The passive in every tense",
        extra: "passive-tenses",
        functions: [
            { title: "The doer is unknown", text: "We don't know who did it.", examples: ["My bike **was stolen** outside the MTR station.", "The wallet **was found** under a seat."] },
            { title: "The doer is obvious or unimportant", text: "Everyone knows who did it, or it doesn't matter.", examples: ["The suspect **has been arrested**. (by the police: obvious)", "Lunch **is served** at 12:30."] },
            { title: "Focus on the receiver or result", text: "Put the important idea first, which is useful for keeping the topic of a paragraph steady.", examples: ["The Star Ferry is a symbol of Hong Kong. It **was founded** in 1888.", "Over 3,000 tonnes of food **are thrown away** every day."] },
            { title: "Formal and factual writing", text: "Reports, news, science and instructions sound objective in the passive.", examples: ["A survey **was conducted** among 200 students.", "The mixture **is heated** to 100°C."] },
            { title: "Reporting opinions", text: "It + be + said/believed/thought + that …: common in articles and reports.", examples: ["**It is believed** that the tunnel will open next year.", "The singer **is said to be** shy in real life."] },
            { title: "Have/get something done", text: "Someone else does a job for you (the causative).", examples: ["I **had my hair cut** in Mong Kok yesterday.", "You should **get your eyes tested**."] }
        ],
        mistakes: [
            { wrong: "The accident was happened at 3 am.", right: "The accident happened at 3 am.", why: "Verbs with no object (happen, arrive, die, appear, occur) cannot be passive." },
            { wrong: "The new library opened by the Chief Executive.", right: "The new library was opened by the Chief Executive.", why: "The passive needs \"be\". Without it, the sentence says the library did the opening." },
            { wrong: "The photos were took by my cousin.", right: "The photos were taken by my cousin.", why: "Use the past participle (V3), not the past simple (V2)." },
            { wrong: "Plastic can recycled easily.", right: "Plastic can be recycled easily.", why: "After a modal, the passive is modal + be + V3." },
            { wrong: "The results will announced on Friday.", right: "The results will be announced on Friday.", why: "Future passive: will + be + V3." },
            { wrong: "This problem must be solve soon.", right: "This problem must be solved soon.", why: "After \"be\" in a passive, the verb is always V3." }
        ],
        tip: "In proofreading, check every \"be + verb\": a passive needs V3 (was built, not was build). Then check every past participle has its \"be\". Watch out for \"was happened\" and \"is occurred\": favourite exam traps."
    },
    gerunds: {
        title: "Gerunds (V-ing as a noun)",
        intro: "A gerund is the -ing form of a verb used as a noun. It names an activity, so it can go anywhere a noun can: as a subject, as an object, or after a preposition.",
        form: [
            { label: "Basic form", formula: "V + -ing", example: "**Reading** helps your writing." },
            { label: "Negative", formula: "not + V-ing", example: "I regret **not joining** the trip." },
            { label: "Passive gerund", formula: "being + V3", example: "Nobody likes **being ignored**." },
            { label: "Perfect gerund", formula: "having + V3", example: "He denied **having cheated** in the test." }
        ],
        spelling: ["make → making (drop the silent e)", "run → running, shop → shopping (double the last consonant after a short stressed vowel)", "lie → lying, die → dying (ie → y)", "panic → panicking (add k)", "visit → visiting, open → opening (no doubling: the stress isn't on the last syllable)"],
        visualTitle: "See it: a gerund fills a noun slot",
        visual: "gerund-slots",
        functions: [
            { title: "As the subject", text: "The gerund is the topic of the sentence. The verb after it is singular.", examples: ["**Swimming** is good for your health.", "**Using** phones in class is not allowed."] },
            { title: "After certain verbs", text: "enjoy, avoid, finish, mind, keep, suggest, consider, practise, admit, deny, miss, risk, give up, can't help.", examples: ["I **enjoy hiking** on Dragon's Back.", "She **suggested taking** the minibus."] },
            { title: "After prepositions", text: "in, on, at, of, for, about, by, without, before, after, instead of: always + V-ing.", examples: ["He is interested **in joining** the band.", "**After finishing** my homework, I went out."] },
            { title: "After \"to\" when it is a preposition", text: "look forward to, be used to, get used to, object to, be committed to, when it comes to. Test: if a noun fits after \"to\", use V-ing.", examples: ["I look forward **to hearing** from you.", "She is used **to waking** up early."] },
            { title: "After fixed expressions", text: "It's no use, It's (not) worth, There's no point (in), have difficulty (in), spend/waste time, be busy, can't stand, feel like.", examples: ["It's **no use crying** over spilt milk.", "I **spent** the weekend **revising** for the test."] },
            { title: "Go + V-ing for activities", text: "go shopping, go swimming, go hiking, go camping.", examples: ["Let's **go hiking** in Sai Kung this Sunday."] }
        ],
        compare: { title: "Gerund or continuous tense?", text: "Both end in -ing, but they do different jobs.", rows: [["Gerund = a noun", "**Cooking** is my hobby.", "You can replace it with a noun: Music is my hobby."], ["Continuous tense = part of the verb", "My mum **is cooking** dinner.", "It follows am/is/are/was/were and shows an action in progress."]] },
        mistakes: [
            { wrong: "I'm looking forward to meet you.", right: "I'm looking forward to meeting you.", why: "\"To\" here is a preposition, so it is followed by V-ing." },
            { wrong: "Swim in the sea is fun.", right: "Swimming in the sea is fun.", why: "The subject must be a noun, so use the gerund." },
            { wrong: "He is good at play the guitar.", right: "He is good at playing the guitar.", why: "After a preposition (at), use V-ing." },
            { wrong: "I enjoy to watch Korean dramas.", right: "I enjoy watching Korean dramas.", why: "\"Enjoy\" is followed by V-ing, never a to-infinitive." },
            { wrong: "Thank you for help me.", right: "Thank you for helping me.", why: "\"For\" is a preposition, so V-ing follows." },
            { wrong: "Reading comics are my favourite pastime.", right: "Reading comics is my favourite pastime.", why: "A gerund subject is singular: \"is\", not \"are\"." }
        ],
        tip: "In proofreading, circle every preposition and check the verb after it: it must be V-ing. Be extra careful with \"look forward to\", \"be used to\" and \"object to\": the \"to\" looks like an infinitive, but it isn't."
    },
    infinitives: {
        title: "To-infinitives (to + V1)",
        intro: "A to-infinitive is \"to\" + the base form of a verb. It often points forward, to a purpose, a plan or something that hasn't happened yet.",
        form: [
            { label: "Basic form", formula: "to + V1", example: "I want **to study** abroad." },
            { label: "Negative", formula: "not + to + V1", example: "She told me **not to worry**." },
            { label: "Passive", formula: "to be + V3", example: "Everyone wants **to be respected**." },
            { label: "Perfect", formula: "to have + V3", example: "He seems **to have forgotten** my name." }
        ],
        visualTitle: "See it: same verb, different meaning",
        visual: "meaning-pairs",
        extraTitle: "Which pattern does the verb take?",
        extra: "verb-patterns",
        functions: [
            { title: "Purpose: why?", text: "to / in order to / so as to + V1.", examples: ["I went to the library **to borrow** a book.", "We left early **in order to catch** the first bus."] },
            { title: "After certain verbs", text: "want, decide, hope, plan, agree, refuse, promise, manage, afford, offer, seem, learn, fail.", examples: ["We **decided to join** the beach clean-up.", "I can't **afford to buy** a new phone."] },
            { title: "Verb + object + to-infinitive", text: "ask, tell, allow, encourage, advise, remind, persuade, invite, warn.", examples: ["The teacher **reminded us to bring** our calculators.", "My parents **allowed me to go** to the concert."] },
            { title: "After adjectives", text: "happy/glad/sorry to, easy/hard to, It is + adjective (+ for sb) + to.", examples: ["I was **glad to hear** the news.", "**It is important for** students **to sleep** well."] },
            { title: "With too and enough", text: "too + adjective + to; adjective + enough + to.", examples: ["The tea is **too hot to drink**.", "He is **old enough to vote**."] },
            { title: "After question words, nouns and \"first/last/only\"", text: "how/what/where to; a chance/plan/decision to; the first to.", examples: ["I don't know **what to do**.", "She was **the first to arrive**.", "This is **a great chance to practise** English."] }
        ],
        compare: { title: "No \"to\" after these", text: "Some verbs take the bare infinitive (V1 without \"to\").", rows: [["Modal verbs", "You **should see** a doctor.", "can, could, will, would, shall, should, may, might, must + V1"], ["make / let + object", "The film **made me cry**. Mum **let me go**.", "But in the passive, \"to\" comes back: I was made **to wait**."]] },
        mistakes: [
            { wrong: "I decided join the drama club.", right: "I decided to join the drama club.", why: "\"Decide\" is followed by a to-infinitive." },
            { wrong: "She managed to finished the race.", right: "She managed to finish the race.", why: "After \"to\", always use the base form (V1)." },
            { wrong: "My parents let me to stay out late.", right: "My parents let me stay out late.", why: "\"Let\" and \"make\" are followed by object + V1, without \"to\"." },
            { wrong: "He is too tired for walk home.", right: "He is too tired to walk home.", why: "too + adjective + to-infinitive." },
            { wrong: "I went to the bank for withdraw money.", right: "I went to the bank to withdraw money.", why: "Purpose is shown with \"to\" + V1, not \"for\" + V1." },
            { wrong: "We hope seeing you soon.", right: "We hope to see you soon.", why: "\"Hope\" is followed by a to-infinitive." }
        ],
        tip: "In proofreading, check the word after every \"to\": is \"to\" part of an infinitive (needs V1), or a preposition (needs V-ing)? Then check verbs like decide, hope and manage haven't lost their \"to\", and that make and let haven't gained one."
    }
};

const FOCUS_TABS = { "Passive Voice": "passive", "Gerunds": "gerunds", "To-infinitives": "infinitives" };

const applyMark = (words, a) => {
    const out = [...words];
    // A changed word keeps the punctuation around the original unless the student typed their own.
    if (a.type === "replace") {
        const [, before, , after] = out[a.at].match(/^([^\w'-]*)(.*?)([^\w'-]*)$/);
        out[a.at] = /^[^\w'-]|[^\w'-]$/.test(a.word) ? a.word : before + a.word + after;
    }
    if (a.type === "insert") out.splice(a.at, 0, a.word);
    if (a.type === "delete") out.splice(a.at, 1);
    return out;
};

// The built-in passage marks each mistake in place: [[wrong>right]] changes a word, [[>right]] adds one and [[wrong>]] deletes one.
const parseProofLine = (text) => {
    const m = text.match(/\[\[([^\]>]*)>([^\]]*)\]\]/);
    if (!m) return { words: text.split(/\s+/), fixed: text.split(/\s+/), error: null };
    const words = text.replace(m[0], m[1] ? "\u0000" : " \u0000 ").trim().split(/\s+/);
    const at = words.findIndex(w => w.includes("\u0000"));
    let error;
    if (!m[1]) { words.splice(at, 1); error = { type: "insert", at, answers: [m[2]] }; }
    else { words[at] = words[at].replace("\u0000", m[1]); error = m[2] ? { type: "replace", at, answers: [m[2]] } : { type: "delete", at, answers: [] }; }
    return { words, fixed: applyMark(words, { ...error, word: m[2] }), error };
};

const CORRECTION_KIND = { replace: "change one word", insert: "add a missing word", delete: "delete an unnecessary word" };

const CONDITIONALS = ["Zero Conditional", "First Conditional", "Second Conditional", "Third Conditional"];

const conditionalMatrix = {
    "Zero Conditional": {
        short: "Zero", ifPart: "If + Present Simple", mainPart: "Present Simple", time: "Any time: always", reality: "Real: always true",
        meaning: "When A happens, B always happens.",
        use: "Facts, science, rules and habits: whenever the condition happens, the result always follows.",
        signals: "if = when / whenever, always, every time, usually",
        examples: ["If you heat ice, it melts.", "If the Black Rainstorm Signal is raised, classes are suspended.", "If I drink bubble tea after 6 pm, I can't sleep."],
        tip: "Test it: if you can swap 'if' for 'when' and the meaning stays the same, it's a Zero Conditional. Never use 'will' here.",
        diagram: { a: "heat ice", b: "it melts" }
    },
    "First Conditional": {
        short: "First", ifPart: "If + Present Simple", mainPart: "will + V1", time: "Future", reality: "Real: possible, likely",
        meaning: "A might really happen, and then B will happen.",
        use: "A real possibility in the future and its likely result. Also used for warnings, promises and plans.",
        signals: "tomorrow, next week, unless (= if … not), as soon as, in case",
        examples: ["If it rains tomorrow, the sports day will be postponed.", "If you take the MTR, you will get there in 20 minutes.", "Unless you book now, the concert tickets will sell out."],
        tip: "Never put 'will' in the if-clause: ✗ If it will rain tomorrow … ✓ If it rains tomorrow … The main clause can also use can, may, might or an order (Call me if you need help).",
        diagram: { a: "it rains tomorrow", b: "sports day will be postponed", c: "it doesn't rain", d: "sports day goes ahead" }
    },
    "Second Conditional": {
        short: "Second", ifPart: "If + Past Simple", mainPart: "would + V1", time: "Now or future", reality: "Unreal: imaginary, unlikely",
        meaning: "A isn't true now (or probably won't happen), but imagine it.",
        use: "Imaginary or very unlikely situations in the present or future, dreams, and advice (If I were you …).",
        signals: "If I were you, imagine, suppose, wish-like dreams, 'but …' showing reality",
        examples: ["If I won the Mark Six, I would buy my parents a flat.", "If I were you, I would apologise to her.", "If there were an MTR station near my home, I would never be late."],
        tip: "The Past Simple here does NOT mean past time: it means 'not real'. Use 'were' for every person in formal writing (If he were …).",
        diagram: { a: "won the Mark Six", b: "would buy a flat", real: "reality: I haven't won" }
    },
    "Third Conditional": {
        short: "Third", ifPart: "If + had + V3", mainPart: "would have + V3", time: "Past", reality: "Unreal: impossible now",
        meaning: "A didn't happen in the past, so B didn't happen either. It's too late to change.",
        use: "Imagining a different past: regrets, blame, relief and criticism about things that already happened.",
        signals: "yesterday, last night, last year, but I didn't, I regret, if only",
        examples: ["If I had set my alarm, I wouldn't have missed the bus.", "If we had booked earlier, we would have got tickets for the concert.", "If Kelvin hadn't forgotten his Octopus card, he wouldn't have had to walk home."],
        tip: "There's no 'would' in the if-clause: ✗ If I would have known … ✓ If I had known … Both halves look back at the past.",
        diagram: { a: "set my alarm", b: "wouldn't have missed the bus", real: "reality: no alarm → missed the bus" }
    }
};

// The matrix: how real a situation is, against when it happens. Two cells are left empty on purpose.
const REALITY = ["Real", "Unreal"];
const COND_TIMES = ["Always", "Now & future", "Past"];
const COND_CELLS = {
    "Real-Always": "Zero Conditional",
    "Real-Now & future": "First Conditional",
    "Real-Past": "Real past events are facts, so just use past tenses: When it rained, we stayed in.",
    "Unreal-Always": "A general fact can't be imaginary, so there's no conditional here.",
    "Unreal-Now & future": "Second Conditional",
    "Unreal-Past": "Third Conditional"
};

const COND_IDEAS = [
    {
        label: "Rain & the picnic",
        rows: [
            ["If it [[rains]], picnics {{are}} cancelled.", "A general rule: it happens every time."],
            ["If it [[rains]] tomorrow, the picnic {{will be}} cancelled.", "The forecast says it might rain: a real chance."],
            ["If it [[rained]] today, the picnic {{would be}} cancelled.", "It's sunny now. We're only imagining rain."],
            ["If it [[had rained]] yesterday, the picnic {{would have been}} cancelled.", "It didn't rain, so the picnic went ahead."]
        ]
    },
    {
        label: "Revision & the test",
        rows: [
            ["If you [[revise]] a little every day, you {{remember}} more.", "This is always true for everyone."],
            ["If I [[revise]] tonight, I {{will pass}} the test tomorrow.", "I can still revise tonight: it's possible."],
            ["If I [[revised]] every night, I {{would pass}} every test.", "I don't revise every night. It's an imagined habit."],
            ["If I [[had revised]] last night, I {{would have passed}} the test.", "I didn't revise, and I failed. Too late now!"]
        ]
    },
    {
        label: "MTR & being on time",
        rows: [
            ["If you [[take]] the MTR, you {{avoid}} traffic jams.", "A general fact about the MTR."],
            ["If we [[take]] the MTR, we {{will arrive}} on time.", "We haven't left yet: we can still choose the MTR."],
            ["If there [[were]] an MTR station near my home, I {{would arrive}} on time every day.", "There isn't one. It's imaginary."],
            ["If we [[had taken]] the MTR, we {{would have arrived}} on time.", "We took a taxi and got stuck in traffic."]
        ]
    }
];

const GENERIC_COND_HINT = "Ask yourself two questions: is this real or imaginary, and is it about always, the future, now, or the past?";

const condQuizQuestions = [
    { q: "If you ______ (heat) chocolate, it melts.", options: ["heat", "will heat", "heated", "had heated"], answer: 0, conditional: "Zero Conditional", explanation: "A fact that is always true: Present Simple in both clauses.", hint: "Is this something that happens every time, like a science fact?" },
    { q: "If it rains tomorrow, the school picnic ______ (be) cancelled.", options: ["is", "will be", "would be", "would have been"], answer: 1, conditional: "First Conditional", explanation: "Rain tomorrow is a real possibility, so the result takes will + V1.", hint: "'Tomorrow': could this really happen? What do we use for a likely future result?" },
    { q: "If I ______ (win) the Mark Six, I would buy my parents a flat.", options: ["win", "will win", "won", "had won"], answer: 2, conditional: "Second Conditional", explanation: "Winning the Mark Six is an imaginary, unlikely situation, so the if-clause takes the Past Simple.", hint: "The main clause uses 'would'. Is winning likely, or just a dream?" },
    { q: "If we had left home earlier, we ______ (not miss) the ferry to Cheung Chau.", options: ["wouldn't miss", "won't miss", "wouldn't have missed", "didn't miss"], answer: 2, conditional: "Third Conditional", explanation: "'Had left' imagines a different past, so the result is would have + V3.", hint: "The if-clause looks back at the past with 'had left'. What form does the result need to match it?" },
    { q: "Which conditional is this? \"If I were you, I would apologise to her.\"", options: ["Zero Conditional", "First Conditional", "Second Conditional", "Third Conditional"], answer: 2, conditional: "Second Conditional", explanation: "'If I were you' is imaginary (I'm not you), with would + V1: Second Conditional.", hint: "Can the speaker really be the other person? Look at the verbs 'were' and 'would'." },
    { q: "If you ______ (not hurry), you will miss the last MTR train.", options: ["don't hurry", "won't hurry", "didn't hurry", "hadn't hurried"], answer: 0, conditional: "First Conditional", explanation: "A real warning about the future: Present Simple in the if-clause, will in the main clause. Never 'will' after 'if'.", hint: "The main clause already has 'will'. Which tense goes in the if-clause of a real future possibility?" },
    { q: "Plants die if they ______ (not get) enough water.", options: ["don't get", "won't get", "didn't get", "wouldn't get"], answer: 0, conditional: "Zero Conditional", explanation: "A general scientific fact: Present Simple in both clauses.", hint: "Is this true for all plants, all the time?" },
    { q: "If Ms Wong ______ (know) about the test, she would have told us.", options: ["knew", "had known", "knows", "would know"], answer: 1, conditional: "Third Conditional", explanation: "'Would have told' shows an imagined past, so the if-clause needs had + V3.", hint: "The result is 'would have told': that's about the past. What does the if-clause need to match?" },
    { q: "If I ______ (be) taller, I would join the school basketball team.", options: ["am", "were", "will be", "had been"], answer: 1, conditional: "Second Conditional", explanation: "The speaker isn't tall, so this is imaginary: Past Simple 'were' (used for all persons).", hint: "Is the speaker actually tall? Imaginary present situations step the verb back one tense." },
    { q: "Which sentence describes something that is always true?", options: ["If you press this button, the light turns on.", "If you pressed this button, the light would turn on.", "If you had pressed this button, the light would have turned on.", "If you press this button tomorrow, the light will turn on."], answer: 0, conditional: "Zero Conditional", explanation: "Present Simple in both clauses describes a fact that happens every time.", hint: "Which sentence works every single time, with no 'will' or 'would'?" },
    { q: "Unless you ______ (book) now, the tickets will sell out.", options: ["book", "will book", "booked", "had booked"], answer: 0, conditional: "First Conditional", explanation: "'Unless' means 'if … not'. It works like 'if' in the First Conditional, so it takes the Present Simple.", hint: "'Unless' = 'if not'. Which tense follows 'if' when the result uses 'will'?" },
    { q: "If Kelvin ______ (not forget) his Octopus card, he wouldn't have had to walk home.", options: ["didn't forget", "hadn't forgotten", "doesn't forget", "wouldn't forget"], answer: 1, conditional: "Third Conditional", explanation: "He did forget it (past), so the imagined past needs had + V3: hadn't forgotten.", hint: "Did this happen in the past? The result uses 'wouldn't have had'." },
    { q: "What does this mean? \"If I had studied harder, I would have passed.\"", options: ["I studied hard and passed.", "I didn't study hard, and I didn't pass.", "I might study hard and pass.", "I always pass when I study hard."], answer: 1, conditional: "Third Conditional", explanation: "The Third Conditional imagines the opposite of what really happened in the past.", hint: "'Had studied' imagines a different past. So what really happened?" },
    { q: "What does this mean? \"If I had more free time, I would learn the guitar.\"", options: ["I have lots of free time.", "I don't have much free time, so I'm not learning the guitar.", "I learnt the guitar last year.", "I will definitely learn the guitar next week."], answer: 1, conditional: "Second Conditional", explanation: "The Second Conditional imagines the opposite of the present: in reality, I don't have the time.", hint: "Past Simple + would describes something imaginary. What is the real situation now?" },
    { q: "If my phone ______ (die) right now, I would be completely lost in the city.", options: ["dies", "died", "will die", "had died"], answer: 1, conditional: "Second Conditional", explanation: "The phone is working, so this is an imagined present: Past Simple + would.", hint: "Is the phone actually dead? The main clause uses 'would be'." }
];

const defaultCondMatch = {
    title: "Rainstorms, Bubble Tea and Bad Luck",
    groups: [
        {
            scene: "The Black Rainstorm Signal",
            items: [
                { sentence: "If the Black Rainstorm Signal is raised, classes are suspended.", meaning: "This is the rule: it happens every single time.", conditional: "Zero Conditional" },
                { sentence: "If the Black Rainstorm Signal is raised tomorrow morning, classes will be suspended.", meaning: "The Observatory says heavy rain is coming tomorrow: it could really happen.", conditional: "First Conditional" },
                { sentence: "If the Black Rainstorm Signal were raised right now, classes would be suspended.", meaning: "The sun is shining at the moment: the speaker is only imagining it.", conditional: "Second Conditional" },
                { sentence: "If the Black Rainstorm Signal had been raised yesterday, classes would have been suspended.", meaning: "The signal wasn't raised yesterday, so everyone had to go to school.", conditional: "Third Conditional" }
            ]
        },
        {
            scene: "Bubble tea at night",
            items: [
                { sentence: "If I drink bubble tea at night, I can't sleep.", meaning: "This happens to me every time: it's a fact about my body.", conditional: "Zero Conditional" },
                { sentence: "If I drink bubble tea tonight, I won't be able to sleep.", meaning: "I'm thinking about buying one after dinner today: it's a real choice.", conditional: "First Conditional" },
                { sentence: "If I drank bubble tea, I wouldn't be able to sleep.", meaning: "I never drink bubble tea, so this is only imaginary.", conditional: "Second Conditional" },
                { sentence: "If I hadn't drunk bubble tea last night, I would have slept well.", meaning: "I did have one last night and stayed awake: now I regret it.", conditional: "Third Conditional" }
            ]
        }
    ],
    transforms: [
        { context: "Ken missed the school bus this morning and was late for assembly. He regrets it.", sentence: "If Ken ___ (not miss) the bus, he ___ (not be) late for assembly.", blanks: [["hadn't missed", "had not missed"], ["wouldn't have been", "would not have been"]], conditional: "Third Conditional", why: "Ken is imagining a different past, so: had + V3, would have + V3.", hint: "Did this already happen? Both verbs need to look back at the past." },
        { context: "The weather forecast says it might rain this Saturday. It's a real possibility.", sentence: "If it ___ (rain) on Saturday, we ___ (watch) a film instead of hiking.", blanks: [["rains"], ["will watch", "are going to watch"]], conditional: "First Conditional", why: "A real future possibility: Present Simple in the if-clause, will + V1 in the result.", hint: "Saturday is in the future and rain is possible. Remember: no 'will' after 'if'." },
        { context: "Chloe's flat is too small, so she can't have a dog. She is daydreaming.", sentence: "If Chloe ___ (have) a dog, she ___ (walk) it along the harbour every evening.", blanks: [["had"], ["would walk"]], conditional: "Second Conditional", why: "An imaginary present: Past Simple in the if-clause, would + V1 in the result.", hint: "Does Chloe have a dog now? Imaginary situations move the verb one step back." },
        { context: "This is a science fact your teacher showed you in art class. It's always true.", sentence: "If you ___ (mix) red and yellow paint, you ___ (get) orange.", blanks: [["mix"], ["get"]], conditional: "Zero Conditional", why: "A fact that is always true: Present Simple in both clauses.", hint: "It happens every time. Do you need 'will' or 'would' for a fact?" },
        { context: "Your friend's desk is very messy, and you're giving her advice before the class inspection.", sentence: "If I ___ (be) you, I ___ (tidy) your desk before the inspection.", blanks: [["were", "was"], ["would tidy"]], conditional: "Second Conditional", why: "Advice with 'If I were you': you can't really be her, so it's imaginary: Past Simple + would.", hint: "Can you really be your friend? Think about the famous phrase for giving advice." },
        { context: "The class forgot to book the barbecue pit last month, so the party in Sai Kung didn't happen.", sentence: "If we ___ (book) the barbecue pit, we ___ (have) our party in Sai Kung.", blanks: [["had booked"], ["would have had"]], conditional: "Third Conditional", why: "The party didn't happen: it's an imagined past: had + V3, would have + V3.", hint: "'Last month': is it too late to change? Both verbs need to go back into the past." },
        { context: "Mum is warning you about tomorrow's test. You can still revise tonight.", sentence: "You ___ (fail) the test tomorrow if you ___ (not revise) tonight.", blanks: [["will fail", "are going to fail"], ["don't revise", "do not revise"]], conditional: "First Conditional", why: "A real warning about the future. The main clause comes first here: will + V1 … if + Present Simple.", hint: "Careful: the main clause comes first this time! Which half is the if-clause?" },
        { context: "This happens every time you travel on the MTR.", sentence: "When the door alarm ___ (beep), the train doors ___ (close).", blanks: [["beeps"], ["close"]], conditional: "Zero Conditional", why: "Something that happens every time ('when' = 'if'): Present Simple in both clauses.", hint: "'Every time': is this a general fact? Check the subject–verb agreement too." }
    ]
};

window.CLY_GRAMMAR = { normalise, TIMES, ASPECTS, tenseMatrix, tenseTimelines, GENERIC_TENSE_HINT, PASSIVE_EXAMPLES, PASSIVE_TENSES, NOUN_SLOTS, MEANING_PAIRS, VERB_PATTERNS, LESSONS, FOCUS_TABS, applyMark, parseProofLine, CORRECTION_KIND, CONDITIONALS, conditionalMatrix, REALITY, COND_TIMES, COND_CELLS, COND_IDEAS, GENERIC_COND_HINT, condQuizQuestions, defaultCondMatch };

})();

