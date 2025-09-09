import React from 'react'

interface ErrorGuideProps {
  title: string
  content: React.ReactNode
}

export default function ErrorGuide({ title, content }: ErrorGuideProps) {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-hecto-50 border border-amber-200 p-6 rounded-2xl my-6 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">💡</span>
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h4 className="text-amber-800 font-semibold text-lg mb-3">{title}</h4>
          <div className="text-gray-700 text-sm leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}
