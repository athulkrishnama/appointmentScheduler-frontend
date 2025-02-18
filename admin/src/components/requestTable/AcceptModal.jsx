import React from 'react'

function AcceptModal({confirmAccept,cancelConfirmation, isLoading}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg">
      <h3 className="text-lg font-medium text-gray-900">
        Confirm accept   Request
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Are you sure you want to accept this request?
      </p>
      <div className="mt-4">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
          onClick={confirmAccept}
        >
          {isLoading ? 'Accepting...' : 'Accept'}
        </button>
        <button
          type="button"
          className="ml-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-black bg-white border border-black rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
          onClick={cancelConfirmation}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
  )
}

export default AcceptModal
