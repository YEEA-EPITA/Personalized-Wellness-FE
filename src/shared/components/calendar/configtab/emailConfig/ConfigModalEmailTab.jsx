import React, { useState, useCallback, useEffect } from 'react';
import { postRequest } from '@/shared/utils/requests';
import { SERVERS } from '@/shared/constants/general';

const ConfigModalEmailTab = ({ config, setConfig, googleAccounts, googleAccountsLoading, googleAccountsError }) => {
  const [selectedEmailAccount, setSelectedEmailAccount] = useState(null);
  const [emailEvents, setEmailEvents] = useState([]);
  const [emailEventsLoading, setEmailEventsLoading] = useState(false);
  const [emailEventsError, setEmailEventsError] = useState(null);
  const [emailFilters, setEmailFilters] = useState({
    startTime: '',
    endTime: ''
  });
  const [emailEventColor, setEmailEventColor] = useState('#9b59b6'); // Default purple color

  // Filter accounts to show Google and Outlook accounts
  const safeGoogleAccounts = Array.isArray(googleAccounts) ? googleAccounts : [];
  const filteredEmailAccounts = safeGoogleAccounts.filter(account => 
    account.type === 'GOOGLE' || account.type === 'OUTLOOK'
  );

  // Initialize date filters to current month
  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setEmailFilters({
      startTime: startOfMonth.toISOString().split('T')[0] + 'T00:00:00.000Z',
      endTime: endOfMonth.toISOString().split('T')[0] + 'T23:59:59.999Z'
    });
  }, []);

  // Fetch emails from API based on account type and filters
  const fetchEmails = useCallback(async (account) => {
    if (!emailFilters.startTime || !emailFilters.endTime) {
      console.warn('⚠️ Email filters not set, skipping fetch');
      return;
    }

    console.log('📧 Fetching emails for:', account.email, 'Type:', account.type);
    setEmailEventsLoading(true);
    setEmailEventsError(null);

    try {
      let endpoint = '';
      let payload = {};

      if (account.type === 'GOOGLE') {
        // For Google emails
        endpoint = '/email/events/filter';
        payload = {
          emails: [account.email],
          startTime: emailFilters.startTime,
          endTime: emailFilters.endTime
        };
      } else if (account.type === 'OUTLOOK') {
        // For Outlook emails
        endpoint = '/outlook/events/filter';
        payload = {
          emails: [account.email],
          startTime: emailFilters.startTime,
          endTime: emailFilters.endTime
        };
      } else {
        throw new Error(`Unsupported email account type: ${account.type}`);
      }

      console.log('📡 Making email API call:', { endpoint, payload, server: SERVERS.node.value });
      console.log('📡 Full API URL will be constructed by postRequest');
      
      const response = await postRequest({ server: SERVERS.node.value })({
        endpoint,
        payload
      });

      console.log('✅ Email response received:', response);
      console.log('✅ Email response status:', response.status);
      console.log('✅ Email response data:', response.data);
      console.log('📧 Raw response structure:', Object.keys(response.data));
      
      // Transform emails to calendar events format
      const emails = response.data.body || response.data || [];
      console.log('📧 Extracted emails:', emails);
      console.log('📧 Is emails array?', Array.isArray(emails));
      
      const transformedEvents = transformEmailsToEvents(emails, account);
      
      console.log('📅 Transformed email events:', transformedEvents);
      setEmailEvents(transformedEvents);

    } catch (error) {
      console.error('❌ Error fetching emails:', error);
      setEmailEventsError(error.message);
      setEmailEvents([]);
    } finally {
      setEmailEventsLoading(false);
    }
  }, [emailFilters.startTime, emailFilters.endTime]);

  // Transform emails to calendar events format
  const transformEmailsToEvents = (emails, account) => {
    console.log('🔄 transformEmailsToEvents called with:', { emailsCount: emails?.length, accountType: account?.type });
    
    if (!Array.isArray(emails)) {
      console.warn('⚠️ Emails is not an array:', emails);
      return [];
    }

    const transformedEvents = emails.map((email, index) => {
      console.log(`🔄 Transforming email ${index + 1}:`, email);
      
      // Extract date from email (this depends on your API response structure)
      const emailDate = email.receivedDateTime || email.createdDateTime || email.sentDateTime || new Date().toISOString();
      
      const event = {
        Id: `email-${account.email}-${index}`,
        Subject: `📧 ${email.subject || 'No Subject'}`,
        StartTime: new Date(emailDate),
        EndTime: new Date(new Date(emailDate).getTime() + 60 * 60 * 1000), // 1 hour duration
        Description: `From: ${email.from?.emailAddress?.address || email.sender?.emailAddress?.address || 'Unknown'}\n\nPreview: ${email.bodyPreview || email.body?.content?.substring(0, 100) || 'No content'}`,
        CategoryColor: account.type === 'GOOGLE' ? '#4285f4' : '#0078d4', // Google blue or Outlook blue
        IsAllDay: false,
        Location: '',
        RecurrenceRule: null,
        metadata: {
          type: 'email',
          platform: account.type,
          account: account.email,
          originalEmail: email
        }
      };
      
      console.log(`✅ Transformed event ${index + 1}:`, event);
      return event;
    });

    console.log('🔄 Total transformed events:', transformedEvents.length);
    return transformedEvents;
  };

  // Update config when account changes (store account and filters for later API calls)
  const updateEmailConfig = useCallback((account, events) => {
    console.log('📧 Updating email config with:', { account: account.email, filters: emailFilters });
    
    setConfig(prev => {
      const newConfig = {
        ...prev,
        email: {
          account: account,
          filters: emailFilters
        }
      };
      
      console.log('📧 New email config set:', newConfig.email);
      return newConfig;
    });
  }, [setConfig, emailFilters]);

  // Handle account selection - just store the account and ready state
  const handleEmailAccountSelect = useCallback(async (account) => {
    console.log('🎯 Email account selected:', account.email, 'Type:', account.type);
    setSelectedEmailAccount(account);
    
    // Update config with selected account and filters
    updateEmailConfig(account, []);
  }, [updateEmailConfig]);

  // Handle filter changes
  const handleFilterChange = useCallback((field, value) => {
    setEmailFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle applying filters
  const handleApplyFilters = useCallback(async () => {
    console.log('🔥 handleApplyFilters called!');
    console.log('🔥 selectedEmailAccount:', selectedEmailAccount);
    console.log('🔥 emailFilters:', emailFilters);
    
    if (selectedEmailAccount) {
      console.log('🔥 About to call fetchEmails...');
      await fetchEmails(selectedEmailAccount);
    } else {
      console.warn('⚠️ No email account selected');
    }
  }, [selectedEmailAccount, fetchEmails]);

  // Update config when account selection changes
  useEffect(() => {
    console.log('📧 useEffect triggered - selectedEmailAccount:', selectedEmailAccount?.email);
    console.log('📧 useEffect triggered - emailEvents length:', emailEvents.length);
    
    if (selectedEmailAccount && emailEvents.length > 0) {
      console.log('📧 Calling updateEmailConfig from useEffect');
      updateEmailConfig(selectedEmailAccount, emailEvents);
    }
  }, [selectedEmailAccount, emailEvents, updateEmailConfig]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Step 1: Select Email Account */}
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600',
          color: '#333',
          fontSize: '16px'
        }}>
          Step 1: Select Email Account
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
            Loading accounts...
          </div>
        ) : filteredEmailAccounts.length === 0 ? (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '4px',
            color: '#666',
            fontStyle: 'italic'
          }}>
            No email accounts available. Please connect a Google or Outlook account first.
          </div>
        ) : (
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            {filteredEmailAccounts.map((account, index) => (
              <div
                key={`${account.type}-${account.id || account.email}`}
                style={{
                  padding: '12px 15px',
                  borderBottom: index < filteredEmailAccounts.length - 1 ? '1px solid #eee' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  backgroundColor: selectedEmailAccount?.email === account.email ? '#e8f5e8' : 'white'
                }}
                onClick={() => handleEmailAccountSelect(account)}
                onMouseEnter={(e) => e.target.style.backgroundColor = selectedEmailAccount?.email === account.email ? '#d4edda' : '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = selectedEmailAccount?.email === account.email ? '#e8f5e8' : 'white'}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: account.type === 'GOOGLE' ? '#4285f4' : '#0078d4',
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
                    {account.name || `${account.type} Account`}
                    <span style={{ 
                      marginLeft: '8px', 
                      fontSize: '12px', 
                      backgroundColor: account.type === 'GOOGLE' ? '#4285f4' : '#0078d4', 
                      color: 'white', 
                      padding: '2px 6px', 
                      borderRadius: '3px' 
                    }}>
                      {account.type}
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

      {/* Step 2: Date Range Filters */}
      {selectedEmailAccount && (
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333',
            fontSize: '16px'
          }}>
            Step 2: Set Date Range
          </label>
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            alignItems: 'end',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #ddd'
          }}>
            <div style={{ flex: '1' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500',
                color: '#555',
                fontSize: '14px'
              }}>
                Start Date
              </label>
              <input
                type="date"
                value={emailFilters.startTime?.split('T')[0] || ''}
                onChange={(e) => handleFilterChange('startTime', e.target.value + 'T00:00:00.000Z')}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ flex: '1' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: '500',
                color: '#555',
                fontSize: '14px'
              }}>
                End Date
              </label>
              <input
                type="date"
                value={emailFilters.endTime?.split('T')[0] || ''}
                onChange={(e) => handleFilterChange('endTime', e.target.value + 'T23:59:59.999Z')}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Email Configuration Ready */}
      {selectedEmailAccount && (
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333',
            fontSize: '16px'
          }}>
            Email Configuration Ready
          </label>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '6px',
            border: '1px solid #2196f3'
          }}>
            <div style={{ 
              fontWeight: '600', 
              color: '#1976d2',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📧</span>
              {selectedEmailAccount.email} ({selectedEmailAccount.type}) configured for email events
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#1976d2', 
              marginBottom: '8px'
            }}>
              Date range: {emailFilters.startTime?.split('T')[0]} to {emailFilters.endTime?.split('T')[0]}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#1976d2', 
              fontStyle: 'italic'
            }}>
              💡 Click "Save Config" below to fetch emails and add them to your calendar
            </div>
          </div>
        </div>
      )}

      {/* Active Email Configuration Display */}
      {config?.email?.account && (
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: '#333',
            fontSize: '16px'
          }}>
            Active Email Configuration
          </label>
          <div style={{ 
            border: '1px solid #28a745',
            borderRadius: '6px',
            padding: '15px',
            backgroundColor: '#f8fff8'
          }}>
            <div style={{ fontWeight: '500', color: '#28a745', marginBottom: '8px' }}>
              📧 Email account: {config.email.account.email}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Date range: {config.email.filters?.startTime?.split('T')[0]} to {config.email.filters?.endTime?.split('T')[0]}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Platform: {config.email.account.type}
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ConfigModalEmailTab;
