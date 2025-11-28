export function LoadingSpinner({ type = "image" }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className={`mt-4 ${type === "image" ? "text-indigo-400" : "text-cyan-400"} text-sm font-medium`}>
        {type === "image" ? "Generating image..." : "Analyzing prompt..."}
      </p>
      <p className="mt-1 text-xs text-slate-500">This may take a moment.</p>
    </div>
  )
}
