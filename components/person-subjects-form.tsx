"use client"

import { Plus, Trash2 } from "lucide-react"
import { TEMPLATE_CONFIG, CATEGORIES } from "@/lib/template-config"
import { getDefaultPerson } from "@/lib/template-config"

export function PersonSubjectsForm({ formData, setFormData }: any) {
  const currentConfig = TEMPLATE_CONFIG[CATEGORIES.PERSON]

  const handleSubjectFieldChange = (subjectId: string, fieldId: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      subjects: prev.subjects.map((subj: any) => (subj.id === subjectId ? { ...subj, [fieldId]: value } : subj)),
    }))
  }

  const handlePersonArrayFieldChange = (subjectId: string, fieldId: string, itemIndex: number, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      subjects: prev.subjects.map((subj: any) =>
        subj.id === subjectId
          ? {
              ...subj,
              [fieldId]: subj[fieldId].map((item: string, i: number) => (i === itemIndex ? value : item)),
            }
          : subj,
      ),
    }))
  }

  const addPersonArrayItem = (subjectId: string, fieldId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      subjects: prev.subjects.map((subj: any) =>
        subj.id === subjectId
          ? {
              ...subj,
              [fieldId]: [...subj[fieldId], ""],
            }
          : subj,
      ),
    }))
  }

  const removePersonArrayItem = (subjectId: string, fieldId: string, itemIndex: number) => {
    setFormData((prev: any) => ({
      ...prev,
      subjects: prev.subjects.map((subj: any) =>
        subj.id === subjectId
          ? {
              ...subj,
              [fieldId]: subj[fieldId].filter((_: string, i: number) => i !== itemIndex),
            }
          : subj,
      ),
    }))
  }

  const handleGlobalFieldChange = (sectionId: string, fieldId: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldId]: value,
      },
    }))
  }

  const addSubject = () => {
    setFormData((prev: any) => ({
      ...prev,
      subjects: [...prev.subjects, getDefaultPerson()],
    }))
  }

  const removeSubject = (idToRemove: string) => {
    setFormData((prev: any) => ({
      ...prev,
      subjects: prev.subjects.filter((subj: any) => subj.id !== idToRemove),
    }))
  }

  const groupedGlobalFields = currentConfig.globalFields?.reduce((acc: any, field: any) => {
    if (!acc[field.section]) acc[field.section] = []
    acc[field.section].push(field)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h3 className="text-md font-semibold text-slate-300">Subjects ({formData.subjects.length})</h3>
        <button
          onClick={addSubject}
          className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-900/20 px-3 py-1.5 rounded-full border border-indigo-900/50"
        >
          <Plus className="w-3 h-3" />
          Add Person
        </button>
      </div>

      {formData.subjects.map((subject: any, index: number) => (
        <div
          key={subject.id}
          className="p-4 rounded-xl bg-slate-950 border border-indigo-700/50 shadow-lg shadow-indigo-900/10"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-indigo-400">Person {index + 1}</h4>
            {formData.subjects.length > 1 && (
              <button
                onClick={() => removeSubject(subject.id)}
                className="text-red-400 hover:text-red-300 transition-colors text-sm flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentConfig.fields.map((field: any) => (
              <div key={field.id} className="group col-span-1">
                <label className="block text-sm font-medium text-slate-300 mb-1">{field.label}</label>
                <input
                  type="text"
                  value={subject[field.id] || ""}
                  onChange={(e) => handleSubjectFieldChange(subject.id, field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            {currentConfig.arrayFields.map((field: any) => (
              <div key={field.id} className="space-y-2 mb-4 p-3 bg-slate-800 rounded-lg border border-slate-700/50">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {field.label} ({subject[field.id]?.length || 0})
                </label>
                {subject[field.id]?.map((item: string, itemIndex: number) => (
                  <div key={itemIndex} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handlePersonArrayFieldChange(subject.id, field.id, itemIndex, e.target.value)}
                      placeholder={`${field.placeholder} (Item ${itemIndex + 1})`}
                      className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removePersonArrayItem(subject.id, field.id, itemIndex)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addPersonArrayItem(subject.id, field.id)}
                  className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-900/20 px-3 py-1.5 rounded-full border border-indigo-900/50"
                >
                  <Plus className="w-3 h-3" />
                  Add Item to {field.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Global Environment Fields */}
      <div className="pt-4 border-t border-slate-800 space-y-4">
        <h3 className="text-md font-semibold text-slate-300">Scene Settings</h3>
        {Object.entries(groupedGlobalFields || {}).map(([section, fields]: [string, any]) => (
          <div key={section} className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest pb-1">{section}</h4>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field: any) => (
                <div key={field.id} className="group col-span-1">
                  <label className="block text-sm font-medium text-slate-300 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={formData.environment?.[field.id] || ""}
                    onChange={(e) => handleGlobalFieldChange("environment", field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
