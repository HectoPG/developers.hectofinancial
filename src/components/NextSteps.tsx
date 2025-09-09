
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
  steps?: NextStep[]
  excludeTitle?: string
}

// 결제 수단 공통 데이터
const PAYMENT_METHODS: NextStep[] = [
  {
    href: "/docs/pg/credit-card",
    icon: "💳",
    title: "신용카드",
    bgColor: "bg-white",
    borderColor: "border-hecto-100",
    hoverBorderColor: "border-hecto-300",
    iconBgColor: "bg-hecto-400",
    hoverIconBgColor: "bg-hecto-500"
  },
  {
    href: "/docs/pg/virtual-account",
    icon: "💰",
    title: "가상계좌",
    bgColor: "bg-white",
    borderColor: "border-hecto-100",
    hoverBorderColor: "border-hecto-300",
    iconBgColor: "bg-hecto-400",
    hoverIconBgColor: "bg-hecto-500"
  },
  {
    href: "/docs/pg/bank-transfer",
    icon: "🏦",
    title: "계좌이체",
    bgColor: "bg-white",
    borderColor: "border-hecto-100",
    hoverBorderColor: "border-hecto-300",
    iconBgColor: "bg-hecto-400",
    hoverIconBgColor: "bg-hecto-500"
  },
  {
    href: "/docs/pg/mobile-payment",
    icon: "📱",
    title: "휴대폰",
    bgColor: "bg-white",
    borderColor: "border-hecto-100",
    hoverBorderColor: "border-hecto-300",
    iconBgColor: "bg-hecto-400",
    hoverIconBgColor: "bg-hecto-500"
  },
  {
    href: "/docs/pg/simple-payment",
    icon: "⚡",
    title: "간편결제",
    bgColor: "bg-white",
    borderColor: "border-hecto-100",
    hoverBorderColor: "border-hecto-300",
    iconBgColor: "bg-hecto-400",
    hoverIconBgColor: "bg-hecto-500"
  },
  {
    href: "/docs/pg/gift-card",
    icon: "🎁",
    title: "상품권",
    bgColor: "bg-white",
    borderColor: "border-hecto-100",
    hoverBorderColor: "border-hecto-300",
    iconBgColor: "bg-hecto-400",
    hoverIconBgColor: "bg-hecto-500"
  },
  {
    href: "/docs/pg/point-damoa",
    icon: "🎯",
    title: "포인트",
    bgColor: "bg-white",
    borderColor: "border-hecto-100",
    hoverBorderColor: "border-hecto-300",
    iconBgColor: "bg-hecto-400",
    hoverIconBgColor: "bg-hecto-500"
  }
]

// 특정 결제 수단을 제외한 나머지 결제 수단들을 반환하는 함수
export function getOtherPaymentMethods(excludeTitle: string): NextStep[] {
  return PAYMENT_METHODS.filter(method => method.title !== excludeTitle)
}

export default function NextSteps({ title, steps, excludeTitle }: NextStepsProps) {
  // steps가 제공되지 않으면 excludeTitle을 사용해서 자동으로 생성
  const displaySteps = steps || (excludeTitle ? getOtherPaymentMethods(excludeTitle) : [])
  
  return (
    <div>
      <p className="mb-6 text-gray-700 text-lg font-medium">{title}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        {displaySteps.map((step, index) => (
          <a 
            key={index}
            href={step.href} 
            className="block p-6 border rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md focus:outline-none"
            style={{ 
              backgroundColor: '#fff7f0',
              borderColor: '#ffd9c1'
            }}
          >
            <div className="text-center">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-200 shadow-sm group-hover:shadow-md"
                style={{ backgroundColor: '#ffb089' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ff9566' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffb089' }}
              >
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
