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
  const [descExpanded, setDescExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Videos');
  const [selectedVideoFilter, setSelectedVideoFilter] = useState('Latest');

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchChannelAndVideos(id) {
      setLoading(true);
      setError(null);
      try {
        const channelRes = await fetch(`http://localhost:8080/api/channels/${id}`);
        if (!channelRes.ok) throw new Error('Failed to fetch channel');
        const channelData = await channelRes.json();
        setChannel(channelData);

        const videosRes = await fetch(`http://localhost:8080/api/videos/channel/${id}`);
        if (!videosRes.ok) throw new Error('Failed to fetch channel videos');
        let videosData = await videosRes.json();

        // Apply video filter sorting
        videosData = sortVideos(videosData, selectedVideoFilter);
        setChannelVideos(videosData);
      } catch (err) {
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
        const res = await fetch(`http://localhost:8080/api/channels/user/${user._id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setChannel(null);
            setChannelVideos([]);
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch user channel');
        }
        const data = await res.json();
        setChannel(data);

        const videosRes = await fetch(`http://localhost:8080/api/videos/channel/${data._id}`);
        if (!videosRes.ok) throw new Error('Failed to fetch videos');
        let videosData = await videosRes.json();

        videosData = sortVideos(videosData, selectedVideoFilter);
        setChannelVideos(videosData);
      } catch (err) {
        setError(err.message);
        setChannel(null);
        setChannelVideos([]);
      } finally {
        setLoading(false);
      }
    }

    function sortVideos(videos, filter) {
      if (filter === 'Latest') {
        return videos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (filter === 'Popular') {
        return videos.sort((a, b) => b.views - a.views);
      } else if (filter === 'Oldest') {
        return videos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
      return videos;
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
  }, [channelId, user, selectedVideoFilter]);

  const isOwner = user && channel && String(user._id) === String(channel.user?._id);

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
      navigate(`/channel/${newChannel._id}`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete video');
      setChannelVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditVideo = (updatedVideo) => {
    setChannelVideos((prev) =>
      prev.map((v) => (v._id === updatedVideo._id ? updatedVideo : v))
    );
  };

  if (loading) return <p className="p-4">Loading channel...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      {/* Banner */}
      {channel && (
        <div className="w-full h-48 bg-gray-200">
          <img
            src={channel.bannerUrl || 'https://img.freepik.com/free-vector/gradient-youtube-horizontal-banner_52683-78651.jpg?semt=ais_hybrid&w=740&q=80'}
            alt="Channel Banner"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      {/* Channel info section */}
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
          <div className="flex items-center gap-6 px-6 py-4">
            <img
              src={channel.logoUrl || 'https://t4.ftcdn.net/jpg/04/37/58/33/240_F_437583308_HglTcJD8fsRAkwjZD8DJHkcHwmXaZ0ag.jpg'}
              alt="Channel Logo"
              className="w-28 h-28 rounded-full border object-cover"
            />

            <div className="flex flex-col flex-grow">
              <h1 className="text-3xl font-semibold flex items-center gap-2">
                {channel.name}
                {channel.verified && (
                  <span className="text-blue-600 font-bold text-xl" title="Verified Channel">✔️</span>
                )}
              </h1>
              <p className="text-gray-600 text-sm">
                @{channel.handle || channel.name.replace(/\s+/g, '').toLowerCase()} •{' '}
                {channel.subscriberCount?.toLocaleString() || 0} subscribers • {channelVideos.length} videos
              </p>

              {/* Description with toggle */}
              <p className="text-gray-700 mt-2 max-w-3xl whitespace-pre-wrap">
                {descExpanded || (channel.description?.length || 0) <= 150
                  ? channel.description
                  : `${channel.description?.slice(0, 150)}...`}
                {channel.description?.length > 150 && (
                  <button
                    onClick={() => setDescExpanded(!descExpanded)}
                    className="text-blue-600 ml-1 underline"
                  >
                    {descExpanded ? 'Show less' : '...more'}
                  </button>
                )}
              </p>

              {/* Links */}
              {channel.links && channel.links.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-3 text-blue-600">
                  {channel.links.slice(0, 6).map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline truncate max-w-xs"
                    >
                      {new URL(link).hostname.replace('www.', '')}
                    </a>
                  ))}
                </div>
              )}

              {/* Subscribe button (only if not owner) */}
              {!isOwner && (
                <button className="mt-4 bg-black text-white px-6 py-2 rounded-full w-max hover:bg-gray-800">
                  Subscribe
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="border-b border-gray-300 px-6">
            <ul className="flex gap-8 text-gray-600 font-medium text-sm">
              {['Home', 'Videos', 'Shorts', 'Live', 'Playlists', 'Community'].map((tab) => (
                <li
                  key={tab}
                  className={`cursor-pointer py-4 border-b-2 ${
                    selectedTab === tab ? 'border-black text-black font-semibold' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </li>
              ))}
              <li className="ml-auto">
                <input
                  type="search"
                  placeholder="Search"
                  className="border rounded px-2 py-1 text-sm"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    // Optional: implement video search filter here if desired
                  }}
                />
              </li>
            </ul>
          </nav>

          {/* Video Filter Buttons (only for Videos tab) */}
          {selectedTab === 'Videos' && (
            <div className="px-6 py-3 flex gap-3">
              {['Latest', 'Popular', 'Oldest'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedVideoFilter(filter)}
                  className={`rounded-full px-4 py-1 text-sm font-medium ${
                    selectedVideoFilter === filter
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}

          {/* Videos Grid */}
          <div className="px-6 py-4">
            {selectedTab === 'Videos' && (
              channelVideos.length > 0 ? (
                <VideoGrid
                  videos={channelVideos}
                  showActions={isOwner}
                  currentUser={user?.username}
                  onVideoDelete={handleDeleteVideo}
                  onVideoEdit={handleEditVideo}
                />
              ) : (
                <p>No videos uploaded yet.</p>
              )
            )}
            {/* TODO: Implement other tabs like Home, Shorts, etc. */}
          </div>

          {/* Create Video button for owner */}
          {isOwner && selectedTab === 'Videos' && (
            <div className="px-6 mb-4">
              <button
                onClick={() => navigate(`/upload?channelId=${channel._id}`)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create Video
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ChannelPage;
