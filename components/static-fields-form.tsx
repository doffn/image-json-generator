"use client"

import { Plus, Trash2, Key } from "lucide-react"
import { TEMPLATE_CONFIG } from "@/lib/template-config"
import { generateId } from "@/lib/utils"

export function StaticFieldsForm({ formData, setFormData, activeCategory }: any) {
  const currentConfig = TEMPLATE_CONFIG[activeCategory]

  const handleStaticFieldChange = (fieldId: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [fieldId]: value }))
  }

  const handleArrayItemChange = (fieldId: string, itemId: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldId]: prev[fieldId].map((item: any) => (item.id === itemId ? { ...item, value } : item)),
    }))
  }

  const addArrayItem = (fieldId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldId]: [...prev[fieldId], { id: generateId(), value: "New Content Item" }],
    }))
  }

  const removeArrayItem = (fieldId: string, itemId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldId]: prev[fieldId].filter((item: any) => item.id !== itemId),
    }))
  }

  const addCustomField = () => {
    setFormData((prev: any) => ({
      ...prev,
      customFields: [...prev.customFields, { id: generateId(), key: "", value: "" }],
    }))
  }

  const removeCustomField = (idToRemove: string) => {
    setFormData((prev: any) => ({
      ...prev,
      customFields: prev.customFields.filter((field: any) => field.id !== idToRemove),
    }))
  }

  const handleCustomFieldChange = (idToChange: string, fieldPart: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      customFields: prev.customFields.map((field: any) =>
        field.id === idToChange ? { ...field, [fieldPart]: value } : field,
      ),
    }))
  }

  const groupedFields = currentConfig.fields?.reduce((acc: any, field: any) => {
    if (!acc[field.section]) acc[field.section] = []
    acc[field.section].push(field)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {Object.entries(groupedFields || {}).map(([section, fields]: [string, any]) => (
        <div key={section} className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">
            {section}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field: any) => (
              <div key={field.id} className="group">
                <label className="block text-sm font-medium text-slate-300 mb-1.5 group-focus-within:text-indigo-400 transition-colors">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleStaticFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Simple Array Fields */}
      {currentConfig.arrayFields &&
        currentConfig.arrayFields.map((field: any) => (
          <div key={field.id} className="space-y-2 mb-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
            <label className="block text-sm font-bold text-slate-300 mb-3">
              {field.label} ({formData[field.id]?.length || 0})
            </label>
            {formData[field.id]?.map((item: any, index: number) => (
              <div key={item.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => handleArrayItemChange(field.id, item.id, e.target.value)}
                  placeholder={`${field.placeholder} (Item ${index + 1})`}
                  className="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(field.id, item.id)}
                  className="text-red-400 hover:text-red-300 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(field.id)}
              className="w-full mt-3 flex items-center justify-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-900/20 px-3 py-1.5 rounded-full border border-indigo-900/50"
            >
              <Plus className="w-3 h-3" />
              Add {field.label}
            </button>
          </div>
        ))}

      {/* Custom Fields Section */}
      <div className="pt-4 border-t border-slate-800 mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest">
            <Key className="w-4 h-4 inline-block mr-2" />
            Custom JSON Fields ({formData.customFields?.length || 0})
          </h3>
          <button
            onClick={addCustomField}
            className="text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-900/20 px-3 py-1.5 rounded-full border border-cyan-900/50"
          >
            <Plus className="w-3 h-3" />
            Add Custom Field
          </button>
        </div>

        {formData.customFields?.map((field: any) => (
          <div
            key={field.id}
            className="flex items-center space-x-2 p-2 bg-slate-950 rounded-lg border border-slate-800"
          >
            <input
              type="text"
              value={field.key}
              onChange={(e) => handleCustomFieldChange(field.id, "key", e.target.value)}
              placeholder="JSON Key (e.g., 'perspective')"
              className="w-1/3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none"
            />
            <input
              type="text"
              value={field.value}
              onChange={(e) => handleCustomFieldChange(field.id, "value", e.target.value)}
              placeholder="JSON Value (e.g., 'fisheye_lens')"
              className="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none"
            />
            <button
              type="button"
              onClick={() => removeCustomField(field.id)}
              className="text-red-400 hover:text-red-300 transition-colors p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
