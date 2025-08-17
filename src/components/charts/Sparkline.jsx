import React from 'react'

const Sparkline = ({ data = [], width = 200, height = 50, color = '#10b981' }) => {
  if (!data || data.length === 0) {
    return (
      <svg width={width} height={height} />
    )
  }

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = Math.max(1, max - min)
  const step = width / (data.length - 1)

  const points = data
    .map((d, i) => {
      const x = i * step
      const y = height - ((d - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  )
}

export default Sparkline


