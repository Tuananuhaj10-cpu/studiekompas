import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, StudyRecommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_ID = "gemini-2.5-flash";

export const getStudyRecommendations = async (userProfile: UserProfile): Promise<StudyRecommendation[]> => {
  const prompt = `
    Je bent een expert studieadviseur in Nederland.
    De gebruiker is een eindexamenleerling met het volgende profiel:
    - Naam: ${userProfile.name}
    - Opleidingsniveau: ${userProfile.level}
    - Profiel: ${userProfile.profile}
    - Favoriete vakken: ${userProfile.favoriteSubjects}
    - Hobby's/Interesses: ${userProfile.hobbies}
    - Werkstijl voorkeur: ${userProfile.workStyle}
    - Droombaan/Toekomstvisie: ${userProfile.dreamJob}

    Op basis hiervan, suggereer 4 concrete vervolgopleidingen (HBO of WO, afhankelijk van het niveau van de gebruiker).
    Houd rekening met de toelaatbaarheid op basis van het profiel (N&T, N&G, etc.).
    Geef een match score (0-100) en leg uit waarom dit past.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING, description: "Naam van de opleiding" },
              level: { type: Type.STRING, description: "Niveau: HBO of WO" },
              description: { type: Type.STRING, description: "Korte beschrijving van de studie" },
              matchScore: { type: Type.INTEGER, description: "Score tussen 0 en 100" },
              matchReason: { type: Type.STRING, description: "Waarom past dit bij de leerling?" },
              careerOpportunities: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Mogelijke beroepen na deze studie"
              },
              keySubjects: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Belangrijke vakken tijdens de studie"
              }
            },
            required: ["id", "name", "level", "description", "matchScore", "matchReason", "careerOpportunities", "keySubjects"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as StudyRecommendation[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};

export const chatWithAdvisor = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  try {
    const chat = ai.chats.create({
      model: MODEL_ID,
      history: history,
      config: {
        systemInstruction: "Je bent een behulpzame studieadviseur. Houd je antwoorden kort, bemoedigend en informatief. Richt je op het Nederlandse onderwijssysteem (HBO/WO).",
      }
    });
    
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, ik kon dat even niet verwerken. Probeer het opnieuw.";
  }
};
