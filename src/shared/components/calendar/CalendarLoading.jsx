// components/calendar/CalendarLoading.jsx
import React from 'react';

const CalendarLoading = () => (
  <div style={{ 
    height: '650px', 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
    fontSize: '18px'
  }}>
    <div>Loading calendar events...</div>
    <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.7 }}>
      Fetching from Jira, Trello, Google Calendar, and Outlook
    </div>
  </div>
);

export default CalendarLoading;
