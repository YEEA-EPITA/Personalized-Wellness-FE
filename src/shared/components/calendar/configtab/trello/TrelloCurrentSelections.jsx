// components/TrelloCurrentSelections.jsx
import React from 'react';

const TrelloCurrentSelections = ({ config }) => {
  const selections = config?.trello?.selections || [];
  
  // Only show complete selections (must have both board and list)
  const completeSelections = selections.filter(selection => 
    selection.board && selection.list && 
    selection.board.id && selection.list.id
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
        Current Selections ({completeSelections.length})
      </label>
      <div style={{
        border: '1px solid #28a745',
        borderRadius: '6px',
        padding: '15px',
        backgroundColor: '#f8fff8'
      }}>
        {completeSelections.map((selection, index) => (
          <div key={`${selection.board?.id}-${selection.list?.id}`} style={{
            padding: '8px',
            marginBottom: index < completeSelections.length - 1 ? '8px' : '0',
            borderBottom: index < completeSelections.length - 1 ? '1px solid #e0e0e0' : 'none',
            fontSize: '13px'
          }}>
            <div style={{ fontWeight: '500', color: '#28a745' }}>
              📋 {selection.board?.name}
            </div>
            <div style={{ color: '#666', marginLeft: '16px' }}>
              📝 {selection.list?.name}
            </div>
            <div style={{ color: '#999', fontSize: '11px', marginLeft: '16px', marginTop: '2px' }}>
              Account: {selection.account}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrelloCurrentSelections;
