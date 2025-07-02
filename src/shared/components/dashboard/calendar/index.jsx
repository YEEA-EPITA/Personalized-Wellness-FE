"use client";

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getISOWeek, format, addWeeks, subWeeks } from "date-fns";

// Dynamic icon loading with fallback
let FiCalendar, FiX, FiClock, FiMail, FiTag;
try {
  const icons = require("react-icons/fi");
  FiCalendar = icons.FiCalendar;
  FiX = icons.FiX;
  FiClock = icons.FiClock;
  FiMail = icons.FiMail;
  FiTag = icons.FiTag;
} catch (e) {
  console.error("Failed to load react-icons/fi:", e);
  FiCalendar = () => <span>📅</span>;
  FiX = () => <span>✖</span>;
  FiClock = () => <span>⏰</span>;
  FiMail = () => <span>✉</span>;
  FiTag = () => <span>🏷</span>;
}

import AddTaskModal from "./components/AddTaskModal";
import SearchTasks from "./components/SearchTasks";
import styles from "./styles.module.css";

const Calendar = () => {
  const [dummyEvents, setDummyEvents] = useState([
    {
      title: "Team Standup",
      start: "2025-06-17T09:00:00",
      end: "2025-06-17T09:30:00",
      email: "defaultuser@example.com",
      type: "task",
      description: "Daily team sync meeting"
    },
    {
      title: "Project Planning",
      start: "2025-06-18T11:00:00",
      end: "2025-06-18T12:00:00",
      email: "calendar2@example.com",
      type: "task",
      description: "Planning for Q3 product roadmap"
    },
    {
      title: "UI Review",
      start: "2025-06-20T14:00:00",
      end: "2025-06-20T15:00:00",
      email: "calendar3@example.com",
      type: "task",
      description: "New dashboard design review"
    },
    {
      title: "Public Holiday",
      start: "2025-06-19T00:00:00",
      end: "2025-06-19T23:59:59",
      email: "defaultuser@example.com",
      type: "holiday",
      description: "Juneteenth National Independence Day"
    },
    {
      title: "Client Meeting (Conflict)",
      start: "2025-06-17T09:00:00",
      end: "2025-06-17T10:00:00",
      email: "calendar2@example.com",
      type: "meeting",
      description: "Quarterly review with Acme Corp"
    }
  ]);

  const calendarColors = {
    "defaultuser@example.com": "#A7F3D0",
    "calendar2@example.com": "#BFDBFE",
    "calendar3@example.com": "#FCD34D"
  };

  const allEmails = Object.keys(calendarColors);
  const [selectedEmails, setSelectedEmails] = useState(["defaultuser@example.com"]); // Only first email by default
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [weekNumber, setWeekNumber] = useState(null);
  const [currentWeekRange, setCurrentWeekRange] = useState("");
  const calendarRef = useRef(null);
  const datePickerRef = useRef(null);

  const toggleEmail = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const visibleEvents = dummyEvents.filter((event) =>
    selectedEmails.includes(event.email)
  );

  const eventContent = (arg) => {
    const bgColor = calendarColors[arg.event.extendedProps.email] || "#ccc";
    return (
      <div
        style={{
          backgroundColor: bgColor,
          padding: "6px 8px", // Increased padding for better visibility
          borderRadius: "4px",
          color: "#000",
          height: "100%",
          overflow: "hidden",
          fontSize: "14px", // Increased font size
          whiteSpace: "normal", // Allow text wrapping
          lineHeight: "1.2" // Adjust line height for readability
        }}
      >
        {arg.event.title}
      </div>
    );
  };

  const updateWeek = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      const start = api.view.currentStart;
      const end = api.view.currentEnd;
      setWeekNumber(getISOWeek(start));
      const formattedStart = format(start, "MMM d");
      const formattedEnd = format(end, "MMM d, yyyy");
      setCurrentWeekRange(`${formattedStart} - ${formattedEnd}`);
    }
  };

  const handleDateSelect = (selectInfo) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const selectedDate = selectInfo.start;
      const startOfWeek = startOfWeek(selectedDate); // Helper function below
      calendarApi.gotoDate(startOfWeek);
      updateWeek();
    }
    setShowDatePicker(false);
  };

  const handleEventClick = (clickInfo) => {
    const eventTitle = clickInfo.event.title;
    console.log("Event clicked:", eventTitle);
    if (!selectedEvent || selectedEvent.title !== eventTitle) {
      setSelectedEvent({
        title: eventTitle,
        start: clickInfo.event.start,
        end: clickInfo.event.end,
        email: clickInfo.event.extendedProps.email,
        type: clickInfo.event.extendedProps.type,
        description: clickInfo.event.extendedProps.description,
        color: calendarColors[clickInfo.event.extendedProps.email] || "#ccc"
      });
    }
  };

  const handleAddTask = (newTask) => {
    setDummyEvents([...dummyEvents, newTask]);
  };

  useEffect(() => {
    updateWeek();
  }, []);

  // Helper function to get the start of the week (Monday)
  const startOfWeek = (date) => {
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // Adjust to Monday (0 = Sunday)
    return addWeeks(subWeeks(date, 1), 1 + diff / 7); // Align to week start
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <div className={styles.headerNavButtons}>
          <button onClick={() => calendarRef.current?.getApi().prev()}>←</button>
          <button
            className={styles.todayButton}
            onClick={() => {
              calendarRef.current?.getApi().today();
              updateWeek();
            }}
          >
            Today
          </button>
          <div
            className={styles.dateDisplay}
            onClick={() => setShowDatePicker(true)}
          >
            <FiCalendar className={styles.calendarIcon} />
            <span>{currentWeekRange}</span>
          </div>
          <button onClick={() => calendarRef.current?.getApi().next()}>→</button>
        </div>

        <div className={styles.dropdownWrapper}>
          <button
            className={styles.dropdownButton}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Select Calendars ▾
          </button>
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              {allEmails.map((email) => (
                <label key={email} className={styles.dropdownItem}>
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(email)}
                    onChange={() => toggleEmail(email)}
                  />
                  {email}
                </label>
              ))}
            </div>
          )}
          <AddTaskModal onSubmit={handleAddTask} allEmails={allEmails} />
        </div>
      </div>

      <SearchTasks
        dummyEvents={dummyEvents}
        calendarColors={calendarColors}
        setSearchQuery={() => {}}
      />

      <div className={styles.mainCalendar}>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          slotMinTime="00:00:00" // Explicitly set start
          slotMaxTime="23:59:59" // Explicitly set end
          allDaySlot={false}
          expandRows={true}
          height="auto"
          minHeight="800px"
          contentHeight="auto"
          events={visibleEvents}
          eventContent={eventContent}
          datesSet={updateWeek}
          eventClick={handleEventClick}
          headerToolbar={false}
          slotDuration="01:00:00"
          slotLabelInterval="01:00"
          slotEventOverlap={false}
          eventMinHeight={30}
        />
      </div>

      <div className={styles.calendarLegend}>
        {selectedEmails.map((email) => (
          <div key={email} className={styles.legendItem}>
            <span
              className={styles.colorBox}
              style={{ backgroundColor: calendarColors[email] }}
            ></span>
            <span className={styles.emailLabel}>{email}</span>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div
          className={styles.eventPopupOverlay}
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className={styles.eventPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.eventPopupHeader}>
              <h3>{selectedEvent.title}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className={styles.closeButton}
              >
                <FiX />
              </button>
            </div>
            <div className={styles.eventPopupContent}>
              <div className={styles.eventDetail}>
                <FiMail />
                <span>{selectedEvent.email}</span>
              </div>
              <div className={styles.eventDetail}>
                <FiClock />
                <span>{format(selectedEvent.start, "EEE, MMM d • h:mm a")} - {format(selectedEvent.end, "h:mm a")}</span>
              </div>
              <div className={styles.eventDetail}>
                <FiTag />
                <span className={styles.eventType}>{selectedEvent.type}</span>
              </div>
              {selectedEvent.description && (
                <div className={styles.eventDescription}>
                  <p>{selectedEvent.description}</p>
                </div>
              )}
              <div
                className={styles.eventColorIndicator}
                style={{ backgroundColor: selectedEvent.color }}
              />
            </div>
          </div>
        </div>
      )}

      {showDatePicker && (
        <div
          className={styles.datePickerOverlay}
          onClick={() => setShowDatePicker(false)}
        >
          <div
            className={styles.datePickerPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.datePickerHeader}>
              <h3>Select Week</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowDatePicker(false)}
              >
                <FiX />
              </button>
            </div>
            <div className={styles.miniCalendar}>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev",
                  center: "title",
                  right: "next"
                }}
                selectable={true}
                select={handleDateSelect}
                initialDate={calendarRef.current?.getApi()?.getDate()}
                height="auto"
                contentHeight="auto"
                width="100%"
                dayCellContent={(arg) => {
                  const date = arg.date;
                  const isStartOfWeek = date.getDay() === 1; // Monday
                  return isStartOfWeek ? format(date, "d") : null; // Show only Mondays
                }}
                dayCellClassNames={(arg) => {
                  const date = arg.date;
                  const isStartOfWeek = date.getDay() === 1;
                  return isStartOfWeek ? styles.weekStart : "";
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;