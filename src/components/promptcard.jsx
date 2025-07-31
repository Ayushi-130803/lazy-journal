function PromptCard({ prompt, value, onChange }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">{prompt}</p>
      <textarea
        className="w-full p-3 rounded-md border dark:bg-gray-700 dark:text-white resize-none"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type here..."
      />
    </div>
  );
}

export default PromptCard;
