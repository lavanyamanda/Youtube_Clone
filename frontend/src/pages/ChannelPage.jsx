import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoGrid from '../components/VideoGrid';

function ChannelPage() {
  const { channelId } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get logged in user info and token from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchChannelAndVideos(id) {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching channel by ID:', id);
        const channelRes = await fetch(`http://localhost:8080/api/channels/${id}`);
        if (!channelRes.ok) throw new Error('Failed to fetch channel');
        const channelData = await channelRes.json();
        console.log('Fetched channel:', channelData);
        setChannel(channelData);

        const videosRes = await fetch(`http://localhost:8080/api/videos/channel/${id}`);
        if (!videosRes.ok) throw new Error('Failed to fetch channel videos');
        const videosData = await videosRes.json();
        setChannelVideos(videosData);
      } catch (err) {
        console.error('Error fetching channel or videos:', err.message);
        setError(err.message);
        setChannel(null);
        setChannelVideos([]);
      } finally {
        setLoading(false);
      }
    }

    async function fetchChannelByUser() {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching channel for user:', user?._id);
        const res = await fetch(`http://localhost:8080/api/channels/user/${user._id}`);
        if (!res.ok) {
          if (res.status === 404) {
            console.log('No channel found for user');
            setChannel(null);
            setChannelVideos([]);
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch user channel');
        }
        const data = await res.json();
        console.log('Fetched channel for user:', data);
        setChannel(data);

        const videosRes = await fetch(`http://localhost:8080/api/videos/channel/${data._id}`);
        if (!videosRes.ok) throw new Error('Failed to fetch videos');
        const videosData = await videosRes.json();
        setChannelVideos(videosData);
      } catch (err) {
        console.error('Error fetching user channel:', err.message);
        setError(err.message);
        setChannel(null);
        setChannelVideos([]);
      } finally {
        setLoading(false);
      }
    }

    if (channelId) {
      fetchChannelAndVideos(channelId);
    } else if (user) {
      fetchChannelByUser();
    } else {
      setChannel(null);
      setChannelVideos([]);
      setLoading(false);
    }
  }, [channelId, user]);

  const isOwner = user && channel && String(user._id) === String(channel.user._id);
  const canCreateChannel = user && !channel;

  // Debug logs for rendering state
  console.log({ user, channel, canCreateChannel, isOwner });

  const handleCreateChannel = async () => {
    if (!user) return alert('Please login to create a channel');

    try {
      const res = await fetch('http://localhost:8080/api/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.username,
          description: 'My new channel',
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create channel');
      }
      const newChannel = await res.json();
      setChannel(newChannel);

      // Navigate to the new channel page
      navigate(`/channel/${newChannel._id}`);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-4">Loading channel...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  const handleDeleteVideo = async (videoId) => {
  if (!window.confirm('Are you sure you want to delete this video?')) return;

  try {
    const res = await fetch(`http://localhost:8080/api/videos/${videoId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete video');

    // Remove deleted video from state
    setChannelVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="flex flex-col">
      {user && (
        <div className="p-4">
          <p>{channel ? "You already have a channel." : "You don't have a channel yet."}</p>
          {!channel && (
            <button
              onClick={handleCreateChannel}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create Channel
            </button>
          )}
        </div>
      )}

      {channel && (
        <>
          {/* Channel Banner */}
          <div className="w-full h-48 bg-gray-200">
            <img
              src={channel.bannerUrl || 'https://via.placeholder.com/1280x270.png?text=Channel+Banner'}
              alt="Channel Banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Channel Info */}
          <div className="flex items-center gap-4 px-6 py-4">
            <img
              src={channel.logoUrl || 'https://via.placeholder.com/80x80.png?text=Logo'}
              alt="Channel Logo"
              className="w-20 h-20 rounded-full border"
            />
            <div>
              <h1 className="text-2xl font-bold">{channel.name}</h1>
              <p className="text-gray-600 text-sm">{channel.description}</p>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="px-6">
            <VideoGrid
              videos={channelVideos}
              showActions={isOwner}
              currentUser={user?.username}
              onVideoDelete={(deletedId) =>
                setChannelVideos(channelVideos.filter((video) => video._id !== deletedId))
              }
              onVideoEdit={(updatedVideo) => {
                setChannelVideos(
                  channelVideos.map((video) =>
                    video._id === updatedVideo._id ? updatedVideo : video
                  )
                );
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ChannelPage;
