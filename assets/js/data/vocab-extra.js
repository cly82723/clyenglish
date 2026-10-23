/* Extra S.1–S.3 vocab passages, written to the same rules as the built-in ones: 15 blanks, each word from the
   worksheet list used once, a context clue for every blank, and (for S.1 and S.3) exactly 5 blanks that need a
   different part of speech from the worksheet's Parts of Speech tables. "Try another passage" cycles through them. */
(function () {
"use strict";

var V = window.CLY_VOCAB;

// Rows are [word on the list, answer, clue, part of speech if changed, note on the grammar clue if changed, other accepted spellings].
function passage(grade, title, paragraphs, rows) {
  var words = Object.keys(V.vocabLists[grade].units).reduce(function (a, k) { return a.concat(V.vocabLists[grade].units[k]); }, []);
  return {
    title: title,
    paragraphs: paragraphs.map(function (p) { return p.split(/\[\[(\d+)\]\]/).map(function (part, i) { return i % 2 ? Number(part) : part; }); }),
    blanks: Object.fromEntries(rows.map(function (r, i) {
      var item = words.filter(function (w) { return w.word === r[0]; })[0];
      if (!item) throw new Error("Not on the " + grade + " list: " + r[0]);
      return [i + 1, { word: r[0], listedPos: item.pos, pos: r[3] || item.pos, changed: !!r[3], meaning: item.meaning, answers: [r[1]].concat(r[5] || []), letter: r[1][0], clue: r[2], formNote: r[4] || "" }];
    }))
  };
}

V.EXTRA = {
  s1: [
    passage("s1", "Three Days at Camp in Sai Kung", [
      "Last month, our class went on a three-day camp in Sai Kung. I am not a very brave person, but my best friend Chloe loves [[1]] and is always looking for new and exciting experiences. As our coach drove along the coast, we saw a beautiful [[2]] of green hills, quiet beaches and small islands stretching far into the distance. Our camp leader, Mr Ho, was very [[3]]. He never shouted or rushed us, and he stayed calm and relaxed even when our coach arrived an hour late.",
      "On the first evening, Mr Ho explained the camp rules [[4]], in just a few words, and then gave each group an [[5]] of the next day: the main activities and times, without all the details. Each group also had a [[6]]: we had to keep our own tent clean and tidy. The next morning, there was a kayaking [[7]] between the groups, and everyone tried very hard to win. It was hard [[8]] work, and our arms and shoulders ached afterwards. Near the end, Chloe stood up in the kayak to wave at us and [[9]], falling straight into the sea! Luckily, she just laughed.",
      "That afternoon, a boy from another group kept splashing us and would not stop, and I felt really [[10]]. However, most people at the camp were very [[11]], always thinking about other people's feelings. Kelvin even carried my bag when he saw that I was tired. After lunch, we learned how to [[12]] our plastic bottles and cans instead of throwing them into the rubbish bin.",
      "The best part was the night hike. Walking through the dark forest with only our torches was [[13]], so exciting that my heart was beating fast. On the last day, Chloe shared her snacks [[14]] with everyone, giving away almost all of them. Everyone agreed that the whole trip was [[15]]: extremely impressive, and much better than we had imagined."
    ], [
      ["adventurous", "adventure", "Chloe is \"always looking for new and exciting experiences\".", "noun", "\"loves ___\": the verb \"loves\" needs a noun as its object here."],
      ["landscape", "landscape", "Everything they could see: \"green hills, quiet beaches and small islands stretching far into the distance\"."],
      ["laid-back", "laid-back", "He \"never shouted or rushed us\" and \"stayed calm and relaxed\"."],
      ["brief", "briefly", "He explained the rules \"in just a few words\".", "adverb", "\"explained the camp rules ___\" describes how he explained them, so we need an adverb."],
      ["outline", "outline", "\"the main activities and times, without all the details\"."],
      ["responsibility", "responsibility", "\"we had to keep our own tent clean and tidy\": a duty."],
      ["competitive", "competition", "There was a race \"between the groups, and everyone tried very hard to win\".", "noun", "\"a kayaking ___\": after \"a\", we need a noun."],
      ["physical", "physical", "Work done with the body: \"our arms and shoulders ached afterwards\"."],
      ["wipe out", "wiped out", "She fell over: \"falling straight into the sea\" (and it happened in the past)."],
      ["irritated", "irritated", "The boy \"kept splashing us and would not stop\", which is annoying."],
      ["considerate", "considerate", "\"always thinking about other people's feelings\"."],
      ["recyclable", "recycle", "The bottles and cans are used again \"instead of throwing them into the rubbish bin\".", "verb", "\"how to ___\": after \"to\", we need a verb."],
      ["thrilling", "thrilling", "\"so exciting that my heart was beating fast\"."],
      ["generous", "generously", "She was \"giving away almost all of them\".", "adverb", "\"shared her snacks ___\" describes how she shared them, so we need an adverb."],
      ["awesome", "awesome", "\"extremely impressive\"."]
    ]),

    passage("s1", "The Week Our School Went Online", [
      "When a typhoon closed our school for a whole week, our lessons moved online. My cousin Marcus, a computer [[1]] who spends hours learning about new software, helped me set everything up. First, I had to create an [[2]] with my school email address and a password so that I could log in. Then our teacher put all the worksheets on the school website, so we could [[3]] them from any phone or laptop, wherever we were.",
      "Our lessons took place in a [[4]] classroom, which looked like a real room on the screen but existed only on the computer. I am an [[5]], so I usually prefer working quietly on my own, and I actually enjoyed studying at home. My sister is the opposite. She loves to [[6]] with her friends, and she missed chatting with her classmates every day.",
      "Our English teacher wanted everyone to [[7]] the lessons, so she asked us to take part in online quizzes and polls. Surprisingly, my [[8]] went up: I finished more work in that week than I usually do in two. We also watched an [[9]] video about volcanoes that taught us a lot. My favourite [[10]], drawing comics in my free time, became even more fun when I shared them online.",
      "The [[11]] of the week was Friday's online talent show. It was easily the best part of all. Our class teacher told a story so [[12]] that half the class fell off their chairs laughing. Then Ming danced [[13]] in front of her camera, jumping around with lots of energy for ten whole minutes. Another classmate drew an [[14]] world for the show, a magical land that existed only in his mind, with flying buses and talking cats. It was an [[15]] week, very unusual and special, and none of us will ever forget it."
    ], [
      ["nerd", "nerd", "A person \"who spends hours learning about new software\"."],
      ["account", "account", "Something you \"create\" \"with my school email address and a password so that I could log in\"."],
      ["access", "access", "\"from any phone or laptop, wherever we were\": to be able to get to the worksheets."],
      ["virtual", "virtual", "It \"looked like a real room on the screen but existed only on the computer\"."],
      ["introverted", "introvert", "\"I usually prefer working quietly on my own\".", "noun", "\"I am an ___\": after \"an\", we need a noun (a person)."],
      ["sociable", "socialise", "She enjoys \"chatting with her classmates\" and spending time with friends.", "verb", "\"She loves to ___\": after \"to\", we need a verb.", ["socialize"]],
      ["engage in", "engage in", "She wanted everyone to \"take part in\" the lessons."],
      ["productive", "productivity", "\"I finished more work in that week than I usually do in two\".", "noun", "\"my ___\": a possessive like \"my\" is followed by a noun."],
      ["education", "educational", "A video \"about volcanoes that taught us a lot\".", "adjective", "\"an ___ video\": a word that describes the noun \"video\" is an adjective."],
      ["pastime", "pastime", "Something you enjoy doing \"in my free time\"."],
      ["highlight", "highlight", "\"It was easily the best part of all.\""],
      ["hilarious", "hilarious", "\"half the class fell off their chairs laughing\": extremely funny."],
      ["energetic", "energetically", "She was \"jumping around with lots of energy for ten whole minutes\".", "adverb", "\"danced ___\" describes how she danced, so we need an adverb."],
      ["imaginary", "imaginary", "\"a magical land that existed only in his mind\"."],
      ["extraordinary", "extraordinary", "\"very unusual and special\"."]
    ]),

    passage("s1", "A Birthday at the Riding School", [
      "For my cousin Ada's twelfth birthday, her parents took us to a riding school in Tuen Mun. Ada is very [[1]]. She loves trying new and exciting things, so she had chosen horse riding herself. The weather was [[2]] for riding: sunny, cool and not too windy, just perfect. The riding school was not open every weekend, but luckily a lesson was [[3]] that Saturday, so we booked it straight away.",
      "Before we started, our instructor gave us a [[4]] talk about safety. It only took two minutes. She told us to speak quietly so that we would not frighten the horses, and she thanked us for our [[5]] when we did. At first my horse only walked slowly, but by the end of the lesson it began to [[6]] across the field, moving so fast that all four feet left the ground at once. I will never forget the [[7]] of that moment; it was so exciting!",
      "Ada is very [[8]] and always wants to be better than everyone else, so she asked the instructor who had ridden the best. Riding is harder than it looks, and I was [[9]] tired afterwards: my legs and back ached for two days. The stables were [[10]], so clean that you could not find a single piece of straw on the floor. After the lesson, we went to the big [[11]] room next to the stables, which is used as a café, a classroom and a party room.",
      "The party was very [[12]]: a clown did magic tricks and made everyone laugh. Ada's mum [[13]] the best moments of the day in a short video, picking out the most exciting parts to share with the family. Later, we went to [[14]] at Ada's flat, just spending time together and playing board games. Then I went home to [[15]] with a good book, because after such an active day I needed to rest."
    ], [
      ["adventurous", "adventurous", "\"She loves trying new and exciting things\"."],
      ["ideal", "ideal", "\"sunny, cool and not too windy, just perfect\"."],
      ["available", "available", "There was a lesson they could book: \"so we booked it straight away\"."],
      ["brief", "brief", "\"It only took two minutes.\""],
      ["considerate", "consideration", "They spoke quietly \"so that we would not frighten the horses\": thinking of the horses' feelings.", "noun", "\"our ___\": a possessive like \"our\" is followed by a noun."],
      ["gallop", "gallop", "\"moving so fast that all four feet left the ground at once\"."],
      ["thrilling", "thrill", "\"it was so exciting!\"", "noun", "\"the ___ of that moment\": after \"the\", we need a noun."],
      ["competitive", "competitive", "She \"always wants to be better than everyone else\"."],
      ["physical", "physically", "Her body was tired: \"my legs and back ached for two days\".", "adverb", "\"___ tired\": a word that describes the adjective \"tired\" is an adverb."],
      ["spotless", "spotless", "\"so clean that you could not find a single piece of straw on the floor\"."],
      ["multifunctional", "multifunctional", "One room \"used as a café, a classroom and a party room\"."],
      ["entertain", "entertaining", "\"a clown did magic tricks and made everyone laugh\".", "adjective", "\"was very ___\": after \"very\", we need an adjective."],
      ["highlight", "highlighted", "She was \"picking out the most exciting parts to share\".", "verb", "\"Ada's mum ___ the best moments\": the sentence needs a verb in the past tense."],
      ["hang out", "hang out", "\"just spending time together and playing board games\"."],
      ["unwind", "unwind", "\"after such an active day I needed to rest\"."]
    ]),

    passage("s1", "The Great Bottle Challenge", [
      "This term, our class started a recycling project. Our class monitor, Ivy, is very [[1]]: she enjoys being with people and talks to everyone. I am more [[2]], and I usually like to work quietly by myself. At first, I was nervous about working with people I did not know well. However, this project taught me how to [[3]] with others, sharing ideas and jobs as a team.",
      "First, our teacher [[4]] the plan on the whiteboard, giving us only the main points and steps. Each of us was [[5]] for one job, so we all had a duty to do. My job was to find out which things in the canteen were [[6]], so that they could be made into something new instead of going to the landfill.",
      "Our school is very [[7]]: students come from many different backgrounds and speak several languages, so we made posters in Chinese, English and Urdu. We wanted the project to be a kind of [[8]] for the whole school, teaching everyone about waste. Ivy was full of [[9]], running from class to class all day without getting tired. Some students kept throwing bottles into the wrong bins, which made me feel [[10]], but our teacher, Mr Lam, stayed [[11]] and never got angry.",
      "My friend Jason, a real computer [[12]] who loves coding, made an app to count the bottles we collected. With his app, we worked [[13]] and collected over 2,000 bottles in a month, far more than we had expected. The school cleaners showed great [[14]] by giving up their lunch breaks to help us sort the bottles, without asking for anything in return. At the end of the term, the principal said our project was [[15]], extremely impressive for a group of Secondary 1 students, and she asked us to run it again next year."
    ], [
      ["sociable", "sociable", "\"she enjoys being with people and talks to everyone\"."],
      ["introverted", "introverted", "\"I usually like to work quietly by myself\"."],
      ["collaborate", "collaborate", "\"sharing ideas and jobs as a team\"."],
      ["outline", "outlined", "He gave \"only the main points and steps\".", "verb", "\"our teacher ___ the plan\": the sentence needs a verb in the past tense."],
      ["responsibility", "responsible", "\"we all had a duty to do\".", "adjective", "\"was ___ for\": after \"was\", we need an adjective here."],
      ["recyclable", "recyclable", "They \"could be made into something new instead of going to the landfill\"."],
      ["diverse", "diverse", "\"students come from many different backgrounds and speak several languages\"."],
      ["education", "education", "Something \"teaching everyone about waste\"."],
      ["energetic", "energy", "\"running from class to class all day without getting tired\".", "noun", "\"full of ___\": after \"full of\", we need a noun."],
      ["irritated", "irritated", "Students \"kept throwing bottles into the wrong bins\", which is annoying."],
      ["laid-back", "laid-back", "He \"never got angry\": calm and relaxed."],
      ["nerd", "nerd", "A person \"who loves coding\" and computers."],
      ["productive", "productively", "They \"collected over 2,000 bottles in a month, far more than we had expected\".", "adverb", "\"worked ___\" describes how we worked, so we need an adverb."],
      ["generous", "generosity", "\"giving up their lunch breaks to help us ... without asking for anything in return\".", "noun", "\"great ___\": after the adjective \"great\", we need a noun."],
      ["awesome", "awesome", "\"extremely impressive\"."]
    ])
  ],

  s2: [
    passage("s2", "The Phone That Took Over", [
      "Last year, my older brother Tommy spent nearly ten hours a day on his phone. He could not stop checking it, even at dinner, and our parents worried that he had an [[1]]. Every time he opened an app, he saw [[2]] for trainers, snacks and games, all trying to make him buy things. These adverts were [[3]] at teenagers like him, because the apps knew his age and interests. In fact, many apps [[4]] everything you do online, following every click and search you make.",
      "Tommy's phone [[5]] him with notifications all day long; it sent so many messages that he could not concentrate on his homework. One app even [[6]] that it could make him smarter, but there was no proof that this was true. At first, Tommy was [[7]] that he was fine. He was completely sure that he did not have a problem.",
      "Then he faced the [[8]] of his bad habit: he failed two tests and felt tired all the time. His headaches became so [[9]] that he had to see a doctor, who said the problem was extremely serious for his age. The doctor told Tommy to [[10]] his phone settings, changing them to make the phone as good as possible for studying, for example by turning off most notifications.",
      "At first, Tommy did not like the plan, but soon he began to [[11]] it, accepting the idea of a phone-free evening. Our mum was very [[12]]: she reacted quickly and positively whenever he asked for help. Tommy also found a useful [[13]] of advice, a website written by doctors, which helped him understand his habit. Of course, there was some [[14]] from his friends, who said he was boring for leaving their group chat. However, Tommy explained himself carefully so that nobody would [[15]] his message and think he was angry with them. Now he uses his phone for just two hours a day."
    ], [
      ["addiction", "addiction", "\"He could not stop checking it, even at dinner\"."],
      ["advertising", "advertising", "Things \"all trying to make him buy things\"."],
      ["targeted", "targeted", "The adverts were aimed \"at teenagers like him\"."],
      ["track", "track", "\"following every click and search you make\"."],
      ["bombard", "bombarded", "\"it sent so many messages that he could not concentrate\" (and it happened in the past)."],
      ["claim", "claimed", "\"but there was no proof that this was true\"."],
      ["convinced", "convinced", "\"He was completely sure\"."],
      ["consequence", "consequence", "The unpleasant result of his habit: \"he failed two tests and felt tired all the time\"."],
      ["severe", "severe", "\"the problem was extremely serious\"."],
      ["optimize", "optimize", "\"changing them to make the phone as good as possible for studying\".", null, null, ["optimise"]],
      ["embrace", "embrace", "\"accepting the idea of a phone-free evening\"."],
      ["responsive", "responsive", "\"she reacted quickly and positively whenever he asked for help\"."],
      ["source", "source", "Where he got advice from: \"a website written by doctors\"."],
      ["criticism", "criticism", "His friends \"said he was boring\": they disapproved."],
      ["misinterpret", "misinterpret", "So nobody would \"think he was angry with them\": understand him wrongly."]
    ]),

    passage("s2", "Trouble in the Class Group Chat", [
      "Last term, a [[1]] joined our class group chat. Nobody knew who he really was, but he kept sending rude messages just to make everyone angry. Soon he began to [[2]] my classmate Rachel, putting pressure on her and sending her unkind messages every night. His posts also [[3]] strong feelings in the whole class, making everyone upset and excited at the same time.",
      "Then one of his posts went [[4]]: a screenshot of it was shared thousands of times online in just one day. Worse still, he was guilty of [[5]]: he posted Rachel's home address and phone number for everyone to see. He even [[6]] to post more of her private information if she told a teacher, saying that he would cause her more trouble. It felt as if he wanted to [[7]] our lives, entering every corner of them without being invited.",
      "Rachel began to [[8]], feeling so afraid that she could not think clearly. Her mother treated it as an [[9]], a serious and dangerous situation that needed action straight away, and called the school at once. We later learned that the troll had also tried to [[10]] our class project by deleting our shared files on purpose, so that we would miss the deadline.",
      "The school put up a [[11]] notice in the hall, where everyone could easily see it, about staying safe online. The troll turned out to be a student from another school, and he faced a serious [[12]]: he was banned from the app and had to apologise. At first, Rachel was [[13]] that everyone was laughing at her, but she was wrong. She also stopped worrying that people would [[14]] on her conversations, because our teacher showed us how to keep our chats private. Thankfully, the school was very [[15]], and the teachers reacted quickly and kindly whenever a student needed help."
    ], [
      ["troll", "troll", "Someone who \"kept sending rude messages just to make everyone angry\"."],
      ["harass", "harass", "\"putting pressure on her and sending her unkind messages every night\"."],
      ["stir", "stirred", "\"making everyone upset and excited\" (and it happened in the past)."],
      ["viral", "viral", "\"shared thousands of times online in just one day\"."],
      ["doxing", "doxing", "\"he posted Rachel's home address and phone number for everyone to see\"."],
      ["threaten", "threatened", "\"saying that he would cause her more trouble\" (in the past)."],
      ["invade", "invade", "\"entering every corner of them without being invited\"."],
      ["panic", "panic", "\"feeling so afraid that she could not think clearly\"."],
      ["emergency", "emergency", "\"a serious and dangerous situation that needed action straight away\"."],
      ["sabotage", "sabotage", "\"deleting our shared files on purpose, so that we would miss the deadline\"."],
      ["prominent", "prominent", "\"where everyone could easily see it\"."],
      ["consequence", "consequence", "An unpleasant result: \"he was banned from the app and had to apologise\"."],
      ["convinced", "convinced", "She felt completely sure, \"but she was wrong\"."],
      ["eavesdrop", "eavesdrop", "Listening secretly to her conversations: \"our teacher showed us how to keep our chats private\"."],
      ["responsive", "responsive", "\"the teachers reacted quickly and kindly\"."]
    ]),

    passage("s2", "My Backpack Hunt", [
      "Before the new school year, I wanted the [[1]] backpack in Hong Kong, the one that thousands of students had already bought. The [[2]] for it was everywhere: on buses, on the MTR and in every app I opened. The company [[3]] that the bag could protect a laptop from any fall, but my dad said there was no proof of that. Still, it seemed that everyone in my class wanted one too.",
      "When I tried it on in the shop, I was disappointed. It was so [[4]], large and heavy, that I could hardly walk with it on my back. I also read a lot of [[5]] online; many buyers complained that the zips broke after a month. So I decided to [[6]], comparing the prices and quality of bags in five different shops before choosing.",
      "At a street market in Sham Shui Po, I found a [[7]] backpack that someone had owned before, but it still looked almost new. The owner of the [[8]], a small table with an open front, offered me a [[9]]: if I bought the bag, he would give me a water bottle for free. It was a real [[10]]: I paid only $80 instead of the usual $300.",
      "The man told me that the market was a great [[11]] of cheap school supplies, the place where many students got their stationery. He even offered to [[12]] my bag by sewing my name on it, so that it would suit me perfectly. Now my name is [[13]] on the front of the bag, where everyone can easily see it. I am [[14]] that I made the right choice; I'm completely sure of it. My bag is not a [[15]] one that looks exactly like everyone else's, and it cost only a quarter of the price of the famous one."
    ], [
      ["best-selling", "best-selling", "\"the one that thousands of students had already bought\"."],
      ["advertising", "advertising", "It \"was everywhere: on buses, on the MTR and in every app I opened\"."],
      ["claim", "claimed", "\"but my dad said there was no proof of that\"."],
      ["cumbersome", "cumbersome", "\"large and heavy, ... I could hardly walk with it\"."],
      ["criticism", "criticism", "\"many buyers complained that the zips broke after a month\"."],
      ["shop around", "shop around", "\"comparing the prices and quality of bags in five different shops before choosing\"."],
      ["second-hand", "second-hand", "A backpack \"that someone had owned before\"."],
      ["stall", "stall", "\"a small table with an open front\" at a market."],
      ["deal", "deal", "An agreement: \"if I bought the bag, he would give me a water bottle for free\"."],
      ["bargain", "bargain", "\"I paid only $80 instead of the usual $300\"."],
      ["source", "source", "\"the place where many students got their stationery\"."],
      ["customize", "customize", "\"sewing my name on it, so that it would suit me perfectly\".", null, null, ["customise"]],
      ["prominent", "prominent", "\"where everyone can easily see it\"."],
      ["convinced", "convinced", "\"I'm completely sure of it\"."],
      ["generic", "generic", "One \"that looks exactly like everyone else's\"."]
    ]),

    passage("s2", "Grandma's Shop Goes Viral", [
      "My grandma Lily is an [[1]]: she makes leather wallets and bags by hand in her tiny shop in Sheung Wan. She also sells [[2]] watches from the 1970s, which are old but still beautiful and in excellent condition. Each item has a small [[3]] attached to it, showing its price. Some customers like to [[4]] with her, arguing politely about the price until she agrees to lower it.",
      "Grandma had always refused to use social media, but last year she decided to [[5]] it, accepting that it might help her business. My cousin made a short video of her at work, and it went [[6]]: within two days, more than a million people had watched it online. The video [[7]] a lot of interest, and people were so excited that they started asking where the shop was.",
      "The next weekend, hundreds of visitors [[8]] the little street, filling it in such large numbers that the neighbours complained. Grandma began to [[9]], feeling so afraid that she almost closed the shop. To help, my cousin decided to [[10]] her online shop, making it as good as possible so that people could buy things without visiting. He also set up a system to [[11]] every parcel, following it all the way from the shop to the customer's door.",
      "Next, he posted adverts that were [[12]] at young office workers, the group most interested in leather wallets. Grandma was very [[13]] to her customers' messages, replying quickly and helpfully to every question. Once, a customer wrote, \"Your prices are crazy!\" Grandma thought he was angry, but she had [[14]] his message: he meant that the prices were surprisingly low. A jealous shop owner nearby even tried to [[15]] her business by posting fake bad reviews on purpose, but her loyal customers ignored them. Now Grandma's shop is busier than ever."
    ], [
      ["artisan", "artisan", "A person who \"makes leather wallets and bags by hand\"."],
      ["vintage", "vintage", "Watches \"from the 1970s, which are old but still beautiful and in excellent condition\"."],
      ["tag", "tag", "Something small \"attached to it, showing its price\"."],
      ["haggle", "haggle", "\"arguing politely about the price until she agrees to lower it\"."],
      ["embrace", "embrace", "\"accepting that it might help her business\"."],
      ["viral", "viral", "\"within two days, more than a million people had watched it online\"."],
      ["stir", "stirred", "\"people were so excited\" (and it happened in the past)."],
      ["invade", "invaded", "\"filling it in such large numbers that the neighbours complained\" (in the past)."],
      ["panic", "panic", "\"feeling so afraid that she almost closed the shop\"."],
      ["optimize", "optimize", "\"making it as good as possible\".", null, null, ["optimise"]],
      ["track", "track", "\"following it all the way from the shop to the customer's door\"."],
      ["targeted", "targeted", "Adverts aimed at \"young office workers, the group most interested in leather wallets\"."],
      ["responsive", "responsive", "\"replying quickly and helpfully to every question\"."],
      ["misinterpret", "misinterpreted", "\"Grandma thought he was angry\", but that was not what he meant (it happened before, so use the past participle)."],
      ["sabotage", "sabotage", "\"posting fake bad reviews on purpose\" to damage her business."]
    ])
  ],

  s3: [
    passage("s3", "Making Our First Film", [
      "This year, our drama club decided to make a short film for an inter-school film festival. Our [[1]] was made up of twelve students, each playing a different character. Our English teacher, Ms Yip, agreed to [[2]] the project, managing the team and checking our work every week. Our film was a piece of [[3]]: a fantasy story set in an imaginary kingdom, with dragons, magic and talking trees.",
      "It was a [[4]] project, because a local bookshop paid for our costumes and props. The owner said that good lighting was [[5]], absolutely necessary, if we wanted the film to look professional. My classmate Brian brought a [[6]] camera, the newest model with all the latest features. Since we obviously could not afford real dragons, he added [[7]] on his laptop, creating fire-breathing monsters with computer software.",
      "In a film, actors [[8]] follow the script exactly, but on the second day our main actor forgot his lines. Instead of stopping, the other actors used [[9]], making up new lines on the spot without any preparation. Their new jokes made the whole crew [[10]] quietly behind the camera, trying not to ruin the scene. When our lighting student was ill, two Form 5 students offered to [[11]], helping us carry the heavy lamps up the hill.",
      "Our dragon, a huge red puppet, stood out [[12]] against the grey sky; it was so easy to notice that nobody could miss it. Ms Yip watched every scene and gave us feedback [[13]], explaining clearly how each one could be improved. The ending was [[14]], making the audience think deeply about friendship and discuss it long after the film had finished. In the end, our film won first prize. We had really [[15]], succeeding completely in our very first film competition!"
    ], [
      ["cast", "cast", "The group of actors: \"twelve students, each playing a different character\"."],
      ["supervisor", "supervise", "\"managing the team and checking our work every week\".", "verb", "\"agreed to ___\": after \"to\", we need a verb."],
      ["make-believe", "make-believe", "\"a fantasy story set in an imaginary kingdom, with dragons, magic and talking trees\"."],
      ["sponsored", "sponsored", "\"a local bookshop paid for our costumes and props\"."],
      ["essential", "essential", "\"absolutely necessary\"."],
      ["cutting-edge", "cutting-edge", "\"the newest model with all the latest features\"."],
      ["visual effects", "visual effects", "\"creating fire-breathing monsters with computer software\"."],
      ["norm", "normally", "This is the usual way films are made, \"but on the second day\" something different happened.", "adverb", "\"actors ___ follow\": a word that describes the verb \"follow\" is an adverb."],
      ["improvise", "improvisation", "\"making up new lines on the spot without any preparation\".", "noun", "\"used ___\": the verb \"used\" needs a noun as its object."],
      ["chuckle", "chuckle", "They laughed \"quietly behind the camera, trying not to ruin the scene\"."],
      ["lend a hand", "lend a hand", "\"helping us carry the heavy lamps up the hill\"."],
      ["conspicuous", "conspicuously", "\"it was so easy to notice that nobody could miss it\".", "adverb", "\"stood out ___\" describes how it stood out, so we need an adverb."],
      ["constructive", "constructively", "\"explaining clearly how each one could be improved\".", "adverb", "\"gave us feedback ___\" describes how she gave it, so we need an adverb."],
      ["thought-provoking", "thought-provoking", "\"making the audience think deeply about friendship and discuss it\"."],
      ["hit a home run", "hit a home run", "\"succeeding completely in our very first film competition\"."]
    ]),

    passage("s3", "Teaching Technology at an Elderly Home", [
      "Every Saturday this term, my classmates and I visited an elderly home in Wong Tai Sin to teach the [[1]], the people who live there, how to use smartphones. When they were young, it was the [[2]] to write letters or make phone calls, the usual way of keeping in touch. However, many of their grandchildren now live abroad, so they would [[3]] need to learn video calls one day; there was no way to avoid it.",
      "Mr Wong, an 82-year-old former bus driver, was the first to [[4]] the idea, happily accepting the challenge of learning something new. Through hours of practice, he managed to [[5]] all the skills he needed. His [[6]] on his daughter for help with his phone had always made him feel useless, so he was proud to do things by himself at last.",
      "We also set up a [[7]] tour for the residents, using a headset that let them walk around Paris without leaving their chairs. One lady, Mrs Chan, would [[8]] tightly to my arm whenever the tour showed a high bridge, holding on as if she might fall. She also showed us photos of her great-grandson, an [[9]] baby with big eyes and a lovely smile that made everyone love him. We kept every lesson [[10]], with games and quizzes that held their attention for a whole hour.",
      "Our hard work seemed to [[11]] the manager of the home, who said she admired how patient we were. When the residents had a problem with their phones, they would [[12]] us for help, sending messages to our class group chat. Some students from a nearby college even [[13]] old tablets to the home, giving them away for free. The experience made me think about my future [[14]] and the kind of job I would like. I now believe that caring for older people could be my [[15]], the work I feel I was meant to do."
    ], [
      ["residents", "residents", "\"the people who live there\"."],
      ["norm", "norm", "\"the usual way of keeping in touch\"."],
      ["inevitable", "inevitably", "\"there was no way to avoid it\".", "adverb", "\"would ___ need\": a word that describes the verb \"need\" is an adverb."],
      ["embrace", "embrace", "\"happily accepting the challenge of learning something new\"."],
      ["acquire", "acquire", "He gained the skills \"through hours of practice\"."],
      ["reliant", "reliance", "He needed \"his daughter for help with his phone\".", "noun", "\"His ___ on\": a possessive like \"his\" is followed by a noun."],
      ["virtual", "virtual", "It \"let them walk around Paris without leaving their chairs\"."],
      ["cling", "cling", "\"holding on as if she might fall\"."],
      ["adorable", "adorable", "\"a lovely smile that made everyone love him\"."],
      ["engaging", "engaging", "\"games and quizzes that held their attention for a whole hour\"."],
      ["impressive", "impress", "The manager \"admired how patient we were\".", "verb", "\"seemed to ___\": after \"to\", we need a verb."],
      ["turn to", "turn to", "They asked us \"for help, sending messages to our class group chat\"."],
      ["donate", "donated", "\"giving them away for free\" (in the past)."],
      ["employ", "employment", "\"the kind of job I would like\".", "noun", "\"my future ___\": after \"my future\", we need a noun."],
      ["vocational", "vocation", "\"the work I feel I was meant to do\".", "noun", "\"my ___\": a possessive like \"my\" is followed by a noun."]
    ]),

    passage("s3", "Film Review: The Lantern Keeper", [
      "Last week, our class watched The Lantern Keeper, a small local film that was nothing like a Hollywood [[1]] that fills every cinema and earns millions. It tells the story of a girl from an [[2]] family, so poor that they cannot even afford rice. It was filmed in a [[3]] fishing village on Lantau Island, with colourful boats and old wooden houses as charming as a postcard.",
      "The story begins [[4]], with jokes and funny scenes that are not serious at all, and the audience let out quiet [[5]] all through the first half. However, the girl soon becomes [[6]] in a complicated family argument that she cannot escape from. The young actress who plays the girl is only thirteen, but her acting is excellent. Her grandfather leaves her a secret message, and she must [[7]] it to discover the hidden meaning of his words.",
      "The director [[8]] the bright colours of the lantern festival with the dark, rainy night of the final scene, so that the difference between happiness and sadness was easy to see. The film was made on a small budget, and its total [[9]], the amount of money spent on it, was less than one million dollars. Even so, the director managed to [[10]] simple paper lanterns and natural light very effectively. The final scene was filmed [[11]], and the audience admired the camera work so much that they clapped.",
      "The girl treats her sick grandfather [[12]], caring for him with deep sympathy and a strong wish to help. I admit that I used to [[13]] local films, thinking they were less important than Hollywood ones, but this one changed my mind. Unfortunately, the ending was a little [[14]] sad, and I guessed it halfway through. Still, a clip of the lantern festival scene has gone [[15]], and millions of people have shared it online."
    ], [
      ["blockbuster", "blockbuster", "A Hollywood film \"that fills every cinema and earns millions\"."],
      ["impoverished", "impoverished", "\"so poor that they cannot even afford rice\"."],
      ["picturesque", "picturesque", "\"colourful boats and old wooden houses as charming as a postcard\"."],
      ["light-hearted", "light-heartedly", "\"with jokes and funny scenes that are not serious at all\".", "adverb", "\"begins ___\" describes how the story begins, so we need an adverb."],
      ["chuckle", "chuckles", "The audience laughed quietly at the jokes.", "noun", "\"quiet ___\": after the adjective \"quiet\", we need a (plural) noun."],
      ["entangled", "entangled", "\"in a complicated family argument that she cannot escape from\"."],
      ["decode", "decode", "\"to discover the hidden meaning of his words\"."],
      ["contrast", "contrasted", "He showed \"the difference between happiness and sadness\" (in the past)."],
      ["expenditure", "expenditure", "\"the amount of money spent on it\"."],
      ["utilize", "utilize", "He used them \"very effectively\".", null, null, ["utilise"]],
      ["impressive", "impressively", "\"the audience admired the camera work so much that they clapped\".", "adverb", "\"was filmed ___\" describes how it was filmed, so we need an adverb."],
      ["compassion", "compassionately", "\"caring for him with deep sympathy and a strong wish to help\".", "adverb", "\"treats her sick grandfather ___\" describes how she treats him, so we need an adverb."],
      ["underestimate", "underestimate", "\"thinking they were less important than Hollywood ones\"."],
      ["predictable", "predictably", "\"I guessed it halfway through\".", "adverb", "\"___ sad\": a word that describes the adjective \"sad\" is an adverb."],
      ["viral", "viral", "\"millions of people have shared it online\"."]
    ]),

    passage("s3", "Our Charity Fun Run", [
      "In March, our school held a charity fun run to raise money for a youth centre that offers [[1]] courses, such as cooking and hairdressing, to teach young people the skills they need for a job. Each runner needed a [[2]], a person or company willing to pay money for every kilometre we ran. My aunt's bakery agreed to pay twenty dollars for each kilometre I finished.",
      "Our PE teacher, Mr Cheung, was the [[3]] of the event, managing the volunteers and checking that everything ran safely. He decided to [[4]] a new timing system, a [[5]] one with the newest technology: every runner wore a chip that recorded their time automatically. The event was [[6]] a race, but most of us just wanted to have fun and help others.",
      "On the day, I wore a bright yellow costume so that my family could spot me easily, and I was very [[7]] in the crowd. Halfway through the race, it started to pour with rain. Getting wet was [[8]]: there was no way to avoid it, because nobody had brought an umbrella. When the water station ran out of cups, the volunteers had to [[9]], quickly making cups out of folded paper without any preparation.",
      "Mr Cheung's feedback after the race was [[10]]; he told each team clearly how to do even better next year. In the end, [[11]] every student in the school took part, almost all 900 of us. We raised so much money that there was an [[12]] of five thousand dollars, more than the youth centre needed, so the extra money went to a soup kitchen. The race left a strong [[13]] on everyone, and the principal said our teamwork was the best she had ever seen. Before the run, I thought it was [[14]] for students to just study and go home, but now I [[15]] every chance to help others, willingly saying yes whenever someone asks."
    ], [
      ["vocational", "vocational", "Courses that \"teach young people the skills they need for a job\"."],
      ["sponsored", "sponsor", "\"a person or company willing to pay money for every kilometre we ran\".", "noun", "\"a ___\": after \"a\", we need a noun."],
      ["supervisor", "supervisor", "\"managing the volunteers and checking that everything ran safely\"."],
      ["employ", "employ", "He decided to use a new system."],
      ["cutting-edge", "cutting-edge", "\"with the newest technology\"."],
      ["essential", "essentially", "Basically, at its heart, it was a race, \"but most of us just wanted to have fun\".", "adverb", "\"was ___ a race\": a word added like this to describe the whole idea is an adverb."],
      ["conspicuous", "conspicuous", "\"so that my family could spot me easily\"."],
      ["inevitable", "inevitable", "\"there was no way to avoid it\"."],
      ["improvise", "improvise", "\"quickly making cups out of folded paper without any preparation\"."],
      ["constructive", "constructive", "Helpful feedback: \"he told each team clearly how to do even better next year\"."],
      ["virtual", "virtually", "\"almost all 900 of us\".", "adverb", "\"___ every student\": a word that describes \"every\" like this is an adverb."],
      ["excess", "excess", "\"more than the youth centre needed\"."],
      ["impressive", "impression", "The race had a strong effect on everyone: \"the principal said our teamwork was the best she had ever seen\".", "noun", "\"a strong ___\": after the adjective \"strong\", we need a noun."],
      ["norm", "normal", "The usual thing: \"for students to just study and go home\".", "adjective", "\"it was ___ for\": after \"was\", we need an adjective."],
      ["embrace", "embrace", "\"willingly saying yes whenever someone asks\"."]
    ])
  ]
};
})();
