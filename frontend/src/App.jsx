import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import VideoPlayer from './pages/VideoPlayer';
import ChannelPage from './pages/ChannelPage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
  

      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSidebarOpen={isSidebarOpen}
            />
          }
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route path="/channel/:channelId" element={<ChannelPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;