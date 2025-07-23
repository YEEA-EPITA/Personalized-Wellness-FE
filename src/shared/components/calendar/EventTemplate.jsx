// components/calendar/EventTemplate.jsx
import React from 'react';

const eventTemplate = (props) => {
  const getPlatformDisplay = (platform) => {
    switch (platform) {
      case 'jira':
        const statusColor = {
          'To Do': '#ff6b6b',
          'In Progress': '#4ecdc4',
          'Done': '#45b7d1',
          'Blocked': '#f9ca24'
        };
        return {
          backgroundColor: statusColor[props.Status] || '#6c5ce7',
          title: props.IssueKey,
          subtitle: props.Subject?.replace(/^\[.*?\]\s*/, '') || '',
          icon: '📋'
        };

      case 'trello':
        const listColor = {
          'To Do': '#ff6b6b',
          'Doing': '#4ecdc4',
          'Done': '#45b7d1'
        };
        return {
          backgroundColor: listColor[props.ListName] || '#0079bf',
          title: props.Subject?.replace(/^\[.*?\]\s*/, '') || '',
          subtitle: `List: ${props.ListName}`,
          icon: '📌'
        };

      case 'google':
        const eventStatusColor = {
          'confirmed': '#4285f4',
          'tentative': '#fbbc04',
          'cancelled': '#ea4335'
        };
        return {
          backgroundColor: eventStatusColor[props.Status] || '#34a853',
          title: props.Subject?.replace(/^\[.*?\]\s*/, '') || '',
          subtitle: props.Status,
          icon: '📅'
        };

      case 'outlook':
        return {
          backgroundColor: '#0078d4',
          title: props.Subject?.replace(/^\[.*?\]\s*/, '') || '',
          subtitle: props.Status || 'Event',
          icon: '📧'
        };

      default:
        return {
          backgroundColor: '#6c5ce7',
          title: props.Subject || 'Event',
          subtitle: '',
          icon: '📝'
        };
    }
  };

  const display = getPlatformDisplay(props.Platform);

  return (
    <div style={{
      padding: '2px 4px',
      backgroundColor: display.backgroundColor,
      color: 'white',
      borderRadius: '3px',
      fontSize: '11px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      gap: '2px'
    }}>
      <span style={{ fontSize: '10px' }}>{display.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 'bold', truncate: 'ellipsis', overflow: 'hidden' }}>
          {display.title}
        </div>
        {display.subtitle && (
          <div style={{ fontSize: '9px', opacity: 0.9, truncate: 'ellipsis', overflow: 'hidden' }}>
            {display.subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default eventTemplate;
