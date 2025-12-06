export enum QuestionType {
  VOCABULARY = 'VOCABULARY',
  GAP_FILL = 'GAP_FILL',
  CONTENT_MATCH = 'CONTENT_MATCH',
  TITLE = 'TITLE'
}

export interface Question {
  id: number;
  label?: string; // e.g., "(1)", "(3)"
  type: QuestionType;
  questionText?: string;
  options: string[];
  answer: number; // 1-based index (1, 2, 3, 4)
  explanation: string;
  targetText?: string; // For vocab (the underlined word) or gap fill (the removed sentence)
  relatedParagraph?: number; // The paragraph index (1-based) this question relates to
}

export interface ParagraphAnalysis {
  paragraphNumber: number;
  originalText: string;
  highlightedText: string; // Text with <span class="marker">...</span> for discourse markers
  summary: string;
  logicType: string; // e.g., "Abstract -> Concrete", "Contrast"
  logicChart: string[]; // Steps of logic flow for the left column
  mainIdea: string; // The "Iitai Koto" for the right column
  japaneseTranslation: string;
  detailedExplanation: string;
}

export interface ExamData {
  meta: {
    title: string;
    wordCount: number;
    date: string; // YYYY-MM-DD
  };
  modifiedText: string; // Text with <u><b>(1)word</b></u> and ( 3 ) placeholders
  questions: {
    q1: Question[];
    q2: Question[];
    q3: Question[];
    q4: Question;
  };
  analysis: ParagraphAnalysis[];
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}