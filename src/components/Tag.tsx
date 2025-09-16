import React from 'react'

interface TagItem {
  text: string
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'gray'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

interface TagProps {
  // 단일 텍스트 사용 시
  text?: string
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'gray'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  
  // 복수 태그 사용 시
  tags?: TagItem[]
  
  // 텍스트 + 태그 조합 사용 시
  tagText?: string
  tag?: string
  tagColor?: 'red' | 'blue' | 'green' | 'yellow' | 'gray'
  
  className?: string
}

const Tag: React.FC<TagProps> = ({ 
  text,
  color = 'red',
  size = 'md',
  tags,
  tagText,
  tag,
  tagColor = 'red',
  className = '' 
}) => {
  const getTagColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'gray':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'xs':
        return 'px-1.5 py-0.5 text-xs'
      case 'sm':
        return 'px-2 py-0.5 text-xs'
      case 'md':
        return 'px-2.5 py-1 text-sm'
      case 'lg':
        return 'px-3 py-1.5 text-base'
      default:
        return 'px-2.5 py-1 text-sm'
    }
  }

  // 복수 태그 렌더링
  if (tags && tags.length > 0) {
    return (
      <div className={`flex items-center gap-2 flex-wrap ${className}`}>
        {tags.map((tagItem, index) => (
          <span 
            key={index}
            className={`inline-flex items-center rounded-full font-medium border ${getTagColorClasses(tagItem.color || 'red')} ${getSizeClasses(tagItem.size || size)}`}
          >
            {tagItem.text}
          </span>
        ))}
      </div>
    )
  }

  // 단일 텍스트 렌더링
  if (text) {
    return (
      <span 
        className={`inline-flex items-center rounded-full font-medium border ${getTagColorClasses(color)} ${getSizeClasses(size)} ${className}`}
      >
        {text}
      </span>
    )
  }

  // 텍스트 + 태그 조합 렌더링
  if (tagText && tag) {
    return (
      <div className={`flex items-baseline gap-3 ${className}`}>
        <span className="text-xl font-semibold text-gray-900 leading-tight">
          {tagText}
        </span>
        <span 
          className={`inline-flex items-center rounded-full font-normal border text-xs ${getTagColorClasses(tagColor)} ${getSizeClasses('sm')}`}
        >
          {tag}
        </span>
      </div>
    )
  }

  return null
}

export default Tag
