// 공통 아이콘 매핑 유틸리티
import { CreditCard, Banknote, FileText, Layers, BookOpen } from 'lucide-react'

export const iconMap: Record<string, any> = {
  CreditCard,
  Banknote,
  FileText,
  Layers,
  BookOpen
}

export const getIcon = (iconName: string) => {
  return iconMap[iconName] || FileText
}
