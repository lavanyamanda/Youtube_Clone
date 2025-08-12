import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CommentList from '../components/CommentList';
import Header from '../components/Header';
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";

function VideoPlayer({ currentUser = "guest" }) {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchVideo() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8080/api/videos/${videoId}`);
        if (!res.ok) throw new Error('Video not found');
        const data = await res.json();
        setVideo(data);
        setLikes(data.likes || 0);
        setDislikes(data.dislikes || 0);

        const suggestedRes = await fetch(`http://localhost:8080/api/videos`);
        if (!suggestedRes.ok) throw new Error('Failed to load suggested videos');
        let suggested = await suggestedRes.json();
        suggested = suggested.filter(v => v._id !== videoId).sort(() => Math.random() - 0.5).slice(0, 6);
        setSuggestedVideos(suggested);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchComments() {
      try {
        const res = await fetch(`http://localhost:8080/api/comments/${videoId}`);
        if (!res.ok) throw new Error('Failed to load comments');
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchVideo();
    fetchComments();
  }, [videoId]);

  if (loading) return <p className="p-4">Loading video...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!video) return <p className="p-4 text-red-600">Video not found.</p>;

  const isOwner = currentUser && currentUser === video.uploader?.username;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      const res = await fetch(`http://localhost:8080/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete video');

      alert('Video deleted successfully');
      navigate('/'); // Redirect to home page after deletion
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = () => {
    navigate(`/video/edit/${videoId}`); //Redirect to video page
  };

  return (
    <>
      <Header />
      <div className="p-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="w-full aspect-video bg-black mb-4">
            <video src={video.videoUrl} controlsclassName="w-full h-full object-contain" poster={video.thumbnailUrl} />
          </div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold mb-1">{video.title}</h2>
            
              <div className="flex space-x-2">
                <button onClick={handleEdit} className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
                <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded"> Delete</button>
              </div>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
          </p>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium">Channel: {video.uploader?.username || 'Unknown'}</p>
            <div className="space-x-2">
              <button onClick={() => setLikes(likes + 1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"> 
               <BiSolidLike /> {likes}
              </button>
              <button onClick={() => setDislikes(dislikes + 1)}className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"  >
                <BiSolidDislike /> {dislikes}
              </button>
            </div>
          </div>

          <p className="mb-6 text-sm">{video.description}</p>

          <CommentList
            comments={comments}
            setComments={setComments}
            videoId={videoId}
            currentUser={currentUser}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Suggested Videos</h3>
          {suggestedVideos.map((vid) => (
            <div
              key={vid._id}
              className="flex space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => navigate(`/video/${vid._id}`)}
            >
              <img src={vid.thumbnailUrl} alt={vid.title} className="w-32 h-20 object-cover rounded" />
              <div>
                <p className="font-medium text-sm">{vid.title}</p>
                <p className="text-xs text-gray-500">{vid.uploader?.username || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{vid.views} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default VideoPlayer;
