import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ClassificationType } from "../types";

// Initialize Gemini Client
// Note: In a production app, API keys should be handled via a secure backend proxy.
// For this demo, we use the process.env.API_KEY as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are TriVision Sort, an advanced AI waste discrimination system.
Your task is to analyze an image and classify the main object into one of seven categories.

Categories:
1. WET_WASTE:
   - Definition: Biodegradable organic matter.
   - Examples: Food scraps, vegetable peels, fruit, tea bags, coffee grounds, garden waste, soiled food wrappers (if mostly organic).
   
2. DRY_WASTE:
   - Definition: Recyclable inorganic materials.
   - Examples: Clean plastic bottles, glass bottles, metal cans, paper, cardboard, dry packaging.

3. BURNABLE_WASTE:
   - Definition: Non-recyclable combustible items.
   - Examples: Soiled paper/tissues, sanitary waste, rubber, leather, specific non-recyclable plastics, dirty clothes/rags.
   
4. INERT_WASTE (C&D):
   - Definition: Construction and Demolition waste. Does not burn or rot; heavy/mineral.
   - Examples: Bricks, concrete, tiles, drywall, glass panes, ceramics, rubble, soil, stones.
   
5. HAZARDOUS_WASTE:
   - Definition: Toxic, flammable, corrosive, or dangerous items requiring safety handling.
   - Examples: Paint cans, batteries, spray bottles, chemicals, syringes/medical waste, light bulbs, e-waste (if broken/toxic).
   
6. BULKY_WASTE:
   - Definition: Large items too big for standard bins; needs special pickup.
   - Examples: Mattresses, sofas, chairs, tires, refrigerators, large appliances, furniture.

7. NOT_WASTE:
   - Definition: Permanent objects, background elements, or items in use.
   - Examples: Intact buildings, cars, trees, people, benches, street signs, electronics in active use.

Return the result in JSON format.
`;

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    // Remove header if present (e.g., "data:image/jpeg;base64,")
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
            text: "Analyze this image. Classify into WET_WASTE, DRY_WASTE, BURNABLE_WASTE, INERT_WASTE, HAZARDOUS_WASTE, BULKY_WASTE, or NOT_WASTE."
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
                "NOT_WASTE", 
                "UNKNOWN"
              ],
              description: "The specific classification of the object."
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence score between 0 and 1."
            },
            label: {
              type: Type.STRING,
              description: "A short label for the object (e.g., 'Apple Core', 'Broken Brick')."
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation of why it fits this category."
            }
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

    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      classification: ClassificationType.UNKNOWN,
      confidence: 0,
      label: "Error",
      reasoning: "Failed to analyze image. Please try again."
    };
  }
};