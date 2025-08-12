import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid';

function ChannelPage({ user }) {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Videos');

  useEffect(() => {
    fetchChannel();
    fetchChannelVideos();
  }, [channelId]);

  const fetchChannel = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log(" No JWT token found in localStorage");
        return;
      }

      const url = channelId
        ? `http://localhost:8080/api/channels/${channelId}`
        : `http://localhost:8080/api/channels/user`;

      const res = await fetch(url, {
        headers: {
          "Authorization": `JWT ${token}`, 
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error('Failed to fetch channel');
      const data = await res.json();
      setChannel(data);
    } catch (err) {
      console.error('Error fetching channel:', err);
    }
  };

  const fetchChannelVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:8080/api/videos/channel/${channelId}`;

      const res = await fetch(url, {
        headers: token ? { 
          "Authorization": `JWT ${token}`, 
          "Content-Type": "application/json" 
        } : {}
      });

      if (!res.ok) throw new Error('Failed to fetch videos');
      const data = await res.json();
      setChannelVideos(data);
    } catch (err) {
      console.error('Error fetching channel videos:', err);
    }
  };

  if (!channel) {
    return <div className="p-4 text-center">Loading channel...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Channel Banner */}
      <div className="w-full h-48 bg-gray-300 rounded-lg mb-6"></div>

      {/* Channel Info */}
      <div className="flex items-center mb-6">
        <img
          src="https://via.placeholder.com/80"
          alt="Channel Logo"
          className="w-20 h-20 rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold">{channel.name}</h1>
          <p className="text-gray-600">
            Owner: {channel.user?.username || 'Unknown'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSelectedTab('Videos')}
          className={`px-4 py-2 rounded-lg ${
            selectedTab === 'Videos' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Videos
        </button>
        <button
          onClick={() => setSelectedTab('About')}
          className={`px-4 py-2 rounded-lg ${
            selectedTab === 'About' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          About
        </button>
      </div>

      {/* Tab Content */}
      {selectedTab === 'Videos' ? (
        <VideoGrid videos={channelVideos} currentUser={user} />
      ) : (
        <div className="bg-gray-100 p-4 rounded-lg">
          <p>This is the about section for {channel.name}.</p>
        </div>
      )}
    </div>
  );
}

export default ChannelPage;
