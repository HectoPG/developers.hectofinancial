import React from 'react'

interface NextStep {
  href: string
  icon: string
  title: string
  bgColor: string
  borderColor: string
  hoverBorderColor: string
  iconBgColor: string
  hoverIconBgColor: string
}

interface NextStepsProps {
  title: string
  steps: NextStep[]
}

export default function NextSteps({ title, steps }: NextStepsProps) {
  return (
    <div>
      <p className="mb-6 text-gray-700 text-lg font-medium">{title}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        {steps.map((step, index) => (
          <a 
            key={index}
            href={step.href} 
            className="block p-6 bg-white border border-gray-200 hover:border-gray-300 rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md"
          >
            <div className="text-center">
              <div className={`w-14 h-14 ${step.iconBgColor} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:${step.hoverIconBgColor} transition-all duration-200 shadow-sm`}>
                <span className="text-white text-xl">{step.icon}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{step.title}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
