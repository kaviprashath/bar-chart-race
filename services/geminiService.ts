import { GoogleGenAI, Type } from "@google/genai";
import { RaceData } from "../types";

// Helper to get today's date for relevant queries
const today = new Date().toISOString().split('T')[0];

export const generateDataset = async (topic: string): Promise<RaceData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set it in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are a data visualization expert. 
  Your task is to generate strict JSON data for a "Bar Chart Race" animation.
  The user will provide a topic. You must output a JSON object containing:
  1. title: A catchy title.
  2. subtitle: A descriptive subtitle.
  3. source: A credible source for this data (e.g. "World Bank", "Statista").
  4. entities: An array of objects defining the competitors (id, label, color, image). Use placeholder image URLs from reliable sources or leave empty if unknown. Use high contrast, distinct hex colors.
  5. timeline: An array of time points. Each point has a "date" (string) and "values" (map of entity ID to numeric value).
  
  Ensure the data spans a reasonable timeframe for the topic (e.g., 10-20 years for yearly data).
  Ensure values are numerical and reasonably accurate estimates for the topic.
  Do not explain. Just return JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a bar chart race dataset for: ${topic}.`,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          source: { type: Type.STRING },
          entities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                color: { type: Type.STRING },
                image: { type: Type.STRING },
              },
              required: ["id", "label", "color"]
            }
          },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                values: {
                  type: Type.OBJECT,
                  additionalProperties: { type: Type.NUMBER }
                }
              },
              required: ["date", "values"]
            }
          }
        },
        required: ["title", "subtitle", "source", "entities", "timeline"]
      }
    }
  });

  const jsonText = response.text;
  if (!jsonText) {
      throw new Error("Failed to generate data from Gemini");
  }

  try {
      return JSON.parse(jsonText) as RaceData;
  } catch (e) {
      console.error("Failed to parse Gemini response", e);
      throw new Error("Invalid JSON received from Gemini");
  }
};
