function SearchBar({ searchTerm, setSearchTerm, user }) {
  const showHint = user?.role === 'user' || user?.role === 'staff';

  return (
    <div className="mb-4 flex flex-col items-center gap-2">
      <div className="w-full md:w-1/3 relative flex gap-2 items-center">
        {/* Search icon (always visible inside the input on left) */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
        </div>

        {/* Input field with left and right padding */}
        <input
          type="text"
          placeholder="Search to view your data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className="border px-3 py-2 pl-10 pr-10 rounded w-full"
        />

        

        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="bg-gray-300 hover:bg-gray-400 text-sm px-3 py-2 rounded"
          >
            Clear
          </button>
        )}
      </div>

      
    </div>
  );
}

export default SearchBar;
