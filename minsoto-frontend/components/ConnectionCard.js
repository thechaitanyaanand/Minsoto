// components/ConnectionCard.js
import Link from 'next/link';

const ConnectionCard = ({ connection }) => {
  const user = connection.user;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border">
      <div className="flex items-center space-x-3 mb-3">
        <img
          src={user.profile?.profile_picture_url || '/default-avatar.png'}
          alt={user.username}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">
            {user.first_name} {user.last_name}
          </h4>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          connection.connection_type === 'friend'
            ? 'bg-green-100 text-green-800'
            : 'bg-purple-100 text-purple-800'
        }`}>
          {connection.connection_type === 'friend' ? 'Friend' : 'Connection'}
        </span>
      </div>
      
      {user.profile?.bio && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {user.profile.bio}
        </p>
      )}
      
      {connection.interests.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Shared interests:</p>
          <div className="flex flex-wrap gap-1">
            {connection.interests.slice(0, 3).map(interest => (
              <span
                key={interest.id}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
              >
                {interest.name}
              </span>
            ))}
            {connection.interests.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">
                +{connection.interests.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="flex space-x-2">
        <Link href={`/profile/${user.username}`}>
          <a className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 text-sm">
            View Profile
          </a>
        </Link>
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Message
        </button>
      </div>
    </div>
  );
};

export default ConnectionCard;
