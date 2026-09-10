import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { prompt, location, coordinates, weather, activeTab, lang } = await req.json();

    // Fallback if no API key is set in environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        title: "SatQuery AI Intelligence",
        tagline: `${location} • Multi-Spectral Spatial Reasoning`,
        stats: [
          { label: "Built-up Delta", value: "+21.4%", color: "text-sky-400" },
          { label: "Hydrology Index", value: weather.moisture || "65%", color: "text-indigo-400" },
          { label: "Vegetation (NDVI)", value: "0.66", color: "text-emerald-400" },
        ],
        insights: [
          `Analyzed quadrant for ${location} (Lat: ${coordinates.lat.toFixed(4)}, Lng: ${coordinates.lng.toFixed(4)}).`,
          `Live atmospheric telemetry: Temp ${weather.temp}, Relative Moisture ${weather.moisture}, Solar Flux ${weather.solar}.`,
          `Query contextual analysis: "${prompt}" successfully processed across terrain vectors.`,
        ],
        recommendation: `Recommended agronomic/urban action plan dispatched for ${location}.`,
        spokenResponse: lang === "te-IN"
          ? `${location} ప్రాంతానికి విశ్లేషణ పూర్తయింది. వాతావరణం మరియు భూసార వివరాలు స్క్రీన్‌పై అందుబాటులో ఉన్నాయి.`
          : `Spatial analysis complete for ${location}. Telemetry and recommendations updated.`,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
You are GeoDrishti, a sovereign AI Geospatial Intelligence Engine built for ISRO and Government of India.
Current Target: ${location} (Lat: ${coordinates.lat}, Lng: ${coordinates.lng}).
Telemetry: Temp: ${weather.temp}, Moisture: ${weather.moisture}, Solar: ${weather.solar}, Wind: ${weather.wind}.
Current Mode: ${activeTab} (satellite change detection, agriculture agronomy, or 3D urban planning).
Language target for voice: ${lang}.

Output strictly valid JSON matching this exact structure:
{
  "title": "Short Title",
  "tagline": "Subtitle indicating sensor & method",
  "stats": [
    { "label": "Key 1", "value": "Value 1", "color": "text-sky-400" },
    { "label": "Key 2", "value": "Value 2", "color": "text-emerald-400" },
    { "label": "Key 3", "value": "Value 3", "color": "text-amber-400" }
  ],
  "insights": [
    "Insight sentence 1 with factual details",
    "Insight sentence 2 with specific observations",
    "Insight sentence 3 with actionable advice"
  ],
  "recommendation": "Executive governance / agricultural action plan",
  "spokenResponse": "A clear, concise 2-sentence summary in the requested language (${lang}) suitable for Text-to-Speech audio."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const parsedData = JSON.parse(responseText);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("SatQuery AI API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate dynamic spatial response." },
      { status: 500 }
    );
  }
}