import { type NextRequest, NextResponse } from "next/server"

const TEXT_API_MODEL = "gemini-2.5-flash-preview-09-2025"
const API_KEY = process.env.GOOGLE_API_KEY

const withExponentialBackoff = async (fn: () => Promise<Response>, retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
}

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "Missing GOOGLE_API_KEY environment variable" }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { jsonOutput } = body

    const TEXT_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_API_MODEL}:generateContent?key=${API_KEY}`

    const systemPrompt =
      "You are a creative prompt analyst. Analyze the provided structured JSON prompt and generate a concise, descriptive text summary of the scene/design, focusing on mood, style, and key elements. Then, suggest one creative improvement. Format as a single paragraph."

    const userQuery = `Analyze the following JSON prompt for image generation:\n\n${jsonOutput}`

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    }

    const response = await withExponentialBackoff(() =>
      fetch(TEXT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    )

    const result = await response.json()

    if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.[0]?.text) {
      return NextResponse.json({ analysis: result.candidates[0].content.parts[0].text })
    } else {
      return NextResponse.json({ error: "Text analysis failed to return content" }, { status: 400 })
    }
  } catch (error) {
    console.error("Text API error:", error)
    return NextResponse.json({ error: "Failed to analyze prompt" }, { status: 500 })
  }
}
