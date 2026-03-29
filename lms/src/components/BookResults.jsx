import React from 'react'

const BookResults = ({book,onAddToCatalog }) => {
 
    const b= book.volumeInfo;
   
  return (
    <div className={`flex items-center gap-4 px-4 py-3 `}>
   
      <div className="w-14 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        {b.imageLinks ? (
          <img src={b.imageLinks.thumbnail}  className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{b.title}</p>
        <p className="text-sm text-gray-500">{b.authors?.[0] || "Unknown Author"}</p>
        <p className="text-xs text-gray-400 mt-1">{b.industryIdentifiers?.[0]?.identifier || "N/A"}</p>
      </div>

   
      <button
        onClick={() => onAddToCatalog(book)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition whitespace-nowrap"
      >
        + Add to catalog
      </button>

    </div>
  )
}

export default BookResults
