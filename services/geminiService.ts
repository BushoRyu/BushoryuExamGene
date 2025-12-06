import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ExamData, QuestionType } from "../types";

// Define the response schema strictly to ensure Gemini returns valid JSON
const examSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    meta: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A suitable title for the article (Question 4 answer)" },
        wordCount: { type: Type.NUMBER, description: "Total word count of the original text" },
        date: { type: Type.STRING, description: "Date of the article or today's date (YYYY-MM-DD)" },
      },
      required: ["title", "wordCount", "date"],
    },
    modifiedText: {
      type: Type.STRING,
      description: "The full English text. Modify it: 1. Underline 4 vocab words for Q1 like '(1)<u><b>word</b></u>'. 2. Remove 3 sentences for Q2 and replace with '( 3 )', '( 6 )', '( 7 )'. Ensure indices are unique and sequential mixed (e.g., 1,2,3,4,5,6,7). Maintain paragraph breaks.",
    },
    questions: {
      type: Type.OBJECT,
      properties: {
        q1: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              label: { type: Type.STRING, description: "e.g., (1)" },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.NUMBER, description: "1-4" },
              explanation: { type: Type.STRING },
              targetText: { type: Type.STRING, description: "The word being defined" },
              relatedParagraph: { type: Type.NUMBER, description: "The paragraph number this question belongs to" }
            },
            required: ["id", "label", "options", "answer", "explanation", "targetText", "relatedParagraph"]
          }
        },
        q2: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              label: { type: Type.STRING, description: "e.g., (3)" },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.NUMBER, description: "1-4" },
              explanation: { type: Type.STRING },
              targetText: { type: Type.STRING, description: "The removed sentence" },
              relatedParagraph: { type: Type.NUMBER, description: "The paragraph number this question belongs to" }
            },
            required: ["id", "label", "options", "answer", "explanation", "targetText", "relatedParagraph"]
          }
        },
        q3: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              questionText: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.NUMBER },
              explanation: { type: Type.STRING },
              relatedParagraph: { type: Type.NUMBER, description: "The paragraph number mainly relevant to this question" }
            },
            required: ["id", "questionText", "options", "answer", "explanation", "relatedParagraph"]
          }
        },
        q4: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.NUMBER },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["id", "options", "answer", "explanation"]
        }
      },
      required: ["q1", "q2", "q3", "q4"]
    },
    analysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          paragraphNumber: { type: Type.NUMBER },
          originalText: { type: Type.STRING },
          highlightedText: { type: Type.STRING, description: "Original text with logic markers wrapped in <span class='bg-yellow-200 font-bold'>Marker</span> tags" },
          summary: { type: Type.STRING, description: "Brief summary" },
          logicType: { type: Type.STRING, description: "e.g. Abstract -> Concrete, Cause -> Effect" },
          logicChart: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Steps for the Logic Chart (Left)" },
          mainIdea: { type: Type.STRING, description: "The 'Iitai Koto' (Right)" },
          japaneseTranslation: { type: Type.STRING },
          detailedExplanation: { type: Type.STRING }
        },
        required: ["paragraphNumber", "originalText", "highlightedText", "summary", "logicType", "logicChart", "mainIdea", "japaneseTranslation", "detailedExplanation"]
      }
    }
  },
  required: ["meta", "modifiedText", "questions", "analysis"]
};

export const generateExam = async (text: string): Promise<ExamData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an expert English exam creator for the 'International University of Health and Welfare' (Japan).
    Your task is to take the provided English text and generate a complete exam set and a detailed paragraph reading analysis.

    Source Text:
    """
    ${text}
    """

    ** STRICT REQUIREMENTS **
    1. **Format**: Follow the exact schema provided.
    2. **Question Structure** (Follow IHWU style strictly):
       - **Question 1 (Vocabulary)**: Select 4 difficult words/idioms. Underline them in 'modifiedText' labeled (1), (2), (4), (5). Create 4 multiple choice questions asking for the closest meaning.
       - **Question 2 (Gap Fill)**: Remove 3 sentences (usually at end of paragraphs or key logical bridges). Replace them in 'modifiedText' with blanks labeled ( 3 ), ( 6 ), ( 7 ). The options must be full sentences.
       - **Question 3 (Content)**: Create 4 content understanding questions (I - IV). Options must be paraphrased.
       - **Question 4 (Title)**: Create a title selection question. The correct title must be the one in 'meta.title'.
       - **Numbering**: Ensure the text labels ((1), (2), etc.) are sequential and non-overlapping. Q1 usually takes (1)(2)(4)(5), Q2 takes (3)(6)(7).
       
    3. **Analysis & Logic Chart**:
       - Analyze paragraph by paragraph.
       - **highlightedText**: Return the original paragraph text but wrap Discourse Markers (e.g., However, For example, In contrast) and Key Logical phrases in HTML tags like <span class='bg-yellow-200 font-bold'>Marker</span>.
       - **logicChart**: A list of strings representing the flow (Left side of analysis). E.g. ["Abstract Theory", "Concrete Example (Study A)", "Result"].
       - **mainIdea**: The specific "Iitai Koto" (Right side of analysis).
       - **relatedParagraph**: For every question in Q1, Q2, and Q3, indicate which paragraph it belongs to (1, 2, 3...).

    4. **Language**:
       - Question instructions: Japanese.
       - Explanations: Japanese.
       - Translations: Japanese.
       - Options/Text: English.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: examSchema,
        temperature: 0.3,
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text) as ExamData;
      // Inject types for easier frontend handling
      parsed.questions.q1.forEach(q => q.type = QuestionType.VOCABULARY);
      parsed.questions.q2.forEach(q => q.type = QuestionType.GAP_FILL);
      parsed.questions.q3.forEach(q => q.type = QuestionType.CONTENT_MATCH);
      parsed.questions.q4.type = QuestionType.TITLE;
      return parsed;
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate exam. Please try again.");
  }
};