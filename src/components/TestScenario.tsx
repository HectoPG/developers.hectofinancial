
interface TestScenarioProps {
  successItems: string[]
  failureItems: string[]
}

export default function TestScenario({ successItems, failureItems }: TestScenarioProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200" style={{ borderColor: '#FF6114', borderWidth: '2px', borderStyle: 'solid' }}>
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <span className="text-sm" style={{ color: '#FF6114' }}>✓</span>
          </div>
          <h4 className="font-semibold text-lg" style={{ color: '#FF6114' }}>성공 시나리오</h4>
        </div>
        <ul className="text-gray-700 space-y-2">
          {successItems.map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2" style={{ color: '#FF6114' }}>•</span>
              <span className="text-base leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white border border-orange-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <span className="text-sm" style={{ color: '#FFC3A6' }}>✗</span>
          </div>
          <h4 className="font-semibold text-lg" style={{ color: '#FFC3A6' }}>실패 시나리오</h4>
        </div>
        <ul className="text-gray-700 space-y-2">
          {failureItems.map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2" style={{ color: '#FFC3A6' }}>•</span>
              <span className="text-base leading-relaxed" style={{ color: '#999999' }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
