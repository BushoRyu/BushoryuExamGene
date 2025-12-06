import React from 'react';
import { ExamData } from '../types';

interface ExamPaperProps {
  data: ExamData;
}

const ExamPaper: React.FC<ExamPaperProps> = ({ data }) => {
  return (
    <div className="max-w-[210mm] mx-auto bg-white p-[15mm] shadow-none print:shadow-none print:w-full print:max-w-none text-black">
      {/* Header */}
      <div className="mb-8 border-b-2 border-black pb-4">
        <h1 className="text-xl font-bold font-serif mb-2">国際医療福祉大学医学部 英語 (予想問題)</h1>
        <div className="flex justify-between text-sm text-gray-600 font-mono">
          <span>Date: {data.meta.date}</span>
          <span>Word Count: {data.meta.wordCount} words</span>
        </div>
      </div>

      {/* Main Text */}
      <div className="mb-12">
        <h3 className="text-lg font-bold mb-4">第 4 問 次の英文を読み、以下の設問に答えよ。</h3>
        <div 
          className="font-serif text-justify leading-relaxed text-base whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: data.modifiedText }} 
        />
      </div>

      {/* Questions */}
      <div className="space-y-12">
        {/* Q1 Vocabulary */}
        <section>
          <h4 className="font-bold mb-4">問 1 下線部(1)〜(5)の本文中での意味に最も近いものを、それぞれの選択肢①〜④のうちから一つ選べ。</h4>
          <div className="space-y-6">
            {data.questions.q1.map((q, idx) => (
              <div key={idx} className="break-inside-avoid">
                <p className="font-serif font-semibold mb-2">{q.label} {q.targetText}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="inline-block w-6 h-6 rounded-full border border-black flex items-center justify-center text-xs shrink-0">
                        {i + 1}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Q2 Gap Fill */}
        <section>
          <h4 className="font-bold mb-4">問 2 空所(3)〜(7)に入れるのに最も適切なものを、それぞれの選択肢①〜④のうちから一つ選べ。</h4>
          <div className="space-y-6">
            {data.questions.q2.map((q, idx) => (
              <div key={idx} className="break-inside-avoid">
                <p className="font-serif font-semibold mb-2">{q.label}</p>
                <div className="space-y-2 pl-4">
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="inline-block w-6 h-6 rounded-full border border-black flex items-center justify-center text-xs shrink-0">
                        {i + 1}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Q3 Content Matching */}
        <section>
          <h4 className="font-bold mb-4">問 3 本文の内容に関して、次の I ～ IV の空所に入れるのに最も適切なものを、それぞれの選択肢①〜④のうちから一つ選べ。</h4>
          <div className="space-y-8">
            {data.questions.q3.map((q, idx) => (
              <div key={idx} className="break-inside-avoid">
                <p className="font-serif mb-3 font-medium">
                  {[ 'I', 'II', 'III', 'IV' ][idx]}. {q.questionText}
                </p>
                <div className="space-y-2 pl-4">
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="inline-block w-6 h-6 rounded-full border border-black flex items-center justify-center text-xs shrink-0">
                        {i + 1}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Q4 Title */}
        <section className="break-inside-avoid">
          <h4 className="font-bold mb-4">問 4 本文のタイトルとして最も適切なものを、次の選択肢①〜④のうちから一つ選べ。</h4>
          <div className="space-y-2 pl-4">
            {data.questions.q4.options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <span className="inline-block w-6 h-6 rounded-full border border-black flex items-center justify-center text-xs shrink-0">
                  {i + 1}
                </span>
                <span className="font-serif">{opt}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExamPaper;
