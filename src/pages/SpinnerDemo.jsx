import React, { useState } from 'react'
import { LoadingSpinner, ButtonSpinner, PageSpinner, CardSpinner, InlineSpinner } from '../components/ui'
import { Button } from '../components/ui/button'
import useTitle from '../hooks/useTitle'

const SpinnerDemo = () => {
  useTitle('Spinner Demo');
  
  const [showPageSpinner, setShowPageSpinner] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)

  const handleButtonClick = () => {
    setButtonLoading(true)
    setTimeout(() => setButtonLoading(false), 2000)
  }

  const handlePageSpinner = () => {
    setShowPageSpinner(true)
    setTimeout(() => setShowPageSpinner(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Loading Spinner Components Demo
        </h1>
        
        {/* Basic Spinners */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Spinners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Different Sizes */}
            <div className="text-center">
              <h3 className="text-sm font-medium mb-3 text-gray-600">Sizes</h3>
              <div className="space-y-4">
                <div>
                  <LoadingSpinner size="sm" />
                  <p className="text-xs mt-1 text-gray-500">Small</p>
                </div>
                <div>
                  <LoadingSpinner size="md" />
                  <p className="text-xs mt-1 text-gray-500">Medium</p>
                </div>
                <div>
                  <LoadingSpinner size="lg" />
                  <p className="text-xs mt-1 text-gray-500">Large</p>
                </div>
                <div>
                  <LoadingSpinner size="xl" />
                  <p className="text-xs mt-1 text-gray-500">Extra Large</p>
                </div>
              </div>
            </div>
            
            {/* Different Colors */}
            <div className="text-center">
              <h3 className="text-sm font-medium mb-3 text-gray-600">Colors</h3>
              <div className="space-y-4">
                <div>
                  <LoadingSpinner color="blue" />
                  <p className="text-xs mt-1 text-gray-500">Blue</p>
                </div>
                <div>
                  <LoadingSpinner color="green" />
                  <p className="text-xs mt-1 text-gray-500">Green</p>
                </div>
                <div>
                  <LoadingSpinner color="red" />
                  <p className="text-xs mt-1 text-gray-500">Red</p>
                </div>
                <div>
                  <LoadingSpinner color="purple" />
                  <p className="text-xs mt-1 text-gray-500">Purple</p>
                </div>
              </div>
            </div>
            
            {/* With Text */}
            <div className="text-center">
              <h3 className="text-sm font-medium mb-3 text-gray-600">With Text</h3>
              <div className="space-y-6">
                <LoadingSpinner size="md" text="Loading..." />
                <LoadingSpinner size="lg" color="green" text="Processing..." />
                <LoadingSpinner size="md" color="purple" text="Please wait..." />
              </div>
            </div>
            
            {/* Inline Usage */}
            <div className="text-center">
              <h3 className="text-sm font-medium mb-3 text-gray-600">Inline Usage</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Loading data <InlineSpinner size="sm" /> please wait...
                </p>
                <p className="text-sm text-gray-600">
                  Processing <InlineSpinner size="sm" color="green" /> your request...
                </p>
                <p className="text-sm text-gray-600">
                  Saving <InlineSpinner size="sm" color="purple" /> changes...
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Preset Components */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Preset Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Button Spinner */}
            <div className="text-center">
              <h3 className="text-sm font-medium mb-3 text-gray-600">Button Spinner</h3>
              <Button 
                onClick={handleButtonClick}
                disabled={buttonLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {buttonLoading ? (
                  <>
                    <ButtonSpinner className="mr-2" />
                    Loading...
                  </>
                ) : (
                  'Click to Load'
                )}
              </Button>
            </div>
            
            {/* Card Spinner */}
            <div className="text-center">
              <h3 className="text-sm font-medium mb-3 text-gray-600">Card Spinner</h3>
              <div className="border border-gray-200 rounded-lg">
                <CardSpinner text="Loading content..." />
              </div>
            </div>
            
            {/* Page Spinner Demo */}
            <div className="text-center">
              <h3 className="text-sm font-medium mb-3 text-gray-600">Full Page Spinner</h3>
              <Button 
                onClick={handlePageSpinner}
                className="bg-green-600 hover:bg-green-700"
              >
                Show Page Spinner
              </Button>
            </div>
          </div>
        </div>
        
        {/* Usage Examples */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Usage Examples</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2 text-gray-700">Basic Usage:</h3>
              <code className="text-xs text-gray-600 block">
                {`import { LoadingSpinner } from '../components/ui'`}<br/>
                {`<LoadingSpinner size="md" color="blue" text="Loading..." />`}
              </code>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2 text-gray-700">Button with Spinner:</h3>
              <code className="text-xs text-gray-600 block">
                {`import { ButtonSpinner } from '../components/ui'`}<br/>
                {`<Button disabled={loading}>`}<br/>
                {`  {loading ? <><ButtonSpinner className="mr-2" />Loading...</> : 'Submit'}`}<br/>
                {`</Button>`}
              </code>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2 text-gray-700">Full Page Loading:</h3>
              <code className="text-xs text-gray-600 block">
                {`import { PageSpinner } from '../components/ui'`}<br/>
                {`{isLoading && <PageSpinner text="Loading page..." />}`}
              </code>
            </div>
          </div>
        </div>
      </div>
      
      {/* Page Spinner Overlay */}
      {showPageSpinner && <PageSpinner text="Loading page content..." />}
    </div>
  )
}

export default SpinnerDemo