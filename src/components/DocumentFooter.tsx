
interface DocumentFooterProps {
  title: string
  description?: string
  primaryButton: {
    text: string
    href: string
  }
  secondaryButton?: {
    text: string
    href: string
  }
}

export default function DocumentFooter({ title, description, primaryButton, secondaryButton }: DocumentFooterProps) {
  return (
    <div className="mt-8 bg-gray-50 rounded-xl p-6 text-center">
      <p className="text-gray-600 mb-4">{title}</p>
      {description && <p className="text-gray-500 mb-4 text-sm">{description}</p>}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href={primaryButton.href} 
          className="inline-flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-medium focus:outline-none"
          style={{ backgroundColor: '#ffb089' }}
        >
          {primaryButton.text}
        </a>
        {secondaryButton && (
          <a 
            href={secondaryButton.href} 
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
          >
            {secondaryButton.text}
          </a>
        )}
      </div>
    </div>
  )
}
