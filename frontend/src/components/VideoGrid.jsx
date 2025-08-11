import VideoCard from './VideoCard';
import { useNavigate } from 'react-router-dom';

function VideoGrid({ videos, showActions = false, currentUser }) {
  const navigate = useNavigate();

  const handleEdit = (id) => alert(`Edit video ${id}`);
  const handleDelete = (id) => alert(`Delete video ${id}`);

  const handleVideoClick = (videoId) => {
    if (!showActions) navigate(`/video/${videoId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
      {videos.map((video) => (
        <div
          key={video._id}
          onClick={() => handleVideoClick(video._id)}
          className={`rounded-lg overflow-hidden transition ${
            !showActions ? 'cursor-pointer hover:shadow-lg' : ''
          }`}
        >
          <VideoCard
            video={video}
            showActions={showActions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentUser={currentUser}
          />
        </div>
      ))}
    </div>
  );
}

export default VideoGrid;
