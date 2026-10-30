/* A made-up cloze for the S.3 challenge's test mode only (s3-challenge.html?test on a local preview). Never used in the league. */
window.CLY_TEST_CLOZE = {
  title: "Test passage",
  textType: "Sample",
  paragraphs: [
    ["Tom yam ", 1, " is my favourite dish. My friend ", 2, " cooks it, and she ", 3, " it to me last week."],
    ["I left early ", 4, " get a seat, but ", 5, " had taken them all."]
  ],
  blanks: {
    1: { verb: "a spicy Thai soup", answers: [", a spicy Thai soup,"], commas: true, topic: "Noun phrases", why: "We already know what tom yam is, so the phrase is extra: a comma on each side." },
    2: { verb: "Kit", answers: ["Kit"], commas: true, topic: "Noun phrases", why: "I have other friends, so the name tells us which one: no commas." },
    3: { verb: "give", answers: ["gave"], topic: "Tenses", why: "\"Last week\" needs the past simple." },
    4: { answers: ["so as to"], topic: "So, so that, so as to", why: "An aim, followed by a base verb." },
    5: { answers: ["someone", "somebody"], topic: "Indefinite pronouns", why: "One person, and we don't know who." }
  },
  distractors: ["sell", "drive"],
  phraseDistractors: ["a tall tree"]
};
