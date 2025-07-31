import React, { useState } from 'react';
// import { getTodayPrompts } from '../data/prompts';
import PromptCard from '../components/PromptCard';

function Home() {
  const [prompts] = useState([
  "What's one small win from today?",
  "How are you feeling emotionally?",
  "Did anything unexpected happen?",
]); // static for now

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📓 Today's Journal</h1>
      {prompts.map((prompt, index) => (
        <PromptCard key={index} prompt={prompt} />
      ))}
    </div>
  );
}

export default Home;
