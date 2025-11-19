import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FilmAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    filmTitleGuess: { type: Type.STRING, description: "Best guess for the film title, or 'Unknown' if generic." },
    directorGuess: { type: Type.STRING, description: "Likely director based on visual style." },
    yearGuess: { type: Type.STRING, description: "Approximate era or year." },
    visualContext: {
      type: Type.OBJECT,
      properties: {
        composition: { type: Type.STRING, description: "Analysis of framing, balance, and blocking." },
        lighting: { type: Type.STRING, description: "Description of lighting style (e.g., chiaroscuro, high-key)." },
        colorPalette: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of 3-5 dominant hex color codes found in the image."
        }
      },
      required: ["composition", "lighting", "colorPalette"]
    },
    denotation: { type: Type.STRING, description: "Literal, objective description of what is visible in the frame." },
    connotation: { type: Type.STRING, description: "The secondary, cultural, or emotional meanings associated with the visuals." },
    signs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          signifier: { type: Type.STRING, description: "The physical form (object, color, sound)." },
          signified: { type: Type.STRING, description: "The mental concept it represents." },
          category: { type: Type.STRING, enum: ["object", "lighting", "color", "composition", "gesture"] }
        },
        required: ["signifier", "signified", "category"]
      },
      description: "A breakdown of key semiotic elements."
    },
    myth: { type: Type.STRING, description: "The broader ideological or cultural narrative reinforced or challenged (Barthesian myth)." },
    mood: { type: Type.STRING, description: "Three words describing the atmosphere." }
  },
  required: ["filmTitleGuess", "visualContext", "denotation", "connotation", "signs", "myth", "mood"]
};

export const analyzeFilmStill = async (base64Data: string, mimeType: string): Promise<FilmAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: `Analyze this film still acting as an expert semiotician and film critic. 
            Deconstruct the image using semiotic theory (referencing concepts from Saussure, Barthes, or Peirce where implicitly relevant).
            Identify the denotative (literal) and connotative (cultural) levels of meaning.
            Break down specific signs (signifiers) and what they represent (signifieds).
            Identify the underlying "myth" or ideology present in the frame.
            Provide the output in strict JSON format.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 2048 } // Allow some reasoning time for deep analysis
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as FilmAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const fetchImageFromUrl = async (url: string): Promise<{ data: string; mimeType: string }> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const blob = await response.blob();
    if (!blob.type.startsWith('image/')) {
       throw new Error('URL is not a valid image');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const data = base64data.split(',')[1];
        resolve({ data, mimeType: blob.type });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Image Fetch Error:", error);
    throw error;
  }
};