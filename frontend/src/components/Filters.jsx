function FilterButtons({ selected, setSelected }) {
  const categories = ['All', 'Music', 'Cartoon', 'Trending', 'News', 'Entertainment'];

  return (
    <div className="flex gap-2 p-3 bg-white rounded-lg overflow-x-auto scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelected(category)}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
            ${selected === category
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300'
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default function Filters({ selected, setSelected }) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <FilterButtons selected={selected} setSelected={setSelected} />
    </div>
  );
}
