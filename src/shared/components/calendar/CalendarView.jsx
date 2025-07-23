'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  ScheduleComponent,
  Day, Week, WorkWeek, Month, Agenda, Inject
} from '@syncfusion/ej2-react-schedule';
import '@syncfusion/ej2-react-schedule/styles/material.css';
import usePlatformsStore from '@/shared/zustand/stores/usePlatformsStore';
import { useCalendarEvents } from '@/shared/hooks/useCalendarEvents';
import { shallow } from 'zustand/shallow';

const CalendarView = ({
  events,
  currentViewDates,
  setCurrentViewDates,
  onEventAction,
  onCellClick,
  eventTemplate,
  onScheduleReady
}) => {
  const scheduleRef = useRef(null);
  const scheduleObj = useRef(null);
  const [scheduleReady, setScheduleReady] = useState(false);
  const [view, setView] = useState('Week');
  const [renderCalendar, setRenderCalendar] = useState(false);
  const { calendarStarttime, calendarEndtime, setCalendarStarttime, setCalendarEndtime } = usePlatformsStore();
  console.log('time diff:', calendarStarttime, calendarEndtime, calendarEndtime - calendarStarttime);
  const getInitialView = (start, end) => {
    const diff = end - start;

    switch (true) {
      case diff === 0: // 1 day
        return 'Day';
      case diff === 518400000: // 6 days (Week view: 7 days total)
        return 'Week';
      case diff === 345600000: // 5 days (WorkWeek)
        return 'WorkWeek';
      case diff === 2937600000: // ~28-31 days
        return 'Month';
      default:
        return 'Week'; // fallback view
    }
  };

  const [currentView, setCurrentView] = useState(
    getInitialView(calendarStarttime, calendarEndtime)
  );

  const [selectedDate, setSelectedDate] = useState(calendarStarttime); // Or any initial date


  // const { events, fetchAllEvents } = useCalendarEvents(localStorage.getItem('calendarConfig') ? JSON.parse(localStorage.getItem('calendarConfig')) : {});
  const lastFetchedRange = useRef({ startDate: '', endDate: '' });

  const viewDatesRef = useRef({
    startDate: '',
    endDate: ''
  });



  const handleActionBegin = (args) => {
    console.log('Action Begin:', args);
    if (args.requestType === 'viewNavigate') {
      if (args.view && args.view !== currentView) {
        setCurrentView(args.view);
      }
    }

    if (args.requestType === 'dateNavigate') {
      if (args.currentDate) {
        setSelectedDate(args.currentDate);
      }
    }
  };


  const handleActionComplete = (args) => {
    if (
      args.requestType === 'viewNavigate' ||
      args.requestType === 'dateNavigate'
    ) {
      console.log('view: 9999', view);
      console.log('scheduleObj.current.currentView: ', scheduleObj.current?.currentView);
      if (view !== scheduleObj.current.currentView) {
        setView(scheduleObj.current.currentView);

        console.log('view: now', scheduleObj.current.currentView);
      }

      console.log('Calendar navigation detected abr--------------', currentViewDates);
      if (args.requestType === 'dateNavigate') {
        const newDate = scheduleRef.current?.selectedDate;
        if (newDate) {
          setSelectedDate(newDate);
          console.log('📆 Selected date changed to:', newDate);
        }
      }

      const viewDates = scheduleObj.current.getCurrentViewDates();
      console.log("📆 View Dates:test", viewDates);

      const startDate = viewDates[0];
      const endDate = viewDates[viewDates.length - 1];

      const newViewDates = {
        startDate: startDate.toLocaleDateString('sv-SE').split('T')[0],
        endDate: endDate.toLocaleDateString('sv-SE').split('T')[0],
      };
      setCurrentViewDates(newViewDates);

      // if (
      //   newViewDates.startDate !== currentViewDates.startDate ||
      //   newViewDates.endDate !== currentViewDates.endDate
      // ) {
      //   const alreadyFetched =
      //     newViewDates.startDate === lastFetchedRange.current.startDate &&
      //     newViewDates.endDate === lastFetchedRange.current.endDate;

      //   if (!alreadyFetched) {
      //     lastFetchedRange.current = newViewDates;

      setCalendarStarttime(new Date(newViewDates.startDate));
      setCalendarEndtime(new Date(newViewDates.endDate));

      //     refreshEvents(); // ✅ let the hook react to Zustand change
      //   }

      // }

    }
  };


  const handlePopupOpen = (args) => {
    if (args.type === 'QuickInfo' && args.data) {
      // Customize or disable popup
    }
  };

  const handleEventRendered = (args) => {
    const task = args.data;
    if (task.Status === 'Done') {
      args.element.style.opacity = '0.6';
      args.element.style.textDecoration = 'line-through';
    }
  };

  const handleCellClick = (args) => {
    onCellClick?.(args);
  };

  useEffect(() => {
    console.log('abz----------abz:', currentViewDates);
    console.log('abz----------abz:', scheduleObj?.current?.getCurrentViewDates());
  }, [currentViewDates]);

  return (
    <ScheduleComponent
      ref={scheduleObj}
      created={() => {
        console.log('📦 Schedule created')
        console.log('📦 Schedule instance:', scheduleObj.current);
      }}
      height="700px"
      // {...(!scheduleReady && { selectedDate: new Date(currentViewDates.startDate) })}
      // currentView="Week"
      // currentView={view} // ✅ Control it
      currentView={currentView}
      selectedDate={selectedDate}
      views={['Day', 'Week', 'WorkWeek', 'Month']}
      showHeaderBar={true}
      eventSettings={{
        dataSource: events,
        fields: {
          id: 'Id',
          subject: { name: 'Subject', title: 'Task Summary' },
          startTime: { name: 'StartTime', title: 'Start Time' },
          endTime: { name: 'EndTime', title: 'End Time' },
          description: { name: 'Description', title: 'Task Details' },
          location: { name: 'Location', title: 'Project' },
          isAllDay: { name: 'IsAllDay', title: 'All Day' }
        },
        template: eventTemplate
      }}
      actionBegin={handleActionBegin}
      // actionComplete={(args) => {}}
      actionComplete={handleActionComplete}
      readonly={true}
      popupOpen={handlePopupOpen}
      eventRendered={handleEventRendered}
      cellClick={handleCellClick}
    >
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
    </ScheduleComponent>
  );
};

export default CalendarView;
