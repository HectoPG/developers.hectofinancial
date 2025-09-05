import React from 'react'

interface DocumentFooterProps {
  title: string
  primaryButton: {
    text: string
    href: string
    bgColor: string
    hoverBgColor: string
  }
  secondaryButton: {
    text: string
    href: string
  }
}

export default function DocumentFooter({ title, primaryButton, secondaryButton }: DocumentFooterProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl text-center my-8 border border-gray-200">
      <p className="text-gray-700 mb-6 text-lg font-medium">{title}</p>
      <div className="flex justify-center space-x-4">
        <a 
          href={primaryButton.href} 
          className="inline-flex items-center px-6 py-3 bg-hecto-400 text-white rounded-xl hover:bg-hecto-500 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {primaryButton.text}
        </a>
        <a 
          href={secondaryButton.href} 
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
        >
          {secondaryButton.text}
        </a>
      </div>
    </div>
  )
}
