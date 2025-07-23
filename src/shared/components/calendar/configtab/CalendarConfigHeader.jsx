import React from 'react';

const CalendarConfigHeader = ({ title = "Calendar Configuration", onClose }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: '1px solid #eee'
    }}>
      <h2 style={{
        margin: 0,
        color: '#333',
        fontSize: '20px',
        fontWeight: '600'
      }}>
        {title}
      </h2>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#666',
          padding: '0',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => e.target.style.color = '#333'}
        onMouseLeave={(e) => e.target.style.color = '#666'}
        title="Close"
      >
        ×
      </button>
    </div>
  );
};

export default CalendarConfigHeader;
