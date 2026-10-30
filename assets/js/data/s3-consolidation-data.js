/* CLY English: S.3 consolidation (Units 1 to 4). Sentence rewrites in the style of a graded grammar
   worksheet, with original texts. The rest of each sentence is given and the student types the missing
   part (or, with whole: true, the whole new sentence). In answers, [a|b] is a choice and (x) is optional, so every correct version is accepted
   (see rewrite-check.js). kind: "present" or "past" makes the student choose the participle first. */
var MIXED_TASK = "First choose: does each underlined sentence need a present participle phrase (the subject does it) or a past participle phrase (it is done to the subject, or the subject feels it)? Then type the phrase and its comma; the rest of the sentence is given.";
window.CLY_S3_CONSOLIDATION = {
  // Units 1 and 2: Part A and Part B practise one unit each; Part C mixes the two.
  unit1A: {
    title: "Our first film festival",
    textType: "Blog post",
    task: "Rewrite each underlined sentence using the grammar from Unit 1: indefinite pronouns, noun phrases and bare infinitives. Type the missing part; the rest of the sentence is given.",
    paragraphs: [
      ["Last term, our school held its first film festival. ", 1, " Luckily, we had a famous judge. ", 2],
      ["My team decided to make a short comedy. ", 3, " ", 4, " I told my team, ", 5, " We filmed for three weekends. Everyone wanted a turn. ", 6],
      ["On the big night, we were all very nervous. When we watched the film again, ", 7, " ", 8, " ", 9]
    ],
    items: {
      1: { original: "There wasn't a single person at our school who had made a film before.", frame: "___ at our school had made a film before.", answers: ["[No one|Nobody]"], hint: "\"Not a single person\" means zero people. Which word means that?", why: "Not a single person → No one or Nobody. The verb stays positive, because the word is already negative." },
      2: { original: "June Ma is a well-known film director. She agreed to judge the festival.", frame: "June Ma___ agreed to judge the festival.", answers: [", a well-known film director,"], hint: "We know who June Ma is, so the phrase is extra. Drop \"is\" and put commas on both sides.", why: "The phrase is extra information about June Ma, so it goes between two commas." },
      3: { original: "Ms Ho forced us to write a full script first.", frame: "Ms Ho made us ___", answers: ["write a full script first."], hint: "Make + someone + which form of the verb?", why: "Make + someone + V1: made us write, with no \"to\"." },
      4: { original: "We were allowed to borrow the school's camera by the IT teacher.", frame: "The IT teacher let us ___", answers: ["borrow the school's camera."], hint: "Let + someone + which form of the verb?", why: "Let + someone + V1: let us borrow, with no \"to\"." },
      5: { original: "‘It is a good idea to start filming early.’", frame: "‘We had better ___’", answers: ["start filming early."], hint: "Which form follows \"had better\"?", why: "Had better + V1: had better start." },
      6: { original: "I prefer acting to holding the camera.", frame: "I would rather ___", answers: ["act than hold the camera."], hint: "Would rather + V1 + than + V1. Both verbs lose their -ing.", why: "Would rather act than hold: both verbs are V1." },
      7: { original: "There was nothing wrong with the sound.", frame: "There wasn't ___ with the sound.", answers: ["anything wrong"], hint: "\"Wasn't\" is already negative. Which word goes after a negative verb?", why: "Only one negative: wasn't + anything." },
      8: { original: "The audience laughed, and we heard it from the back of the hall.", frame: "We heard the audience ___ from the back of the hall.", answers: ["laugh"], hint: "Hear + someone + which form of the verb?", why: "Hear + someone + V1: heard the audience laugh. It stays V1, even in a past sentence." },
      9: { original: "One of the films was called Waffle Days. It won Best Film.", frame: "The film ___ won Best Film.", answers: ["Waffle Days"], hint: "There were many films, so the name tells us which one. Is it needed or extra?", why: "The name is needed to show which film, so it takes no commas." }
    }
  },

  unit2B: {
    title: "Our charity sale",
    textType: "Article for the school magazine",
    task: "Rewrite each underlined sentence using the grammar from Unit 2: so, so that, so as to, must, have to and need to. Type the missing part; the rest of the sentence is given.",
    paragraphs: [
      ["Our class wanted to help stray animals. ", 1, " ", 2, " Luckily, the school hall was free."],
      ["We had a meeting to make the rules clear. ", 3, " ", 4, " ", 5, " ", 6],
      ["On the day, the S.6 students were sitting a mock exam next door. ", 7, " ", 8, " ", 9]
    ],
    items: {
      1: { original: "We held a charity sale because we wanted to raise money for them.", frame: "We held a charity sale ___", answers: ["[so as to|in order to] raise money for them.", "so that we [could|would] raise money for them."], hint: "This is the aim. Use \"so as to\" + verb, or \"so that\" + subject.", why: "Raising money was the aim: so as to raise, or so that we could raise." },
      2: { original: "The weather was terrible. As a result, we moved the sale indoors.", frame: "The weather was terrible, ___", answers: ["so we moved the sale indoors."], hint: "Moving indoors is what happened as a result.", why: "It really happened, so use \"so\", with a comma before it." },
      3: { original: "It isn't necessary for volunteers to bring their own tables.", frame: "Volunteers ___", answers: ["[don't have to|don't need to|needn't] bring their own tables."], hint: "It isn't necessary, but it isn't banned. Which negative means that?", why: "Not necessary → don't have to, don't need to or needn't." },
      4: { original: "Selling food without a teacher's permission is not allowed.", frame: "You ___", answers: ["must not sell food without a teacher's permission."], hint: "It is forbidden. Which negative means that?", why: "Not allowed → must not + V1." },
      5: { original: "We made posters because we wanted everyone to know about the sale.", frame: "We made posters so that ___", answers: ["everyone [would|could] know about the sale."], hint: "The sentence is in the past. \"So that\" + subject + which modal?", why: "A past sentence takes a past modal: so that everyone would (or could) know." },
      6: { original: "The school's rule says that every stall needs a teacher.", frame: "Every stall ___", answers: ["[has to|must|needs to] have a teacher."], hint: "It's a rule from the school. \"Every stall\" is singular.", why: "A rule from someone else: has to. It is singular, so not \"have to\"." },
      7: { original: "We spoke quietly because we didn't want to disturb them.", frame: "We spoke quietly ___", answers: ["so as not to disturb them.", "so that we [wouldn't|didn't] disturb them."], hint: "A negative aim. Where does \"not\" go in \"so as to\"?", why: "So as not to + V1. \"Not\" goes before \"to\"." },
      8: { original: "At the end, it was necessary for us to carry everything upstairs by hand.", frame: "At the end, we ___", answers: ["[had to|needed to] carry everything upstairs by hand."], hint: "This is in the past. What is the past form of \"must\"?", why: "\"Must\" has no past form, so use \"had to\" or \"needed to\"." },
      9: { original: "We raised a lot of money. As a result, the shelter bought food for six months.", frame: "We raised a lot of money, ___", answers: ["so the shelter bought food for six months."], hint: "Buying the food really happened. Which word gives a result?", why: "It really happened, so use \"so\"." }
    }
  },

  unitsMixedC: {
    title: "The hike to Sharp Peak",
    textType: "Email to a friend",
    task: "These sentences mix Units 1 and 2. Decide which grammar each one needs, then type the missing part. The rest of the sentence is given.",
    paragraphs: [
      ["Hi Sam, Last Sunday our class went hiking in Sai Kung. ", 1, " ", 2, " ", 3],
      ["Our guide was very strict. ", 4, " ", 5, " It was a tough walk. ", 6],
      ["We got back to the village by five. ", 7, " ", 8, " ", 9, " Next time, you should come too!"]
    ],
    items: {
      1: { original: "Not a single person in my class had been there before.", frame: "___ in my class had been there before.", answers: ["[No one|Nobody]"], hint: "Which word means zero people? The verb stays positive.", why: "Not a single person → No one or Nobody." },
      2: { original: "Sharp Peak is one of the toughest hikes in Sai Kung. It took us four hours.", frame: "Sharp Peak___ took us four hours.", answers: [", one of the toughest hikes in Sai Kung,"], hint: "Is the phrase needed or extra? Use it between commas, with no \"is\".", why: "The name already tells us which hike, so the phrase is extra: two commas." },
      3: { original: "We got up at five because we wanted to avoid the heat.", frame: "We got up at five ___", answers: ["[so as to|in order to] avoid the heat.", "so that we [could|would] avoid the heat."], hint: "This is the aim. \"So as to\" + verb, or \"so that\" + subject.", why: "Avoiding the heat was the aim: so as to avoid, or so that we could avoid." },
      4: { original: "He forced us to drink water every hour.", frame: "He made us ___", answers: ["drink water every hour."], hint: "Make + someone + which form of the verb?", why: "Make + someone + V1: made us drink." },
      5: { original: "Swimming in the reservoir is not allowed.", frame: "You ___", answers: ["must not swim in the reservoir."], hint: "It's forbidden. Which negative means that?", why: "Not allowed → must not + V1." },
      6: { original: "It wasn't necessary to carry a tent, because we came back the same day.", frame: "We ___ carry a tent, because we came back the same day.", answers: ["[didn't have to|didn't need to]"], hint: "It wasn't necessary, and this is in the past.", why: "Not necessary, in the past → didn't have to or didn't need to." },
      7: { original: "My legs hurt a lot. As a result, I took a taxi home.", frame: "My legs hurt a lot, ___", answers: ["so I took a taxi home."], hint: "Taking a taxi really happened. Which word gives a result?", why: "It really happened, so use \"so\"." },
      8: { original: "Mum saw that I limped through the door.", frame: "Mum saw me ___ through the door.", answers: ["limp"], hint: "See + someone + which form of the verb?", why: "See + someone + V1: saw me limp, for the whole action." },
      9: { original: "I prefer to rest at home than to hike again this weekend.", frame: "I would rather ___", answers: ["rest at home than hike again this weekend."], hint: "Would rather + V1 + than + V1. Which \"to\"s must go?", why: "Would rather rest than hike: both verbs are V1." }
    }
  },

  presentA: {
    title: "Team Spark's robot diary",
    textType: "Blog post",
    task: "Rewrite each underlined sentence so that it starts with a present participle phrase. Type the whole new sentence.",
    whole: true,
    paragraphs: [
      ["Team Spark is our school's robotics team. ", 1, " Our coach, Mr Lam, gave us one rule: test everything twice."],
      ["Building the robot was not easy. ", 2, " We all rushed outside, but in the end the smell came from a loose wire. The next week, we had another problem. ", 3, " ", 4],
      [5, " Finally, contest day arrived. ", 6, " Everyone gasped. ", 7, " ", 8]
    ],
    items: {
      1: { original: "Because we wanted to win the inter-school robot contest, we started building in September.", frame: "___ we started building in September.", answers: ["Wanting to win the inter-school robot contest,"], hint: "This is a reason. Take \"wanted\" back to V-ing, and drop \"because we\".", why: "Because we wanted → Wanting. We are the ones who wanted, so the V-ing form fits." },
      2: { original: "While Kelvin was testing the motor, he noticed a strange burning smell.", frame: "___ Kelvin noticed a strange burning smell.", answers: ["(While) testing the motor,"], hint: "Two things at the same time. Drop \"Kelvin was\" and keep the V-ing.", why: "While Kelvin was testing → (While) testing. Kelvin does both actions, so he follows the comma." },
      3: { original: "Ada opened the toolbox and found that the screwdriver was missing.", frame: "___ Ada found that the screwdriver was missing.", answers: ["[Opening|Having opened] the toolbox,"], hint: "One action right after the other. Turn the first verb, \"opened\", into V-ing.", why: "Ada opened, then found → Opening the toolbox, Ada found … (\"Having opened\" also shows the order)." },
      4: { original: "Because she did not know where it was, she borrowed one from the science lab.", frame: "___ she borrowed one from the science lab.", answers: ["Not knowing where [it|the screwdriver] was,"], hint: "A negative reason. Put \"Not\" before the V-ing, never \"Don't\".", why: "Because she did not know → Not knowing. \"Not\" comes first in a negative participle phrase." },
      5: { original: "We worked late every evening because we hoped to finish before the deadline.", frame: "___ we worked late every evening.", answers: ["Hoping to finish before the deadline,"], hint: "The reason moves to the front. Which verb shows the reason? Make it V-ing.", why: "Because we hoped → Hoping. The phrase moves to the start, followed by a comma." },
      6: { original: "As our robot rolled across the stage, it knocked over the judges' water bottle.", frame: "___ our robot knocked over the judges' water bottle.", answers: ["(While) rolling across the stage,"], hint: "The robot does the rolling. Drop \"As our robot\" and use V-ing.", why: "As our robot rolled → Rolling across the stage. The robot does both actions." },
      7: { original: "Mr Lam laughed loudly, and he told us not to worry.", frame: "___ Mr Lam told us not to worry.", answers: ["Laughing loudly,"], hint: "Two actions by the same person. Turn \"laughed\" into V-ing.", why: "Mr Lam laughed and told → Laughing loudly, Mr Lam told us …" },
      8: { original: "Because we realised that the judges liked our robot, we relaxed and enjoyed the rest of the day.", frame: "___ we relaxed and enjoyed the rest of the day.", answers: ["[Realising|Having realised] (that) the judges liked our robot,"], hint: "Another reason. Drop \"Because we\" and turn \"realised\" into V-ing.", why: "Because we realised → Realising (that) the judges liked our robot." }
    }
  },

  pastB: {
    title: "Grandma's first smartphone",
    textType: "Short story",
    task: "Rewrite each underlined sentence so that it starts with a past participle phrase. Type the whole new sentence.",
    whole: true,
    paragraphs: [
      ["Last month, my uncle bought Grandma her first smartphone. ", 1, " On the first day, she just stared at it. ", 2],
      ["But Grandma never gives up easily. ", 3, " Within a week, she could send voice messages and stickers. ", 4, " ", 5],
      ["Next, I showed her some games, but she just shook her head. ", 6, " What she really loved was the camera. She spent a whole afternoon taking pictures of the flowers on her balcony. ", 7, " ", 8, " Now she sends us twenty photos a day!"]
    ],
    items: {
      1: { original: "The phone was chosen by my uncle, and it had a huge screen.", frame: "___ the phone had a huge screen.", answers: ["Chosen by my uncle,"], hint: "The phone didn't choose anything: it was chosen. Start with the V3.", why: "The phone was chosen → Chosen by my uncle. It happened to the phone, so use V3." },
      2: { original: "Grandma was confused by all the buttons, so she asked me for help.", frame: "___ Grandma asked me for help.", answers: ["Confused by all the buttons,"], hint: "How did Grandma feel? Drop \"Grandma was\" and \"so\".", why: "Grandma was confused → Confused by all the buttons. She has the feeling, so use V3." },
      3: { original: "She was determined to learn, so she practised sending messages every evening.", frame: "___ she practised sending messages every evening.", answers: ["Determined to learn,"], hint: "Drop \"She was\" and \"so\". Keep the V3 and what follows it.", why: "She was determined → Determined to learn." },
      4: { original: "She was encouraged by her progress, so she joined the family group chat.", frame: "___ she joined the family group chat.", answers: ["Encouraged by her progress,"], hint: "Her progress encouraged her: it was done to her. Start with the V3.", why: "She was encouraged → Encouraged by her progress." },
      5: { original: "Grandma was surprised by the number of messages, and she turned off the sound.", frame: "___ Grandma turned off the sound.", answers: ["Surprised by the number of messages,"], hint: "A feeling again. Which V3 shows how she felt?", why: "Grandma was surprised → Surprised by the number of messages." },
      6: { original: "Because she was not interested in games, she deleted them all.", frame: "___ she deleted them all.", answers: ["[Not interested|Uninterested] in games,"], hint: "A negative feeling. Drop \"Because she was\" and keep \"not\" in front.", why: "Because she was not interested → Not interested in games (or Uninterested in games)." },
      7: { original: "The photos were taken with her new phone, and they looked amazing.", frame: "___ the photos looked amazing.", answers: ["Taken with her new phone,"], hint: "The photos didn't take anything: they were taken. Use the V3 of \"take\".", why: "The photos were taken → Taken with her new phone." },
      8: { original: "She was delighted by the results, so she sent the photos to everyone she knew.", frame: "___ she sent the photos to everyone she knew.", answers: ["Delighted by the results,"], hint: "How did she feel about the results? Drop \"She was\" and \"so\".", why: "She was delighted → Delighted by the results." }
    }
  },

  // Consolidation: participle phrases. Five sets, each a text that mixes both kinds.
  participles: [
    {
      title: "The girl who cleans the beach",
      textType: "Magazine article",
      task: MIXED_TASK,
      paragraphs: [
        ["Every Sunday morning, about fifty teenagers arrive at Cheung Sha beach with gloves and bags. ", 1],
        ["It all began two years ago. ", 2, " ", 3, " ", 4],
        [5, " Joyce is now in S.4, but she has not slowed down. ", 6]
      ],
      items: {
        1: { kind: "past", original: "The group was started by a Form 3 student, and it now has 200 members.", frame: "___ the group now has 200 members.", answers: ["Started by a Form 3 student,"], hint: "Did the group start something, or was it started? Use the V3.", why: "The group was started → Started by a Form 3 student. It happened to the group: past participle." },
        2: { kind: "present", original: "Because she wanted to protect the sea turtles, Joyce began collecting rubbish on her local beach.", frame: "___ Joyce began collecting rubbish on her local beach.", answers: ["Wanting to protect the sea turtles,"], hint: "Joyce does the wanting. Drop \"Because she\" and use V-ing.", why: "Because she wanted → Wanting to protect the sea turtles. Joyce does it: present participle." },
        3: { kind: "past", original: "Joyce was shocked by the amount of plastic, so she posted photos online.", frame: "___ Joyce posted photos online.", answers: ["Shocked by the amount of plastic,"], hint: "This is a feeling Joyce has. Which form does the person with the feeling take?", why: "Joyce was shocked → Shocked by the amount of plastic. She feels it: past participle." },
        4: { kind: "present", original: "As she scrolled through the comments, she found dozens of offers to help.", frame: "___ she found dozens of offers to help.", answers: ["(While) scrolling through the comments,"], hint: "She does the scrolling. Drop \"As she\" and use V-ing.", why: "As she scrolled → Scrolling through the comments. She does it: present participle." },
        5: { kind: "past", original: "The volunteers were supported by local shops, and they collected two tonnes of rubbish last year.", frame: "___ the volunteers collected two tonnes of rubbish last year.", answers: ["Supported by local shops,"], hint: "The shops supported the volunteers: it was done to them. Use V3.", why: "The volunteers were supported → Supported by local shops: past participle." },
        6: { kind: "present", original: "Joyce hopes to inspire other teenagers, so she now gives talks at schools.", frame: "___ Joyce now gives talks at schools.", answers: ["Hoping to inspire other teenagers,"], hint: "Joyce does the hoping. Turn \"hopes\" into V-ing and drop \"so\".", why: "Joyce hopes → Hoping to inspire other teenagers. She does it: present participle." }
      }
    },
    {
      title: "Team Spark's robot diary",
      textType: "Blog post",
      task: MIXED_TASK,
      paragraphs: [
        ["Team Spark is our school's robotics team. ", 1, " Our coach, Mr Lam, gave us one rule: test everything twice."],
        [2, " ", 3, " ", 4, " In the end, the smell came from a loose wire."],
        [5, " Finally, contest day arrived. ", 6, " Everyone gasped. ", 7, " ", 8]
      ],
      items: {
        1: { kind: "present", original: "Because we wanted to win the inter-school robot contest, we started building in September.", frame: "___ we started building in September.", answers: ["Wanting to win the inter-school robot contest,"], hint: "We do the wanting. Drop \"Because we\" and use V-ing.", why: "Because we wanted → Wanting to win the inter-school robot contest. We do it: present participle." },
        2: { kind: "past", original: "Our robot was built from recycled parts, and it weighed only two kilograms.", frame: "___ our robot weighed only two kilograms.", answers: ["Built from recycled parts,"], hint: "The robot didn't build anything: it was built. Use the V3 of \"build\".", why: "Our robot was built → Built from recycled parts. It happened to the robot: past participle." },
        3: { kind: "present", original: "While Kelvin was testing the motor, he noticed a strange burning smell.", frame: "___ Kelvin noticed a strange burning smell.", answers: ["(While) testing the motor,"], hint: "Kelvin does the testing. Drop \"Kelvin was\" and keep the V-ing.", why: "While Kelvin was testing → (While) testing the motor. Kelvin does it: present participle." },
        4: { kind: "past", original: "We were worried by the smell, so we switched everything off.", frame: "___ we switched everything off.", answers: ["Worried by the smell,"], hint: "This is a feeling. Drop \"We were\" and \"so\".", why: "We were worried → Worried by the smell. We feel it: past participle." },
        5: { kind: "present", original: "We worked late every evening because we hoped to finish before the deadline.", frame: "___ we worked late every evening.", answers: ["Hoping to finish before the deadline,"], hint: "The reason moves to the front. We do the hoping: V-ing.", why: "Because we hoped → Hoping to finish before the deadline: present participle." },
        6: { kind: "present", original: "As our robot rolled across the stage, it knocked over the judges' water bottle.", frame: "___ our robot knocked over the judges' water bottle.", answers: ["(While) rolling across the stage,"], hint: "The robot does the rolling. Drop \"As our robot\" and use V-ing.", why: "As our robot rolled → Rolling across the stage. The robot does it: present participle." },
        7: { kind: "past", original: "Mr Lam was not upset by the accident, and he told us not to worry.", frame: "___ Mr Lam told us not to worry.", answers: ["Not upset by the accident,"], hint: "A negative feeling. Keep \"Not\" in front of the V3.", why: "Mr Lam was not upset → Not upset by the accident: past participle." },
        8: { kind: "past", original: "We were encouraged by his calm smile, so we relaxed and enjoyed the rest of the day.", frame: "___ we relaxed and enjoyed the rest of the day.", answers: ["Encouraged by his calm smile,"], hint: "His smile encouraged us: it was done to us. Use the V3.", why: "We were encouraged → Encouraged by his calm smile: past participle." }
      }
    },
    {
      title: "Grandma's first smartphone",
      textType: "Short story",
      task: MIXED_TASK,
      paragraphs: [
        ["Last month, my uncle bought Grandma her first smartphone. ", 1, " ", 2, " ", 3],
        ["But Grandma never gives up easily. ", 4, " ", 5, " Next, she found some games on the phone. ", 6],
        ["What she really loved was the camera. ", 7, " ", 8, " Now she sends us twenty photos a day!"]
      ],
      items: {
        1: { kind: "past", original: "The phone was chosen by my uncle, and it had a huge screen.", frame: "___ the phone had a huge screen.", answers: ["Chosen by my uncle,"], hint: "The phone didn't choose anything: it was chosen. Start with the V3.", why: "The phone was chosen → Chosen by my uncle: past participle." },
        2: { kind: "present", original: "She held it up to the light, and she looked for the power button.", frame: "___ she looked for the power button.", answers: ["Holding it up to the light,"], hint: "She does the holding. Turn \"held\" into V-ing.", why: "She held it and looked → Holding it up to the light: present participle." },
        3: { kind: "past", original: "Grandma was confused by all the buttons, so she asked me for help.", frame: "___ Grandma asked me for help.", answers: ["Confused by all the buttons,"], hint: "How did Grandma feel? Drop \"Grandma was\" and \"so\".", why: "Grandma was confused → Confused by all the buttons. She feels it: past participle." },
        4: { kind: "present", original: "Because she wanted to surprise us, she practised in secret every evening.", frame: "___ she practised in secret every evening.", answers: ["Wanting to surprise us,"], hint: "She does the wanting. Drop \"Because she\" and use V-ing.", why: "Because she wanted → Wanting to surprise us: present participle." },
        5: { kind: "past", original: "She was encouraged by her progress, so she joined the family group chat.", frame: "___ she joined the family group chat.", answers: ["Encouraged by her progress,"], hint: "Her progress encouraged her: it was done to her. Use the V3.", why: "She was encouraged → Encouraged by her progress: past participle." },
        6: { kind: "past", original: "Because she was not interested in games, she deleted them all.", frame: "___ she deleted them all.", answers: ["[Not interested|Uninterested] in games,"], hint: "A negative feeling. Drop \"Because she was\" and keep \"not\" in front.", why: "Because she was not interested → Not interested in games (or Uninterested in games): past participle." },
        7: { kind: "present", original: "While she was walking in the park, she took photos of every flower.", frame: "___ she took photos of every flower.", answers: ["(While) walking in the park,"], hint: "She does the walking. Drop \"she was\" and keep the V-ing.", why: "While she was walking → (While) walking in the park: present participle." },
        8: { kind: "past", original: "She was delighted by the results, so she sent the photos to everyone she knew.", frame: "___ she sent the photos to everyone she knew.", answers: ["Delighted by the results,"], hint: "How did she feel about the results? Drop \"She was\" and \"so\".", why: "She was delighted → Delighted by the results: past participle." }
      }
    },
    {
      title: "A day in Tai O",
      textType: "Travel blog",
      task: MIXED_TASK,
      paragraphs: [
        ["Last Friday, our class went on a trip to Tai O, a fishing village on Lantau Island. ", 1],
        [2, " Then we took a small boat out to sea. ", 3],
        ["By lunchtime, everyone was starving. ", 4, " ", 5, " ", 6]
      ],
      items: {
        1: { kind: "past", original: "Tai O is known as the Venice of Hong Kong, and it attracts many tourists.", frame: "___ Tai O attracts many tourists.", answers: ["Known as the Venice of Hong Kong,"], hint: "People know Tai O by this name: it is done to Tai O. Use the V3 of \"know\".", why: "Tai O is known → Known as the Venice of Hong Kong: past participle." },
        2: { kind: "present", original: "As we walked past the stilt houses, we smelled dried fish everywhere.", frame: "___ we smelled dried fish everywhere.", answers: ["(While) walking past the stilt houses,"], hint: "We do the walking. Drop \"As we\" and use V-ing.", why: "As we walked → Walking past the stilt houses: present participle." },
        3: { kind: "past", original: "We were amazed by the pink dolphins, so we took hundreds of photos.", frame: "___ we took hundreds of photos.", answers: ["Amazed by the pink dolphins,"], hint: "This is a feeling we had. Which form does the person with the feeling take?", why: "We were amazed → Amazed by the pink dolphins: past participle." },
        4: { kind: "present", original: "Because Ms Lo knew that we were hungry, she bought us egg waffles.", frame: "___ Ms Lo bought us egg waffles.", answers: ["Knowing (that) we were hungry,"], hint: "Ms Lo does the knowing. Drop \"Because Ms Lo\" and use V-ing.", why: "Because Ms Lo knew → Knowing (that) we were hungry: present participle." },
        5: { kind: "past", original: "The waffles were cooked over charcoal, and they tasted amazing.", frame: "___ the waffles tasted amazing.", answers: ["Cooked over charcoal,"], hint: "The waffles didn't cook anything: they were cooked. Use the V3.", why: "The waffles were cooked → Cooked over charcoal: past participle." },
        6: { kind: "present", original: "Because I didn't want the day to end, I took the last bus home.", frame: "___ I took the last bus home.", answers: ["Not wanting the day to end,"], hint: "A negative reason. Put \"Not\" before the V-ing, never \"Don't\".", why: "Because I didn't want → Not wanting the day to end: present participle." }
      }
    },
    {
      title: "The night of the typhoon",
      textType: "Diary entry",
      task: MIXED_TASK,
      paragraphs: [
        ["Last September, a typhoon came straight towards Hong Kong. ", 1, " ", 2],
        [3, " He came back soaked but smiling. ", 4],
        ["The next morning, we went outside. ", 5, " ", 6]
      ],
      items: {
        1: { kind: "past", original: "The city was hit by heavy rain and strong winds, and it went quiet overnight.", frame: "___ the city went quiet overnight.", answers: ["Hit by heavy rain and strong winds,"], hint: "The city didn't hit anything: it was hit. The V3 of \"hit\" is \"hit\".", why: "The city was hit → Hit by heavy rain and strong winds: past participle." },
        2: { kind: "present", original: "Because we heard the wind outside, we closed all the windows.", frame: "___ we closed all the windows.", answers: ["Hearing the wind outside,"], hint: "We do the hearing. Drop \"Because we\" and use V-ing.", why: "Because we heard → Hearing the wind outside: present participle." },
        3: { kind: "past", original: "Dad was worried about the old tree, so he went outside to check it.", frame: "___ Dad went outside to check it.", answers: ["Worried about the old tree,"], hint: "This is a feeling Dad had. Drop \"Dad was\" and \"so\".", why: "Dad was worried → Worried about the old tree: past participle." },
        4: { kind: "present", original: "While my sister was playing board games with me, she forgot all about the storm.", frame: "___ my sister forgot all about the storm.", answers: ["(While) playing board games with me,"], hint: "My sister does the playing. Drop \"my sister was\" and keep the V-ing.", why: "While my sister was playing → (While) playing board games with me: present participle." },
        5: { kind: "past", original: "The streets were covered in leaves, and they looked like a forest.", frame: "___ the streets looked like a forest.", answers: ["Covered in leaves,"], hint: "The leaves covered the streets: it was done to them. Use the V3.", why: "The streets were covered → Covered in leaves: past participle." },
        6: { kind: "present", original: "Because we wanted to help, we joined our neighbours to clean up.", frame: "___ we joined our neighbours to clean up.", answers: ["Wanting to help,"], hint: "We do the wanting. Drop \"Because we\" and use V-ing.", why: "Because we wanted → Wanting to help: present participle." }
      }
    }
  ],

  statementsA: {
    title: "Open day interviews",
    textType: "Report for the school magazine",
    task: "Type the reported statement; the reporting verb is given. Change the tense, pronouns and time words where they need to. If something is still true, you may keep the tense.",
    situation: [["Said", "last week, at the school's 60th anniversary open day"], ["You are reporting", "today, at school"]],
    list: true,
    paragraphs: [["Ms Chan (class of 1998): ", 1], ["Mr Lee (class of 1985): ", 2], ["Kitty (class of 2015): ", 3], ["Mr Ho (class of 1990): ", 4], ["Ms Yip (class of 1979): ", 5], ["Eric (class of 2010): ", 6], ["Ms Fung (class of 1972): ", 7], ["Dr Ma (class of 1995): ", 8], ["Mrs Lau (class of 1988): ", 9], ["Mr Tse (class of 1982), to us: ", 10]],
    items: {
      1: { original: "‘I am a doctor at Queen Mary Hospital now.’", frame: "Ms Chan said ___", answers: ["(that) she [was|is] a doctor at Queen Mary Hospital( [now|then]).", "(that) she [was|is] now a doctor at Queen Mary Hospital."], hint: "Change \"I\" to \"she\". She is still a doctor, so you may keep \"is\" or move it back to \"was\".", why: "I am → she was (or she is, because it is still true)." },
      2: { original: "‘I will never forget my S.3 English teacher.’", frame: "Mr Lee said ___", answers: ["(that) he [would|will] never forget his S.3 English teacher."], hint: "Change \"I\" and \"my\". What does \"will\" become?", why: "I will → he would; my → his. (\"Will\" can stay, because he still feels this.)" },
      3: { original: "‘We are planning a reunion dinner for next year.’", frame: "Kitty said ___", answers: ["(that) they [were|are] planning a reunion dinner for [next year|the next year|the following year]."], hint: "Change \"we\" to \"they\". Move \"are\" back one step.", why: "We are planning → they were planning. Next year is still next year, so it can stay." },
      4: { original: "‘I broke a window in the hall when I was in S.2.’", frame: "Mr Ho told us ___", answers: ["(that) he [had broken|broke] a window in the hall when he [was|had been] in S.2."], hint: "Change \"I\" to \"he\" twice. Move \"broke\" back one step.", why: "I broke → he had broken. (\"Broke\" is also fine, because \"when he was in S.2\" shows the time.)" },
      5: { original: "‘I can still remember the school song.’", frame: "Ms Yip said ___", answers: ["(that) she [could|can] still remember the school song."], hint: "Change \"I\". What does \"can\" become?", why: "I can → she could (or can, because it is still true)." },
      6: { original: "‘I have just moved back to Hong Kong from Canada.’", frame: "Eric said ___", answers: ["(that) he had just moved back to Hong Kong from Canada."], hint: "\"Have just\" was true last week, not now. Move it back one step.", why: "I have just moved → he had just moved. A week later it is no longer \"just\", so the tense must move back." },
      7: { original: "‘The school library was much smaller in my day.’", frame: "Ms Fung told us ___", answers: ["(that) the school library [had been|was] much smaller in her day."], hint: "Change \"my\". Move \"was\" back one step.", why: "was → had been; my day → her day. (\"Was\" is also fine here.)" },
      8: { original: "‘My daughter starts S.1 here tomorrow.’", frame: "Dr Ma said ___", answers: ["(that) her daughter [started|was starting|would start|was going to start] S.1 [there|here|at our school|at this school] [the next day|the following day|the day after]."], hint: "Her \"tomorrow\" was last week. Change \"my\", the tense and the time word.", why: "My → her; starts → started; tomorrow → the next day. (\"Here\" can stay, because you are at the same school.)" },
      9: { original: "‘I met my husband at this school's sports day.’", frame: "Mrs Lau said ___", answers: ["(that) she [had met|met] her husband at [this|that|the] school's sports day."], hint: "Change \"I\" and \"my\". Move \"met\" back one step.", why: "I met my husband → she had met her husband." },
      10: { original: "‘You must work hard if you want to succeed.’", frame: "Mr Tse told us ___", answers: ["(that) we [had to|must] work hard if we [wanted|want] to succeed."], hint: "He was talking to us: \"you\" becomes \"we\". What can \"must\" become?", why: "You must → we had to (or must, for advice that is still true); you want → we wanted (or want)." }
    }
  },

  questionsB: {
    title: "Questions for a marine biologist",
    textType: "Class newsletter",
    task: "Type the reported question; the reporting verb is given. Use if or whether for yes/no questions, statement word order, and a full stop.",
    situation: [["Asked", "last Friday, when the marine biologist Dr Kwan visited our class"], ["You are reporting", "this week, in the class newsletter"]],
    list: true,
    paragraphs: [["Ben: ", 1], ["Amy: ", 2], ["Kit: ", 3], ["Joy: ", 4], ["Leo: ", 5], ["Mia: ", 6], ["Sam: ", 7], ["Ivy: ", 8], ["Tom: ", 9], ["Lily: ", 10]],
    items: {
      1: { original: "‘Do you dive every day?’", frame: "Ben asked Dr Kwan ___", answers: ["[if|whether] she [dived|dove|dives] every day."], hint: "A yes/no question: start with if or whether. Drop \"do\" and move the verb back.", why: "Do you dive → if she dived. No \"do\", statement order, full stop." },
      2: { original: "‘Have you ever seen a shark?’", frame: "Amy asked Dr Kwan ___", answers: ["[if|whether] she had ever seen a shark."], hint: "If or whether, then the subject before the verb. What does \"have seen\" become?", why: "Have you ever seen → if she had ever seen." },
      3: { original: "‘Where do pink dolphins live?’", frame: "Kit asked Dr Kwan ___", answers: ["where pink dolphins [lived|live]."], hint: "Keep \"where\". Drop \"do\" and put the subject before the verb.", why: "Where do pink dolphins live → where pink dolphins lived (or live: it is still true)." },
      4: { original: "‘Why are the coral reefs dying?’", frame: "Joy asked Dr Kwan ___", answers: ["why the coral reefs [were|are] dying."], hint: "Put \"the coral reefs\" before \"are\", then move \"are\" back.", why: "Why are the coral reefs dying → why the coral reefs were dying. Subject first, then the verb." },
      5: { original: "‘Can I join your summer project?’", frame: "Leo asked Dr Kwan ___", answers: ["[if|whether] he [could|can] join her summer project."], hint: "If or whether. Change \"I\" and \"your\". What does \"can\" become?", why: "Can I join your → if he could join her." },
      6: { original: "‘What did you study at university?’", frame: "Mia asked Dr Kwan ___", answers: ["what she [had studied|studied] at university."], hint: "Drop \"did\". Put \"she\" before the verb and move the tense back.", why: "What did you study → what she had studied. No \"did\", statement order." },
      7: { original: "‘How many fish did you count yesterday?’", frame: "Sam asked Dr Kwan ___", answers: ["how many fish she [had counted|counted] [the day before|the previous day]."], hint: "Drop \"did\". Her \"yesterday\" was more than a week ago: change the time word too.", why: "did you count yesterday → she had counted the day before." },
      8: { original: "‘Will the fish come back if we stop polluting the sea?’", frame: "Ivy asked Dr Kwan ___", answers: ["[if|whether] the fish [would come back if [we|they] stopped|will come back if [we|they] stop] polluting the sea."], hint: "If or whether, then \"the fish\" before the verb. What does \"will\" become?", why: "Will the fish come back → if the fish would come back, and stop → stopped." },
      9: { original: "‘Who pays for your research?’", frame: "Tom asked Dr Kwan ___", answers: ["who [paid|pays] for her research."], hint: "Here \"who\" is the subject, so the word order stays. Change \"your\".", why: "Who pays for your research → who paid for her research. The order doesn't change when \"who\" is the subject." },
      10: { original: "‘Is it safe to swim at Repulse Bay?’", frame: "Lily asked Dr Kwan ___", answers: ["[if|whether] it [was|is] safe to swim at Repulse Bay."], hint: "If or whether, then \"it\" before \"is\". Move \"is\" back.", why: "Is it safe → if it was safe (or is: it is still true)." }
    }
  }
};
