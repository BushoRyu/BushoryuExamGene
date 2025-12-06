import React, { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface InputSectionProps {
  onGenerate: (text: string) => void;
  isGenerating: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isGenerating }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onGenerate(text);
    }
  };

  const sampleText = `Scientists may be one step closer to a cure for the common cold. They aren’t fighting the viruses that cause the infection. Instead, they’re looking to make human cells — the hotel rooms in which viruses reproduce — an unwelcome place. Viruses can’t reproduce on their own. They must hijack the machinery in cells to do that. So they temporarily infect those cells to make more of themselves.`;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          Exam Input
        </h2>
        <p className="text-slate-500 mt-2">
          Paste an English article below (recommended 500-1000 words). The AI will generate a Kokusai Iryo Fukushi style exam.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm leading-relaxed"
          placeholder="Paste English text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isGenerating}
        />
        
        <div className="mt-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setText(sampleText)}
            className="text-sm text-slate-400 hover:text-indigo-600 underline"
          >
            Load Sample Text
          </button>
          
          <button
            type="submit"
            disabled={!text.trim() || isGenerating}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all
              ${!text.trim() || isGenerating 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5'}
            `}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Generating Exam...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Exam
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputSection;
