import React from 'react'
import useTitle from '@/hooks/useTitle'

const Terms = () => {
  useTitle('Terms of Service')
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-600 mb-6">Please read these terms carefully before using SportNex.</p>
      <div className="space-y-4 text-gray-700">
        <p>• Bookings are subject to availability and club rules.</p>
        <p>• Cancellations and refunds follow our posted policy.</p>
        <p>• Misuse of the platform may result in account suspension.</p>
      </div>
    </div>
  )
}

export default Terms


