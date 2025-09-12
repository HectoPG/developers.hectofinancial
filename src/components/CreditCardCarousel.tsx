import React from 'react';

interface CreditCard {
  id: string;
  name: string;
  color: string;
  logo: string;
  gradient: string;
}

const creditCards: CreditCard[] = [
  {
    id: 'shinhan',
    name: '신한카드',
    color: 'text-blue-800',
    logo: 'SH',
    gradient: 'from-blue-400 via-blue-500 to-blue-600'
  },
  {
    id: 'kookmin',
    name: '국민카드',
    color: 'text-yellow-800',
    logo: 'KB',
    gradient: 'from-yellow-400 via-yellow-500 to-yellow-600'
  },
  {
    id: 'samsung',
    name: '삼성카드',
    color: 'text-indigo-800',
    logo: 'SS',
    gradient: 'from-indigo-400 via-indigo-500 to-indigo-600'
  },
  {
    id: 'hyundai',
    name: '현대카드',
    color: 'text-gray-800',
    logo: 'HD',
    gradient: 'from-gray-400 via-gray-500 to-gray-600'
  },
  {
    id: 'hana',
    name: '하나카드',
    color: 'text-green-800',
    logo: 'HN',
    gradient: 'from-green-400 via-green-500 to-green-600'
  },
  {
    id: 'lotte',
    name: '롯데카드',
    color: 'text-red-800',
    logo: 'LT',
    gradient: 'from-red-400 via-red-500 to-red-600'
  },
  {
    id: 'woori',
    name: '우리카드',
    color: 'text-blue-800',
    logo: 'WR',
    gradient: 'from-blue-500 via-blue-600 to-blue-700'
  },
  {
    id: 'nh',
    name: 'NH카드',
    color: 'text-emerald-800',
    logo: 'NH',
    gradient: 'from-emerald-400 via-emerald-500 to-emerald-600'
  }
];

const CreditCardCarousel: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes rotateCarousel {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        .carousel-container {
          perspective: 800px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
        }
        
        .carousel-3d {
          position: relative;
          width: 150px;
          height: 200px;
          transform-style: preserve-3d;
          animation: rotateCarousel 20s linear infinite;
        }
        
        /* 각 카드별 동적 흐림 애니메이션 생성 */
        ${creditCards.map((_, index) => {
          const cardAngle = (360 / creditCards.length) * index;
          let keyframes = `@keyframes cardBlur${index} {\n`;
          
          for (let t = 0; t <= 100; t += 10) {
            const currentTime = t / 100;
            const carouselRotation = currentTime * 360;
            const absoluteCardAngle = (cardAngle + carouselRotation) % 360;
            
            // 후면 판별 (진짜 뒤쪽만: 135도~225도)
            const isBackSide = absoluteCardAngle > 135 && absoluteCardAngle < 225;
            
            let blurAmount = 0;
            let opacity = 1;
            
            if (isBackSide) {
              // 180도에서 가장 흐림, 흐림 정도를 더 약하게 (0.3px~1px)
              const distanceFrom180 = Math.abs(absoluteCardAngle - 180);
              // 180도에서 멀어질수록 흐림 효과 감소
              const blurIntensity = Math.max(0, (45 - distanceFrom180) / 45);
              blurAmount = 0.3 + (blurIntensity * 0.7); // 0.3px~1px
              opacity = 0.9 + (blurIntensity * -0.1); // 0.8~0.9
            }
            
            keyframes += `  ${t}% { filter: blur(${blurAmount}px); opacity: ${opacity}; }\n`;
          }
          
          keyframes += `}`;
          return keyframes;
        }).join('\n')}
        
        .carousel-card {
          position: absolute;
          left: 50%;
          top: 50%;
          transform-origin: center;
          transition: filter 0.5s ease;
        }
      `}</style>
      <div className="w-full py-12 overflow-hidden">
      {/* 3D 회전 캐러셀 */}
      <div className="carousel-container">
        <div className="carousel-3d">
          {creditCards.map((card, index) => {
            const cardAngle = (360 / creditCards.length) * index;
            const radius = 200; // 회전 반지름을 반으로 줄임
            
            return (
              <div
                key={card.id}
                className={`carousel-card w-28 h-40 bg-gradient-to-br ${card.gradient} rounded-xl shadow-xl p-3 text-white overflow-hidden transform hover:scale-105 transition-all duration-300`}
                style={{
                  transform: `translate(-50%, -50%) rotateY(${cardAngle}deg) translateZ(${radius}px) rotateZ(15deg)`,
                  animation: `cardBlur${index} 20s linear infinite`,
                }}
                onClick={() => console.log(`${card.name} 카드 클릭됨`)}
              >
                {/* 카드 배경 패턴 */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full"></div>
                  <div className="absolute top-6 left-1 w-3 h-3 bg-white rounded-full"></div>
                  <div className="absolute bottom-6 right-2 w-5 h-5 bg-white rounded-full"></div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 bg-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full"></div>
                </div>

                {/* 카드 내용 */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* 상단 헤더 */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-bold bg-white bg-opacity-20 px-1 py-0.5 rounded">
                      {card.logo}
                    </div>
                    <div className="text-right">
                      <div className="text-xs opacity-80 leading-tight">CARD</div>
                    </div>
                  </div>

                  {/* 중앙 카드사명 */}
                  <div className="flex-1 flex flex-col justify-center items-center text-center mb-2">
                    <div className="text-sm font-bold">{card.name}</div>
                  </div>

                  {/* 카드 번호 */}
                  <div className="mb-2">
                    <div className="text-xs font-mono tracking-wide text-center">
                      4000 0000
                    </div>
                    <div className="text-xs font-mono tracking-wide text-center">
                      0000 ••••
                    </div>
                  </div>

                  {/* 하단 정보 */}
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-80">VALID</div>
                      <div className="font-mono text-xs">12/25</div>
                    </div>
                    <div className="text-xs opacity-80">
                      HECTO
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </>
  );
};

export default CreditCardCarousel;
