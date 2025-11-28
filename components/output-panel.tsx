"use client"

import { Code, Camera, List, Copy, Check, Download, XCircle, MessageSquare } from "lucide-react"
import { LoadingSpinner } from "./loading-spinner"

export function OutputPanel({
  activeTab,
  setActiveTab,
  jsonOutput,
  generatedImageUrl,
  generatedText,
  isGeneratingImage,
  isGeneratingText,
  copied,
  onCopy,
  generationError,
}: any) {
  return (
    <div className="flex flex-col flex-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 p-2">
        <TabButton icon={Code} label="JSON Code" tabId="json" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={Camera} label="Image Result" tabId="image" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton icon={List} label="Text Analysis" tabId="text" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto relative">
        {/* JSON Output Tab */}
        {activeTab === "json" && (
          <div className="p-4">
            <pre className="font-mono text-[10px] sm:text-xs leading-snug text-indigo-100 whitespace-pre-wrap break-all">
              {jsonOutput}
            </pre>
            <button
              onClick={() => onCopy(jsonOutput)}
              className={`w-full flex items-center justify-center gap-2 py-2 mt-4 rounded-lg font-semibold transition-all duration-200 text-sm ${
                copied ? "bg-emerald-500 text-white" : "bg-slate-700 hover:bg-slate-600 text-slate-200"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Image Result Tab */}
        {activeTab === "image" && (
          <div className="w-full h-full flex items-center justify-center min-h-[400px]">
            {isGeneratingImage && <LoadingSpinner type="image" />}
            {!isGeneratingImage && generatedImageUrl && (
              <div className="w-full h-full relative p-4">
                <img
                  src={generatedImageUrl || "/placeholder.svg"}
                  alt="Generated result from Gemini"
                  className="w-full h-full object-contain rounded-xl shadow-lg"
                />
                <a
                  href={generatedImageUrl}
                  download="gemini_image.png"
                  className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full shadow-lg hover:bg-white/20 transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            )}
            {!isGeneratingImage && !generatedImageUrl && (
              <div className="text-center text-slate-600 p-8">
                <Camera className="w-10 h-10 mx-auto mb-2" />
                <p>Click 'Generate Image' to see the AI result here.</p>
              </div>
            )}
          </div>
        )}

        {/* Text Analysis Tab */}
        {activeTab === "text" && (
          <div className="w-full h-full flex items-center justify-center p-4 min-h-[400px]">
            {isGeneratingText && <LoadingSpinner type="text" />}
            {!isGeneratingText && generatedText && (
              <div className="p-4 bg-slate-950 rounded-lg shadow-inner border border-slate-800 space-y-3 w-full">
                <h4 className="text-cyan-400 font-semibold flex items-center gap-2">
                  <List className="w-4 h-4" /> AI Prompt Analysis
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{generatedText}</p>
              </div>
            )}
            {!isGeneratingText && !generatedText && (
              <div className="text-center text-slate-600 p-8">
                <MessageSquare className="w-10 h-10 mx-auto mb-2" />
                <p>Click 'Analyze Prompt' to get creative feedback from a text model.</p>
              </div>
            )}
          </div>
        )}

        {/* Global Error Display */}
        {generationError && (
          <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex items-center justify-center z-20 p-4">
            <div className="p-6 bg-red-900/90 rounded-xl border border-red-700 text-center shadow-2xl">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-300" />
              <p className="font-semibold text-red-300">Generation Error</p>
              <p className="text-sm text-red-400 mt-2">{generationError}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TabButton({ icon: Icon, label, tabId, activeTab, setActiveTab }: any) {
  return (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors border-b-2 ${
        activeTab === tabId
          ? "text-white border-indigo-500 bg-slate-800"
          : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}
