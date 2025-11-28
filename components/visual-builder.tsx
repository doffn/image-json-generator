"use client"

import { Trash2 } from "lucide-react"
import { PersonSubjectsForm } from "./person-subjects-form"
import { StaticFieldsForm } from "./static-fields-form"

export function VisualBuilder({
  activeCategory,
  formData,
  setFormData,
  isMultiSubject,
  EXAMPLES,
  onExampleLoaded,
}: any) {
  const handleClearForm = () => {
    if (isMultiSubject) {
      // For PERSON template, clear all subject fields to empty strings
      const clearedData = {
        ...formData,
        subjects: formData.subjects.map((subject: any) => ({
          id: subject.id,
          age: "",
          gender: "",
          ethnicity: "",
          hair: "",
          eyes: "",
          outfit: [""],
          pose: [""],
        })),
        environment: {
          location: "",
          lighting: "",
          camera: "",
          style: "",
        },
        customFields: [],
      }
      setFormData(clearedData)
    } else {
      // For BROCHURE, STICKER, AD templates, clear all fields to empty strings
      const clearedData = {
        ...formData,
      }

      // Clear all top-level string fields
      Object.keys(clearedData).forEach((key) => {
        if (typeof clearedData[key] === "string") {
          clearedData[key] = ""
        } else if (Array.isArray(clearedData[key])) {
          // For array fields like contentPanels, clear their values
          clearedData[key] = clearedData[key].map((item: any) => ({
            ...item,
            value: "",
          }))
        }
      })

      // Clear customFields
      clearedData.customFields = []

      setFormData(clearedData)
    }

    onExampleLoaded()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-5 h-5 text-indigo-400">🎨</span>
          Visual Builder
        </h2>
        <button
          onClick={handleClearForm}
          className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors bg-red-900/20 px-3 py-1.5 rounded-full border border-red-900/50"
        >
          <Trash2 className="w-3 h-3" />
          Clear Form
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {isMultiSubject ? (
          <PersonSubjectsForm formData={formData} setFormData={setFormData} />
        ) : (
          <StaticFieldsForm formData={formData} setFormData={setFormData} activeCategory={activeCategory} />
        )}
      </div>
    </div>
  )
}
