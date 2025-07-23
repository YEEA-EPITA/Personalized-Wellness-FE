import React, { useState, useCallback } from 'react';
import { useGoogleAccounts } from '@/shared/hooks/useGoogleData';
import ConfigModalJiraTab from './jira/ConfigModalJiraTab';
import ConfigModalTrelloTab from './trello/ConfigModalTrelloTab';
import ConfigModalGoogleTab from './googleCalendar/ConfigModalGoogleTab';
import ConfigModalEmailTab from './emailConfig/ConfigModalEmailTab';
import CalendarConfigHeader from './CalendarConfigHeader';
const CalendarConfigModal = ({ isOpen, onClose, onSave, currentConfig }) => {
  // Fetch Google accounts once for all tabs
  const { accounts: googleAccounts, loading: googleAccountsLoading, error: googleAccountsError } = useGoogleAccounts();
  
  // Debug logging for main modal
  console.log('🏠 Main Modal - Google accounts hook results:');
  console.log('  accounts:', googleAccounts);
  console.log('  loading:', googleAccountsLoading);
  console.log('  error:', googleAccountsError);
  console.log('  Type of accounts:', typeof googleAccounts);
  console.log('  Is array:', Array.isArray(googleAccounts));
  
  const [config, setConfig] = useState(() => {
    const defaultConfig = {
      jira: {
        selections: [] // Array of { account, project, status }
      },
      trello: {
        selections: [] // Array of { account, board, list }
      },
      google: {
        selections: [] // Array of { account, calendar, eventTypes }
      },
      email: {
        account: null, // Selected email account
        filters: {} // Date filters used
      }
    };

    if (currentConfig) {
      // Handle legacy format conversion
      const jiraSelections = [];
      const trelloSelections = [];

      // Convert legacy jiraEmail array to new format
      if (currentConfig.jiraEmail) {
        const emails = Array.isArray(currentConfig.jiraEmail) ? currentConfig.jiraEmail : [currentConfig.jiraEmail];
        emails.forEach(email => {
          jiraSelections.push({ 
            account: email, 
            project: null, 
            status: [] 
          });
        });
      }

      // Convert legacy trelloEmail array to new format
      if (currentConfig.trelloEmail) {
        const emails = Array.isArray(currentConfig.trelloEmail) ? currentConfig.trelloEmail : [currentConfig.trelloEmail];
        emails.forEach(email => {
          trelloSelections.push({ 
            account: email, 
            board: null, 
            list: [] 
          });
        });
      }

      return {
        ...defaultConfig,
        jira: { selections: jiraSelections },
        trello: { selections: trelloSelections },
        google: { selections: currentConfig.google?.selections || [] },
        email: { 
          account: currentConfig.email?.account || null,
          filters: currentConfig.email?.filters || {}
        }
      };
    }

    return defaultConfig;
  });

  const [selectedPlatform, setSelectedPlatform] = useState('jira'); // 'jira', 'trello', 'google', 'email'

  const handlePlatformChange = useCallback((platform) => {
    setSelectedPlatform(platform);
  }, []);

  const handleSave = useCallback(() => {
    onSave(config);
    onClose();
  }, [config, onSave, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          width: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <CalendarConfigHeader onClose={onClose} />

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Platform Tabs */}
            <div>
              <div style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '16px' }}>
                <button
                  onClick={() => handlePlatformChange('jira')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderBottom: selectedPlatform === 'jira' ? '2px solid #007bff' : '2px solid transparent',
                    backgroundColor: 'transparent',
                    color: selectedPlatform === 'jira' ? '#007bff' : '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: selectedPlatform === 'jira' ? '600' : '400'
                  }}
                >
                  Jira
                </button>
                <button
                  onClick={() => handlePlatformChange('trello')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderBottom: selectedPlatform === 'trello' ? '2px solid #007bff' : '2px solid transparent',
                    backgroundColor: 'transparent',
                    color: selectedPlatform === 'trello' ? '#007bff' : '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: selectedPlatform === 'trello' ? '600' : '400'
                  }}
                >
                  Trello
                </button>
                <button
                  onClick={() => handlePlatformChange('google')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderBottom: selectedPlatform === 'google' ? '2px solid #007bff' : '2px solid transparent',
                    backgroundColor: 'transparent',
                    color: selectedPlatform === 'google' ? '#007bff' : '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: selectedPlatform === 'google' ? '600' : '400'
                  }}
                >
                  Google
                </button>
                <button
                  onClick={() => handlePlatformChange('email')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderBottom: selectedPlatform === 'email' ? '2px solid #007bff' : '2px solid transparent',
                    backgroundColor: 'transparent',
                    color: selectedPlatform === 'email' ? '#007bff' : '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: selectedPlatform === 'email' ? '600' : '400'
                  }}
                >
                  📧 Email
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {selectedPlatform === 'jira' && (
              <ConfigModalJiraTab 
                config={config} 
                setConfig={setConfig} 
                googleAccounts={googleAccounts}
                googleAccountsLoading={googleAccountsLoading}
                googleAccountsError={googleAccountsError}
              />
            )}

            {selectedPlatform === 'trello' && (
              <ConfigModalTrelloTab 
                config={config} 
                setConfig={setConfig} 
                googleAccounts={googleAccounts}
                googleAccountsLoading={googleAccountsLoading}
                googleAccountsError={googleAccountsError}
              />
            )}

            {selectedPlatform === 'google' && (
              <ConfigModalGoogleTab 
                config={config} 
                setConfig={setConfig} 
                googleAccounts={googleAccounts}
                googleAccountsLoading={googleAccountsLoading}
                googleAccountsError={googleAccountsError}
              />
            )}

            {selectedPlatform === 'email' && (
              <ConfigModalEmailTab 
                config={config} 
                setConfig={setConfig} 
                googleAccounts={googleAccounts}
                googleAccountsLoading={googleAccountsLoading}
                googleAccountsError={googleAccountsError}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '15px',
            borderTop: '1px solid #eee'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                color: '#666',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              Cancel
            </button>
            {/* Only show Save button when at least one selection is complete */}
            {(config.jira.selections.length > 0 || 
              config.trello.selections.length > 0 || 
              config.google.selections.length > 0 || 
              (config.email?.account)) && (
              <button
                onClick={handleSave}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
              >
                Save Configuration
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarConfigModal;