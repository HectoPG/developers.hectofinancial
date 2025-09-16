interface QAItem {
  question: string
  answer: string
}

interface QAProps {
  qaItems: QAItem[]
  maxHeight?: string
  maxVisibleItems?: number
}

export default function QA({ qaItems, maxHeight = "400px", maxVisibleItems = 3 }: QAProps) {
  const shouldScroll = qaItems.length >= maxVisibleItems

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">💡 자주 묻는 질문</h3>
      <div 
        className={shouldScroll ? "overflow-y-auto pr-2" : ""}
        style={{ 
          maxHeight: shouldScroll ? maxHeight : "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#D1D5DB #F3F4F6"
        }}
      >
        <div className="space-y-4">
          {qaItems.map((item, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
               <h4 className="text-base font-medium text-gray-900 mb-2">
                 ❓ {item.question}
               </h4>
               <p className="text-base text-gray-700 leading-relaxed">
                 💬 {item.answer}
               </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
