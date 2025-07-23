import React from 'react';

const GoogleCalendarConfirmation = ({ selectedGoogleAccount }) => {
  if (!selectedGoogleAccount) return null;

  return (
    <div style={{ 
      padding: '15px', 
      backgroundColor: '#e8f5e8', 
      borderRadius: '4px',
      border: '1px solid #d4edda'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        marginBottom: '8px'
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#28a745',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          ✓
        </div>
        <span style={{ fontWeight: '600', color: '#155724' }}>
          Google Calendar Connected
        </span>
      </div>
      <div style={{ fontSize: '14px', color: '#155724', lineHeight: '1.4' }}>
        Account <strong>{selectedGoogleAccount}</strong> is now connected and fetching events from your primary calendar.
        Events will automatically appear in your calendar view.
      </div>
    </div>
  );
};

export default GoogleCalendarConfirmation;
