import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface StudyPlanRequest {
  subjectId: string;
  year?: string;
  examDate: string;
  completedUnits: number[];
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in environment variables." },
        { status: 500 }
      );
    }

    const body: StudyPlanRequest = await req.json();
    const { subjectId, year, examDate, completedUnits = [] } = body;

    if (!subjectId || !examDate) {
      return NextResponse.json(
        { error: "Missing required fields: subjectId and examDate." },
        { status: 400 }
      );
    }

    // Locate subject JSON file across content directories
    const contentDir = path.join(process.cwd(), "content");
    const years = year ? [year] : ["first-year", "second-year", "third-year", "fourth-year"];
    let subjectData: { id: string; name: string; units: { unitNumber: number; title: string }[] } | null = null;

    for (const y of years) {
      const filePath = path.join(contentDir, y, `${subjectId}.json`);
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, "utf-8");
          subjectData = JSON.parse(raw);
          break;
        } catch {
          // continue searching
        }
      }
    }

    if (!subjectData) {
      return NextResponse.json(
        { error: `Subject '${subjectId}' not found in curriculum.` },
        { status: 400 }
      );
    }

    // Calculate days remaining
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(examDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const unitsList = subjectData.units.map(
      (u) => `Unit ${u.unitNumber}: ${u.title}`
    );

    const prompt = `You are an expert engineering study planner for K.K. Wagh Institute students.
Subject: ${subjectData.name}
Full Syllabus Units:
${unitsList.join("\n")}

Exam Date: ${examDate}
Days remaining: ${daysRemaining}
Already completed units (or partially done): ${completedUnits.length > 0 ? completedUnits.map(u => `Unit ${u}`).join(", ") : "None"}

Generate a realistic, day-wise study plan in JSON format.
Output MUST be strictly valid JSON matching this structure:
{
  "totalDays": ${daysRemaining},
  "dailyPlan": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "unit": "Unit 1",
      "topic": "Topic summary or key concepts",
      "hours": 2,
      "priority": "HIGH"
    }
  ],
  "weakAreaFocus": ["Focus topic 1", "Focus topic 2"],
  "tips": ["Tip 1", "Tip 2"]
}

Rules:
1. Priority values must ONLY be one of: "HIGH", "MEDIUM", or "LOW".
2. Prioritize uncompleted units first.
3. Give 1-2 revision days at the end before the exam.
4. Keep hours realistic (1.5 to 3.5 hours per day).
5. Return ONLY the JSON object. Do not include markdown codeblocks, explanations, or commentary.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = [
      "gemini-flash-latest",
      "gemini-2.0-flash",
      "gemini-pro-latest",
      "gemini-2.5-pro",
    ];

    let text: string | null = null;
    let lastError: unknown = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const candidateText = result.response.text().trim();
        if (candidateText) {
          text = candidateText;
          break;
        }
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`Model ${modelName} failed:`, msg);
      }
    }

    if (!text) {
      const errMsg = lastError instanceof Error ? lastError.message : String(lastError);
      if (errMsg.includes("429") || errMsg.includes("Quota") || errMsg.includes("quota")) {
        throw new Error("Gemini API quota exceeded or not enabled for this API key. Please generate a new key at aistudio.google.com/app/apikey.");
      }
      throw lastError || new Error("All Gemini model candidates failed.");
    }

    // Strip markdown JSON block if present
    if (text.startsWith("```")) {
      text = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "").trim();
    }

    const planData = JSON.parse(text);
    return NextResponse.json(planData);
  } catch (error: unknown) {
    console.error("Gemini Study Plan Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate AI study plan.";
    return NextResponse.json(
      { error: message },
      { status: 503 }
    );
  }
}
