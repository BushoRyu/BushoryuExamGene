import React, { useState } from 'react';
import { AppState, ExamData } from './types';
import { generateExam } from './services/geminiService';
import { downloadPDF } from './services/pdfService';
import InputSection from './components/InputSection';
import ExamPaper from './components/ExamPaper';
import AnalysisView from './components/AnalysisView';
import { Download, AlertCircle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleGenerate = async (text: string) => {
    setStatus(AppState.GENERATING);
    setErrorMsg('');
    try {
      const data = await generateExam(text);
      setExamData(data);
      setStatus(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setStatus(AppState.ERROR);
    }
  };

  const handleDownload = () => {
    if (examData) {
      downloadPDF(examData, 'pdf-root');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold font-serif">
              E
            </div>
            <h1 className="font-bold text-lg tracking-tight text-slate-900">
              IHWU <span className="text-indigo-600">Exam Generator</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             {status === AppState.SUCCESS && (
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4" />
                Save as PDF
              </button>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[210mm] mx-auto py-8">
        
        {/* State: Idle / Error / Generating */}
        {status !== AppState.SUCCESS && (
          <div className="space-y-8 px-4">
            <InputSection 
              onGenerate={handleGenerate} 
              isGenerating={status === AppState.GENERATING} 
            />
            
            {status === AppState.ERROR && (
              <div className="max-w-4xl mx-auto bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 border border-red-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}
          </div>
        )}

        {/* State: Success - Render everything in one flow for PDF capture */}
        {status === AppState.SUCCESS && examData && (
          <div className="animate-fade-in">
             <div className="bg-blue-50 p-4 mb-6 rounded-lg border border-blue-200 flex items-start gap-3 mx-4 no-print">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800">
                  <strong>Exam Generated!</strong> Scroll down to review. Click "Save as PDF" to download the complete study guide including the exam paper and detailed logic analysis.
                </p>
             </div>

            {/* THE PDF CONTAINER */}
            <div id="pdf-root" className="bg-white shadow-xl min-h-screen">
              {/* Part 1: Exam Paper */}
              <ExamPaper data={examData} />

              {/* Page Break Visual */}
              <div className="h-4 bg-slate-100 border-y border-slate-200 my-0 print:hidden flex items-center justify-center">
                 <span className="text-xs text-slate-400 uppercase tracking-widest">Page Break (Analysis Follows)</span>
              </div>

              {/* Part 2: Analysis */}
              <AnalysisView data={examData} />
            </div>
            
            <div className="text-center mt-12 mb-8 no-print">
                 <button 
                  onClick={() => {
                    setExamData(null);
                    setStatus(AppState.IDLE);
                  }}
                  className="text-slate-500 hover:text-indigo-600 underline text-sm"
                 >
                   Create New Exam
                 </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;