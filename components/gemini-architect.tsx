"use client"

import { useState, useEffect, useCallback } from "react"
import { Sparkles, Zap, MessageSquare, AlertCircle } from "lucide-react"
import { CATEGORIES, TEMPLATE_CONFIG, EXAMPLES } from "@/lib/template-config"
import { TemplateNavigation } from "./template-navigation"
import { VisualBuilder } from "./visual-builder"
import { OutputPanel } from "./output-panel"

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

export function GeminiArchitect() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.PERSON)
  const [formData, setFormData] = useState(TEMPLATE_CONFIG[CATEGORIES.PERSON].initialState())
  const [jsonOutput, setJsonOutput] = useState("")
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [generatedText, setGeneratedText] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isGeneratingText, setIsGeneratingText] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"json" | "image" | "text">("json")
  const [copied, setCopied] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("google-api-key") || ""
    setApiKey(stored)
  }, [])

  const generateJson = useCallback((category: string, data: any) => {
    const generator = TEMPLATE_CONFIG[category].generate
    return JSON.stringify(generator(data), null, 2)
  }, [])

  useEffect(() => {
    setJsonOutput(generateJson(activeCategory, formData))
  }, [formData, activeCategory, generateJson])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    const newInitialState = TEMPLATE_CONFIG[category].initialState()
    setFormData(newInitialState)
    setGeneratedImageUrl(null)
    setGeneratedText(null)
    setGenerationError(null)
    setActiveTab("json")
    setCopied(false)
  }

  const handleCopy = useCallback((text: string) => {
    if (!text) return
    try {
      const textarea = document.createElement("textarea")
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
      setGenerationError("Copy failed. Please copy the text manually.")
    }
  }, [])

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem("google-api-key", key)
    setApiKey(key)
    setShowApiKeyInput(false)
  }

  const handleGenerateImage = async () => {
    if (!apiKey) {
      setShowApiKeyInput(true)
      setGenerationError("Please provide your Google API key to generate images.")
      return
    }

    setIsGeneratingImage(true)
    setGenerationError(null)
    setGeneratedImageUrl(null)
    setActiveTab("image")

    const IMAGE_API_MODEL = "imagen-4.0-generate-001"
    const IMAGE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_API_MODEL}:predict?key=${apiKey}`

    const payload = {
      instances: [{ prompt: jsonOutput }],
      parameters: {
        sampleCount: 1,
        aspectRatio: activeCategory === CATEGORIES.AD ? "4:3" : "1:1",
        outputMimeType: "image/png",
      },
    }

    try {
      const response = await withExponentialBackoff(() =>
        fetch(IMAGE_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      )

      const result = await response.json()

      if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        setGeneratedImageUrl(`data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`)
      } else {
        const errorDetail = result.error?.message || "Image generation failed. Check your prompt or API status."
        setGenerationError(errorDetail)
        setActiveTab("json")
      }
    } catch (error) {
      console.error("Image API fetch error:", error)
      setGenerationError("Failed to connect to the Image API. Check your network or API configuration.")
      setActiveTab("json")
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleAnalyzePrompt = async () => {
    if (!apiKey) {
      setShowApiKeyInput(true)
      setGenerationError("Please provide your Google API key to analyze prompts.")
      return
    }

    setIsGeneratingText(true)
    setGenerationError(null)
    setGeneratedText(null)
    setActiveTab("text")

    const TEXT_API_MODEL = "gemini-2.5-flash-preview-09-2025"
    const TEXT_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_API_MODEL}:generateContent?key=${apiKey}`

    const systemPrompt =
      "You are a creative prompt analyst. Analyze the provided structured JSON prompt and generate a concise, descriptive text summary of the scene/design, focusing on mood, style, and key elements. Then, suggest one creative improvement. Format as a single paragraph."

    const userQuery = `Analyze the following JSON prompt for image generation:\n\n${jsonOutput}`

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    }

    try {
      const response = await withExponentialBackoff(() =>
        fetch(TEXT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      )

      const result = await response.json()

      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.[0]?.text) {
        setGeneratedText(result.candidates[0].content.parts[0].text)
      } else {
        setGenerationError("Text analysis failed to return content. Check the prompt structure.")
        setActiveTab("json")
      }
    } catch (error) {
      console.error("Text API fetch error:", error)
      setGenerationError("Failed to connect to the Text API. Check your network or API configuration.")
      setActiveTab("json")
    } finally {
      setIsGeneratingText(false)
    }
  }

  const isMultiSubject = activeCategory === CATEGORIES.PERSON

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Gemini JSON Architect
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 hidden sm:block">Structured Prompt Builder</div>
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                apiKey
                  ? "bg-emerald-900/20 text-emerald-400 border border-emerald-900/50 hover:bg-emerald-900/30"
                  : "bg-orange-900/20 text-orange-400 border border-orange-900/50 hover:bg-orange-900/30"
              }`}
            >
              {apiKey ? "API Key Set" : "Add API Key"}
            </button>
          </div>
        </div>
      </header>

      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-2">Google API Key</h2>
            <p className="text-sm text-slate-400 mb-4">
              Get your free API key from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Google AI Studio
              </a>
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => handleSaveApiKey(e.target.value)}
              placeholder="Paste your API key here..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setShowApiKeyInput(false)}
                disabled={!apiKey}
                className="flex-1 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white text-sm font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-3">
            <TemplateNavigation activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
          </div>

          {/* CENTER - VISUAL FORM BUILDER */}
          <div className="lg:col-span-5">
            <VisualBuilder
              activeCategory={activeCategory}
              formData={formData}
              setFormData={setFormData}
              isMultiSubject={isMultiSubject}
              EXAMPLES={EXAMPLES}
              onExampleLoaded={() => setActiveTab("json")}
            />
          </div>

          {/* RIGHT - GENERATION OUTPUT */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            {!apiKey && (
              <div className="p-3 bg-orange-900/20 border border-orange-700/50 rounded-lg flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-300">
                  <p className="font-medium">API Key Required</p>
                  <p className="text-xs text-orange-400 mt-1">
                    Click "Add API Key" in the header to enable image generation and prompt analysis.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || isGeneratingText || !apiKey}
                title={!apiKey ? "Add API key to generate images" : ""}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isGeneratingImage || !apiKey
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                }`}
              >
                <Zap className={`w-5 h-5 ${isGeneratingImage ? "animate-spin" : "fill-white"}`} />
                <span>{isGeneratingImage ? "Generating..." : "Generate Image"}</span>
              </button>
              <button
                onClick={handleAnalyzePrompt}
                disabled={isGeneratingText || isGeneratingImage || !apiKey}
                title={!apiKey ? "Add API key to analyze prompts" : ""}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isGeneratingText || !apiKey
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(0,188,212,0.4)]"
                }`}
              >
                <MessageSquare className={`w-5 h-5 ${isGeneratingText ? "animate-spin" : "fill-white"}`} />
                <span>{isGeneratingText ? "Analyzing..." : "Analyze Prompt"}</span>
              </button>
            </div>

            {/* Output Panel */}
            <OutputPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              jsonOutput={jsonOutput}
              generatedImageUrl={generatedImageUrl}
              generatedText={generatedText}
              isGeneratingImage={isGeneratingImage}
              isGeneratingText={isGeneratingText}
              copied={copied}
              onCopy={handleCopy}
              generationError={generationError}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
