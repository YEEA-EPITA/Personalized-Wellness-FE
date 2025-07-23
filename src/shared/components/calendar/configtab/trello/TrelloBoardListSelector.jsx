// components/TrelloBoardListSelector.jsx
import React from 'react';

const TrelloBoardListSelector = ({
  selectedTrelloAccount,
  trelloBoards,
  trelloBoardsLoading,
  trelloBoardsError,
  isListSelected,
  handleTrelloBoardListSelect
}) => {
  if (!selectedTrelloAccount || !trelloBoards || trelloBoards.length === 0) return null;

  return (
    <div>
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#333',
        fontSize: '16px'
      }}>
        Step 2: Select Boards and Lists
      </label>

      {trelloBoardsLoading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          color: '#666'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '10px'
          }}></div>
          Loading boards and lists...
        </div>
      ) : trelloBoardsError ? (
        <div style={{
          padding: '15px',
          backgroundColor: '#fff3cd',
          borderRadius: '4px',
          color: '#856404',
          border: '1px solid #ffeaa7'
        }}>
          Error loading boards: {trelloBoardsError}
        </div>
      ) : trelloBoards.length === 0 ? (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          No boards found for this account.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {trelloBoards.map((board) => (
            <div key={board.id} style={{
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '15px',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{
                fontWeight: '600',
                marginBottom: '10px',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#0079bf',
                  borderRadius: '2px',
                  display: 'inline-block'
                }}></span>
                {board.name}
                {board.error && (
                  <span style={{
                    fontSize: '11px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '3px'
                  }}>
                    Error loading lists
                  </span>
                )}
              </div>

              {board.lists && board.lists.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '8px',
                  marginTop: '10px'
                }}>
                  {board.lists.map((list) => {
                    const isSelected = isListSelected(selectedTrelloAccount, board, list);
                    return (
                      <div
                        key={list.id}
                        style={{
                          padding: '8px 12px',
                          border: `2px solid ${isSelected ? '#28a745' : '#ddd'}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#d4edda' : 'white',
                          fontSize: '13px',
                          fontWeight: isSelected ? '500' : 'normal',
                          color: isSelected ? '#155724' : '#333',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleTrelloBoardListSelect(selectedTrelloAccount, board, list)}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.target.style.backgroundColor = '#e9ecef';
                            e.target.style.borderColor = '#adb5bd';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.borderColor = '#ddd';
                          }
                        }}
                      >
                        {isSelected && '✓ '}{list.name}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{
                  color: '#666',
                  fontStyle: 'italic',
                  fontSize: '13px',
                  marginTop: '5px'
                }}>
                  No lists available for this board
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrelloBoardListSelector;
