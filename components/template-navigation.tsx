"use client"

import { Code } from "lucide-react"
import { TEMPLATE_CONFIG, CATEGORIES } from "@/lib/template-config"

export function TemplateNavigation({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string
  onCategoryChange: (category: string) => void
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Select Template</h2>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
        {Object.values(CATEGORIES).map((cat) => {
          const config = TEMPLATE_CONFIG[cat]
          const Icon = config.icon
          const isActive = activeCategory === cat

          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-200 text-left border ${
                isActive
                  ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-300 shadow-md shadow-indigo-900/20"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
              <span className="font-medium">{config.label}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <h3 className="text-indigo-400 font-medium mb-2 flex items-center gap-2">
          <Code className="w-4 h-4" />
          Pro Tip
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Use the 'Analyze Prompt' feature to get feedback from a separate Gemini text model before generating the
          image!
        </p>
      </div>
    </div>
  )
}
