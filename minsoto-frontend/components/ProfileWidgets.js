import { useState } from 'react';

const ProfileWidgets = ({ profile, isOwner = false, onLayoutChange }) => {
  // Simple fallback implementation until we add react-grid-layout
  const [widgets, setWidgets] = useState([
    { id: 'bio', type: 'bio', title: 'About Me' },
    { id: 'connections', type: 'connections', title: 'Connections' },
    { id: 'recent-activity', type: 'activity', title: 'Recent Activity' }
  ]);

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'bio':
        return (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-bold mb-3">{widget.title}</h3>
            <p className="text-gray-700">
              {profile.bio || 'No bio yet. Tell the world about yourself!'}
            </p>
            {isOwner && (
              <button className="mt-3 text-blue-500 hover:text-blue-700 text-sm">
                Edit Bio
              </button>
            )}
          </div>
        );
      
      case 'connections':
        return (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-bold mb-3">{widget.title}</h3>
            <p className="text-gray-500">
              Connection list will be displayed here.
            </p>
          </div>
        );
      
      case 'activity':
        return (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-bold mb-3">{widget.title}</h3>
            <p className="text-gray-500">
              Recent posts and activities will be shown here.
            </p>
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <p>Unknown widget: {widget.type}</p>
          </div>
        );
    }
  };

  return (
    <div 
      style={{ backgroundColor: profile.theme_color || '#f9fafb' }}
      className="min-h-screen p-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {widgets.slice(0, 2).map(widget => (
              <div key={widget.id}>
                {renderWidget(widget)}
              </div>
            ))}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {widgets.slice(2).map(widget => (
              <div key={widget.id}>
                {renderWidget(widget)}
              </div>
            ))}
            
            {/* Customization Panel (Owner Only) */}
            {isOwner && (
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">Customize Profile</h4>
                <p className="text-blue-600 text-sm mb-3">
                  Advanced grid layout coming soon!
                </p>
                <button className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600">
                  ⚙️ Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileWidgets;
