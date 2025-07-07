import React from 'react'

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  text = '', 
  className = '',
  fullScreen = false 
}) => {
  // Size variants
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  // Color variants
  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    purple: 'border-purple-600',
    gray: 'border-gray-600',
    white: 'border-white'
  }

  // Text size based on spinner size
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  const spinnerClasses = `
    ${sizeClasses[size]} 
    ${colorClasses[color]} 
    border-2 
    border-t-transparent 
    rounded-full 
    animate-spin
  `.trim()

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50'
    : `flex flex-col items-center justify-center ${className}`

  return (
    <div className={containerClasses}>
      {/* Main Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className={spinnerClasses}></div>
        
        {/* Inner pulsing dot */}
        <div className={`
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          ${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'}
          ${colorClasses[color].replace('border-', 'bg-')}
          rounded-full
          animate-pulse
        `}></div>
      </div>
      
      {/* Loading text */}
      {text && (
        <p className={`
          mt-3 
          ${textSizeClasses[size]} 
          ${color === 'white' ? 'text-white' : 'text-gray-600'} 
          font-medium 
          animate-pulse
        `}>
          {text}
        </p>
      )}
    </div>
  )
}

// Preset spinner variants for common use cases
export const ButtonSpinner = ({ className = '' }) => (
  <LoadingSpinner 
    size="sm" 
    color="white" 
    className={`inline-flex ${className}`}
  />
)

export const PageSpinner = ({ text = 'Loading...' }) => (
  <LoadingSpinner 
    size="lg" 
    color="blue" 
    text={text}
    fullScreen={true}
  />
)

export const CardSpinner = ({ text = '' }) => (
  <LoadingSpinner 
    size="md" 
    color="blue" 
    text={text}
    className="py-8"
  />
)

export const InlineSpinner = ({ size = 'sm', color = 'blue' }) => (
  <LoadingSpinner 
    size={size} 
    color={color} 
    className="inline-flex"
  />
)

export default LoadingSpinner