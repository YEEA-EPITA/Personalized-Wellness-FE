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
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={onConfigureClick}
          title="Configure Calendar"
          style={{
            padding: '12px',
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
            transition: 'all 0.2s ease-in-out',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#bbdefb';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#e3f2fd';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(25, 118, 210, 0.15)';
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: '18px' }}>⚙️</span>
        </button>
        <button 
          onClick={onRefreshClick}
          title="Refresh Events"
          style={{
            padding: '12px',
            backgroundColor: '#f1f8e9',
            color: '#388e3c',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            boxShadow: '0 2px 8px rgba(56, 142, 60, 0.15)',
            transition: 'all 0.2s ease-in-out',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#dcedc8';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(56, 142, 60, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f1f8e9';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(56, 142, 60, 0.15)';
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: '18px' }}>🔄</span>
        </button>
      </div>
    </div>
  );
};

export default CalendarStatsBar;
