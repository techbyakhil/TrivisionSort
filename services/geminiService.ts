import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ClassificationType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are TriVision Sort, a high-precision AI computer vision system specialized in waste logistics and environmental sorting.
Your objective is to identify the primary object in an image and determine its optimal disposal or recycling path.

Classification Taxonomy:
1. WET_WASTE (Organic/Biodegradable):
   - Scope: Food waste, agricultural residue, biological matter.
   - Note: Includes soiled paper/cardboard ONLY IF heavily contaminated with food.

2. DRY_WASTE (Recyclable/Inorganic):
   - Scope: Clean plastics (PET, HDPE), aluminum, tin, glass, dry paper, cardboard.
   - Requirement: Material must be relatively clean and non-toxic.

3. BURNABLE_WASTE (Combustible/Non-Recyclable):
   - Scope: Contaminated textiles, rubber, multi-layer packaging (e.g., chip bags), cigarette butts, hygiene products.

4. INERT_WASTE (C&D/Mineral):
   - Scope: Bricks, ceramics, porcelain, concrete, soil, rocks, broken glass panes (non-bottle).

5. HAZARDOUS_WASTE (Toxic/Regulated):
   - Scope: Batteries, electronic circuit boards, paint, solvents, pesticides, fluorescent bulbs, medical sharps.
   - High Priority: If any chemical or electrical component is visible, default here.

6. BULKY_WASTE (Large Scale/Over-sized):
   - Scope: Furniture, appliances, mattresses, tires. Items requiring mechanical lift or special scheduling.

7. NOT_WASTE (Operational/Fixed Assets):
   - Scope: Infrastructure, living humans/animals, active vehicles, trees in situ.

Response Protocol:
- Return valid JSON.
- Be clinically precise in 'label'.
- 'reasoning' must cite specific visual markers (e.g., "Texture suggests polyethylene", "Visible food residue").
`;

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Perform high-resolution object identification and waste classification."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: {
              type: Type.STRING,
              enum: [
                "WET_WASTE", 
                "DRY_WASTE", 
                "BURNABLE_WASTE", 
                "INERT_WASTE", 
                "HAZARDOUS_WASTE", 
                "BULKY_WASTE", 
                "NOT_WASTE"
              ],
            },
            confidence: { type: Type.NUMBER },
            label: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["classification", "confidence", "label", "reasoning"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        classification: data.classification as ClassificationType,
        confidence: data.confidence,
        label: data.label,
        reasoning: data.reasoning
      };
    }

    throw new Error("Analysis packet empty");
  } catch (error) {
    console.error("TriVision Analysis Failure:", error);
    return {
      classification: ClassificationType.UNKNOWN,
      confidence: 0,
      label: "System Error",
      reasoning: "Optical analysis failed. Check network or sensor alignment."
    };
  }
};