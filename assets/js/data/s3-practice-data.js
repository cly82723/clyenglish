/* The S.3 practice cloze: the weekly challenge's format with no clock, and instant marking. These are practice passages, so their answers can be public;
   weekly challenge sets stay in the private bank and are never copied here. Same fields as a challenge cloze (tools/challenge-bank.js). */
window.CLY_S3_PRACTICE = [
  {
    title: "The Day the Lift Broke",
    textType: "Blog post",
    paragraphs: [
      ["Last Monday, the lift in our building ", 1, " working. It was a disaster for my grandmother, who ", 2, " on the twentieth floor since 2010."],
      ["Our building's only caretaker ", 3, " came at once. I have four cousins, and my cousin ", 4, " came to help too. The caretaker knocked on every door, but ", 5, " answered because everyone was at work. Later, ", 6, " left a bag of rice outside Grandma's door, but we still don't know who it was."],
      ["\"Is there ", 7, " I can do to help?\" I asked. By the time the repair team ", 8, ", Grandma ", 9, " all her shopping up the stairs by herself. Tomorrow, they ", 10, " the lift again."]
    ],
    blanks: {
      1: { verb: "stop", answers: ["stopped"], topic: "Tenses", why: "\"Last Monday\" is a finished time, so use the past simple: stopped." },
      2: { verb: "live", answers: ["has lived", "'s lived"], topic: "Tenses", why: "\"Since 2010\" runs up to now, so use the present perfect: has lived." },
      3: { verb: "Mr Chan", answers: [", Mr Chan,"], commas: true, topic: "Noun phrases", why: "The building has only one caretaker, so the name is extra information. It needs a comma on each side." },
      4: { verb: "Leo", answers: ["Leo"], commas: true, topic: "Noun phrases", why: "There are four cousins, so the name tells us which one. It takes no commas." },
      5: { answers: ["nobody", "no one"], topic: "Indefinite pronouns", why: "Everyone was at work, so zero people answered: nobody or no one." },
      6: { answers: ["someone", "somebody"], topic: "Indefinite pronouns", why: "One person, and we don't know who: someone or somebody." },
      7: { answers: ["anything", "something"], topic: "Indefinite pronouns", why: "An open question: Is there anything I can do? Is there something I can do? is right too." },
      8: { verb: "arrive", answers: ["arrived"], topic: "Tenses", why: "\"By the time\" + past simple sets the point in the past: by the time they arrived." },
      9: { verb: "carry", answers: ["had carried", "'d carried"], topic: "Tenses", why: "She carried it before they arrived, so the earlier action takes the past perfect: had carried." },
      10: { verb: "check", answers: ["will check", "'ll check", "are going to check", "'re going to check", "are checking", "'re checking", "will be checking", "'ll be checking"], topic: "Tenses", why: "\"Tomorrow\" is the future: will check or are going to check." }
    },
    distractors: ["paint", "sell"],
    phraseDistractors: ["a tall tree"]
  },
  {
    title: "Getting Ready for the School Fair",
    textType: "School newsletter article",
    paragraphs: [
      ["Our class stayed late on Friday ", 1, " finish the posters. ", 2, " everyone could see them, we hung them next to the school gate. Then it started to rain, ", 3, " we moved all the tables inside."],
      ["Last year, we ", 4, " carry everything by hand. This year, we ", 5, " pay for any tables, because the school lends them to us for free. Remember one rule on the day: you ", 6, " bring drinks into the hall."],
      ["", 7, " a big box, Ms Lee walked in and showed us where to put the prizes. ", 8, " by all the work, we sat down for a rest. ", 9, " about Saturday, nobody wanted to go home. I left at six, ", 10, " a poster in each hand."]
    ],
    blanks: {
      1: { answers: ["so as to"], topic: "So, so that, so as to", why: "Finishing the posters was the aim, and a base verb follows: so as to + V1." },
      2: { answers: ["so that"], topic: "So, so that, so as to", why: "The aim opens the sentence and a clause follows. Only so that can do this." },
      3: { answers: ["so"], topic: "So, so that, so as to", why: "Moving the tables was the result of the rain: comma + so + clause." },
      4: { answers: ["had to", "needed to"], topic: "Must, have to, need to", why: "\"Last year\" is the past, and must has no past form: had to or needed to." },
      5: { answers: ["don't need to", "needn't", "don't have to", "won't need to", "won't have to"], topic: "Must, have to, need to", why: "The tables are free, so paying isn't necessary: don't need to or don't have to." },
      6: { answers: ["mustn't"], topic: "Must, have to, need to", why: "A rule that forbids something: mustn't + V1." },
      7: { verb: "carry", answers: ["Carrying"], topic: "Participles", why: "She did the carrying at the same time as she walked in: V-ing." },
      8: { verb: "tire", answers: ["Tired"], topic: "Participles", why: "The work tired us, so we received the action: V3. Notice \"by all the work\"." },
      9: { verb: "excite", answers: ["Excited"], topic: "Participles", why: "Saturday excited us, so we received the action: V3." },
      10: { verb: "hold", answers: ["holding"], topic: "Participles", why: "I was holding the posters at the same time as I left: V-ing." }
    },
    distractors: ["paint", "sell", "wash"]
  }
];
