const SubNavbar = () => {
  
  return (
     <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-3">
      
      {/* Search input */}
      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 w-72">
        🔍
        <input
          type="text"
          placeholder="Search books..."
          className="outline-none text-sm text-gray-700 w-full bg-transparent"
        />
      </div>

    </div>
  );
};

export default SubNavbar;
