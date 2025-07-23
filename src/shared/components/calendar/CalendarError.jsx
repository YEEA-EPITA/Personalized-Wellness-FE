// components/calendar/CalendarError.jsx
import React from 'react';

const CalendarError = ({ error, onRetry }) => (
  <div style={{ 
    height: '650px', 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
    fontSize: '18px',
    color: 'red'
  }}>
    <div>Error loading calendar events: {error}</div>
    <button 
      onClick={onRetry}
      style={{ 
        marginTop: '15px', 
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      Retry Loading Events
    </button>
  </div>
);

export default CalendarError;
