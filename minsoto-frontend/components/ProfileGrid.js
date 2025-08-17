// components/ProfileGrid.js
import { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ProfileGrid = ({ profile, isOwner = false, onLayoutChange }) => {
    const [layouts, setLayouts] = useState(profile.widget_layout || {});
    const [widgets, setWidgets] = useState(profile.active_widgets || []);

    const defaultWidgets = {
        bio: {
            id: 'bio',
            type: 'bio',
            title: 'About Me',
            content: profile.bio,
            w: 6, h: 3, x: 0, y: 0
        },
        habits: {
            id: 'habits',
            type: 'habits',
            title: 'My Habits',
            w: 3, h: 4, x: 6, y: 0
        },
        interests: {
            id: 'interests',
            type: 'interests',
            title: 'Interests',
            w: 3, h: 2, x: 9, y: 0
        },
        achievements: {
            id: 'achievements',
            type: 'achievements',
            title: 'Achievements',
            w: 6, h: 3, x: 0, y: 3
        }
    };

    const handleLayoutChange = (layout, layouts) => {
        if (isOwner) {
            setLayouts(layouts);
            onLayoutChange && onLayoutChange(layouts);
        }
    };

    const renderWidget = (widget) => {
        switch (widget.type) {
            case 'bio':
                return (
                    <div className="bg-white rounded-lg p-4 h-full border">
                        <h3 className="font-medium mb-2">{widget.title}</h3>
                        <p className="text-gray-600 text-sm">{widget.content}</p>
                    </div>
                );
            
            case 'habits':
                return (
                    <div className="bg-white rounded-lg p-4 h-full border">
                        <h3 className="font-medium mb-2">{widget.title}</h3>
                        <div className="space-y-2">
                            {/* This will be populated with actual habit data */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Reading</span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                    15 days
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Exercise</span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                    7 days
                                </span>
                            </div>
                        </div>
                    </div>
                );
            
            case 'interests':
                return (
                    <div className="bg-white rounded-lg p-4 h-full border">
                        <h3 className="font-medium mb-2">{widget.title}</h3>
                        <div className="flex flex-wrap gap-1">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                Programming
                            </span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                Fitness
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                Music
                            </span>
                        </div>
                    </div>
                );
            
            default:
                return (
                    <div className="bg-gray-100 rounded-lg p-4 h-full border">
                        <h3 className="font-medium">{widget.title}</h3>
                        <p className="text-gray-500 text-sm">Widget content</p>
                    </div>
                );
        }
    };

    return (
        <div className="w-full">
            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                onLayoutChange={handleLayoutChange}
                isDraggable={isOwner}
                isResizable={isOwner}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={60}
                margin={[16, 16]}
            >
                {widgets.map(widgetId => {
                    const widget = defaultWidgets[widgetId] || { id: widgetId, type: 'default', title: 'Unknown Widget' };
                    return (
                        <div key={widget.id} data-grid={widget}>
                            {renderWidget(widget)}
                        </div>
                    );
                })}
            </ResponsiveGridLayout>
        </div>
    );
};

export default ProfileGrid;
