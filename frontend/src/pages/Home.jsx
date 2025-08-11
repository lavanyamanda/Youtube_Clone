import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Filters from '../components/Filters';
import VideoGrid from '../components/VideoGrid';

function Home({ searchQuery, setSearchQuery }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:8080/api/videos');
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  // Filter videos based on search query and category
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <p className="p-4">Loading videos...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Header with Search & Sidebar Toggle */}
      <Header
        setSearchQuery={setSearchQuery}
        toggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Main content layout: sidebar + content */}
      <div className="flex flex-1">
        {isSidebarOpen && (
          <aside className="w-60 bg-gray-100 border-r border-gray-300">
            <Sidebar />
          </aside>
        )}

        <main className="flex-1 p-4">
          <Filters
            selected={selectedCategory}
            setSelected={setSelectedCategory}
          />
          <VideoGrid videos={filteredVideos} />
        </main>
      </div>
    </div>
  );
}

export default Home;
