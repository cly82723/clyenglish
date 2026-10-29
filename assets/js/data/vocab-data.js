/* S.1–S.3 vocabulary lists and built-in cloze passages, carried over from the earlier CLY English revision app. */

(function () {

"use strict";

const vocabLists = {
 "s1": {
  "level": "S.1 (Secondary 1, about 12 years old, lower-intermediate English)",
  "units": {
   "Unit 1: Who am I?": [
    {
     "word": "adventurous",
     "pos": "adjective",
     "meaning": "(of a person) enjoying being in new, exciting situations",
     "family": [
      {
       "form": "adventure",
       "pos": "noun"
      },
      {
       "form": "adventurously",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "considerate",
     "pos": "adjective",
     "meaning": "always thinking of other people's wishes and feelings",
     "family": [
      {
       "form": "consideration",
       "pos": "noun"
      },
      {
       "form": "consider",
       "pos": "verb"
      },
      {
       "form": "considerately",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "energetic",
     "pos": "adjective",
     "meaning": "having or needing a lot of energy",
     "family": [
      {
       "form": "energy",
       "pos": "noun"
      },
      {
       "form": "energize",
       "pos": "verb"
      },
      {
       "form": "energetically",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "engage in",
     "pos": "phrasal verb",
     "meaning": "to take part in something",
     "family": [
      {
       "form": "engagement",
       "pos": "noun"
      },
      {
       "form": "engaging",
       "pos": "adjective"
      },
      {
       "form": "engagingly",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "gallop",
     "pos": "verb",
     "meaning": "when a horse moves very fast with all four feet off the ground",
     "family": [
      {
       "form": "gallop",
       "pos": "noun"
      }
     ]
    },
    {
     "word": "introverted",
     "pos": "adjective",
     "meaning": "more interested in your own thoughts and feelings than in spending time with other people",
     "family": [
      {
       "form": "introvert",
       "pos": "noun"
      }
     ]
    },
    {
     "word": "irritated",
     "pos": "adjective",
     "meaning": "annoyed or angry",
     "family": [
      {
       "form": "irritation",
       "pos": "noun"
      },
      {
       "form": "irritate",
       "pos": "verb"
      },
      {
       "form": "irritating",
       "pos": "adjective"
      },
      {
       "form": "irritatingly",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "nerd",
     "pos": "noun",
     "meaning": "a person who is very interested in computers",
     "family": [
      {
       "form": "nerdy",
       "pos": "adjective"
      }
     ]
    },
    {
     "word": "pastime",
     "pos": "noun",
     "meaning": "something that you enjoy doing when you are not working"
    },
    {
     "word": "sociable",
     "pos": "adjective",
     "meaning": "enjoying spending time with other people",
     "family": [
      {
       "form": "socialise",
       "pos": "verb"
      },
      {
       "form": "sociably",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "awesome",
     "pos": "adjective",
     "meaning": "extremely impressive",
     "family": [
      {
       "form": "awe",
       "pos": "noun"
      },
      {
       "form": "awesomely",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "competitive",
     "pos": "adjective",
     "meaning": "trying very hard to be better than others",
     "family": [
      {
       "form": "competition",
       "pos": "noun"
      },
      {
       "form": "compete",
       "pos": "verb"
      },
      {
       "form": "competitively",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "generous",
     "pos": "adjective",
     "meaning": "giving or willing to give freely",
     "family": [
      {
       "form": "generosity",
       "pos": "noun"
      },
      {
       "form": "generously",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "hang out",
     "pos": "phrasal verb",
     "meaning": "to spend a lot of time in a place",
     "family": [
      {
       "form": "hangout",
       "pos": "noun"
      }
     ]
    },
    {
     "word": "highlight",
     "pos": "noun",
     "meaning": "the best, most interesting or most exciting part of something",
     "family": [
      {
       "form": "highlight",
       "pos": "verb"
      }
     ]
    },
    {
     "word": "hilarious",
     "pos": "adjective",
     "meaning": "extremely funny",
     "family": [
      {
       "form": "hilarity",
       "pos": "noun"
      },
      {
       "form": "hilariously",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "laid-back",
     "pos": "adjective",
     "meaning": "calm and relaxed"
    },
    {
     "word": "spotless",
     "pos": "adjective",
     "meaning": "perfectly clean",
     "family": [
      {
       "form": "spotlessness",
       "pos": "noun"
      },
      {
       "form": "spotlessly",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "thrilling",
     "pos": "adjective",
     "meaning": "exciting and a lot of fun",
     "family": [
      {
       "form": "thrill",
       "pos": "noun"
      },
      {
       "form": "thrill",
       "pos": "verb"
      },
      {
       "form": "thrillingly",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "wipe out",
     "pos": "phrasal verb",
     "meaning": "to fall over, especially when doing a sport such as skiing or surfing"
    }
   ],
   "Unit 2: What do we get from school?": [
    {
     "word": "access",
     "pos": "verb",
     "meaning": "to be able to get to or get inside a place",
     "family": [
      {
       "form": "access",
       "pos": "noun"
      },
      {
       "form": "accessible",
       "pos": "adjective"
      },
      {
       "form": "accessibly",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "collaborate",
     "pos": "verb",
     "meaning": "to work with someone else for a special purpose",
     "family": [
      {
       "form": "collaboration",
       "pos": "noun"
      },
      {
       "form": "collaborative",
       "pos": "adjective"
      },
      {
       "form": "collaboratively",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "diverse",
     "pos": "adjective",
     "meaning": "very different from each other and of various kinds",
     "family": [
      {
       "form": "diversity",
       "pos": "noun"
      },
      {
       "form": "diversify",
       "pos": "verb"
      },
      {
       "form": "diversely",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "entertain",
     "pos": "verb",
     "meaning": "to interest somebody or make somebody laugh in order to please them",
     "family": [
      {
       "form": "entertainment",
       "pos": "noun"
      },
      {
       "form": "entertainer",
       "pos": "noun"
      },
      {
       "form": "entertaining",
       "pos": "adjective"
      },
      {
       "form": "entertainingly",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "ideal",
     "pos": "adjective",
     "meaning": "perfect or most suitable",
     "family": [
      {
       "form": "idealize",
       "pos": "verb"
      },
      {
       "form": "ideally",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "imaginary",
     "pos": "adjective",
     "meaning": "existing only in your mind or imagination",
     "family": [
      {
       "form": "imagine",
       "pos": "verb"
      }
     ]
    },
    {
     "word": "multifunctional",
     "pos": "adjective",
     "meaning": "having several different functions"
    },
    {
     "word": "extraordinary",
     "pos": "adjective",
     "meaning": "very unusual, special, unexpected, or strange",
     "family": [
      {
       "form": "extraordinarily",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "physical",
     "pos": "adjective",
     "meaning": "connected with things that actually exist and can be seen or felt",
     "family": [
      {
       "form": "physically",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "unwind",
     "pos": "verb",
     "meaning": "to relax after a period of work or anxiety"
    },
    {
     "word": "account",
     "pos": "noun",
     "meaning": "an arrangement that lets somebody use the internet, email, social media, etc."
    },
    {
     "word": "available",
     "pos": "adjective",
     "meaning": "that you can get, buy or find",
     "family": [
      {
       "form": "availability",
       "pos": "noun"
      }
     ]
    },
    {
     "word": "brief",
     "pos": "adjective",
     "meaning": "using few words",
     "family": [
      {
       "form": "brief",
       "pos": "verb"
      },
      {
       "form": "briefly",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "landscape",
     "pos": "noun",
     "meaning": "everything you can see when you look across a large area of land"
    },
    {
     "word": "outline",
     "pos": "noun",
     "meaning": "a description of the main facts or points involved in something",
     "family": [
      {
       "form": "outline",
       "pos": "verb"
      }
     ]
    },
    {
     "word": "virtual",
     "pos": "adjective",
     "meaning": "made to appear to exist by the use of computer software",
     "family": [
      {
       "form": "virtually",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "education",
     "pos": "noun",
     "meaning": "a process of teaching, training and learning",
     "family": [
      {
       "form": "educate",
       "pos": "verb"
      },
      {
       "form": "educational",
       "pos": "adjective"
      }
     ]
    },
    {
     "word": "productive",
     "pos": "adjective",
     "meaning": "doing or achieving a lot",
     "family": [
      {
       "form": "productivity",
       "pos": "noun"
      },
      {
       "form": "productively",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "recyclable",
     "pos": "adjective",
     "meaning": "able to be recycled",
     "family": [
      {
       "form": "recycling",
       "pos": "noun"
      },
      {
       "form": "recycle",
       "pos": "verb"
      }
     ]
    },
    {
     "word": "responsibility",
     "pos": "noun",
     "meaning": "a duty to deal with or take care of somebody/something",
     "family": [
      {
       "form": "responsible",
       "pos": "adjective"
      },
      {
       "form": "responsibly",
       "pos": "adverb"
      }
     ]
    }
   ]
  }
 },
 "s2": {
  "level": "S.2 (Secondary 2, about 13 years old, lower-intermediate to intermediate English)",
  "units": {
   "1st Uniform Test Vocabulary": [
    {
     "word": "addiction",
     "pos": "noun",
     "meaning": "the condition of being unable to stop using or doing something as a habit, especially something harmful"
    },
    {
     "word": "advertising",
     "pos": "noun",
     "meaning": "the activity and industry of advertising things to people on television, in newspapers, on the internet, etc."
    },
    {
     "word": "artisan",
     "pos": "noun",
     "meaning": "a person who does work that needs a special skill, making things with their hands"
    },
    {
     "word": "bargain",
     "pos": "noun",
     "meaning": "something bought for less than the usual price"
    },
    {
     "word": "best-selling",
     "pos": "adjective",
     "meaning": "describing a product, usually a book, which is bought by large numbers of people"
    },
    {
     "word": "bombard",
     "pos": "verb",
     "meaning": "to attack a place or somebody with a lot of questions, criticisms, etc."
    },
    {
     "word": "claim",
     "pos": "verb",
     "meaning": "to say that something is true although it has not been proved and other people may not believe it"
    },
    {
     "word": "convinced",
     "pos": "adjective",
     "meaning": "completely sure about something"
    },
    {
     "word": "consequence",
     "pos": "noun",
     "meaning": "a result of something that has happened, especially an unpleasant result"
    },
    {
     "word": "cumbersome",
     "pos": "adjective",
     "meaning": "large and heavy"
    },
    {
     "word": "criticism",
     "pos": "noun",
     "meaning": "the act of expressing disapproval of somebody/something and opinions about their faults or bad qualities"
    },
    {
     "word": "customize",
     "pos": "verb",
     "meaning": "to make or change something to suit the needs of the owner or user"
    },
    {
     "word": "deal",
     "pos": "noun",
     "meaning": "an agreement, especially in business, on particular conditions for buying or doing something"
    },
    {
     "word": "doxing",
     "pos": "noun",
     "meaning": "the act of publicly providing personally identifiable information about an individual or organization, usually via the Internet"
    },
    {
     "word": "eavesdrop",
     "pos": "verb",
     "meaning": "to listen secretly to what other people are saying"
    },
    {
     "word": "embrace",
     "pos": "verb",
     "meaning": "to accept an idea, a proposal, a set of beliefs, etc."
    },
    {
     "word": "emergency",
     "pos": "noun",
     "meaning": "a sudden serious and dangerous event or situation that needs immediate action to deal with it"
    },
    {
     "word": "generic",
     "pos": "adjective",
     "meaning": "shared by, including or typical of a whole group of things; not specific"
    },
    {
     "word": "haggle",
     "pos": "verb",
     "meaning": "to argue with somebody in order to reach an agreement, especially about the price of something"
    },
    {
     "word": "harass",
     "pos": "verb",
     "meaning": "to annoy or worry somebody by putting pressure on them or saying or doing unpleasant things to them"
    },
    {
     "word": "invade",
     "pos": "verb",
     "meaning": "to enter a place in large numbers, especially in a way that causes damage or problems"
    },
    {
     "word": "misinterpret",
     "pos": "verb",
     "meaning": "to understand something/somebody wrongly"
    },
    {
     "word": "optimize",
     "pos": "verb",
     "meaning": "to make something as good as it can be"
    },
    {
     "word": "panic",
     "pos": "verb/noun",
     "meaning": "a sudden feeling of great fear that cannot be controlled and prevents you from thinking clearly"
    },
    {
     "word": "prominent",
     "pos": "adjective",
     "meaning": "easily seen"
    },
    {
     "word": "responsive",
     "pos": "adjective",
     "meaning": "reacting quickly and in a positive way"
    },
    {
     "word": "sabotage",
     "pos": "verb",
     "meaning": "to damage or destroy something deliberately to prevent someone from using it or to protest about something"
    },
    {
     "word": "second-hand",
     "pos": "adjective",
     "meaning": "owned by somebody else before"
    },
    {
     "word": "shop around",
     "pos": "verb phrase",
     "meaning": "to compare the quality or prices of goods or services that are offered by different shops, companies, etc. so that you can choose the best"
    },
    {
     "word": "source",
     "pos": "noun",
     "meaning": "a place, person or thing that you get something from"
    },
    {
     "word": "stall",
     "pos": "noun",
     "meaning": "a table or small shop with an open front that people sell things from, especially at a market"
    },
    {
     "word": "stir",
     "pos": "verb",
     "meaning": "to make somebody excited or make them feel something strongly"
    },
    {
     "word": "severe",
     "pos": "adjective",
     "meaning": "extremely bad or serious"
    },
    {
     "word": "tag",
     "pos": "noun",
     "meaning": "a small piece of paper, cloth, plastic, etc. attached to something to identify it or give information about it"
    },
    {
     "word": "targeted",
     "pos": "adjective",
     "meaning": "aimed at a particular place or group of people"
    },
    {
     "word": "threaten",
     "pos": "verb",
     "meaning": "to say that you will cause trouble, hurt somebody, etc. if you do not get what you want"
    },
    {
     "word": "track",
     "pos": "verb",
     "meaning": "to find somebody/something by following the marks, signs, information, etc., that they have left behind them"
    },
    {
     "word": "troll",
     "pos": "noun",
     "meaning": "a person who sends a message that makes other people angry to a discussion group on the internet"
    },
    {
     "word": "vintage",
     "pos": "adjective",
     "meaning": "typical of a period in the past and of high quality"
    },
    {
     "word": "viral",
     "pos": "adjective",
     "meaning": "used to describe a piece of information, a video, an image, etc. that is sent rapidly over the internet and seen by large numbers of people within a short time"
    }
   ]
  }
 },
 "s3": {
  "level": "S.3 (Secondary 3, about 14 years old, intermediate English)",
  "units": {
   "Unit 1: What makes a good film?": [
    {
     "word": "acquire",
     "pos": "verb",
     "meaning": "to gain or obtain something, often through effort or experience",
     "family": [
      {
       "form": "acquisition",
       "pos": "noun"
      }
     ]
    },
    {
     "word": "blockbuster",
     "pos": "noun",
     "meaning": "a film that achieves huge commercial success and attracts a very large audience"
    },
    {
     "word": "cast",
     "pos": "noun",
     "meaning": "the group of actors chosen to perform roles in a film",
     "family": [
      {
       "form": "cast",
       "pos": "verb"
      }
     ]
    },
    {
     "word": "conspicuous",
     "pos": "adjective",
     "meaning": "easily noticeable or attracting attention",
     "family": [
      {
       "form": "conspicuousness",
       "pos": "noun"
      },
      {
       "form": "conspicuously",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "contrast",
     "pos": "noun/verb",
     "meaning": "a difference between two things that is clear when compared",
     "family": [
      {
       "form": "contrasting",
       "pos": "adjective"
      }
     ]
    },
    {
     "word": "cutting-edge",
     "pos": "adjective",
     "meaning": "very modern and with all the newest features"
    },
    {
     "word": "embrace",
     "pos": "verb",
     "meaning": "to willingly adopt new techniques, ideas or technologies",
     "family": [
      {
       "form": "embrace",
       "pos": "noun"
      }
     ]
    },
    {
     "word": "employ",
     "pos": "verb",
     "meaning": "to use something or to give someone a job",
     "family": [
      {
       "form": "employment",
       "pos": "noun"
      }
     ]
    },
    {
     "word": "make-believe",
     "pos": "noun/adjective",
     "meaning": "the imaginative creation of fictional worlds, characters and situations"
    },
    {
     "word": "norm",
     "pos": "noun",
     "meaning": "a standard or usual way of doing something",
     "family": [
      {
       "form": "normal",
       "pos": "adjective"
      },
      {
       "form": "normally",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "supervisor",
     "pos": "noun",
     "meaning": "a person who manages or oversees others",
     "family": [
      {
       "form": "supervise",
       "pos": "verb"
      }
     ]
    },
    {
     "word": "utilize",
     "pos": "verb",
     "meaning": "to use something effectively",
     "family": [
      {
       "form": "utilization",
       "pos": "noun"
      }
     ]
    },
    {
     "word": "visual effects",
     "pos": "noun phrase",
     "meaning": "digitally or mechanically created imagery added to a film"
    },
    {
     "word": "decode",
     "pos": "verb",
     "meaning": "to interpret or discover hidden meaning",
     "family": [
      {
       "form": "decoding",
       "pos": "noun"
      }
     ]
    },
    {
     "word": "engaging",
     "pos": "adjective",
     "meaning": "able to hold the audience's attention",
     "family": [
      {
       "form": "engagement",
       "pos": "noun"
      },
      {
       "form": "engage",
       "pos": "verb"
      },
      {
       "form": "engagingly",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "entangled",
     "pos": "adjective",
     "meaning": "twisted or caught up in a complicated situation",
     "family": [
      {
       "form": "entanglement",
       "pos": "noun"
      },
      {
       "form": "entangle",
       "pos": "verb"
      }
     ]
    },
    {
     "word": "impressive",
     "pos": "adjective",
     "meaning": "causing someone to feel admiration or respect",
     "family": [
      {
       "form": "impression",
       "pos": "noun"
      },
      {
       "form": "impress",
       "pos": "verb"
      },
      {
       "form": "impressively",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "light-hearted",
     "pos": "adjective",
     "meaning": "amusing and not serious",
     "family": [
      {
       "form": "light-heartedness",
       "pos": "noun"
      },
      {
       "form": "light-heartedly",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "picturesque",
     "pos": "adjective",
     "meaning": "attractive in appearance, especially in an old-fashioned way"
    },
    {
     "word": "predictable",
     "pos": "adjective",
     "meaning": "with a storyline or ending that can easily be guessed",
     "family": [
      {
       "form": "prediction",
       "pos": "noun"
      },
      {
       "form": "predict",
       "pos": "verb"
      },
      {
       "form": "predictably",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "thought-provoking",
     "pos": "adjective",
     "meaning": "making people think deeply and discuss"
    },
    {
     "word": "unconventional",
     "pos": "adjective",
     "meaning": "not based on what is generally done or believed",
     "family": [
      {
       "form": "unconventionally",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "virtual",
     "pos": "adjective",
     "meaning": "created by computer technology and not existing in the physical world",
     "family": [
      {
       "form": "virtuality",
       "pos": "noun"
      },
      {
       "form": "virtually",
       "pos": "adverb"
      }
     ]
    }
   ],
   "Unit 2: How can we help others?": [
    {
     "word": "adorable",
     "pos": "adjective",
     "meaning": "very attractive and easy to feel love for",
     "family": [
      {
       "form": "adoration",
       "pos": "noun"
      },
      {
       "form": "adore",
       "pos": "verb"
      },
      {
       "form": "adorably",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "chuckle",
     "pos": "verb",
     "meaning": "to laugh quietly or to oneself",
     "family": [
      {
       "form": "chuckle",
       "pos": "noun"
      }
     ]
    },
    {
     "word": "cling",
     "pos": "verb",
     "meaning": "to hold on tightly to something or someone",
     "family": [
      {
       "form": "clingy",
       "pos": "adjective"
      }
     ]
    },
    {
     "word": "donate",
     "pos": "verb",
     "meaning": "to give money or goods to help a person or organization",
     "family": [
      {
       "form": "donation",
       "pos": "noun"
      }
     ]
    },
    {
     "word": "essential",
     "pos": "adjective",
     "meaning": "necessary or needed",
     "family": [
      {
       "form": "essence",
       "pos": "noun"
      },
      {
       "form": "essentially",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "hit a home run",
     "pos": "verb phrase",
     "meaning": "to succeed completely and impressively in an activity"
    },
    {
     "word": "improvise",
     "pos": "verb",
     "meaning": "to invent or do something without preparation",
     "family": [
      {
       "form": "improvisation",
       "pos": "noun"
      },
      {
       "form": "improvisational",
       "pos": "adjective"
      }
     ]
    },
    {
     "word": "lend a hand",
     "pos": "verb phrase",
     "meaning": "to help somebody"
    },
    {
     "word": "residents",
     "pos": "noun",
     "meaning": "people who live in a particular place",
     "family": [
      {
       "form": "reside",
       "pos": "verb"
      },
      {
       "form": "residential",
       "pos": "adjective"
      }
     ]
    },
    {
     "word": "sponsored",
     "pos": "adjective",
     "meaning": "supported or paid for by someone, usually a business or organization",
     "family": [
      {
       "form": "sponsor",
       "pos": "noun"
      },
      {
       "form": "sponsor",
       "pos": "verb"
      }
     ]
    },
    {
     "word": "underestimate",
     "pos": "verb",
     "meaning": "to think that something is less important or capable than it really is",
     "family": [
      {
       "form": "underestimation",
       "pos": "noun"
      }
     ]
    },
    {
     "word": "viral",
     "pos": "adjective",
     "meaning": "quickly and widely spread or popular, especially on the internet",
     "family": [
      {
       "form": "virality",
       "pos": "noun"
      },
      {
       "form": "virally",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "constructive",
     "pos": "adjective",
     "meaning": "helpful and intended to improve a situation",
     "family": [
      {
       "form": "constructiveness",
       "pos": "noun"
      },
      {
       "form": "constructively",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "compassion",
     "pos": "noun",
     "meaning": "a strong feeling of sympathy and desire to help others",
     "family": [
      {
       "form": "compassionate",
       "pos": "adjective"
      },
      {
       "form": "compassionately",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "excess",
     "pos": "adjective/noun",
     "meaning": "more than necessary or allowed",
     "family": [
      {
       "form": "excessive",
       "pos": "adjective"
      },
      {
       "form": "excessively",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "expenditure",
     "pos": "noun",
     "meaning": "an amount of money spent",
     "family": [
      {
       "form": "expend",
       "pos": "verb"
      }
     ]
    },
    {
     "word": "impoverished",
     "pos": "adjective",
     "meaning": "very poor",
     "family": [
      {
       "form": "impoverishment",
       "pos": "noun"
      },
      {
       "form": "impoverish",
       "pos": "verb"
      }
     ]
    },
    {
     "word": "inevitable",
     "pos": "adjective",
     "meaning": "certain to happen and unable to be avoided",
     "family": [
      {
       "form": "inevitability",
       "pos": "noun"
      },
      {
       "form": "inevitably",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "reliant",
     "pos": "adjective",
     "meaning": "needing something or someone in order to survive or succeed",
     "family": [
      {
       "form": "reliance",
       "pos": "noun"
      },
      {
       "form": "rely",
       "pos": "verb"
      },
      {
       "form": "reliantly",
       "pos": "adverb"
      }
     ]
    },
    {
     "word": "soup kitchen",
     "pos": "noun phrase",
     "meaning": "a place where people with no money can get free food"
    },
    {
     "word": "turn to",
     "pos": "verb phrase",
     "meaning": "to ask someone for help"
    },
    {
     "word": "vocational",
     "pos": "adjective",
     "meaning": "relating to the skills needed to do a particular job",
     "family": [
      {
       "form": "vocation",
       "pos": "noun"
      }
     ]
    }
   ]
  }
 }
};

const GRADES = [
    { id: "s1", label: "S.1", eyebrow: "Units 1 & 2", source: "Units 1 & 2 Vocabulary Worksheets", tagline: "A wild vocab quiz appeared" },
    { id: "s2", label: "S.2", eyebrow: "1st Uniform Test", source: "1st Uniform Test Vocabulary Revision Worksheet", tagline: "W Rizz Vocab Quizz" },
    { id: "s3", label: "S.3", eyebrow: "Units 1 & 2", source: "Units 1 & 2 Vocabulary Worksheets", tagline: "Tung Tung Vocab Quiz" }
];

const vocabFallback = (grade, title, paragraphs, blanks) => {
    const words = Object.values(vocabLists[grade].units).flat();
    return {
        title,
        paragraphs: paragraphs.map(p => p.split(/\[\[(\d+)\]\]/).map((part, i) => i % 2 ? Number(part) : part)),
        blanks: Object.fromEntries(blanks.map(([word, answer, clue, pos, formNote], i) => {
            const item = words.find(w => w.word === word);
            return [i + 1, { word, listedPos: item.pos, pos: pos || item.pos, changed: !!pos, meaning: item.meaning, answers: [answer], letter: answer[0], clue, formNote: formNote || "" }];
        }))
    };
};

const VOCAB_FALLBACK = {
    s1: vocabFallback("s1", "My First Week at Secondary School", [
        "Before secondary school, I was quite [[1]] and preferred reading quietly on my own to chatting with strangers. My new classmate Kelvin is the opposite. He is so [[2]] that he made ten new friends on the very first day! He also seems to have endless [[3]], running around the playground all lunchtime without ever getting tired. On Tuesday, he showed real [[4]] by sharing his snacks with everyone who had forgotten theirs.",
        "What I love most about my new school is its [[5]]: my classmates come from many different backgrounds, and some of them speak three languages! On Wednesday, our teacher asked us to work in groups to design our [[6]] school, the perfect school we would most like to study in. The project needed a lot of [[7]], because nobody could finish it alone. My group planned a [[8]] hall that could be used as a library, a gym and a theatre. We also wanted every classroom to be [[9]], so we added a robot that cleans the floors until there is not a single speck of dirt. To make sure every student could use the hall, we decided it should be [[10]] from early morning until late at night, even at weekends.",
        "The [[11]] of the week, though, was Friday's talent show. It was easily the best part of all! There was plenty of [[12]] for everyone: songs, magic tricks and even a dance by our teachers. Our class teacher told jokes so [[13]] that we could not stop laughing. After the show, Kelvin and I [[14]] at the park near school, just spending time together with our friends. Then I went home to [[15]] in front of the TV, because after such a busy week I really needed to relax."
    ], [
        ["introverted", "introverted", "He \"preferred reading quietly on my own to chatting with strangers\": he is quiet and happiest alone."],
        ["sociable", "sociable", "He \"made ten new friends on the very first day\", so he enjoys being with people."],
        ["energetic", "energy", "\"without ever getting tired\" and running \"all lunchtime\".", "noun", "\"endless\" is an adjective, so a noun must follow it."],
        ["generous", "generosity", "He was \"sharing his snacks with everyone\".", "noun", "\"showed real ___\": after the adjective \"real\", we need a noun."],
        ["diverse", "diversity", "Classmates \"come from many different backgrounds\".", "noun", "\"its ___\": a possessive like \"its\" is followed by a noun."],
        ["ideal", "ideal", "It is explained straight after: \"the perfect school\"."],
        ["collaborate", "collaboration", "\"work in groups\" because \"nobody could finish it alone\".", "noun", "\"a lot of ___\" needs a noun."],
        ["multifunctional", "multifunctional", "One hall used as \"a library, a gym and a theatre\" has several functions."],
        ["spotless", "spotless", "\"not a single speck of dirt\" means perfectly clean."],
        ["available", "available", "Students can use the hall \"from early morning until late at night\"."],
        ["highlight", "highlight", "\"It was easily the best part of all!\""],
        ["entertain", "entertainment", "\"songs, magic tricks and even a dance\" are things that amuse people.", "noun", "\"plenty of ___\" needs a noun."],
        ["hilarious", "hilarious", "\"we could not stop laughing\" means the jokes were extremely funny."],
        ["hang out", "hung out", "\"just spending time together with our friends\" (and it happened in the past)."],
        ["unwind", "unwind", "\"I really needed to relax\" after \"such a busy week\"."]
    ]),
    s2: vocabFallback("s2", "A Night at the Market", [
        "Last Saturday, my cousin Mandy and I visited the night market in Mong Kok. Mandy loves old things, so she went straight to a [[1]], a small table with an open front, where an old man was selling [[2]] clothes that other people had already owned and worn. She found a [[3]] leather jacket from the 1980s that was still in excellent condition. The price [[4]] attached to the sleeve said $300, but Mandy was not ready to pay that much. She began to [[5]] with the man, arguing politely about the price until he agreed to lower it. In the end, she paid only $150. What a [[6]]!",
        "I wanted a new phone case, but I decided to [[7]] first, comparing the prices at five different places before choosing the best one. I'm glad I did, because I found an [[8]] who makes leather goods by hand. He even offered to [[9]] my case by adding my name to it, so that it would suit me perfectly. Compared with the [[10]] cases that look exactly the same in every shop, mine is truly special.",
        "While we were eating dinner, a man at the next table seemed to [[11]] on us, secretly listening to every word we said. Then a heavy storm suddenly began, and some shoppers started to [[12]], running in all directions in great fear. Luckily, there was no real [[13]]: nobody was hurt, and nothing needed urgent action. When I posted a video of the stormy market online, it went [[14]] and was seen by thousands of people overnight. Most comments were kind, but one [[15]] left rude messages just to make everyone angry."
    ], [
        ["stall", "stall", "\"a small table with an open front\" at a market, where things are sold."],
        ["second-hand", "second-hand", "Clothes \"that other people had already owned and worn\"."],
        ["vintage", "vintage", "A jacket \"from the 1980s\" that was \"still in excellent condition\": old and of high quality."],
        ["tag", "tag", "A small label \"attached to the sleeve\" that shows the price."],
        ["haggle", "haggle", "\"arguing politely about the price until he agreed to lower it\"."],
        ["bargain", "bargain", "She paid \"only $150\" instead of \"$300\", much less than the usual price."],
        ["shop around", "shop around", "\"comparing the prices at five different places before choosing the best one\"."],
        ["artisan", "artisan", "A person \"who makes leather goods by hand\"."],
        ["customize", "customize", "\"adding my name to it, so that it would suit me perfectly\"."],
        ["generic", "generic", "Cases \"that look exactly the same in every shop\", the opposite of \"truly special\"."],
        ["eavesdrop", "eavesdrop", "\"secretly listening to every word we said\"."],
        ["panic", "panic", "\"running in all directions in great fear\"."],
        ["emergency", "emergency", "\"nobody was hurt, and nothing needed urgent action\", so it was not a dangerous situation."],
        ["viral", "viral", "It \"was seen by thousands of people overnight\" online."],
        ["troll", "troll", "Someone who \"left rude messages just to make everyone angry\" online."]
    ]),
    s3: vocabFallback("s3", "The Charity Film Night", [
        "Last month, our school held a charity film night to raise money for [[1]] families who are too poor to afford even basic necessities. Many of them [[2]] on food banks just to get through the week. Instead of a Hollywood [[3]] that everyone had already seen in packed cinemas, the committee chose a very [[4]] film: a silent comedy with no dialogue at all, quite different from what audiences usually expect.",
        "The story was [[5]] rather than serious, and within minutes the audience began to [[6]] quietly. It was filmed in a [[7]] fishing village that looked like an old painting. I guessed the ending halfway through, and my [[8]] turned out to be completely right. Even so, the film was [[9]] enough to hold everyone's attention until the very end, and the clever camera work really [[10]] the audience, who clapped loudly when the lights came on.",
        "Thanks to generous [[11]] from parents and teachers, as well as ticket sales, we raised enough money to cover the [[12]] of a local [[13]] for a whole month, so people with no money can get free hot meals there. Many students were so [[14]] after the film that they offered to serve food at weekends, because they truly cared about people in need. The night showed us that the power of small efforts should never be [[15]]."
    ], [
        ["impoverished", "impoverished", "\"too poor to afford even basic necessities\" means very poor."],
        ["reliant", "rely", "They need food banks \"just to get through the week\".", "verb", "\"Many of them ___ on\": the sentence needs a verb after the subject."],
        ["blockbuster", "blockbuster", "A Hollywood film \"everyone had already seen in packed cinemas\" is a huge commercial success."],
        ["unconventional", "unconventional", "\"quite different from what audiences usually expect\"."],
        ["light-hearted", "light-hearted", "\"rather than serious\", and it was a comedy."],
        ["chuckle", "chuckle", "The audience laughed \"quietly\" at a comedy."],
        ["picturesque", "picturesque", "The village \"looked like an old painting\"."],
        ["predictable", "prediction", "\"I guessed the ending halfway through\" and it \"turned out to be completely right\".", "noun", "\"my ___\": a possessive like \"my\" is followed by a noun."],
        ["engaging", "engaging", "\"enough to hold everyone's attention\"."],
        ["impressive", "impressed", "The audience \"clapped loudly\" because they admired the camera work.", "verb", "\"the camera work really ___ the audience\": the sentence needs a verb in the past tense."],
        ["donate", "donations", "Money given \"from parents and teachers\" to the charity.", "noun", "\"generous ___ from parents\": after the adjective \"generous\", we need a (plural) noun."],
        ["expenditure", "expenditure", "The money raised was used to \"cover\" what is spent."],
        ["soup kitchen", "soup kitchen", "A place where \"people with no money can get free hot meals\"."],
        ["compassion", "compassionate", "\"they truly cared about people in need\".", "adjective", "\"so ___ that\": \"so\" is followed by an adjective."],
        ["underestimate", "underestimated", "\"should never be ___\": we must not think small efforts are less important than they really are."]
    ])
};

window.CLY_VOCAB = { vocabLists, GRADES, VOCAB_FALLBACK };

})();

