import React from 'react'

interface ResponsiveImageProps {
  src: string
  alt: string
  width?: string | number
  height?: string | number
  maxWidth?: string | number
  maxHeight?: string | number
  marginTop?: string | number
  marginBottom?: string | number
  marginLeft?: string | number
  marginRight?: string | number
  paddingTop?: string | number
  paddingBottom?: string | number
  paddingLeft?: string | number
  paddingRight?: string | number
  className?: string
  style?: React.CSSProperties
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width = 'auto',
  height = 'auto',
  maxWidth = '100%',
  maxHeight = 'auto',
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  paddingTop = 0,
  paddingBottom = 0,
  paddingLeft = 0,
  paddingRight = 0,
  className = '',
  style = {}
}) => {
  const customStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
    marginTop: typeof marginTop === 'number' ? `${marginTop}px` : marginTop,
    marginBottom: typeof marginBottom === 'number' ? `${marginBottom}px` : marginBottom,
    marginLeft: typeof marginLeft === 'number' ? `${marginLeft}px` : marginLeft,
    marginRight: typeof marginRight === 'number' ? `${marginRight}px` : marginRight,
    paddingTop: typeof paddingTop === 'number' ? `${paddingTop}px` : paddingTop,
    paddingBottom: typeof paddingBottom === 'number' ? `${paddingBottom}px` : paddingBottom,
    paddingLeft: typeof paddingLeft === 'number' ? `${paddingLeft}px` : paddingLeft,
    paddingRight: typeof paddingRight === 'number' ? `${paddingRight}px` : paddingRight,
    display: 'block',
    ...style
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className}`}
      style={customStyle}
      loading="lazy"
    />
  )
}

export default ResponsiveImage
