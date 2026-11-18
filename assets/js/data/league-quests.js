/* CLY English Weekly Challenge: the weekly quests, one set per form for each week. Test mode plays the first week;
   tools/quests-tsv.js turns each week into rows for the QuestSets tab of that form's league sheet.
   Shapes (marked by apps-script/Logic.gs): sprint { passages: [{ title, lines }] } with lines as in a proofreading
   challenge ([[wrong>right]]); words { paragraphs, gaps: { id: { first, answers } } }; ladder { start, rungs }.
   "Fix last week's mistakes" needs no content: it is built from last week's challenge.
   Every week's content is a draft until CLY approves it in the sheet. */
window.CLY_QUESTS_BANK = {
  "S.4": {
    "2026-11-23": {
      sprint: { title: "Proofreading sprint", passages: [
        { title: "Our class trip", lines: [
          ["Last Friday, our class [[go>went]] to the Hong Kong Wetland Park."],
          ["We took the MTR to Tin Shui Wai and walked from the station."],
          ["Our teacher told us to keep quiet so that we would not frighten the birds."],
          ["I have never seen so [[much>many]] birds in one place."],
          ["One of my classmates [[were>was]] very excited when she saw a kingfisher."],
          ["We spent an hour in the hide, watching the mudflats."],
          ["After lunch, we visited the exhibition about [[the>]] climate change."],
          ["Everyone agreed it was the most interesting trip we have ever [[went>been]] on."]
        ] },
        { title: "The new study room", lines: [
          ["Our school [[open>opened]] a new study room on the fifth floor last month."],
          ["It stays open until seven o'clock on weekdays."],
          ["There [[is>are]] twenty desks, and each one has its own lamp."],
          ["Students must write their names on a list before they come in."],
          ["Since it opened, I have [[study>studied]] there almost every evening."],
          ["It is much quieter than [[the>]] home, where my brothers play games."],
          ["My only complaint is that the chairs are not very comfortable."],
          ["I hope the school will [[keeps>keep]] it open during the summer holidays."]
        ] }
      ] },
      words: { title: "Words of the week", paragraphs: [
        ["Our school has started a buddy scheme to ", 1, " a sense of belonging among new S1 students. It also hopes to ", 2,
          " the problem of loneliness at lunchtime. Teachers plan to ", 3, " the scheme in every class next term."],
        ["Some parents worry that it may ", 4, " a challenge for busy seniors, so the school will help them ", 5,
          " a balance between study and helping others. Most of all, the scheme should ", 6, " the gap between younger and older students."]
      ], gaps: {
        1: { first: "f", answers: ["foster"] }, 2: { first: "t", answers: ["tackle"] }, 3: { first: "i", answers: ["implement"] },
        4: { first: "p", answers: ["pose"] }, 5: { first: "s", answers: ["strike"] }, 6: { first: "b", answers: ["bridge"] }
      } },
      ladder: { title: "Level-up ladder", start: "Homework is bad for students.", rungs: [
        { to: "5", options: ["Homework is very bad for students.", "Too much homework leaves students with no time to rest.", "Homework is not good for students at all."],
          answer: 1, reasons: ["It is longer.", "It says how homework is bad.", "It uses “too much”."], reason: 1 },
        { to: "5**", options: ["When an S4 student finishes worksheets at midnight, the next morning's first lesson is already lost.",
          "Homework is extremely harmful to the health of students in Hong Kong.", "Many students think that homework is a big problem nowadays."],
          answer: 0, reasons: ["It uses a harder word.", "It shows the cost in a scene the reader can see.", "It mentions Hong Kong."], reason: 1 }
      ] }
    }
  },
  "S.3": {
    "2026-11-23": {
      sprint: { title: "Proofreading sprint", passages: [
        { title: "My weekend", lines: [
          ["On Saturday, I [[visit>visited]] my grandmother in Tai Po."],
          ["She lives in a small flat near the market."],
          ["We cooked dumplings together and [[watch>watched]] an old film."],
          ["My grandmother [[have>has]] two cats called Mimi and Lulu."],
          ["They like to sleep on the sofa all afternoon."],
          ["In the evening, we [[go>went]] to a noodle shop for dinner."],
          ["The noodles were hot and very tasty."],
          ["I want to visit her again [[in>on]] Sunday next week."]
        ] },
        { title: "Our sports day", lines: [
          ["Our sports day [[is>was]] last Thursday at the Sha Tin sports ground."],
          ["Everyone wore their house colours."],
          ["I [[run>ran]] in the 100-metre race and came third."],
          ["My best friend won two [[medal>medals]] in the long jump."],
          ["We cheered loudly for our classmates."],
          ["It was the [[most hot>hottest]] day of the month."],
          ["The teachers gave us water and ice lollies."],
          ["I [[am>was]] very tired but happy when I got home."]
        ] }
      ] },
      words: { title: "Words of the week", paragraphs: [
        ["Our class wants to ", 1, " teamwork, so we started a reading club. We want to ", 2, " the problem of students who never read. Our teacher will help us ", 3, " our plan next month."],
        ["Phones can ", 4, " a risk if we use them too much, so we must ", 5, " a balance between screens and books. The club can also ", 6, " the gap between S1 and S3 students."]
      ], gaps: {
        1: { first: "f", answers: ["foster"] }, 2: { first: "t", answers: ["tackle"] }, 3: { first: "i", answers: ["implement"] },
        4: { first: "p", answers: ["pose"] }, 5: { first: "s", answers: ["strike"] }, 6: { first: "b", answers: ["bridge"] }
      } },
      ladder: { title: "Level-up ladder", start: "Our school canteen is bad.", rungs: [
        { to: "5", options: ["Our school canteen is very bad.", "Our school canteen sells food that is greasy and too expensive.", "Our school canteen is not good at all."],
          answer: 1, reasons: ["It is longer.", "It says how the canteen is bad.", "It uses “too”."], reason: 1 },
        { to: "5**", options: ["Our school canteen is extremely terrible and awful.",
          "By the second lesson, the smell of fried chicken wings has filled the corridor, and many of us have already spent half our lunch money.",
          "Many students say that the canteen is a big problem."],
          answer: 1, reasons: ["It uses more adjectives.", "It shows the problem in a scene the reader can picture.", "It mentions money."], reason: 1 }
      ] }
    }
  }
};
