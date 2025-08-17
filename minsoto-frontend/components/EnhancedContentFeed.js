import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../lib/api';

const EnhancedContentFeed = ({ feedType = 'global' }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [interests, setInterests] = useState([]);
  const [newPost, setNewPost] = useState({
    content: '',
    post_type: 'text',
    visibility: 'public',
    image_url: ''
  });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
    fetchInterests();
  }, [feedType, filter]);

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        feed_type: feedType,
        filter: filter
      });
      const response = await apiClient.get(`/content/feed/?${params}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterests = async () => {
    try {
      const response = await apiClient.get('/connections/interests/');
      setInterests(response.data);
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/content/feed/', newPost);
      setNewPost({
        content: '',
        post_type: 'text',
        visibility: 'public',
        image_url: ''
      });
      setShowCreatePost(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await apiClient.post(`/content/posts/${postId}/like/`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) return <div className="animate-pulse">Loading feed...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          {interests.map(interest => (
            <button
              key={interest.id}
              onClick={() => setFilter(interest.name)}
              className={`px-4 py-2 rounded ${
                filter === interest.name ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {interest.name}
            </button>
          ))}
        </div>

        {/* Create Post Button */}
        <button
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showCreatePost ? 'Cancel' : 'Create Post'}
        </button>

        {/* Create Post Form */}
        {showCreatePost && (
          <form onSubmit={handleCreatePost} className="mt-4 space-y-4">
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              placeholder="What's on your mind?"
              className="w-full p-3 border rounded-lg"
              rows="3"
              required
            />
            
            <div className="flex gap-4">
              <select
                value={newPost.post_type}
                onChange={(e) => setNewPost({...newPost, post_type: e.target.value})}
                className="border rounded px-3 py-2"
              >
                <option value="text">Text</option>
                <option value="progress">Progress Update</option>
                <option value="achievement">Achievement</option>
              </select>
              
              <select
                value={newPost.visibility}
                onChange={(e) => setNewPost({...newPost, visibility: e.target.value})}
                className="border rounded px-3 py-2"
              >
                <option value="public">Public</option>
                <option value="connections">Connections Only</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>

            <input
              type="url"
              value={newPost.image_url}
              onChange={(e) => setNewPost({...newPost, image_url: e.target.value})}
              placeholder="Image URL (optional)"
              className="w-full p-2 border rounded"
            />

            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Post
            </button>
          </form>
        )}
      </div>

      {/* Posts */}
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            {post.author.profile?.profile_picture_url && (
              <img
                src={post.author.profile.profile_picture_url}
                alt={post.author.username}
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div>
              <h3 className="font-semibold">{post.author.username}</h3>
              <p className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
            {post.post_type !== 'text' && (
              <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {post.post_type}
              </span>
            )}
          </div>

          <p className="mb-4">{post.content}</p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt="Post content"
              className="w-full rounded mb-4"
            />
          )}

          {post.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.interests.map(interest => (
                <span
                  key={interest.id}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                >
                  {interest.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center gap-1 ${
                post.is_liked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <span>{post.is_liked ? '❤️' : '🤍'}</span>
              {post.likes_count}
            </button>
            <span>{post.comments_count} comments</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnhancedContentFeed;
