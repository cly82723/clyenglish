/* CLY English: S.3 grammar, Units 3 and 4. Six topics, each with a short rule lesson and a hard quiz,
   then a mixed challenge (cloze and proofreading). Quizzes test what sounds natural, not just what follows a formula:
   meaning questions, "which sounds right", dangling phrases, register and still-true facts. */
window.CLY_S3_GRAMMAR = {
  // review: the rules part on s3-grammar.html. ex uses the proofreading mark: [[wrong>right]].
  topics: {
    "Past perfect": { review: "pastperfect-rules", ex: "When we arrived, the bus [[left>had left]]." },
    "-ing phrases": { review: "ing-rules", ex: "[[Walked>Walking]] home, I saw a stray cat." },
    "-ed phrases": { review: "ed-rules", ex: "[[Exciting>Excited]] about the trip, we couldn't sleep." },
    "Reported statements": { review: "statements-rules", ex: "He [[said>told]] me that he was busy." },
    "Reported questions": { review: "questions-rules", ex: "She asked where [[did I live>I lived]]." },
    "Linking words": { review: "linking-rules", ex: "[[Although>Despite]] the rain, we went out." }
  },

  lessons: {
    pastPerfect: {
      intro: "The past perfect (had + V3) is the past of the past. Use it when you are already talking about the past and need to step further back.",
      form: [
        { label: "Positive", formula: "had + V3", example: "By the time we arrived, the film **had started**." },
        { label: "Negative", formula: "had not (hadn't) + V3", example: "I **hadn't eaten** all day, so I was starving." },
        { label: "Yes/No question", formula: "Had + subject + V3?", example: "**Had** you ever **tried** durian before that trip?" },
        { label: "Wh- question", formula: "Wh- + had + subject + V3?", example: "Where **had** she **put** the keys?" }
      ],
      functions: [
        { title: "The earlier of two past events", text: "Put the past perfect on the event that happened first. The later event stays in the past simple.", examples: ["When I got to the station, the last train **had left**. (The train left first.)", "She **had never seen** snow before she moved to Canada."] },
        { title: "The reason behind a past situation", text: "Use it to explain a past feeling or result.", examples: ["He was nervous because he **hadn't prepared** his speech.", "The streets were wet. It **had rained** overnight."] },
        { title: "Don't overuse it", text: "If you tell events in the order they happened, the past simple is enough. With only one past event, \"had\" is wrong.", examples: ["I woke up, **had** breakfast and **caught** the bus. (in order: no past perfect needed)", "I **visited** Japan last year. (not: I had visited Japan last year.)"] }
      ],
      compare: {
        title: "One word changes the story",
        text: "The past perfect is not just \"more past\". It changes what happened.",
        rows: [
          ["Past simple", "When I got home, my brother **cooked** dinner.", "I arrived first, then he started cooking."],
          ["Past perfect", "When I got home, my brother **had cooked** dinner.", "Dinner was ready when I arrived."]
        ]
      },
      mistakes: [
        { wrong: "I had gone to Ocean Park yesterday.", right: "I went to Ocean Park yesterday.", why: "There is no earlier past event, so a single finished action takes the past simple." },
        { wrong: "The bus already left when we reached the stop.", right: "The bus had already left when we reached the stop.", why: "The bus left first, so it takes had + V3." },
        { wrong: "Had you ate breakfast before you left?", right: "Had you eaten breakfast before you left?", why: "After \"had\", use V3: eat – ate – eaten." }
      ],
      tip: "Look for two past events and ask which came first. Only that one gets \"had\". If there is only one past event, \"had\" is a mistake.",
      practice: { id: "pastperfect-quiz", label: "Try the quiz" }
    },

    ing: {
      intro: "An -ing phrase squeezes a whole clause into a few words. It describes the subject of the main clause, and that subject is doing the action.",
      form: [
        { label: "At the same time", formula: "V-ing …, subject + verb", example: "**Walking** home, I saw a stray cat. (= While I was walking home …)" },
        { label: "One right after the other", formula: "V-ing …, subject + verb", example: "**Opening** the box, he found a note. (= He opened the box and found …)" },
        { label: "Reason", formula: "V-ing …, subject + verb", example: "**Knowing** she was tired, we let her sleep. (= Because we knew …)" },
        { label: "Negative", formula: "Not + V-ing …, subject + verb", example: "**Not wanting** to wake the baby, she whispered." }
      ],
      functions: [
        { title: "The golden rule: same subject", text: "The person doing the -ing action must come straight after the comma. If not, the sentence says something silly.", examples: ["**Walking** into the classroom, **I** noticed the drawings on the board. (I walked in.)", "Not: Walking into the classroom, the board was covered in drawings. (The board can't walk!)"] },
        { title: "Active meaning", text: "The subject does the -ing action. If something happens to the subject, you need an -ed phrase instead.", examples: ["**Hearing** the news, she screamed. (She heard the news.)", "**Having** more practice, you will sing better. (= If you have more practice …)"] },
        { title: "Written, not chatty", text: "These phrases sound formal. Use one or two in a story or article to vary your sentences, but not in a WhatsApp message and not in every sentence.", examples: ["Story: **Grabbing** her bag, Mei ran for the door.", "Chat: Grabbed my bag and ran!"] }
      ],
      compare: {
        title: "Same idea, three sentences",
        text: "An -ing phrase only works when both parts share one subject.",
        rows: [
          ["Two clauses", "Because **he** wanted to save money, **he** walked to school.", "Correct, but a little long."],
          ["-ing phrase", "**Wanting** to save money, **he** walked to school.", "Same subject (he), so it works."],
          ["Dangling", "**Wanting** to save money, **the bus** was skipped.", "Wrong: the bus didn't want anything."]
        ]
      },
      mistakes: [
        { wrong: "Looking out of the window, the mountains were beautiful.", right: "Looking out of the window, I saw how beautiful the mountains were.", why: "The mountains weren't looking out of the window. The person doing the looking must come after the comma." },
        { wrong: "Don't knowing the answer, he kept quiet.", right: "Not knowing the answer, he kept quiet.", why: "Make an -ing phrase negative with \"not\", never \"don't\"." },
        { wrong: "Feeling hungry, so I made some noodles.", right: "Feeling hungry, I made some noodles.", why: "The phrase already gives the reason. Don't add \"so\" as well." }
      ],
      tip: "After an -ing phrase, look at the first noun after the comma and ask: can this do the -ing action? If not, the sentence is broken.",
      practice: { id: "ing-quiz", label: "Try the quiz" }
    },

    ed: {
      intro: "An -ed phrase starts with a past participle (V3). It also describes the subject of the main clause, but this time something happens to the subject, or the subject has a feeling.",
      form: [
        { label: "Reason", formula: "V3 …, subject + verb", example: "**Shocked** by the news, Sam sat down. (= Because Sam was shocked …)" },
        { label: "Condition", formula: "V3 …, subject + verb", example: "**Kept** in the fridge, the soup will last three days. (= If it is kept …)" },
        { label: "Description", formula: "V3 …, subject + verb", example: "**Built** in 1915, the clock tower is a famous landmark." },
        { label: "Negative", formula: "Not + V3 …, subject + verb", example: "**Not invited** to the party, Leo stayed at home." }
      ],
      functions: [
        { title: "-ing or -ed?", text: "Ask: does the subject do the action, or is it done to the subject? Does it → V-ing. Done to it, or a feeling → V3.", examples: ["**Barking** loudly, the dog chased the boy. (The dog barked.)", "**Frightened** by the dog, the boy ran away. (The dog frightened him.)"] },
        { title: "Same subject, again", text: "The subject after the comma must be the one that was shocked, invited or built.", examples: ["**Bored** by the speech, **people** left early. (People were bored.)", "Not: Bored by the speech, the show ended early. (The show wasn't bored.)"] },
        { title: "Feelings: -ed for the person", text: "The person who has the feeling takes -ed. The thing that causes the feeling takes -ing.", examples: ["**Disappointed** with her result, Kitty asked to retake the test.", "The result was **disappointing**."] }
      ],
      compare: {
        title: "Watch the ending",
        text: "One letter changes who feels what.",
        rows: [
          ["-ed (has the feeling)", "**Disappointed** with her result, Kitty decided to try again.", "Kitty felt disappointed."],
          ["-ing (causes it)", "**Disappointing** her fans, the singer cancelled the concert.", "The singer made her fans feel disappointed."]
        ]
      },
      mistakes: [
        { wrong: "Exciting about the trip, the children couldn't sleep.", right: "Excited about the trip, the children couldn't sleep.", why: "The children felt excited. The person with the feeling takes -ed." },
        { wrong: "Written in a hurry, I made lots of mistakes in my essay.", right: "Written in a hurry, my essay was full of mistakes.", why: "The essay was written, not me. Put the thing the V3 describes after the comma." },
        { wrong: "Being encouraged by his coach, so Tom entered the race.", right: "Encouraged by his coach, Tom entered the race.", why: "Drop \"so\": the phrase already gives the reason. \"Being\" isn't needed either." }
      ],
      tip: "When a sentence starts with V-ing or V3, check the subject after the comma. Is it doing the action (V-ing) or receiving it (V3)? Is it the right subject at all?",
      practice: { id: "ed-quiz", label: "Try the quiz" }
    },

    statements: {
      intro: "Reported speech tells someone what another person said, without their exact words. Move things one step back (the tense, the people, the place and the time), but only when they need to move.",
      form: [
        { label: "Present → past", formula: "am/is/are → was/were, like → liked", example: "‘I like K-pop,’ said Joy. → Joy said (that) she **liked** K-pop." },
        { label: "Past or present perfect → past perfect", formula: "did / have done → had done", example: "‘I've lost my key,’ said Ben. → Ben said he **had lost** his key." },
        { label: "Modals", formula: "will → would, can → could", example: "‘I'll call you,’ said Mum. → Mum said she **would** call me." },
        { label: "People", formula: "I → he/she, my → his/her", example: "‘My bag is heavy,’ said Ivy. → Ivy said **her** bag was heavy." },
        { label: "Place and time", formula: "here → there, today → that day, tomorrow → the next day, yesterday → the day before", example: "‘I'll see you here tomorrow.’ → He said he would see me **there the next day**." }
      ],
      functions: [
        { title: "Still true? You can keep the tense", text: "If what was said is still true now, keeping the tense sounds natural. This is common with facts.", examples: ["‘The Earth goes round the Sun,’ said our teacher. → Our teacher said the Earth **goes** round the Sun.", "‘I live in Tai Po,’ said Ken (and he still does). → Ken said he **lives** (or **lived**) in Tai Po."] },
        { title: "Time words move only if the day has changed", text: "Reporting on the same day? \"Today\" stays \"today\". Reporting a week later? It becomes \"that day\".", examples: ["(This morning) ‘I'm free today,’ said Ann. → Ann said she was free **today**.", "(Last month) ‘I'm free today,’ said Ann. → Ann said she was free **that day**."] },
        { title: "Choose a precise reporting verb", text: "\"Said\" works, but other verbs show how something was said. Each has its own pattern.", examples: ["She **told me** (that) … (\"tell\" always needs a person)", "He **explained** / **complained** / **admitted** that …", "She **promised to** help. He **reminded me to** bring my card."] }
      ],
      compare: {
        title: "Say or tell?",
        text: "This is one of the most common reported-speech mistakes.",
        rows: [
          ["say", "She **said** (that) she was tired.", "No person after \"said\"."],
          ["say to", "She **said to me** that she was tired.", "Add \"to\" before the person."],
          ["tell", "She **told me** (that) she was tired.", "\"Tell\" always needs a person."]
        ]
      },
      mistakes: [
        { wrong: "He said me that he was busy.", right: "He told me that he was busy.", why: "\"Say\" can't take a person straight after it. Use \"told me\" or \"said to me\"." },
        { wrong: "Mia said that ‘I am hungry’.", right: "Mia said that she was hungry.", why: "No quotation marks in reported speech, and \"I\" becomes \"she\"." },
        { wrong: "(Last week) Leo said he will come tomorrow.", right: "Leo said he would come the next day.", why: "His \"tomorrow\" has passed, so move both the tense and the time word back." }
      ],
      tip: "After \"said\" or \"told\", check three things: the tense, the pronoun and the time word. One of them is usually the trap.",
      practice: { id: "statements-quiz", label: "Try the quiz" }
    },

    questions: {
      intro: "A reported question is not a question any more. It uses statement word order (subject before verb) and ends with a full stop.",
      form: [
        { label: "Yes/No question", formula: "asked (+ person) + if/whether + subject + verb", example: "‘Are you ready?’ → She asked **if I was** ready." },
        { label: "Wh- question", formula: "asked (+ person) + wh-word + subject + verb", example: "‘Where is the hall?’ → He asked **where the hall was**." },
        { label: "do/does/did questions", formula: "drop do/does/did, change the main verb", example: "‘Do you like sushi?’ → She asked **if I liked** sushi." },
        { label: "Who/what is the subject", formula: "keep the same order", example: "‘Who broke the window?’ → He asked **who had broken** the window." }
      ],
      functions: [
        { title: "Statement word order", text: "Put the subject before the verb, as in a normal sentence. This is the most common mistake.", examples: ["He asked where **the station was**. (not: where was the station)", "She asked what time **the film started**. (not: what time did the film start)"] },
        { title: "No \"that\", no question mark", text: "Report a question with if/whether or a wh-word. Never add \"that\", and end with a full stop.", examples: ["She asked **if** I was free. (not: asked that if)", "I wondered **whether** the shop was still open."] },
        { title: "Polite questions work the same way", text: "\"Could you tell me …?\" and \"Do you know …?\" sound more polite than direct questions. The part after the question word still uses statement order.", examples: ["Could you tell me **where the toilet is**?", "Do you know **what time the shop opens**?"] }
      ],
      compare: {
        title: "Direct, reported, polite",
        text: "One question, three ways.",
        rows: [
          ["Direct", "‘When **does** the bus **leave**?’", "Question order: does + subject + verb."],
          ["Reported", "He asked when **the bus left**.", "Statement order, full stop."],
          ["Polite", "Do you know when **the bus leaves**?", "Statement order inside, but the whole sentence is a question."]
        ]
      },
      mistakes: [
        { wrong: "She asked me where did I live.", right: "She asked me where I lived.", why: "Drop \"did\" and put the subject before the verb." },
        { wrong: "He asked that if I wanted a drink.", right: "He asked if I wanted a drink.", why: "No \"that\" before if or whether." },
        { wrong: "Do you know where is the post office?", right: "Do you know where the post office is?", why: "Inside a bigger question, use statement order: subject, then verb." }
      ],
      tip: "After \"asked\", \"wondered\" or \"Do you know\", read what follows. If the verb comes before the subject, swap them.",
      practice: { id: "questions-quiz", label: "Try the quiz" }
    },

    linking: {
      intro: "Linking words show how two ideas connect. First pick the job (add, contrast, cause, example, condition, purpose or conclude), then check the grammar that comes after the word.",
      form: [
        { label: "Add", formula: "moreover, furthermore, in addition, as well as", example: "The flat is small. **Moreover**, it's noisy." },
        { label: "Contrast", formula: "however, although, even though, yet, on the other hand", example: "**Although** it rained, we went hiking." },
        { label: "Cause and effect", formula: "because, since, due to, as a result, therefore", example: "The road was closed. **As a result**, we were late." },
        { label: "Example", formula: "for example, for instance, such as, including", example: "Some cities, **such as** Tokyo and Seoul, are very safe." },
        { label: "Condition", formula: "as long as, provided that, unless, in case", example: "You can go out **as long as** you finish your homework." },
        { label: "Purpose", formula: "in order to, so as to, so that", example: "I left early **so that** I could get a seat." },
        { label: "Conclusion", formula: "all in all, overall, in conclusion, to sum up", example: "**All in all**, it was a great trip." }
      ],
      functions: [
        { title: "Joiners and sentence starters", text: "Some words join two clauses in one sentence (although, because, unless, so that). Others start a new sentence and take a comma (However, Therefore, Moreover).", examples: ["**Although** the film was long, I enjoyed it.", "The film was long. **However,** I enjoyed it.", "Not: Although the film was long, but I enjoyed it. (Use one linker, not two.)"] },
        { title: "What comes next: a noun or a clause?", text: "\"Because of\", \"due to\", \"despite\", \"in addition to\" and \"such as\" take a noun or V-ing. \"Because\", \"although\" and \"so that\" take a clause (subject + verb).", examples: ["**Because of** the rain, the match was cancelled.", "**Because** it rained, the match was cancelled.", "**In addition to** winning the prize, she was interviewed on TV."] },
        { title: "Unless and in case", text: "\"Unless\" means \"if not\". \"In case\" means \"to be ready because something might happen\". Neither is followed by \"will\".", examples: ["We'll walk **unless** it rains. (= if it doesn't rain)", "Take an umbrella **in case** it rains. (= because it might rain)"] }
      ],
      compare: {
        title: "Same idea, different grammar",
        text: "Three ways to show contrast. Look at what follows each one.",
        rows: [
          ["although + clause", "**Although** the tickets were expensive, we bought them.", "Subject + verb after it."],
          ["however + new sentence", "The tickets were expensive. **However,** we bought them.", "Full stop before, comma after."],
          ["despite + noun", "**Despite** the price, we bought the tickets.", "A noun or V-ing, never a clause."]
        ]
      },
      mistakes: [
        { wrong: "Although I was tired, but I finished my homework.", right: "Although I was tired, I finished my homework.", why: "Use one contrast word. \"Although\" already links the two parts." },
        { wrong: "Due to it was raining, the match was cancelled.", right: "Due to the rain, the match was cancelled.", why: "\"Due to\" needs a noun. With a clause, use \"because\"." },
        { wrong: "I'll bring a jacket in case it will be cold.", right: "I'll bring a jacket in case it is cold.", why: "No \"will\" after \"in case\", just like after \"if\"." }
      ],
      tip: "For every linking word, check two things: does its job match the ideas (add, contrast, cause …)? And does the right grammar follow it (a noun or a clause, a new sentence or the same one)?",
      practice: { id: "linking-quiz", label: "Try the quiz" }
    }
  },

  quizzes: {
    pastPerfect: { topic: "Past perfect", sets: [[
      { q: "By the time the ambulance arrived, a passer-by ______ the injured cyclist first aid, which probably saved his life.", options: ["gave", "had given", "has given", "gives"], answer: 1, explanation: "The first aid was finished before the ambulance came. \"By the time\" + a past event points to had + V3.", hint: "Which happened first: the first aid or the ambulance arriving? \"By the time\" is a big clue." },
      { q: "‘When Mia walked into the hall, the speech had finished.’ What does this tell us?", options: ["Mia heard the whole speech.", "Mia heard the end of the speech.", "Mia missed the speech.", "The speech started when Mia walked in."], answer: 2, explanation: "\"Had finished\" means the speech ended before she walked in, so she missed all of it.", hint: "Did the speech end before or after Mia walked in?" },
      { q: "Which sentence sounds the most natural?", options: ["I had woken up at seven, had had breakfast and had left for school.", "I woke up at seven, had breakfast and left for school.", "I woke up at seven, had had breakfast and had left for school.", "I had woken up at seven, had breakfast and left for school."], answer: 1, explanation: "The events are told in the order they happened, so the past simple is enough. Here \"had breakfast\" is just \"have breakfast\" in the past.", hint: "Are the events told in order? If so, does anything need to step back further into the past?" },
      { q: "Jason was furious with himself. He ______ his phone on the MTR, and all his revision notes were on it.", options: ["left", "had left", "has left", "was leaving"], answer: 1, explanation: "He was furious at a past moment, and leaving the phone happened before that. The past perfect explains a past feeling.", hint: "He felt furious in the past. Did the leaving happen before that feeling?" },
      { q: "Tim's mum bought him a new laptop, but only after his old one broke. Which sentence says the same thing?", options: ["Tim's old laptop had broken before his mum bought him a new one.", "Tim's mum had bought him a new laptop before his old one broke.", "Tim's old laptop broke after his mum had bought him a new one.", "When Tim's mum bought him a new laptop, his old one was breaking."], answer: 0, explanation: "The breaking came first, so \"had broken\" goes on it. The buying came second.", hint: "Which came first: the breaking or the buying? \"Had\" goes on the first one." },
      { q: "I ______ such a beautiful sunset until I went on that trip to Lamma Island.", options: ["never see", "had never seen", "have never seen", "was never seeing"], answer: 1, explanation: "\"Until I went\" marks a point in the past. Your experience up to that point takes had + never + V3.", hint: "This is your experience up to a moment in the past. Which tense counts up to a past moment?" },
      { q: "Which question is correct?", options: ["Where you had hidden the present?", "Where had you hid the present?", "Where had you hidden the present?", "Where did you had hidden the present?"], answer: 2, explanation: "Wh- word + had + subject + V3. Hide – hid – hidden.", hint: "Check the word order after \"Where\", then check the V3 of \"hide\"." },
      { q: "‘After the guests left, we tidied the flat.’ Must you change \"left\" to \"had left\"?", options: ["Yes, because the guests left first.", "No. \"After\" already shows the order, so both are correct.", "Yes, because both events are in the past.", "No, because \"had left\" can never follow \"after\"."], answer: 1, explanation: "\"After\" already shows the order, so \"after the guests left\" and \"after the guests had left\" are both correct. The past perfect is optional here.", hint: "Is there a word in the sentence that already shows which event came first?" },
      { q: "The concert ______ when we got there, so we only heard the last two songs.", options: ["had already finished", "already starts", "had already started", "has already started"], answer: 2, explanation: "They heard the last two songs, so the concert began before they arrived and was still going.", hint: "They heard two songs. Was the concert over, or still on?" },
      { q: "Which sentence is NOT natural?", options: ["I had just sat down when the phone rang.", "She had only met him once, so she didn't recognise him.", "We had lived in Sha Tin for ten years before we moved to Tai Po.", "I had bought new trainers yesterday, and I love them."], answer: 3, explanation: "Buying the trainers is the only past event, and \"I love them\" is about now. Nothing later in the past needs it, so say \"I bought\".", hint: "Which sentence has only one past event?" }
    ]] },

    ing: { topic: "-ing phrases", sets: [[
      { q: "Which sentence is correct?", options: ["Running for the bus, my bag fell open.", "Running for the bus, I dropped my bag.", "Running for the bus, my phone was dropped.", "Running for the bus, it started to rain."], answer: 1, explanation: "\"I\" was running, and \"I\" comes straight after the comma. A bag, a phone or \"it\" can't run.", hint: "Who was running? Find the sentence where that person comes straight after the comma." },
      { q: "Rewrite: ‘Because she didn't want to be late, Amy took a taxi.’", options: ["Not wanting to be late, Amy took a taxi.", "Don't wanting to be late, Amy took a taxi.", "Wanting not late, Amy took a taxi.", "Not wanted to be late, Amy took a taxi."], answer: 0, explanation: "Put \"not\" before the -ing word: Not wanting.", hint: "How do you make an -ing phrase negative? Not \"don't\"." },
      { q: "‘Hearing a strange noise downstairs, ______.’ Which ending fits?", options: ["the lights were switched on", "a burglar was found by my dad", "my dad went to check", "it woke the whole family"], answer: 2, explanation: "Only \"my dad\" could hear the noise, so he must come right after the comma.", hint: "Who or what can hear a noise? It must be the subject after the comma." },
      { q: "‘Opening the fridge, Ken found that someone had eaten his cake.’ What does the -ing phrase show?", options: ["the reason Ken found out", "Ken opened the fridge and then found out", "a condition", "Ken found out before he opened the fridge"], answer: 1, explanation: "One action right after the other: he opened the fridge, then found the cake was gone.", hint: "Think about the order. Did opening the fridge cause the discovery, or just come right before it?" },
      { q: "Which -ing phrase shows a reason?", options: ["Walking along the beach, we collected shells.", "Knowing that the shop closed at nine, we hurried.", "Turning the corner, she saw the school.", "Sitting on the bench, he read a book."], answer: 1, explanation: "\"Knowing that the shop closed at nine\" = because we knew. The others are actions at the same time or one after another.", hint: "Which phrase can you replace with \"Because we …\"?" },
      { q: "‘Lily was tired after the long hike. She went straight to bed.’ Which version is best for a story?", options: ["Being tired after the long hike, so Lily went straight to bed.", "Tired after the long hike, Lily went straight to bed.", "Lily, she was tired after the long hike, went straight to bed.", "Tiring after the long hike, Lily went straight to bed."], answer: 1, explanation: "\"Tired\" describes how Lily felt. \"Tiring\" would mean she made other people tired, and \"so\" can't follow the phrase.", hint: "Did Lily feel tired, or did she make others tired? And does the phrase need \"so\"?" },
      { q: "Choose the correct sentence.", options: ["Having no umbrella, the rain soaked me.", "Having no umbrella, I got soaked.", "Having no umbrella, my clothes got soaked.", "Had no umbrella, I got soaked."], answer: 1, explanation: "\"I\" had no umbrella, so \"I\" follows the comma. The rain and my clothes didn't have an umbrella.", hint: "Who had no umbrella?" },
      { q: "Which version of ‘While I was waiting for the lift, I checked my messages’ is NOT correct?", options: ["Waiting for the lift, I checked my messages.", "While waiting for the lift, I checked my messages.", "I checked my messages while waiting for the lift.", "Waited for the lift, I checked my messages."], answer: 3, explanation: "A past simple verb can't start a phrase like this. I was doing the waiting, so use \"Waiting\".", hint: "Which one starts with the wrong form of the verb?" },
      { q: "‘______ the instructions carefully, you will avoid silly mistakes in the exam.’", options: ["Read", "Reading", "Being read", "To reading"], answer: 1, explanation: "A condition: \"Reading the instructions carefully\" = If you read them carefully. You do the reading, so it's active.", hint: "You are the one reading. Which form shows an active action at the start of a sentence?" },
      { q: "Which is the most natural message to send a friend on WhatsApp?", options: ["Having finished my homework, I shall now proceed to the cinema.", "Finished my homework! Heading to the cinema now.", "Finishing my homework, the cinema is where I'm going.", "My homework having been finished, I go to the cinema."], answer: 1, explanation: "-ing phrases sound formal and written. In a chat, short and casual is natural. The third one also dangles: the cinema didn't finish your homework.", hint: "Who are you talking to? Would a teenager really write like a formal report?" }
    ]] },

    ed: { topic: "-ed phrases", sets: [[
      { q: "‘______ by the loud music next door, Grandpa couldn't fall asleep.’", options: ["Annoying", "Annoyed", "Annoy", "Having annoyed"], answer: 1, explanation: "The music annoyed Grandpa, so he received the feeling: Annoyed.", hint: "Did Grandpa annoy someone, or did the music annoy him?" },
      { q: "Which sentence is correct?", options: ["Bitten by a mosquito, the itch kept me awake.", "Bitten by a mosquito, I scratched my arm all night.", "Biting by a mosquito, I scratched my arm.", "Bitten by a mosquito, it was very itchy."], answer: 1, explanation: "\"I\" was bitten, so \"I\" comes after the comma, and the passive meaning needs V3: bitten.", hint: "Who was bitten? Check the subject after the comma and the form of \"bite\"." },
      { q: "Combine: ‘The bridge was designed by a team of students. It can hold 20 kg.’", options: ["Designed by a team of students, the bridge can hold 20 kg.", "Designing by a team of students, the bridge can hold 20 kg.", "Designed by a team of students, they built a bridge that can hold 20 kg.", "The bridge designed by a team of students, it can hold 20 kg."], answer: 0, explanation: "The bridge was designed, so it follows the comma and the phrase uses V3. The students weren't designed.", hint: "What was designed: the bridge or the students?" },
      { q: "‘______ in the sun for too long, the chocolate melted.’", options: ["Leaving", "Left", "Leave", "Being leaving"], answer: 1, explanation: "Someone left the chocolate in the sun. The chocolate received the action, so use V3: Left.", hint: "Did the chocolate leave something, or was it left somewhere?" },
      { q: "Which sentence means ‘If you are given enough time, you can finish the project’?", options: ["Giving enough time, you can finish the project.", "Given enough time, you can finish the project.", "Gave enough time, you can finish the project.", "Being give enough time, you can finish the project."], answer: 1, explanation: "An -ed phrase can show a condition: Given enough time = If you are given enough time.", hint: "You receive the time. Which form shows that?" },
      { q: "Fill both blanks: ‘(a) ___ by the result, the team cheered. (b) ___ the crowd, the team scored again.’", options: ["Thrilled / Thrilling", "Thrilling / Thrilled", "Thrilled / Thrilled", "Thrilling / Thrilling"], answer: 0, explanation: "(a) The team felt thrilled: Thrilled. (b) The team thrilled the crowd: Thrilling.", hint: "In (a), who has the feeling? In (b), who causes it?" },
      { q: "Which sentence is NOT correct?", options: ["Not invited to the meeting, Sue felt left out.", "Not supported by his parents, Tim turned down the offer.", "Not convinced by her excuse, an investigation was started.", "Not told about the change, we went to the wrong room."], answer: 2, explanation: "An investigation can't be convinced. Say: Not convinced by her excuse, the police started an investigation.", hint: "In each one, could the subject after the comma really have that feeling?" },
      { q: "Which sounds the most natural in a news report?", options: ["Founded in 1911, the University of Hong Kong is the city's oldest university.", "The University of Hong Kong, it was founded in 1911, is the city's oldest university.", "Founding in 1911, the University of Hong Kong is the city's oldest university.", "Being founded in 1911, so the University of Hong Kong is the city's oldest university."], answer: 0, explanation: "The university was founded (passive), so use V3, with no extra \"it\" and no \"so\".", hint: "Did the university found something, or was it founded?" },
      { q: "‘Shocked to see the dog lying on the floor, ______.’", options: ["the vet was called at once", "Anna rushed it to the vet", "the floor was covered in treat boxes", "it was taken to the vet"], answer: 1, explanation: "Anna was the one who was shocked, so she must follow the comma.", hint: "Who was shocked? It must be the subject after the comma." },
      { q: "Which -ed phrase shows a condition (if …)?", options: ["Tired from work, Mum went to bed early.", "Kept in a cool place, these biscuits will stay fresh for weeks.", "Surprised by the question, Ben laughed.", "Encouraged by her friends, she joined the choir."], answer: 1, explanation: "\"Kept in a cool place\" = If they are kept in a cool place. The others give a reason.", hint: "Which one can you replace with \"If they are …\"? Look for \"will\" in the main clause." }
    ]] },

    statements: { topic: "Reported statements", sets: [[
      { q: "Last Friday, Kelly said, ‘I'm going to the dentist tomorrow.’ Today is Monday. Report what she said.", options: ["Kelly said she was going to the dentist tomorrow.", "Kelly said she was going to the dentist the next day.", "Kelly said she is going to the dentist tomorrow.", "Kelly said I was going to the dentist the next day."], answer: 1, explanation: "Kelly's \"tomorrow\" was Saturday, which has passed, so it becomes \"the next day\".", hint: "Today is Monday. Is Kelly's \"tomorrow\" still tomorrow?" },
      { q: "‘Water boils at 100°C,’ our science teacher said. Which report is best?", options: ["Our science teacher said water boils at 100°C.", "Our science teacher said water had boiled at 100°C.", "Our science teacher said water would boil at 100°C.", "Our science teacher told water boils at 100°C."], answer: 0, explanation: "It's a fact that is still true, so the present tense sounds natural. \"Told\" would need a person.", hint: "Is it still true today? And does \"told\" need someone after it?" },
      { q: "Ben said to me, ‘I've already watched that film.’", options: ["Ben said me he had already watched that film.", "Ben told me he had already watched that film.", "Ben told he had already watched that film.", "Ben told to me he had already watched that film."], answer: 1, explanation: "\"Tell\" takes a person straight after it: told me. \"Said me\" and \"told to me\" are wrong.", hint: "Which verb takes a person straight after it, with no \"to\"?" },
      { q: "‘I'm sorry, I broke your mug,’ said Joe. → Joe ______ that he had broken my mug.", options: ["complained", "admitted", "promised", "reminded"], answer: 1, explanation: "He's confessing a mistake: admitted. \"Reminded\" would need a person, and \"promised\" is about the future.", hint: "What is Joe doing: complaining, confessing, promising or reminding?" },
      { q: "Before last week's party, Rita said, ‘I can't come because I have to babysit.’ Report it now.", options: ["Rita said she couldn't come because she had to babysit.", "Rita said she can't come because she had to babysit.", "Rita said she couldn't come because she has to babysit.", "Rita said she couldn't came because she had to babysit."], answer: 0, explanation: "The party is over, so both verbs move back: can't → couldn't, have to → had to. After \"couldn't\", use V1.", hint: "The party has already happened. Do both verbs need to move back?" },
      { q: "Mum said, ‘I'll pick you up here at five.’ You report it later, at home.", options: ["Mum said she would pick me up there at five.", "Mum said she will pick me up here at five.", "Mum said I would pick you up there at five.", "Mum said she would pick you up here at five."], answer: 0, explanation: "I → she, you → me, will → would, and you are no longer at that place, so here → there.", hint: "Check four things: the person speaking, the person spoken to, \"will\", and \"here\"." },
      { q: "Which sentence is NOT correct?", options: ["He said that he was tired.", "He said he was tired.", "He told me that he was tired.", "He told that he was tired."], answer: 3, explanation: "\"Told\" always needs a person: He told me that … \"That\" is optional in all the others.", hint: "Which verb is missing the person it needs?" },
      { q: "An hour ago, Sam told you, ‘I live in Tsuen Wan.’ He still lives there. Which report is NOT acceptable?", options: ["Sam said he lives in Tsuen Wan.", "Sam said he lived in Tsuen Wan.", "Sam said he had lived in Tsuen Wan.", "Sam told me he lives in Tsuen Wan."], answer: 2, explanation: "\"Had lived\" suggests he doesn't live there any more. \"Lives\" (still true) and \"lived\" (normal change) are both fine.", hint: "Which one changes the meaning, as if he had moved away?" },
      { q: "Last month, the choir leader announced, ‘We are rehearsing for the concert this week.’", options: ["The choir leader announced that they were rehearsing for the concert that week.", "The choir leader announced that they are rehearsing for the concert this week.", "The choir leader announced that they had rehearsed for the concert this week.", "The choir leader announced that they were rehearsing for the concert last week."], answer: 0, explanation: "A month later, \"this week\" is no longer this week: it becomes \"that week\", and \"are rehearsing\" becomes \"were rehearsing\".", hint: "It was said a month ago. Which week was \"this week\" then?" },
      { q: "A few days ago, Tina told me, ‘I saw your brother at the library yesterday.’", options: ["Tina told me she had seen my brother at the library the day before.", "Tina told me she had seen your brother at the library yesterday.", "Tina told me she has seen my brother at the library the day before.", "Tina told me she saw my brother at the library yesterday."], answer: 0, explanation: "saw → had seen, your → my, and her \"yesterday\" is no longer yesterday, so it becomes \"the day before\".", hint: "Her \"yesterday\" was a few days ago. Check the tense, the pronoun and the time word." }
    ]] },

    questions: { topic: "Reported questions", sets: [[
      { q: "‘Where did you buy that jacket?’ Kate asked me.", options: ["Kate asked me where did I buy that jacket.", "Kate asked me where I had bought that jacket.", "Kate asked me where had I bought that jacket.", "Kate asked me that where I had bought that jacket."], answer: 1, explanation: "Drop \"did\", put the subject before the verb, and move the tense back: where I had bought.", hint: "In a reported question, does the subject come before or after the verb? Is there a place for \"did\"?" },
      { q: "You are lost in Mong Kok. What is the most polite thing to say to a stranger?", options: ["Tell me where the MTR station is.", "Excuse me, could you tell me where the MTR station is?", "Excuse me, could you tell me where is the MTR station?", "Excuse me, could you tell me where the MTR station is it?"], answer: 1, explanation: "\"Could you tell me\" is polite, and the part after \"where\" uses statement order: the station is.", hint: "After \"Could you tell me where\", which comes first: the subject or the verb?" },
      { q: "‘Who ate my noodles?’ Dad asked.", options: ["Dad asked who had eaten his noodles.", "Dad asked who had he eaten his noodles.", "Dad asked who did eat his noodles.", "Dad asked if who had eaten his noodles."], answer: 0, explanation: "\"Who\" is the subject here, so the order stays the same. Only the tense and \"my\" change.", hint: "Here \"who\" is the one doing the eating. Does the word order need to change?" },
      { q: "‘Is the test on Friday?’ I asked Ms Lee.", options: ["I asked Ms Lee is the test on Friday.", "I asked Ms Lee if the test was on Friday.", "I asked Ms Lee if was the test on Friday.", "I asked Ms Lee whether is the test on Friday."], answer: 1, explanation: "Yes/No question: if or whether + subject + verb. The test was.", hint: "A yes/no question needs a linking word. Then check the order of \"the test\" and the verb." },
      { q: "Which sentence is correct?", options: ["I wonder what time does the shop close.", "I wonder what time the shop closes.", "I wonder what time the shop closes?", "I wonder that what time the shop closes."], answer: 1, explanation: "\"I wonder\" is a statement, so use statement order and end with a full stop.", hint: "Is \"I wonder …\" a question or a statement? Check the order and the end." },
      { q: "‘Have you ever been to Japan?’ my cousin asked me.", options: ["My cousin asked me if I had ever been to Japan.", "My cousin asked me had I ever been to Japan.", "My cousin asked me if I have ever been to Japan?", "My cousin asked me if I ever had been in Japan."], answer: 0, explanation: "if + subject + verb, with have been → had been, \"ever\" after \"had\", and a full stop.", hint: "Check four things: the linking word, the word order, the tense and the punctuation." },
      { q: "Yesterday, Mr Chan asked us, ‘Can you help me carry these boxes tomorrow?’ You report it today.", options: ["Mr Chan asked us if we could help him carry those boxes today.", "Mr Chan asked us if we could help him carry these boxes tomorrow.", "Mr Chan asked us could we help him carry those boxes the next day.", "Mr Chan asked us if we can help him carry those boxes today."], answer: 0, explanation: "He asked yesterday, so his \"tomorrow\" is today. can → could, these → those, and statement order.", hint: "He asked yesterday. When is his \"tomorrow\"?" },
      { q: "Which sentence is NOT correct?", options: ["She asked whether I needed a lift.", "She asked if I needed a lift.", "She asked me whether or not I needed a lift.", "She asked me did I need a lift."], answer: 3, explanation: "Reported questions don't keep \"did\" or question order. Use if or whether: She asked me if I needed a lift.", hint: "Which one still looks like a direct question?" },
      { q: "‘How much does this cost?’ the tourist asked.", options: ["The tourist asked how much did that cost.", "The tourist asked how much that cost.", "The tourist asked how much cost that.", "The tourist asked how much was that cost."], answer: 1, explanation: "Drop \"does\", move the tense back (costs → cost), and this → that.", hint: "Remove the helping verb. Then put the subject before the verb." },
      { q: "Which polite question is correct?", options: ["Do you know when does the next bus come?", "Do you know when the next bus comes?", "Do you know when the next bus comes.", "Do you know when will the next bus come?"], answer: 1, explanation: "The whole sentence is a question (Do you know …?), so it ends with \"?\", but the part after \"when\" uses statement order.", hint: "Inside \"Do you know when …\", use statement order. But is the whole sentence a question?" }
    ]] },

    linking: { topic: "Linking words", sets: [[
      { q: "The new phone has a brilliant camera. ______, its battery barely lasts a day.", options: ["Moreover", "However", "Therefore", "For instance"], answer: 1, explanation: "A good point, then a bad point: that's contrast. \"However\" starts the new sentence.", hint: "Is the second sentence adding a good point, or turning to a bad one?" },
      { q: "______ the heavy traffic, we arrived on time.", options: ["Although", "Despite", "However", "Even though"], answer: 1, explanation: "\"The heavy traffic\" is a noun phrase, not a clause, so you need \"Despite\". \"Although\" and \"Even though\" need a subject + verb.", hint: "Is \"the heavy traffic\" a noun or a full clause with a verb?" },
      { q: "You can borrow my notes ______ you give them back by Friday.", options: ["unless", "in case", "as long as", "so as to"], answer: 2, explanation: "Giving them back is the condition for borrowing: as long as = only if.", hint: "Is giving the notes back a condition, a reason to be ready, or a purpose?" },
      { q: "I always carry a power bank ______ my phone runs out of battery.", options: ["unless", "in case", "as long as", "so as"], answer: 1, explanation: "You carry it to be ready because the battery might run out: in case.", hint: "Do you carry it only if the battery runs out, or to be ready because it might?" },
      { q: "Which sentence is correct?", options: ["Due to the typhoon, school was closed.", "Due to there was a typhoon, school was closed.", "Because of there was a typhoon, school was closed.", "Because the typhoon, school was closed."], answer: 0, explanation: "\"Due to\" and \"because of\" need a noun. \"Because\" needs a clause: Because there was a typhoon …", hint: "Which linkers take a noun, and which take a subject + verb?" },
      { q: "Which sentence is NOT correct?", options: ["Even though she studied hard, she failed the test.", "She studied hard, yet she failed the test.", "Although she studied hard, but she failed the test.", "She studied hard. However, she failed the test."], answer: 2, explanation: "\"Although\" and \"but\" both show contrast. Use one, not both.", hint: "Which sentence uses two contrast words for one idea?" },
      { q: "We booked the tickets a month early ______ get good seats.", options: ["so that", "in order to", "such as", "as a result"], answer: 1, explanation: "\"Get\" is a bare verb, so you need \"in order to\". \"So that\" needs a clause: so that we could get good seats.", hint: "Look at what comes after the blank: a verb on its own, or a subject + verb?" },
      { q: "Which sentence uses the linker correctly?", options: ["Many teenagers enjoy outdoor sports. Such as hiking and kayaking.", "Many teenagers enjoy outdoor sports, such as hiking and kayaking.", "Many teenagers enjoy outdoor sports. For example hiking and kayaking.", "Many teenagers enjoy outdoor sports, for instance, they go hiking and kayaking."], answer: 1, explanation: "\"Such as\" adds examples inside the same sentence. A and C leave a sentence with no verb, and D joins two sentences with only a comma.", hint: "Does each option end up with complete sentences, each with its own verb?" },
      { q: "‘You won't pass ______ you start revising now.’ Which word means \"if you don't start revising now\"?", options: ["unless", "in case", "as long as", "provided that"], answer: 0, explanation: "\"Unless\" means \"if not\": you won't pass if you don't start now.", hint: "Which word already has \"not\" built into its meaning?" },
      { q: "In a chatty blog post: ‘The trip had a few problems: the bus was late and it rained. ______, we had a great time.’", options: ["In conclusion", "All in all", "Furthermore", "As a result"], answer: 1, explanation: "\"All in all\" weighs up the good and the bad and gives an overall view. \"In conclusion\" belongs at the end of a formal essay or speech.", hint: "You are weighing up good and bad in a friendly post. Which phrase sounds like everyday writing, not a formal essay?" }
    ]] }
  },

  // The challenge mixes all six topics. Each blank gives the base verb (and any words to add).
  cloze: [
    {
      title: "The Missing Exam Paper",
      textType: "Story for the school magazine",
      lookFor: ["Past perfect", "-ing phrases", "-ed phrases", "Reported statements", "Reported questions"],
      blanks: {
        1: { verb: "take", answers: ["had taken"], focus: "Past perfect", form: "past perfect", why: "Someone took the paper before Ms Ho noticed: the earlier of two past events.", hint: "Which came first: someone taking the paper, or Ms Ho realising?" },
        2: { verb: "lock", answers: ["had locked"], focus: "Past perfect", form: "past perfect", why: "She locked it on Friday, before Monday's discovery: had + V3.", hint: "Friday comes before Monday. Which event is further back in the past?" },
        3: { verb: "never / forget", answers: ["had never forgotten"], focus: "Past perfect", form: "past perfect with never", why: "Her experience up to that past moment: had + never + V3. Forget – forgot – forgotten.", hint: "This is her whole experience up to a past point. Check the V3 of \"forget\"." },
        4: { verb: "shock", answers: ["shocked"], focus: "-ed phrases", form: "-ed phrase (a feeling)", why: "The discovery shocked her, so she had the feeling: Shocked by …", hint: "Did Ms Ho shock someone, or did the discovery shock her?" },
        5: { verb: "last / see", answers: ["had last seen"], focus: "Reported questions", form: "reported wh- question, past perfect", why: "‘When did you last see it?’ becomes when she had last seen it: statement order, tense moved back.", hint: "He asked ‘When did you last see it?’. Drop \"did\" and move the tense back." },
        6: { verb: "check", answers: ["had checked"], focus: "Reported statements", form: "reported statement, past perfect", why: "‘I checked it on Friday’ becomes she had checked it.", hint: "She said ‘I checked it on Friday.’ What does the past simple become in reported speech?" },
        7: { verb: "want", answers: ["wanting"], focus: "-ing phrases", form: "-ing phrase (reason)", why: "Mr Yip wanted to find out, so he does the action: Wanting = because he wanted.", hint: "Mr Yip is the one wanting. Active meaning: -ing or -ed?" },
        8: { verb: "enter", answers: ["had entered"], focus: "Reported questions", form: "reported yes/no question, past perfect", why: "‘Did anyone enter the staff room?’ becomes whether anyone had entered it.", hint: "The direct question was ‘Did anyone enter …?’. What happens to \"did\" and the tense?" },
        9: { verb: "not / see", answers: ["hadn't seen", "had not seen"], focus: "Reported statements", form: "reported statement, negative past perfect", why: "‘I didn't see anyone’ becomes he hadn't seen anyone.", hint: "He said ‘I didn't see anyone.’ Move it one step back and keep it negative." },
        10: { verb: "hold", answers: ["holding"], focus: "-ing phrases", form: "-ing phrase (same time)", why: "Kit held the envelope while he explained: an active action at the same time.", hint: "Kit is holding the envelope as he speaks. Active or passive?" },
        11: { verb: "find", answers: ["had found", "found"], focus: "Reported statements", form: "reported statement, past perfect", why: "‘I found it on the school bus’ becomes he had found it. (\"Found\" is also accepted here.)", hint: "He said ‘I found it.’ What does that become after \"he explained that\"?" },
        12: { verb: "not / bring", answers: ["hadn't brought", "had not brought"], focus: "Reported questions", form: "reported wh- question, negative past perfect", why: "‘Why didn't you bring it earlier?’ becomes why he hadn't brought it: no \"did\", statement order. Bring – brought – brought.", hint: "The direct question was ‘Why didn't you bring it in earlier?’. Check the V3 of \"bring\"." },
        13: { verb: "be", answers: ["had been", "was"], focus: "Reported statements", form: "reported statement", why: "‘I was too scared’ becomes he had been (or was) too scared.", hint: "He said ‘I was too scared.’ Move it back one step." },
        14: { verb: "relieve", answers: ["relieved"], focus: "-ed phrases", form: "-ed phrase (a feeling)", why: "Ms Ho felt relieved: the person with the feeling takes -ed.", hint: "Is Ms Ho causing relief or feeling it?" },
        15: { verb: "put", answers: ["had put"], focus: "Past perfect", form: "past perfect", why: "Putting it in her bag happened on Friday, long before she laughed: had + V3. Put – put – put.", hint: "When did she put the paper in her bag: before or after this moment?" },
        16: { verb: "fall", answers: ["had fallen"], focus: "Past perfect", form: "past perfect", why: "It fell out on the bus before Kit found it: had + V3. Fall – fell – fallen.", hint: "It fell out before Kit found it. Check the V3 of \"fall\"." }
      },
      paragraphs: [
        ["When Ms Ho opened her drawer on Monday morning, she realised that someone ", 1, " the S.3 maths paper. She was sure she ", 2, " the drawer on Friday, because she ", 3, " to do it before. ", 4, " by the discovery, she went to see the principal at once."],
        ["The principal, Mr Yip, asked her when she ", 5, " the paper. She said that she ", 6, " it on Friday afternoon. ", 7, " to find out the truth quickly, Mr Yip asked the janitor whether anyone ", 8, " the staff room over the weekend. The janitor said that he ", 9, " anyone."],
        ["The next morning, a student called Kit knocked on the staff room door. ", 10, " a crumpled envelope, he explained that he ", 11, " it on the school bus. Ms Ho asked him why he ", 12, " it in earlier, and Kit said that he ", 13, " too scared. ", 14, " to have the paper back, Ms Ho burst out laughing: she ", 15, " it in her bag by mistake, and it ", 16, " out on the bus!"]
      ]
    },
    {
      title: "Lunch at the Robot Café",
      textType: "Blog post",
      lookFor: ["Past perfect", "-ing phrases", "-ed phrases", "Reported statements", "Reported questions"],
      blanks: {
        1: { verb: "want", answers: ["wanted"], focus: "Reported questions", form: "reported yes/no question", why: "‘Do you want to try …?’ becomes if I wanted to try: drop \"do\", move the tense back.", hint: "She asked ‘Do you want to …?’. Drop \"do\" and move the verb back one step." },
        2: { verb: "hear", answers: ["had heard"], focus: "Reported statements", form: "reported statement, past perfect", why: "‘I've heard about it’ becomes I had heard about it.", hint: "I said ‘I've heard about it.’ What does the present perfect become?" },
        3: { verb: "never / be", answers: ["had never been"], focus: "Reported statements", form: "reported statement, past perfect with never", why: "‘I've never been there’ becomes I had never been there.", hint: "I said ‘I've never been there.’ Move it back, and keep \"never\" after \"had\"." },
        4: { verb: "excite", answers: ["excited"], focus: "-ed phrases", form: "-ed phrase (a feeling)", why: "The idea excited me: I had the feeling, so Excited by …", hint: "Was I exciting someone, or was I excited by the idea?" },
        5: { verb: "already / form", answers: ["had already formed"], focus: "Past perfect", form: "past perfect with already", why: "The queue formed before we arrived: had already + V3.", hint: "Was the queue there before we arrived, or did it start when we arrived?" },
        6: { verb: "not / want", answers: ["not wanting"], focus: "-ing phrases", form: "negative -ing phrase (reason)", why: "Jade didn't want to wait: Not wanting = because she didn't want.", hint: "Jade is the one who didn't want to wait. How do you make an -ing phrase negative?" },
        7: { verb: "be", answers: ["was", "would be"], focus: "Reported questions", form: "reported wh- question", why: "‘How long is the wait?’ becomes how long the wait was: statement order, tense back.", hint: "The direct question was ‘How long is the wait?’. Put the subject first, then the verb." },
        8: { verb: "just / become", answers: ["had just become"], focus: "Reported statements", form: "reported statement, past perfect with just", why: "‘A few tables have just become free’ becomes had just become. Become – became – become.", hint: "He said ‘A few tables have just become free.’ What does \"have just\" become?" },
        9: { verb: "sit", answers: ["sitting"], focus: "-ing phrases", form: "-ing phrase (same time)", why: "We sat and watched at the same time; we did the sitting: Sitting.", hint: "We are doing the sitting while we watch. Active or passive?" },
        10: { verb: "like", answers: ["would like"], focus: "Reported questions", form: "reported wh- question with would", why: "‘What would you like to order?’ becomes what we would like to order: statement order.", hint: "The robot asked ‘What would you like to order?’. Put \"we\" before the verb." },
        11: { verb: "programme", answers: ["programmed"], focus: "-ed phrases", form: "-ed phrase (description)", why: "Someone programmed the robot, so it received the action: Programmed to …", hint: "Did the robot programme something, or was it programmed?" },
        12: { verb: "be", answers: ["was", "is"], focus: "Reported statements", form: "reported statement", why: "‘It's the best café …’ becomes it was the best café. (\"Is\" is fine if she still thinks so.)", hint: "Jade said ‘It's the best café I've ever visited.’ Move it back one step." },
        13: { verb: "ever / visit", answers: ["had ever visited", "has ever visited"], focus: "Reported statements", form: "reported statement, past perfect with ever", why: "‘… I've ever visited’ becomes she had ever visited.", hint: "She said ‘… I've ever visited.’ What does \"I've ever\" become?" },
        14: { verb: "enjoy", answers: ["had enjoyed", "enjoyed"], focus: "Reported questions", form: "reported yes/no question", why: "‘Did you enjoy yourselves?’ becomes whether we had enjoyed ourselves.", hint: "The manager asked ‘Did you enjoy yourselves?’. Drop \"did\" and move the tense back." },
        15: { verb: "impress", answers: ["impressed"], focus: "-ed phrases", form: "-ed phrase (a feeling)", why: "The experience impressed us: we had the feeling, so Impressed by …", hint: "Did we impress someone, or did the experience impress us?" },
        16: { verb: "come", answers: ["would come"], focus: "Reported statements", form: "reported promise with would", why: "‘We'll come back soon’ becomes we would come back.", hint: "We said ‘We'll come back soon.’ What does \"will\" become?" }
      },
      paragraphs: [
        ["Last Saturday, my cousin Jade asked me if I ", 1, " to try the new robot café in Kwun Tong. I said that I ", 2, " about it but ", 3, " there. ", 4, " by the idea of being served by a robot, I agreed at once."],
        ["When we arrived, a long queue ", 5, " outside. ", 6, " to wait for an hour, Jade asked a waiter how long the wait ", 7, ". He told us that a few tables ", 8, " free, so we were lucky."],
        [9, " at our table, we watched a small robot roll towards us. It asked us what we ", 10, " to order. ", 11, " to speak five languages, it even told a joke in Cantonese! Jade said that it ", 12, " the best café she ", 13, ". Before we left, the manager asked whether we ", 14, " ourselves. ", 15, " by the whole experience, we promised that we ", 16, " back soon."]
      ]
    }
  ],

  // Lines: [[wrong>right]] changes a word, [[>word]] adds a missing word, [[word>]] deletes one. A line with no marker has no mistake.
  proofreading: [
    {
      title: "A Trip to the Science Museum",
      textType: "Blog post",
      lookFor: ["Past perfect", "-ing phrases", "-ed phrases", "Reported statements", "Reported questions", "Linking words"],
      lines: [
        ["Last Friday, our class visited the Science Museum in Tsim Sha Tsui East."],
        ["I was really excited because I [[have>had]] never been there before.", "Past perfect", "The story is in the past, and \"never been\" counts up to that past day: had never been.", "The story is told in the past. Which helping verb shows experience up to a past moment?"],
        ["[[Arrived>Arriving]] at the entrance, we saw a huge robot dinosaur.", "-ing phrases", "We did the arriving (active), so use the -ing form: Arriving at the entrance …", "Who arrived? If the subject does the action, which form starts the phrase?"],
        ["Our guide asked us [[that>]] if we had ever seen a real fossil.", "Reported questions", "Never put \"that\" before if or whether in a reported question.", "Look at the words just before \"if\". Is one of them unnecessary?"],
        ["When nobody answered, she explained that fossils are the remains of"],
        ["animals and plants that lived millions of years ago. My friend Tim"],
        ["asked her [[if>what]] the robot dinosaur was made of.", "Reported questions", "\"Made of\" needs something to complete it, so this is a wh- question: what the robot was made of.", "‘___ is it made of?’ Was the original a yes/no question or a wh- question?"],
        ["[[Amazing>Amazed]] by her answer, we followed her into the next hall.", "-ed phrases", "We felt amazed: the people with the feeling take -ed.", "Did we amaze someone, or were we amazed by the answer?"],
        ["In addition to [[make>making]] our own lightning, we built bridges out of", "Linking words", "\"In addition to\" is followed by a noun or V-ing: in addition to making.", "Is the \"to\" in \"in addition to\" part of an infinitive, or a preposition?"],
        ["paper. [[Although>However]], ours collapsed after we added only three coins.", "Linking words", "\"Although\" must join two clauses in one sentence. To start a new sentence with a contrast, use \"However,\".", "This contrast word starts a new sentence and is followed by a comma. Which linker does that?"],
        ["Our teacher said that we [[will>would]] get another chance the following week.", "Reported statements", "‘You will get another chance’ becomes we would get: will moves back to would.", "Look at \"the following week\". What does \"will\" become in reported speech?"],
        ["By the time we finished, the museum shop [[>had]] already closed, so I", "Past perfect", "The shop closed before we finished, so add \"had\": had already closed.", "Which happened first: the shop closing or us finishing? Is a word missing?"],
        ["couldn't buy a souvenir. All in all, it was the best school trip I had ever been on."],
        ["[[Tiring>Tired]] but happy, we took the MTR back to school.", "-ed phrases", "We felt tired: the person with the feeling takes -ed. \"Tiring\" would mean we made others tired.", "Did we feel tired, or make others tired?"]
      ]
    },
    {
      title: "My First Week",
      textType: "Email to a pen friend",
      lookFor: ["Past perfect", "-ing phrases", "-ed phrases", "Reported statements", "Reported questions", "Linking words"],
      lines: [
        ["Hi Sara, Thanks for your email. You asked me [[what>how]] my first week", "Reported questions", "\"Had gone\" can't take an object, so the question word must be \"how\": ‘How did your first week go?’", "What was the direct question: ‘___ did your first week go?’"],
        ["at the new school had gone. To be honest, it started as a bit of a disaster!"],
        ["On Monday, when I got to the classroom, the lesson [[>had]] already", "Past perfect", "The lesson started before I arrived: had already started.", "Which happened first: the lesson starting or me arriving? Is a helping verb missing?"],
        ["started, so everyone stared at me. [[Embarrassing>Embarrassed]] by", "-ed phrases", "I felt embarrassed: the person with the feeling takes -ed.", "Was I causing the embarrassment, or feeling it?"],
        ["all the attention, I sat down as quickly as I could. Then the teacher"],
        ["asked me why I [[am>was]] late, and I told her that my bus had", "Reported questions", "Reported questions move the tense back: why I was late.", "The teacher asked in the past. Should the verb move back one step?"],
        ["broken down on the way. [[Felt>Feeling]] sorry for me, a girl called", "-ing phrases", "Mandy did the feeling (active), so use the -ing form: Feeling sorry for me …", "The girl is the one who felt sorry. Which form shows an active action at the start of a phrase?"],
        ["Mandy offered to show me around at lunch. [[Although>Despite]] the bad", "Linking words", "\"The bad start\" is a noun phrase, so you need \"Despite\". \"Although\" needs a clause.", "Is \"the bad start\" a noun or a clause with its own verb?"],
        ["start, the rest of the week was great. On Wednesday, Mandy asked me"],
        ["whether I [[want>wanted]] to join the drama club with her, and I joined", "Reported questions", "‘Do you want to join?’ becomes whether I wanted to join: the tense moves back.", "Mandy asked in the past. What happens to \"want\"?"],
        ["it so [[as>that]] I could make more friends. When I got home on Friday,", "Linking words", "\"So that\" is followed by a clause (I could make). \"So as\" must be followed by \"to\" + verb.", "What follows: \"to\" + a verb, or a subject + verb?"],
        ["my mum asked me if I had made any friends yet, and I [[said>told]]", "Reported statements", "\"Tell\" takes a person straight after it: told her. \"Said her\" is wrong.", "Which reporting verb can take a person straight after it?"],
        ["her that I had already made two. I'll send you some photos [[unless>if]]", "Linking words", "\"Unless\" means \"if not\", which makes no sense here. The photos are sent on the condition that she wants them: if.", "Read it with \"if not\" in place of the linker. Does it still make sense?"],
        ["you want to see them. All in all, it wasn't such a bad week after all! Love, Chloe"]
      ]
    }
  ]
};
