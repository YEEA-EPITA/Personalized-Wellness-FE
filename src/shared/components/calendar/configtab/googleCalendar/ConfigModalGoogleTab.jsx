import React, { useState, useCallback, useEffect } from 'react';
import { useGoogleCalendars } from '@/shared/hooks/useGoogleData';
import GoogleAccountSelector from './GoogleAccountSelector';
import GoogleCurrentSelections from './GoogleCurrentSelections';
import GoogleCalendarConfirmation from './GoogleCalendarConfirmation';

const ConfigModalGoogleTab = ({ config, setConfig, googleAccounts, googleAccountsLoading, googleAccountsError }) => {
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState(null);
  
  // Set selected account based on existing config
  useEffect(() => {
    if (config.google?.selections?.length > 0 && !selectedGoogleAccount) {
      const firstSelection = config.google.selections[0];
      if (firstSelection.account) {
        console.log(`🔄 Setting selected Google account from existing config: ${firstSelection.account}`);
        setSelectedGoogleAccount(firstSelection.account);
      }
    }
  }, [config.google?.selections, selectedGoogleAccount]);

  
  // Only use calendar fetching hook, accounts are passed from parent
  const { calendars: googleCalendars, loading: calendarsLoading, fetchCalendars } = useGoogleCalendars();

  // Ensure googleAccounts is always an array and filter only Google type accounts
  const allAccounts = Array.isArray(googleAccounts) ? googleAccounts : [];
  const safeGoogleAccounts = allAccounts.filter(account => account.type === 'GOOGLE');

  
  // Additional debugging for null case
  if (googleAccounts === null) {
    console.warn('⚠️ Google Tab - googleAccounts is null!');
  } else if (googleAccounts === undefined) {
    console.warn('⚠️ Google Tab - googleAccounts is undefined!');
  }

  // Google handlers
  const handleGoogleAccountSelect = useCallback(async (accountEmail) => {
    console.log(`🎯 Google account selected: ${accountEmail}`);
    setSelectedGoogleAccount(accountEmail);
    
    // For immediate event fetching without calendar selection,
    // add a default selection to the config right away
    console.log('✨ Creating default Google selection for immediate event fetching');
    
    const defaultSelection = {
      account: accountEmail,
      calendar: { id: 'primary', name: 'Primary Calendar' }, // Use primary calendar by default
      eventTypes: ['busy', 'tentative', 'free'] // Default event types
    };
    
    // Update config immediately to trigger Google Calendar event fetching
    setConfig(prev => {
      const existingSelections = prev.google.selections.filter(s => s.account !== accountEmail);
      const newConfig = {
        ...prev,
        google: {
          selections: [...existingSelections, defaultSelection]
        }
      };
      
      console.log('🔄 Updated Google config for immediate event fetching:', newConfig.google);
      console.log('🎯 Default selection added:', defaultSelection);
      
      return newConfig;
    });
    
    // Fetch calendars for this account using real API (for future use if needed)
    if (!googleCalendars[accountEmail]) {
      console.log(`🔍 Fetching calendars for Google account: ${accountEmail}`);
      await fetchCalendars(accountEmail);
    }
  }, [googleCalendars, fetchCalendars, setConfig]);

  const handleGoogleCalendarSelect = useCallback((accountEmail, calendar) => {
    console.log('🎯 Google Calendar selected:', { accountEmail, calendar });
    
    setConfig(prev => {
      const existingSelections = prev.google.selections.filter(s => !(s.account === accountEmail && s.calendar?.id === calendar.id));
      const newSelection = {
        account: accountEmail,
        calendar: calendar,
        eventTypes: ['busy', 'tentative', 'free'] // Default event types
      };
      
      const newConfig = {
        ...prev,
        google: {
          selections: [...existingSelections, newSelection]
        }
      };
      
      console.log('🔄 Updated Google config:', newConfig.google);
      console.log('🎯 New selection added:', newSelection);
      
      return newConfig;
    });
  }, [setConfig]);

  const handleGoogleEventTypeToggle = useCallback((accountEmail, calendarId, eventType) => {
    setConfig(prev => {
      const updatedSelections = prev.google.selections.map(selection => {
        if (selection.account === accountEmail && selection.calendar?.id === calendarId) {
          const currentEventTypes = selection.eventTypes || [];
          const newEventTypes = currentEventTypes.includes(eventType)
            ? currentEventTypes.filter(et => et !== eventType)
            : [...currentEventTypes, eventType];
          
          return { ...selection, eventTypes: newEventTypes };
        }
        return selection;
      });
      
      return {
        ...prev,
        google: { selections: updatedSelections }
      };
    });
  }, [setConfig]);

  const removeGoogleSelection = useCallback((accountEmail, calendarId) => {
    console.log(`🗑️ Removing Google selection for account: ${accountEmail}`);
    
    setConfig(prev => ({
      ...prev,
      google: {
        selections: prev.google.selections.filter(s => !(s.account === accountEmail && s.calendar?.id === calendarId))
      }
    }));
    
    // Reset selected account if we're removing its selection
    if (selectedGoogleAccount === accountEmail) {
      console.log(`🔄 Resetting selected Google account`);
      setSelectedGoogleAccount(null);
    }
  }, [setConfig, selectedGoogleAccount]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <GoogleAccountSelector
        safeGoogleAccounts={safeGoogleAccounts}
        selectedGoogleAccount={selectedGoogleAccount}
        handleGoogleAccountSelect={handleGoogleAccountSelect}
        googleAccountsLoading={googleAccountsLoading}
        googleAccountsError={googleAccountsError}
      />

      <GoogleCalendarConfirmation selectedGoogleAccount={selectedGoogleAccount} />

      <GoogleCurrentSelections
        config={config}
        removeGoogleSelection={removeGoogleSelection}
        handleGoogleEventTypeToggle={handleGoogleEventTypeToggle}
      />
    </div>
  );
};

export default ConfigModalGoogleTab;
