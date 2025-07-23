// components/JiraAccountList.jsx
import React from 'react';

const JiraAccountList = ({
  allAccounts,
  allAccountsLoading,
  selectedJiraAccount,
  handleJiraAccountSelect
}) => {
  return (
    <div>
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#333',
        fontSize: '16px'
      }}>
        Step 1: Select Jira Account
      </label>

      {allAccountsLoading ? (
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
          Loading accounts...
        </div>
      ) : allAccounts.length === 0 ? (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          No Jira accounts available. Please connect a Jira account first.
        </div>
      ) : (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '4px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {allAccounts.map((account, index) => (
            <div
              key={`${account.type}-${account.id || account.email}`}
              style={{
                padding: '12px 15px',
                borderBottom: index < allAccounts.length - 1 ? '1px solid #eee' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                backgroundColor: selectedJiraAccount === account.email ? '#e8f5e8' : 'white'
              }}
              onClick={() => handleJiraAccountSelect(account.email)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  selectedJiraAccount === account.email ? '#d4edda' : '#f8f9fa')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  selectedJiraAccount === account.email ? '#e8f5e8' : 'white')
              }
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {account.name ? account.name.charAt(0).toUpperCase() : account.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: '500', color: '#333' }}>
                  {account.name || 'Jira Account'}
                  <span style={{
                    marginLeft: '8px',
                    fontSize: '12px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '3px'
                  }}>
                    Jira
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {account.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JiraAccountList;
