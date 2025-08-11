import { useState } from 'react';

function CommentList({ comments, setComments, videoId, currentUser }) {
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return alert("Please enter comment");
    if (!userName.trim()) return alert("Please enter your name");

    try {
      const res = await fetch(`http://localhost:8080/api/comments/${videoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newComment,
          userName,
          channelName: userName
        }),
      });
      if (!res.ok) throw new Error("Failed to add comment");

      const addedComment = await res.json();
      setComments([addedComment, ...comments]);
      setNewComment('');
    } catch (err) {
      alert(err.message);
    }
  };

  // Start editing a comment
  const handleEditClick = (id, currentText) => {
    setEditId(id);
    setEditText(currentText);
  };

  // Save edited comment
  const handleSaveEdit = async () => {
    if (!editText.trim()) return alert("Comment can't be empty");

    try {
      const res = await fetch(`http://localhost:8080/api/comments/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText }),
      });
      if (!res.ok) throw new Error("Failed to update comment");

      const updatedComment = await res.json();
      setComments(comments.map(c => (c._id === editId ? updatedComment : c)));
      setEditId(null);
      setEditText('');
    } catch (err) {
      alert(err.message);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  // Delete comment
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/comments/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error("Failed to delete comment");

      setComments(comments.filter(c => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="mb-4">
      {/* Name input */}
      <input
        type="text"
        placeholder="Your name"
        className="w-full p-2 border rounded mb-2"
        value={userName}
        onChange={e => setUserName(e.target.value)}
      />

      {/* New comment input */}
      <textarea
        placeholder="Add a comment..."
        className="w-full p-2 border rounded mb-2"
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
      />

      <button
        onClick={handleAddComment}
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 mb-4"
      >
        Comment
      </button>

      <h3 className="font-semibold mb-2">Comments</h3>

      {comments.length === 0 && <p>No comments yet.</p>}

      {comments.map(comment => (
        <div key={comment._id} className="border p-3 rounded mb-2">
          <p className="text-sm text-gray-700 font-medium">{comment.userName}</p>
          <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>

          {editId === comment._id ? (
            <>
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className="w-full p-2 border rounded my-2"
              />
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 text-white px-3 py-1 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="my-2">{comment.text}</p>
              {/* Anyone can edit/delete for now */}
              <div className="flex space-x-2 text-sm text-blue-600">
                <button onClick={() => handleEditClick(comment._id, comment.text)}>Edit</button>
                <button onClick={() => handleDelete(comment._id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default CommentList;
