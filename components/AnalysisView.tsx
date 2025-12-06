import React from 'react';
import { ExamData, Question, QuestionType } from '../types';
import { BookOpenCheck, ArrowRight, ArrowDown } from 'lucide-react';

interface AnalysisViewProps {
  data: ExamData;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ data }) => {
  
  // Helper to filter questions for a specific paragraph
  const getQuestionsForParagraph = (paraNum: number) => {
    const q1 = data.questions.q1.filter(q => q.relatedParagraph === paraNum);
    const q2 = data.questions.q2.filter(q => q.relatedParagraph === paraNum);
    const q3 = data.questions.q3.filter(q => q.relatedParagraph === paraNum);
    return { q1, q2, q3 };
  };

  return (
    <div className="max-w-[210mm] mx-auto bg-white p-[15mm] text-black">
      
      {/* Header */}
      <div className="mb-8 border-b-2 border-indigo-600 pb-2">
        <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
          <BookOpenCheck className="w-8 h-8" />
          Paragraph Reading Analysis & Answers
        </h2>
      </div>

      {/* Paragraph Analysis Loop */}
      <div className="space-y-12">
        {data.analysis.map((para, idx) => {
          const { q1, q2, q3 } = getQuestionsForParagraph(para.paragraphNumber);
          const hasQuestions = q1.length > 0 || q2.length > 0 || q3.length > 0;

          return (
            <div key={idx} className="break-inside-avoid mb-12">
              {/* Paragraph Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
                  {para.paragraphNumber}
                </div>
                <h3 className="text-lg font-bold text-slate-800">Paragraph {para.paragraphNumber}</h3>
                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-500">
                  {para.logicType}
                </span>
              </div>

              {/* Text with Highlights */}
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6 font-serif text-justify leading-relaxed text-lg"
                   dangerouslySetInnerHTML={{ __html: para.highlightedText }} 
              />

              {/* Logic Chart (Left) vs Main Idea (Right) */}
              <div className="grid grid-cols-2 gap-0 mb-6 border border-slate-300 rounded-lg overflow-hidden">
                {/* Left: Logic Chart */}
                <div className="bg-white p-4 border-r border-slate-300">
                  <div className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3 text-center">論理展開 (Logic Flow)</div>
                  <div className="flex flex-col items-center gap-2">
                    {para.logicChart && para.logicChart.map((step, i) => (
                      <div key={i} className="flex flex-col items-center w-full">
                        <div className="bg-blue-50 border border-blue-200 text-blue-900 px-3 py-2 rounded text-sm text-center w-full">
                          {step}
                        </div>
                        {i < para.logicChart.length - 1 && (
                          <ArrowDown className="w-4 h-4 text-slate-400 my-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Main Idea */}
                <div className="bg-white p-4">
                  <div className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3 text-center">筆者のイイタイコト (Main Idea)</div>
                  <div className="h-full flex items-center justify-center bg-red-50 border border-red-100 p-4 rounded text-red-900 font-medium text-center">
                    {para.mainIdea}
                  </div>
                </div>
              </div>

              {/* Translation (Optional, compact) */}
              <div className="mb-6 text-sm text-slate-600 border-l-2 border-slate-300 pl-3 italic">
                {para.japaneseTranslation}
              </div>

              {/* Relevant Questions */}
              {hasQuestions && (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <h4 className="font-bold text-indigo-800 mb-3 border-b border-indigo-200 pb-1">Review Questions</h4>
                  <div className="space-y-4">
                    {q1.map((q, i) => <QuestionDisplay key={`q1-${i}`} q={q} label="問 1 (Vocab)" />)}
                    {q2.map((q, i) => <QuestionDisplay key={`q2-${i}`} q={q} label="問 2 (Gap)" />)}
                    {q3.map((q, i) => <QuestionDisplay key={`q3-${i}`} q={q} label={`問 3 (${['I','II','III','IV'][data.questions.q3.indexOf(q)]})`} />)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Title Question (Usually at the end) */}
      <div className="mt-8 pt-8 border-t-2 border-slate-200 break-inside-avoid">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Overall: 問 4 (Title)</h3>
        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
           <div className="flex items-center gap-3 mb-2">
               <span className="font-bold text-indigo-700">Answer: {data.questions.q4.answer}</span>
               <span className="font-serif font-bold text-lg">"{data.questions.q4.options[data.questions.q4.answer - 1]}"</span>
           </div>
           <p className="text-sm text-slate-700">{data.questions.q4.explanation}</p>
        </div>
      </div>

    </div>
  );
};

const QuestionDisplay: React.FC<{ q: Question; label: string }> = ({ q, label }) => (
  <div className="flex gap-4 items-start text-sm">
    <div className="font-mono font-bold text-slate-500 w-24 shrink-0">{label} {q.label}</div>
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold bg-white px-2 rounded border border-slate-200">Ans: {q.answer}</span>
        {q.type === QuestionType.GAP_FILL && <span className="italic text-slate-600">"{q.options[q.answer-1]}"</span>}
      </div>
      <p className="text-slate-600">{q.explanation}</p>
    </div>
  </div>
);

export default AnalysisView;