import React from 'react';

const GoogleCurrentSelections = ({ config, removeGoogleSelection, handleGoogleEventTypeToggle }) => {
  if (!config?.google?.selections || config.google.selections.length === 0) return null;

  return (
    <div>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600',
        color: '#333',
        fontSize: '16px'
      }}>
        Active Google Calendar Connections ({config.google.selections.length})
      </label>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {config.google.selections.map((selection, index) => (
          <div
            key={`${selection.account}-${selection.calendar?.id}-${index}`}
            style={{
              border: '1px solid #d4edda',
              borderRadius: '4px',
              padding: '15px',
              backgroundColor: '#e8f5e8'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <div style={{
                  fontWeight: '600',
                  color: '#155724',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
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
                  </span>
                  {selection.account} → {selection.calendar?.name}
                </div>
                <div style={{ fontSize: '12px', color: '#155724', marginTop: '4px' }}>
                  Fetching events from Google Calendar
                </div>
              </div>
              <button
                onClick={() => removeGoogleSelection(selection.account, selection.calendar?.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc3545',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '0',
                  width: '20px',
                  height: '20px'
                }}
                title="Disconnect this Google account"
              >
                ×
              </button>
            </div>

            {/* Event Types Configuration */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#155724',
                fontSize: '14px'
              }}>
                Event Types to Include:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['busy', 'tentative', 'free'].map(eventType => (
                  <label
                    key={eventType}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      border: '1px solid #c3e6cb',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      backgroundColor: (selection.eventTypes || []).includes(eventType) ? '#d4edda' : 'white',
                      textTransform: 'capitalize'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={(selection.eventTypes || []).includes(eventType)}
                      onChange={() =>
                        handleGoogleEventTypeToggle(selection.account, selection.calendar?.id, eventType)
                      }
                      style={{ margin: 0 }}
                    />
                    {eventType}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleCurrentSelections;
