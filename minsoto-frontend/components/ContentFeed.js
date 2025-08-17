// components/ContentFeed.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../lib/api';

const ContentFeed = ({ feedType = 'global' }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const { user } = useAuth();

    useEffect(() => {
        fetchPosts();
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

    const handleLike = async (postId) => {
        try {
            await apiClient.post(`/content/posts/${postId}/like/`);
            fetchPosts(); // Refresh posts
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    if (loading) return <div>Loading feed...</div>;

    return (
        <div className="space-y-6">
            {/* Feed Filters */}
            <div className="flex space-x-4 border-b pb-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    All Posts
                </button>
                <button
                    onClick={() => setFilter('progress')}
                    className={`px-4 py-2 rounded ${filter === 'progress' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Progress Updates
                </button>
                <button
                    onClick={() => setFilter('achievements')}
                    className={`px-4 py-2 rounded ${filter === 'achievements' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Achievements
                </button>
            </div>

            {/* Posts */}
            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-lg border p-6">
                        {/* Post Header */}
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                src={post.author.profile?.profile_picture_url || '/default-avatar.png'}
                                alt={post.author.username}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <h4 className="font-medium">{post.author.username}</h4>
                                <p className="text-sm text-gray-500">
                                    {new Date(post.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="ml-auto">
                                <span className={`px-2 py-1 rounded text-xs ${
                                    post.post_type === 'progress' ? 'bg-blue-100 text-blue-800' :
                                    post.post_type === 'achievement' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {post.post_type}
                                </span>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                            <p className="text-gray-800">{post.content}</p>
                            {post.image_url && (
                                <img
                                    src={post.image_url}
                                    alt="Post image"
                                    className="mt-3 rounded-lg max-w-full h-auto"
                                />
                            )}
                        </div>

                        {/* Post Interests */}
                        {post.interests.length > 0 && (
                            <div className="mb-4">
                                {post.interests.map(interest => (
                                    <span
                                        key={interest.id}
                                        className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs mr-1"
                                    >
                                        {interest.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Post Actions */}
                        <div className="flex items-center space-x-4 pt-4 border-t">
                            <button
                                onClick={() => handleLike(post.id)}
                                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                            >
                                <span>👍</span>
                                <span>{post.likes_count || 0}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                                <span>💬</span>
                                <span>{post.comments_count || 0}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContentFeed;
