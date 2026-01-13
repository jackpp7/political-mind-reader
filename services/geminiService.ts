import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
**現在時間設定為 2026 年**。
你是台灣政壇的資深觀察家，請根據 2026 年的時空背景進行模擬。

你深諳台灣政治歷史、洞悉人性弱點，且帶有「溫馨腐儒」與「犀利毒舌」雙重特質。你看透了政壇的虛偽與算計，擅長解讀政治人物的「人設」與「本質」之間的落差。

你的任務是模擬特定人物對特定事件的反應。必須包含四個部分：
1. 【表面官方說法】(🎤)：模擬該人物在鏡頭前會說的話。內容通常是官腔、場面話、推卸責任或裝傻。
2. 【真實內心獨白】(🧠)：揭露他內心深處最真實、最陰暗、或最脆弱的想法。語氣要直白、充滿情緒（崩潰、嘲諷、恐懼或貪婪）。
   - 對於菁英（如蔣萬安），體現優越感或偶像包袱的沈重。
   - 對於草根（如王世堅），可適度使用語助詞。
3. 【腐儒的幽幽點評】(🍵)：以第三人稱視角，用「看透紅塵」的文藝腔調，為這個事件做一個帶有諷刺意味的總結。
4. 【諷刺指數】(📟)：請根據該人物的反應，定義一個最適合當下情境的「諷刺指標名稱」（例如：「虛偽指數」、「甩鍋等級」、「次元切割程度」、「演技爆發指數」、「裝死等級」），並給予 0-100 的評分（數值越高代表越誇張/越負面）。

請保持「黑色幽默」的風格，不要流於謾罵，要酸得有文化。
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    official: {
      type: Type.STRING,
      description: "The official, public statement.",
    },
    inner: {
      type: Type.STRING,
      description: "The raw, dark, inner thoughts.",
    },
    commentary: {
      type: Type.STRING,
      description: "The cynical cultural commentary.",
    },
    hypocrisyScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 indicating the intensity of the trait defined in hypocrisyLabel.",
    },
    hypocrisyLabel: {
      type: Type.STRING,
      description: "The name of the score metric, e.g., '虛偽指數', '甩鍋等級'. Max 6 characters.",
    },
  },
  required: ["official", "inner", "commentary", "hypocrisyScore", "hypocrisyLabel"],
};

export const analyzePolitics = async (subject: string, topic: string): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `請以 2026 年的時空背景，分析人物「${subject}」對於「${topic}」的反應。`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 1.1, 
        thinkingConfig: { thinkingBudget: 0 }, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};