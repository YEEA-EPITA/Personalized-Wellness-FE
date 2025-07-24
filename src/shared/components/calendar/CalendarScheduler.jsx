'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { registerLicense } from '@syncfusion/ej2-base';
import { useCalendarEvents } from '@/shared/hooks/useCalendarEvents';
import CalendarConfigModal from './configtab/CalendarConfigModal';
import CalendarView from './CalendarView';
import CalendarLoading from './CalendarLoading';
import CalendarError from './CalendarError';
import eventTemplate from './EventTemplate'; 
import CalendarStatsBar from './CalendarStatsBar';
import './calendar.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';
import usePlatformsStore from '@/shared/zustand/stores/usePlatformsStore';


// Register the license key from environment variable
if (process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY) {
  registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY);
  console.log('✅ Syncfusion license registered');
} else {
  console.warn('⚠️ Syncfusion license key not found - some features may be limited');
}

const CalendarScheduler = () => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [currentViewDates, setCurrentViewDates] = useState(() => {
    // Initialize with the calendar's selected date (July 10, 2025)
    const selectedDate = new Date(2024,1,1); // This matches the calendar's selectedDate
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    return {
      startDate: startOfMonth.toLocaleDateString('sv-SE').split('T')[0],
      endDate: endOfMonth.toLocaleDateString('sv-SE').split('T')[0]
    };
  });  


  console.log('🔄 Initial currentViewDates:', currentViewDates);
  const [calendarConfig, setCalendarConfig] = useState(() => {
    // Try to load from localStorage on initial load
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem('calendarConfig');
      console.log('🔄 Loaded calendarConfig from localStorage:', savedConfig);
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          // Remove startDate and endDate from saved config to use dynamic dates
          const { startDate, endDate, ...cleanConfig } = parsedConfig;
          console.log('🔄 Loaded cleaned:=1710=', currentViewDates);
          return cleanConfig;
        } catch (e) {
          console.error('No saved calendar config:', e);
        }
      }
    }
    console.log('-----1710---??',currentViewDates)
    return {
      jira: {
        jiraEmail: null,
        jiraProjects: [],
        startDate: `${currentViewDates.startDate}T00:00:00.000+0100`,
        endDate: `${currentViewDates.endDate}T23:59:59.000+0100`
      },
      trello: {
        trelloEmail: '',
        trelloBoards: [],
        trelloLists: [],
      },
      google: { selections: [] }, // Support new Google config structure
      email: { account: null, filters: {} }, // Support email config
    };
  });

  const {
    events,
    loading,
    error,
    refreshEvents
  } = useCalendarEvents(calendarConfig,
  currentViewDates.startDate,
  currentViewDates.endDate);


  const handleConfigSave = (newConfig) => {
    console.log('📥 CalendarScheduler: Received new config from modal:', newConfig);
    console.log('📧 Email config in new config:', newConfig.email);
    
    console.log('📊 Trello card emmy', newConfig.trello);

    // Convert new config structure to legacy format for compatibility
    const convertedConfig = {
      // Extract Jira info from selections for backward compatibility
      jiraEmail: newConfig.jira?.selections?.[0]?.account || '',
      jiraProjects: newConfig.jira?.selections?.map(s => s.project?.key).filter(Boolean) || [],
      
      // Extract Trello info from selections for backward compatibility  
      trelloEmail: newConfig.trello?.selections?.[0]?.account || '',
      trelloLists: newConfig.trello?.selections.map(sel => sel.list.id),
      
      // Keep both new and legacy structures
      jira: newConfig.jira || { selections: [] },
      trello: newConfig.trello || { selections: [] },
      google: newConfig.google || { selections: [] },
      email: newConfig.email || { account: null, filters: {} }, // Include email config
      
      // Preserve other settings
      // startDate: calendarConfig.startDate,
      // endDate: calendarConfig.endDate,
      // defaultView: calendarConfig.defaultView,
      // refreshInterval: calendarConfig.refreshInterval,
      // showWeekends: calendarConfig.showWeekends,
      // workingHours: calendarConfig.workingHours
    };

    console.log('📊 Trello card emmy', newConfig.trello);

    console.log('🔄 Converted config for storage:', convertedConfig);

    setCalendarConfig(convertedConfig);
    // Save to localStorage
    localStorage.setItem('calendarConfig', JSON.stringify(convertedConfig));
    console.log('💾 Calendar configuration saved to localStorage',convertedConfig);
    
    // Force refresh events after config save
    // setTimeout(() => {
    //   console.log('🚀 Calling refreshEvents() to trigger Jira/Trello/Google API calls');
    //   refreshEvents();
    // }, 100); // Small delay to ensure state is updated
  };

  // Enhanced cell click handler to get comprehensive day information
  const handleCellClick = (args) => {
    
    // Handle Syncfusion ScheduleComponent cell click event
    let clickedDate;
    if (args.startTime) {
      clickedDate = new Date(args.startTime);
    } else if (args instanceof Date) {
      clickedDate = args;
    } else {
      console.warn('Unable to determine clicked date from args:', args);
      return;
    }
    
  };
  useEffect(() => {
    console.log('✅ View dates updated:', currentViewDates);
  }, [currentViewDates]);

  useEffect(() => {
    console.log('⚠️ calendarConfig changed:', calendarConfig);
  }, [calendarConfig]);



  if (loading) {
      return <CalendarLoading />;
  }

  if (error) {
    return <CalendarError error={error} />;
  }

  return (
    <div>
      <CalendarStatsBar
        events={events}
        onConfigureClick={() => setIsConfigModalOpen(true)}
        onRefreshClick={refreshEvents}
      />


      <CalendarView
        events={events}
        currentViewDates={currentViewDates}
        setCurrentViewDates={setCurrentViewDates}
        onCellClick={handleCellClick}
        eventTemplate={eventTemplate}
        onScheduleReady={(instance) => {
          console.log("📤 Got schedule instance from child:", instance);
        }}
      />

      <CalendarConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleConfigSave}
        currentConfig={calendarConfig}
      />
    </div>
  );

};

export default CalendarScheduler;
