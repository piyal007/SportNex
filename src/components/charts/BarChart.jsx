import React from 'react'

const BarChart = ({ data = [], labels = [], height = 160, color = '#0ea5e9', bg = '#e0f2fe' }) => {
  const max = Math.max(1, ...data)
  const barWidth = 100 / (data.length * 1.5)

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end h-full gap-2">
        {data.map((value, i) => {
          const h = Math.round((value / max) * 100)
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full rounded-t" style={{ height: `${h}%`, backgroundColor: color }} />
              <div className="w-full" style={{ height: `${100 - h}%`, backgroundColor: bg }} />
              {labels[i] && <div className="mt-2 text-xs text-gray-600">{labels[i]}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BarChart


