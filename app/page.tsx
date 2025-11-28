import { GeminiArchitect } from "@/components/gemini-architect"

export const metadata = {
  title: "Gemini JSON Architect",
  description: "Structured Prompt Builder with Multi-Model AI Generation",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <GeminiArchitect />
    </div>
  )
}
