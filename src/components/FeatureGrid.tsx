import React from 'react'

interface Feature {
  icon: string
  title: string
  description: string
  bgColor: string
  borderColor: string
  iconBgColor: string
}

interface FeatureGridProps {
  features: Feature[]
}

export default function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {features.map((feature, index) => (
        <div 
          key={index}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-200"
        >
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 ${feature.iconBgColor} rounded-xl flex items-center justify-center mr-4 shadow-sm`}>
              <span className="text-white text-xl">{feature.icon}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
