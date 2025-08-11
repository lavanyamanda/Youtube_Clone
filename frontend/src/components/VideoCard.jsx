function VideoCard({ video, showActions = false, onEdit, onDelete, currentUser }) {
  // currentUser is username string, uploader is an object with username
  const isOwner = currentUser && currentUser === video.uploader?.username;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-40 object-cover" />
      <div className="p-3">
        <h3 className="font-semibold text-sm">{video.title}</h3>
        <p className="text-xs text-gray-500">{video.uploader?.username || 'Unknown'}</p>
        <p className="text-xs text-gray-400">
          {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
        </p>
        {showActions && isOwner && (
          <div className="mt-2 flex space-x-2">
            <button
              onClick={() => onEdit(video._id)}
              className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(video._id)}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoCard;
