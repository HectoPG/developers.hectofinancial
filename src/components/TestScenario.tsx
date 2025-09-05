import React from 'react'

interface TestScenarioProps {
  successItems: string[]
  failureItems: string[]
}

export default function TestScenario({ successItems, failureItems }: TestScenarioProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      <div className="bg-white border border-emerald-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">✓</span>
          </div>
          <h4 className="text-emerald-800 font-semibold text-lg">성공 시나리오</h4>
        </div>
        <ul className="text-gray-700 space-y-2">
          {successItems.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-emerald-500 mr-2 mt-1">•</span>
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white border border-red-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">✗</span>
          </div>
          <h4 className="text-red-800 font-semibold text-lg">실패 시나리오</h4>
        </div>
        <ul className="text-gray-700 space-y-2">
          {failureItems.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-red-500 mr-2 mt-1">•</span>
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
