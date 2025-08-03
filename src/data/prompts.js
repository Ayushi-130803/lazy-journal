// Each prompt must have: id, text, wordSuggestions, skipPhrases

export const promptsData = [
  {
    id: "reflection",
    text: "What is something you would have done differently today?",
    wordSuggestions: ["apologize", "focus", "avoid", "listen"],
    skipPhrases: ["I was perfect today", "Nothing to reflect on"],
  },
  {
    id: "grateful",
    text: "What is something you're grateful for today?",
    wordSuggestions: ["family", "sunset", "friend", "good food"],
    skipPhrases: ["Nothing much good happened today", "Can't think of anything"],
  },
  {
    id: "achievement",
    text: "What did you accomplish today?",
    wordSuggestions: ["finished work", "exercise", "called a friend"],
    skipPhrases: ["Nothing worth mentioning", "No achievements today"],
  },
];
