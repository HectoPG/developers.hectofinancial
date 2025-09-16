import React from 'react'

interface ServiceItem {
  icon: string
  title: string
  description: string
}

interface ServiceGridProps {
  services: ServiceItem[]
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ services }) => {
  return (
    <div className="my-8">
      {/* 서비스 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <div 
            key={index}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            {/* 배경 그라데이션 효과 */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* 콘텐츠 - 가로 배치 */}
            <div className="relative z-10 flex items-center gap-4">
              {/* 아이콘 - border 제거 */}
              <div className="flex-shrink-0">
                <span className="text-3xl">{service.icon}</span>
              </div>
              
              {/* 텍스트 영역 */}
              <div className="flex-1 min-w-0">
                {/* 제목 */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors duration-200">
                  {service.title}
                </h3>
                
                {/* 설명 */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default ServiceGrid
