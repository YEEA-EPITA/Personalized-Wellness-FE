import React from 'react';

const CalendarStatsBar = ({ events, onConfigureClick, onRefreshClick }) => {
  return (
    <div style={{ 
      marginBottom: '15px', 
      padding: '10px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '5px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div><strong>Total Events: {events.length}</strong></div>
        <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
          <span>📋 Jira: {events.filter(e => e.Platform === 'jira').length}</span>
          <span>📌 Trello: {events.filter(e => e.Platform === 'trello').length}</span>
          <span>📅 Google: {events.filter(e => e.Platform === 'google').length}</span>
          <span>📧 Email: {events.filter(e => e.Platform === 'email').length}</span>
        </div>
        <span style={{ fontSize: '12px', opacity: 0.7 }}>
          Click on events to view details
        </span>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={onConfigureClick}
          style={{
            padding: '5px 15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ⚙️ Configure
        </button>
        <button 
          onClick={onRefreshClick}
          style={{
            padding: '5px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🔄 Refresh Events
        </button>
      </div>
    </div>
  );
};

export default CalendarStatsBar;
