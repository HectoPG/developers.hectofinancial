
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
    <div className="my-8">
      <p className="mb-6 text-gray-700 text-base font-medium">{title}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {displaySteps.map((step, index) => (
          <a 
            key={index}
            href={step.href}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            {/* 배경 그라데이션 효과 */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* 콘텐츠 - 세로 배치 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* 아이콘 */}
              <div className="flex-shrink-0 mb-2">
                <span className="text-2xl">{step.icon}</span>
              </div>
              
              {/* 텍스트 */}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-gray-900 group-hover:text-orange-700 transition-colors duration-200">
                  {step.title}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
