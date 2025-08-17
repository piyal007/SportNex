import React from 'react'
import useTitle from '@/hooks/useTitle'

const Privacy = () => {
  useTitle('Privacy Policy')
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-600 mb-6">We value your privacy. This page outlines how SportNex collects, uses, and protects your information.</p>
      <div className="space-y-4 text-gray-700">
        <p>• We only collect information necessary to provide booking and membership services.</p>
        <p>• Your data is never sold. Limited data may be shared with payment providers to process transactions.</p>
        <p>• You can request profile updates or deletion by contacting support.</p>
      </div>
    </div>
  )
}

export default Privacy


