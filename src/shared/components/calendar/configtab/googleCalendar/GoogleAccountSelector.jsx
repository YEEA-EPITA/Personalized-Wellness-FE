import React from 'react';

const GoogleAccountSelector = ({
  safeGoogleAccounts = [],
  selectedGoogleAccount,
  handleGoogleAccountSelect,
  googleAccountsLoading,
  googleAccountsError
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
        Select Google Account
      </label>

      {googleAccountsLoading ? (
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
          Loading Google accounts...
        </div>
      ) : googleAccountsError ? (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8d7da', 
          borderRadius: '4px',
          color: '#721c24',
          border: '1px solid #f5c6cb'
        }}>
          Error: {googleAccountsError}
        </div>
      ) : safeGoogleAccounts.length === 0 ? (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          No Google accounts available. Please connect a Google account first.
        </div>
      ) : (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '4px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {safeGoogleAccounts.map((account, index) => (
            <div
              key={account.id || account.email}
              style={{
                padding: '12px 15px',
                borderBottom: index < safeGoogleAccounts.length - 1 ? '1px solid #eee' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                backgroundColor: selectedGoogleAccount === account.email ? '#e8f5e8' : 'white'
              }}
              onClick={() => handleGoogleAccountSelect(account.email)}
              onMouseEnter={(e) => e.target.style.backgroundColor = selectedGoogleAccount === account.email ? '#d4edda' : '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = selectedGoogleAccount === account.email ? '#e8f5e8' : 'white'}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#4285f4',
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
                  {account.name || 'Google Account'}
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

export default GoogleAccountSelector;
