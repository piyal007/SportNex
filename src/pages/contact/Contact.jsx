import React from 'react'
import useTitle from '@/hooks/useTitle'

const Contact = () => {
  useTitle('Contact')

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Get in touch</h1>
          <p className="mt-3 text-gray-600">Questions, feedback, or partnership opportunities? We would love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-lg">Email</h3>
            <p className="mt-2 text-gray-600">support@sportnex.app</p>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-lg">Phone</h3>
            <p className="mt-2 text-gray-600">+1 (555) 123-4567</p>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold text-lg">Location</h3>
            <p className="mt-2 text-gray-600">123 Sport Ave, Court City</p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Send us a message</h2>
          <form
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              alert('Thanks! We will get back to you soon.')
            }}
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                placeholder="Your name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Email</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                placeholder="you@example.com"
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-sm text-gray-700">Message</label>
              <textarea
                rows={5}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                placeholder="How can we help?"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-5 py-2.5 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact


