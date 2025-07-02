import React, { useState, useEffect } from "react";

// Dynamic icon loading with fallback
let FiMail, FiClock, FiTag, FiX;
try {
  const icons = require("react-icons/fi");
  FiMail = icons.FiMail;
  FiClock = icons.FiClock;
  FiTag = icons.FiTag;
  FiX = icons.FiX;
} catch (e) {
  console.error("Failed to load react-icons/fi in SearchTasks:", e);
  FiMail = () => <span>✉</span>;
  FiClock = () => <span>⏰</span>;
  FiTag = () => <span>🏷</span>;
  FiX = () => <span>✖</span>;
}

import styles from "../styles.module.css";

// Debounce utility
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const SearchTasks = ({ dummyEvents, calendarColors, setSearchQuery }) => {
  const [searchQuery, setLocalSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  // Debounced search handler
  const handleSearch = debounce(() => {
    console.log("Debounced search query:", searchQuery); // Debug log
    if (searchQuery.trim() === "") {
      setSelectedTask(null); // Clear selection if search is empty
    } else {
      const foundTask = dummyEvents.find((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (foundTask) {
        setSelectedTask({
          title: foundTask.title,
          start: foundTask.start,
          end: foundTask.end,
          email: foundTask.email,
          type: foundTask.type,
          description: foundTask.description,
          color: calendarColors[foundTask.email] || "#ccc"
        });
      } else {
        setSelectedTask({ notFound: searchQuery });
      }
    }
  }, 300); // 300ms delay

  useEffect(() => {
    console.log("useEffect triggered with searchQuery:", searchQuery); // Debug log
    handleSearch();
  }, [searchQuery, dummyEvents, calendarColors, handleSearch]);

  const closePopup = () => {
    setSelectedTask(null);
    setLocalSearchQuery("");
    if (setSearchQuery) setSearchQuery(""); // Ensure external state is cleared
    console.log("Popup closed, states reset"); // Debug log
  };

  // Log initial render
  useEffect(() => {
    console.log("SearchTasks mounted with initial searchQuery:", searchQuery);
  }, []);

  return (
    <>
      <div className={styles.searchContainer}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchBar}
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => {
            console.log("Search input:", e.target.value); // Debug log
            setLocalSearchQuery(e.target.value);
          }}
        />
      </div>
      {selectedTask && (
        <div className={styles.eventPopupOverlay} onClick={closePopup}>
          <div className={styles.eventPopup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.eventPopupHeader}>
              <h3>{selectedTask.notFound ? `${selectedTask.notFound} not found` : selectedTask.title}</h3>
              <button onClick={closePopup} className={styles.closeButton}>
                <FiX />
              </button>
            </div>
            <div className={styles.eventPopupContent}>
              {!selectedTask.notFound && (
                <>
                  <div className={styles.eventDetail}>
                    <FiMail />
                    <span>{selectedTask.email}</span>
                  </div>
                  <div className={styles.eventDetail}>
                    <FiClock />
                    <span>{new Date(selectedTask.start).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })} - {new Date(selectedTask.end).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                  </div>
                  <div className={styles.eventDetail}>
                    <FiTag />
                    <span className={styles.eventType}>{selectedTask.type}</span>
                  </div>
                  {selectedTask.description && (
                    <div className={styles.eventDescription}>
                      <p>{selectedTask.description}</p>
                    </div>
                  )}
                  <div
                    className={styles.eventColorIndicator}
                    style={{ backgroundColor: selectedTask.color }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchTasks;