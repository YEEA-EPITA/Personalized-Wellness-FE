// components/JiraSelectionList.jsx
import React from 'react';

const JiraSelectionList = ({ config, removeJiraSelectionByIndex, handleJiraStatusToggle }) => {
  const allSelections = config?.jira?.selections || [];
  
  // Only show complete selections (must have both account and project)
  const completeSelections = allSelections.filter(selection => 
    selection.account && selection.project && selection.project.id
  );

  if (completeSelections.length === 0) return null;

  return (
    <div>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600',
        color: '#333',
        fontSize: '16px'
      }}>
        Current Selections
      </label>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {completeSelections.map((selection, index) => {
          // Find the original index in allSelections for removal
          const originalIndex = allSelections.findIndex(s => 
            s.account === selection.account && 
            s.project?.id === selection.project?.id
          );
          
          return (
          <div
            key={`${selection.account}-${selection.project?.id}`}
            style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '15px',
              backgroundColor: '#f8f9fa'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '10px'
              }}
            >
              <div>
                <div style={{ fontWeight: '600', color: '#333' }}>
                  {selection.account} → {selection.project?.name}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Project Key: {selection.project?.key}
                </div>
              </div>

              <button
                onClick={() => removeJiraSelectionByIndex(originalIndex)}
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
                title="Remove this selection"
              >
                ×
              </button>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#333',
                  fontSize: '14px'
                }}
              >
                Select Status:
              </label>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['To Do', 'In Progress', 'Done'].map((status) => (
                  <label
                    key={status}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      backgroundColor: (selection.status || []).includes(status)
                        ? '#e8f5e8'
                        : 'white'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={(selection.status || []).includes(status)}
                      onChange={() =>
                        handleJiraStatusToggle(
                          selection.account,
                          selection.project?.id,
                          status
                        )
                      }
                      style={{ margin: 0 }}
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default JiraSelectionList;
