
interface DocumentFooterProps {
  // 좌측 섹션 - 도움말 및 지원
  leftSection: {
    faq: {
      text: string
      link: string
    }
    support: {
      realtime: {
        text: string
        link: string
      }
      email: {
        text: string
        link: string
      }
    }
  }
  // 우측 섹션 - 코드 샘플
  rightSection: {
    text: string
    link: string
  }
}

export default function DocumentFooter({ leftSection, rightSection }: DocumentFooterProps) {
  // Props가 없을 경우 기본값 제공
  if (!leftSection || !rightSection) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        {/* 좌측 섹션 - 도움말 및 지원 */}
        <div className="flex-1 space-y-4">
          {/* FAQ 섹션 */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-[10px] text-gray-600 font-medium">i</span>
            </div>
            <div className="text-gray-700 text-sm">
              더 궁금한 내용이 있나요?{' '}
              <a 
                href={leftSection?.faq?.link || '#'}
                className="text-gray-700 underline hover:text-gray-900 transition-colors text-xs"
              >
                {leftSection?.faq?.text || '자주 묻는 질문'}
              </a>
            </div>
          </div>
          
          {/* 지원 섹션 */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-[10px] text-gray-600">🎧</span>
            </div>
            <div className="text-gray-700 text-sm">
              기술지원이 필요한가요?{' '}
              <a 
                href={leftSection?.support?.realtime?.link || '#'}
                className="text-gray-700 underline hover:text-gray-900 transition-colors text-xs"
              >
                {leftSection?.support?.realtime?.text || '실시간 문의'}
              </a>
              <span className="text-gray-400 mx-2">|</span>
              <a 
                href={leftSection?.support?.email?.link || '#'}
                className="text-gray-700 underline hover:text-gray-900 transition-colors text-xs"
              >
                {leftSection?.support?.email?.text || '이메일 보내기'}
              </a>
            </div>
          </div>
        </div>

        {/* 우측 섹션 - 코드 샘플 */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-[10px] text-gray-600">🐙</span>
          </div>
          <div className="text-gray-700 text-sm">
            {rightSection?.text || '코드 샘플을 참고하세요'}{' '}
            <a 
              href={rightSection?.link || '#'}
              className="text-blue-600 underline hover:text-blue-800 transition-colors text-xs"
            >
              HectoFinancial GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
