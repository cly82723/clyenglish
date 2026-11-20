/* CLY English: card content for the S.3 flashcards and quiz. Meanings and word families come from vocab-data.js (joined by word);
   this file adds a collocation, a sample sentence, where the word is useful, and the quiz choices.
   blank: the exact words in the sentence that the quiz hides. distractors: three wrong choices, written to be clearly wrong in the sentence. */
(function () {
  "use strict";

  // card(word, collocation, sentence, goodFor, blank, distractors, note)
  function card(word, collocation, sentence, goodFor, blank, distractors, note) {
    var parts = goodFor.split(" · ");
    var topics = parts.length > 1 ? parts[0].split(", ") : [];
    var types = (parts.length > 1 ? parts[1] : parts[0]).split(", ");
    return { word: word, collocation: collocation, sentence: sentence, topics: topics, types: types, blank: blank, distractors: distractors, note: note || "" };
  }

  var unit1 = [
    card("acquire", "acquire a skill", "Students acquire useful skills when they volunteer in their communities.", "Education, Youth · Article, Speech", "acquire", ["acquisition", "supervise", "entangle"]),
    card("blockbuster", "a summer blockbuster", "The summer blockbuster brought record crowds back to Hong Kong cinemas.", "Culture · Article, Story", "blockbuster", ["norm", "supervisor", "make-believe"]),
    card("cast", "a talented cast", "A cast of local actors made the school play feel real.", "Culture, Education · Article, Story", "cast", ["blockbuster", "norm", "contrast"]),
    card("conspicuous", "a conspicuous rise", "A conspicuous rise in screen time worried many parents.", "Technology, Health · Report, Letter", "conspicuous", ["conspicuously", "virtual", "light-hearted"]),
    card("contrast", "in contrast to", "In contrast to last year, more students now take part in sports.", "Education, Youth · Report, Article", "contrast", ["contrasting", "norm", "cast"]),
    card("cutting-edge", "cutting-edge technology", "The museum uses cutting-edge technology to bring history to life.", "Technology, Culture · Article, Proposal", "cutting-edge", ["thought-provoking", "light-hearted", "entangled"]),
    card("embrace", "embrace change", "Schools should embrace new technology instead of banning it.", "Technology, Education · Letter, Speech", "embrace", ["embracing", "predict", "entangle"]),
    card("employ", "employ staff", "The company will employ over sixty staff, most of them recent graduates.", "Work · Report, Article", "employ", ["employment", "decode", "entangle"]),
    card("make-believe", "a make-believe world", "Children's make-believe games teach them to work with others.", "Youth, Education · Article, Story", "make-believe", ["make-belief", "supervisor", "blockbuster"]),
    card("norm", "become the norm", "Working from home has become the norm for many office workers.", "Work, Technology · Article, Report", "norm", ["normal", "normally", "contrast"]),
    card("supervisor", "a line supervisor", "Her supervisor praised her for finishing the project ahead of schedule.", "Work · Report, Story", "supervisor", ["supervise", "supervision", "blockbuster"]),
    card("utilize", "utilize resources", "The proposal is to utilize empty classrooms as quiet study areas.", "Education, Environment · Proposal, Report", "utilize", ["utilization", "decode", "entangle"]),
    card("visual effects", "stunning visual effects", "Stunning visual effects made the film a hit, but the story felt thin.", "Culture · Article, Letter", "visual effects", ["visual effect", "supervisors", "norms"]),
    card("decode", "decode a message", "Good readers decode a writer's attitude from word choice, not only from facts.", "Education · Article, Speech", "decode", ["decoding", "acquire", "utilize"]),
    card("engaging", "an engaging speaker", "Her engaging speaking style kept the audience listening from the first sentence.", "Education, Work · Speech, Article", "engaging", ["engage", "engagement", "predictable"]),
    card("entangled", "entangled in", "Many teenagers feel entangled in group chats they cannot leave.", "Youth, Technology · Article, Story", "entangled", ["entangle", "entanglement", "thought-provoking"]),
    card("impressive", "impressive results", "The school's recycling scheme produced impressive results within one term.", "Environment, Education · Report, Speech", "impressive", ["impress", "impression", "make-believe"]),
    card("light-hearted", "a light-hearted tone", "The light-hearted video helped the club attract new members.", "Youth, Culture · Article, Story", "light-hearted", ["light-heartedly", "light-heartedness", "entangled"]),
    card("picturesque", "a picturesque island", "Cheung Chau is a picturesque island within an hour of the city.", "Culture · Article, Letter", "picturesque", ["picturesquely", "predictable", "supervisor"]),
    card("predictable", "a predictable ending", "The ending was predictable, so the film lost its power to surprise.", "Culture · Article, Letter", "predictable", ["prediction", "predictably", "thought-provoking"]),
    card("thought-provoking", "a thought-provoking question", "The exhibition raises thought-provoking questions about waste.", "Environment, Culture · Article, Speech", "thought-provoking", ["thought-provoked", "make-believe", "entangled"]),
    card("unconventional", "an unconventional approach", "The teacher used unconventional methods to keep her students motivated.", "Education · Proposal, Article", "unconventional", ["unconventionally", "supervisor", "acquire"]),
    card("virtual", "a virtual tour", "A virtual tour lets overseas visitors explore the museum from home.", "Technology, Culture · Article, Proposal", "virtual", ["virtually", "virtuality", "predictable"])
  ];

  var unit2 = [
    card("adorable", "an adorable puppy", "The adorable rescue puppies drew a long queue at the adoption day.", "Youth · Story, Article", "adorable", ["adore", "adorably", "impoverished"]),
    card("chuckle", "chuckle to oneself", "She could not help but chuckle at the old photo before putting it back in the box.", "Story", "chuckle", ["chuckled", "cling", "donate"]),
    card("cling", "cling to", "Some people cling to old habits even when better options exist.", "Youth, Work · Article, Speech", "cling", ["clingy", "chuckle", "donate"]),
    card("donate", "donate to charity", "Many residents donate unused food to local charities every week.", "Environment, Youth · Article, Letter, Proposal", "donate", ["donation", "improvise", "cling"]),
    card("essential", "essential for", "Teamwork is essential for any project that involves several people.", "Work, Education · Article, Speech", "essential", ["essence", "essentially", "impoverished"]),
    card("hit a home run", "informal: hit a home run with", "The new youth centre hit a home run with its free coding classes.", "Youth · Story, Article (informal only)", "hit a home run", ["made a home run", "struck a home run", "hit a home runs"], "informal"),
    card("improvise", "improvise a solution", "When the projector failed, the teacher had to improvise a lesson on the whiteboard.", "Education · Story, Speech", "improvise", ["improvisation", "underestimate", "cling"]),
    card("lend a hand", "informal: lend a hand with", "Volunteers are ready to lend a hand when the shelter needs repairs.", "Youth · Story, Article (informal only)", "lend a hand", ["lend a help", "hand a lend", "borrow a hand"], "informal"),
    card("residents", "local residents", "Local residents welcomed the new library in their neighbourhood.", "Culture, Youth · Letter, Report", "residents", ["reside", "residential", "reliant"]),
    card("sponsored", "a sponsored event", "A local bank sponsored the charity run and covered all the costs.", "Work, Youth · Article, Proposal", "sponsored", ["sponsor", "sponsoring", "donate"]),
    card("underestimate", "underestimate the importance of", "Many students underestimate how much sleep affects their results.", "Health, Education · Article, Speech", "underestimate", ["underestimation", "improvise", "cling"]),
    card("viral", "go viral", "A short clip about food waste went viral and changed how people shop.", "Technology, Environment · Article, Speech", "viral", ["virality", "virally", "essential"]),
    card("constructive", "constructive feedback", "Constructive feedback helps team members improve without losing confidence.", "Work, Education · Letter, Report", "Constructive", ["Constructiveness", "Constructively", "Compassion"]),
    card("compassion", "show compassion", "Volunteers showed great compassion for the elderly people they visited.", "Youth, Health · Speech, Story", "compassion", ["compassionate", "compassionately", "constructive"]),
    card("excess", "excess food", "Restaurants can donate excess food instead of throwing it away.", "Environment · Proposal, Article", "excess", ["excessively", "expenditure", "reliance"]),
    card("expenditure", "public expenditure", "Rising expenditure on food leaves many families with little to save.", "Work, Youth · Report, Letter", "expenditure", ["expend", "excess", "reliance"]),
    card("impoverished", "impoverished families", "Impoverished families often cannot afford healthy meals.", "Youth, Health · Article, Speech", "Impoverished", ["Impoverishment", "Impoverish", "Inevitable"]),
    card("inevitable", "an inevitable result", "Some delay is inevitable when so many people use the same system.", "Technology · Report, Letter", "inevitable", ["inevitably", "inevitability", "vocational"]),
    card("reliant", "reliant on", "Many elderly people are reliant on neighbours for daily support.", "Health, Youth · Article, Report", "reliant", ["reliance", "rely", "residents"]),
    card("soup kitchen", "volunteer at a soup kitchen", "Students volunteered at a soup kitchen near the market every Saturday.", "Youth · Article, Story", "soup kitchen", ["soup kitchens", "kitchen soup", "soup cooking"]),
    card("turn to", "turn to someone for help", "Teenagers often turn to friends first and to adults later.", "Youth, Health · Article, Speech", "turn to", ["turn on", "turn at", "turn up"]),
    card("vocational", "vocational training", "Vocational courses prepare students for jobs that need practical skills.", "Education, Work · Proposal, Article", "Vocational", ["Vocation", "Vocationally", "Adorable"])
  ];

  // The Phrases deck: the back says what the phrase does instead of giving a meaning
  function phrase(text, does, sentence, goodFor, blank, distractors) {
    var c = card(text, "", sentence, goodFor, blank, distractors);
    c.does = does;
    return c;
  }

  var phrases = [
    phrase("a growing number of", "shows a trend", "A growing number of students use study apps after school.", "Technology, Education · Article, Report", "A growing number of", ["A growing amount of", "A growing numbers of", "A grow number of"]),
    phrase("there is growing evidence that", "backs a claim", "There is growing evidence that short breaks improve concentration.", "Health, Education · Article, Speech", "There is growing evidence that", ["There are growing evidence that", "There is growing evidences that", "There has growing evidence that"]),
    phrase("with regard to", "introduces a topic", "With regard to cost, the school can share equipment between classes.", "Proposal, Letter", "With regard to", ["With regard of", "With regards of", "By regard to"]),
    phrase("as a result of", "shows a cause", "As a result of the new scheme, food waste fell by a third.", "Environment · Report", "As a result of", ["As a result", "As results of", "In a result of"]),
    phrase("to a large extent", "gives a measured view", "The scheme succeeded to a large extent because students ran it themselves.", "Report, Article", "to a large extent", ["in a large extent", "to a large extends", "at a large extent"]),
    phrase("a significant proportion of", "describes a share", "A significant proportion of teenagers sleep less than eight hours.", "Health · Report", "A significant proportion of", ["A significant proportions of", "A significant proportion for", "A significant proportioned of"]),
    phrase("play a key role in", "shows importance", "Teachers play a key role in building students' confidence.", "Education · Speech, Article", "play a key role in", ["play a key role of", "play a key role on", "plays a key role in"]),
    phrase("contributes to", "shows a cause", "Sleep loss contributes to poor concentration.", "Health · Report", "contributes to", ["contribute to", "contributes at", "is contributes to"]),
    phrase("the most effective way to", "recommends", "The most effective way to reduce waste is to plan meals in advance.", "Environment · Proposal, Article", "The most effective way to", ["The most effective way for", "Most effective ways to", "The most effective way at"]),
    phrase("I would like to propose that", "makes a suggestion", "I would like to propose that the library opens on Saturdays.", "Proposal, Letter", "I would like to propose that", ["I would like propose that", "I would like to proposing that", "I like to propose to"]),
    phrase("it is hoped that", "closes a report", "It is hoped that these measures will shorten the queues.", "Report, Proposal", "It is hoped that", ["It is hope that", "It is hoping that", "It hopes that"]),
    phrase("in light of", "links a reason to a decision", "In light of these results, we recommend a trial period.", "Report, Proposal", "In light of", ["In lights of", "On light of", "In light to"]),
    phrase("admittedly", "concedes, then argues (admittedly … ; however, …)", "Admittedly, apps can distract students; however, they also make revision easier.", "Technology · Article, Letter", "Admittedly", ["Admitting", "Admittance", "Admit"]),
    phrase("on top of this", "adds a point", "On top of this, the course is free for all residents.", "Article, Letter", "On top of this", ["On the top of this", "In top of this", "At top of this"]),
    phrase("this stems from", "explains a cause", "This stems from a lack of quiet places to study.", "Education · Report", "This stems from", ["This stem from", "This stems of", "These stems from"]),
    phrase("it follows that", "draws a conclusion", "It follows that schools should teach students how to judge online sources.", "Technology, Education · Speech, Article", "It follows that", ["It follow that", "It follows what", "It is following that"]),
    phrase("thank you for raising your concerns", "opens a reply", "Thank you for raising your concerns about the noise from the display.", "Letter (email reply)", "Thank you for raising your concerns", ["Thank you for raise your concerns", "Thanks for raising your concern", "Thank you of raising your concerns"]),
    phrase("we take your concerns seriously", "reassures", "We take your concerns seriously and have asked the team to review the plan.", "Letter (email reply)", "We take your concerns seriously", ["We take your concerns serious", "We take your concern serious", "We took your concerns serious"]),
    phrase("I would welcome the opportunity to", "offers a meeting", "I would welcome the opportunity to meet residents and explain the plan.", "Letter (email reply)", "I would welcome the opportunity to", ["I would welcome the opportunity for", "I would welcome an opportunity of", "I will welcome the opportunity of"]),
    phrase("please do not hesitate to contact me", "invites questions", "Please do not hesitate to contact me if you have further questions.", "Letter (email reply)", "Please do not hesitate to contact me", ["Please do not hesitate contact me", "Please not hesitate to contact me", "Please do not hesitating to contact me"]),
    phrase("I look forward to hearing from you", "closes an email", "I look forward to hearing from you before the end of the month.", "Letter (email reply)", "I look forward to hearing from you", ["I look forward to hear from you", "I look forward hearing from you", "I am look forward to hearing from you"]),
    phrase("I am writing in response to", "opens a reply", "I am writing in response to your email about the proposed lighting display.", "Letter (email reply)", "I am writing in response to", ["I am writing in responding to", "I am writing in respond to", "I write in response of"]),
    phrase("please be assured that", "reassures", "Please be assured that the display will be dimmed at night.", "Letter (email reply)", "Please be assured that", ["Please be assuring that", "Please assure that", "Please be assured of that"]),
    phrase("in accordance with", "follows a rule", "In accordance with the regulations, all displays are dimmed by 11 pm.", "Report, Letter", "In accordance with", ["In accordance of", "In accord with", "According with"]),
    phrase("I would like to share three ideas with you", "opens a speech", "I would like to share three ideas with you about how we use our time.", "Speech", "I would like to share three ideas with you", ["I would like sharing three ideas with you", "I would like to share three ideas to you", "I would like share three ideas with you"]),
    phrase("turning to", "moves to the next point", "Turning to my second point, let us look at the cost.", "Speech", "Turning to", ["Turned to", "To turn at", "Turning at"]),
    phrase("what this means for us is", "links to the audience", "What this means for us is that small habits add up.", "Speech", "What this means for us is", ["What this mean for us is", "What this means for us are", "That this means for us is"]),
    phrase("I hope you leave today with", "closes a speech", "I hope you leave today with one idea you want to try.", "Speech", "I hope you leave today with", ["I hope you leaving today with", "I hope you leave today to", "I hope you left today with"]),
    phrase("thank you for your attention", "closes a speech", "Thank you for your attention, and I look forward to your questions.", "Speech", "Thank you for your attention", ["Thank you for your attentions", "Thanks for you attention", "Thank you for pay attention"]),
    phrase("has more than doubled", "describes a rise", "The number of visitors has more than doubled since 2015.", "Report, Article", "has more than doubled", ["have more than doubled", "has more than double", "is more than doubled"]),
    phrase("the vast majority of", "describes a share", "The vast majority of respondents said they would use the service again.", "Report", "The vast majority of", ["The vast majorities of", "The vast major of", "Vast majority of"])
  ];

  window.CLY_CARDS = {
    decks: [
      { id: "unit1", title: "Unit 1 · What makes a good film?", kind: "word", cards: unit1 },
      { id: "unit2", title: "Unit 2 · How can we help others?", kind: "word", cards: unit2 },
      { id: "phrases", title: "Phrases for writing", kind: "phrase", cards: phrases }
    ]
  };
})();
