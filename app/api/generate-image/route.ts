import { type NextRequest, NextResponse } from "next/server"

const IMAGE_API_MODEL = "imagen-4.0-generate-001"
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
    const { prompt, aspectRatio = "1:1" } = body

    const IMAGE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_API_MODEL}:predict?key=${API_KEY}`

    const payload = {
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio,
        outputMimeType: "image/png",
      },
    }

    const response = await withExponentialBackoff(() =>
      fetch(IMAGE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    )

    const result = await response.json()

    if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
      return NextResponse.json({ imageData: `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}` })
    } else {
      const errorDetail = result.error?.message || "Image generation failed"
      return NextResponse.json({ error: errorDetail }, { status: 400 })
    }
  } catch (error) {
    console.error("Image API error:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
