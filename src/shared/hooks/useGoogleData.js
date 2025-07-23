import { useState, useEffect, useCallback } from 'react';
import { getRequest } from "@/shared/utils/requests";
import { SERVERS } from "@/shared/constants/general";

export const useGoogleAccounts = () => {
  const [accounts, setAccounts] = useState([]); // Initialize with empty array instead of null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching Google accounts from API...');
      const response = await getRequest({ server: SERVERS.node.value })({
        endpoint: '/google/accounts'
      });
      
      console.log('✅ Google accounts API response:', response.data);
      console.log('🔧 Full response object:', response);
      console.log('📊 Response.data type:', typeof response.data);
      console.log('🎯 Response.data keys:', response.data ? Object.keys(response.data) : 'null/undefined');
      
      // Transform the API response to match our expected format
      let accountsData = [];
      
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          accountsData = response.data;
          console.log('✅ Response.data is array, using directly');
        } else if (response.data.body && response.data.body.accounts && Array.isArray(response.data.body.accounts)) {
          accountsData = response.data.body.accounts;
          console.log('✅ Using response.data.body.accounts');
        } else if (response.data.accounts && Array.isArray(response.data.accounts)) {
          accountsData = response.data.accounts;
          console.log('✅ Using response.data.accounts');
        } else if (response.data.data && Array.isArray(response.data.data)) {
          accountsData = response.data.data;
          console.log('✅ Using response.data.data');
        } else {
          console.warn('⚠️ Unexpected API response format:', response.data);
          console.warn('📝 Response structure:', JSON.stringify(response.data, null, 2));
          accountsData = [];
        }
      } else {
        console.warn('⚠️ No response or response.data is null/undefined');
        accountsData = [];
      }
      
      console.log('📋 Processed accounts data:', accountsData);
      console.log('🔢 Account count:', accountsData.length);
      console.log('🔄 Setting accounts state to:', accountsData);
      setAccounts(accountsData);
    } catch (err) {
      console.error('❌ Error fetching Google accounts:', err);
      console.error('❌ Error details:', {
        message: err.message,
        status: err.status,
        response: err.response?.data,
        stack: err.stack
      });
      setError(`Failed to fetch Google accounts: ${err.message}`);
      setAccounts([]); // Keep empty array on error
    } finally {
      setLoading(false);
      console.log('🏁 fetchAccounts completed');
    }
  }, []);

  useEffect(() => {
    console.log('🚀 useGoogleAccounts hook mounted, calling fetchAccounts...');
    fetchAccounts();
  }, [fetchAccounts]);

  // Log state changes
  useEffect(() => {
    console.log('🔄 useGoogleAccounts state changed:', { accounts, loading, error });
  }, [accounts, loading, error]);

  return {
    accounts,
    loading,
    error,
    refreshAccounts: fetchAccounts
  };
};

export const useGoogleCalendars = () => {
  const [calendars, setCalendars] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const fetchCalendars = useCallback(async (accountEmail) => {
    try {
      setLoading(prev => ({ ...prev, [accountEmail]: true }));
      setError(prev => ({ ...prev, [accountEmail]: null }));
      
      console.log(`🔍 Fetching Google calendars for account: ${accountEmail}`);
      const response = await getRequest({ server: SERVERS.node.value })({
        endpoint: `/google/calendars?account=${encodeURIComponent(accountEmail)}`
      });
      
      console.log(`✅ Google calendars API response for ${accountEmail}:`, response.data);
      
      // Transform the API response to match our expected format
      const calendarsData = response.data.calendars || response.data || [];
      setCalendars(prev => ({
        ...prev,
        [accountEmail]: calendarsData
      }));
    } catch (err) {
      console.error(`❌ Error fetching Google calendars for ${accountEmail}:`, err);
      setError(prev => ({ 
        ...prev, 
        [accountEmail]: 'Failed to fetch calendars' 
      }));
      // Set empty array as fallback
      setCalendars(prev => ({
        ...prev,
        [accountEmail]: []
      }));
    } finally {
      setLoading(prev => ({ ...prev, [accountEmail]: false }));
    }
  }, []);

  return {
    calendars,
    loading,
    error,
    fetchCalendars
  };
};

export const useOutlookAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching Outlook accounts from API...');
      const response = await getRequest({ server: SERVERS.node.value })({
        endpoint: '/outlook/accounts'
      });
      
      console.log('✅ Outlook accounts API response:', response.data);
      
      // Transform the API response to match our expected format
      const accountsData = response.data.accounts || response.data || [];
      setAccounts(accountsData);
    } catch (err) {
      console.error('❌ Error fetching Outlook accounts:', err);
      setError('Failed to fetch Outlook accounts');
      setAccounts([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    refreshAccounts: fetchAccounts
  };
};

export const useOutlookCalendars = () => {
  const [calendars, setCalendars] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const fetchCalendars = useCallback(async (accountEmail) => {
    try {
      setLoading(prev => ({ ...prev, [accountEmail]: true }));
      setError(prev => ({ ...prev, [accountEmail]: null }));
      
      console.log(`🔍 Fetching Outlook calendars for account: ${accountEmail}`);
      const response = await getRequest({ server: SERVERS.node.value })({
        endpoint: `/outlook/calendars?account=${encodeURIComponent(accountEmail)}`
      });
      
      console.log(`✅ Outlook calendars API response for ${accountEmail}:`, response.data);
      
      // Transform the API response to match our expected format
      const calendarsData = response.data.calendars || response.data || [];
      setCalendars(prev => ({
        ...prev,
        [accountEmail]: calendarsData
      }));
    } catch (err) {
      console.error(`❌ Error fetching Outlook calendars for ${accountEmail}:`, err);
      setError(prev => ({ 
        ...prev, 
        [accountEmail]: 'Failed to fetch calendars' 
      }));
      // Set empty array as fallback
      setCalendars(prev => ({
        ...prev,
        [accountEmail]: []
      }));
    } finally {
      setLoading(prev => ({ ...prev, [accountEmail]: false }));
    }
  }, []);

  return {
    calendars,
    loading,
    error,
    fetchCalendars
  };
};
