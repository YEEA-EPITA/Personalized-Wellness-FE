import React, { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import styles from "../styles.module.css";

const AddTaskModal = ({ onSubmit, allEmails }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    email: allEmails[0] || "",
    type: "task",
    description: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const start = `${formData.date}T${formData.startTime}:00`;
    const end = `${formData.date}T${formData.endTime}:00`;
    onSubmit({
      title: formData.title,
      start,
      end,
      email: formData.email,
      type: formData.type,
      description: formData.description
    });
    setShowModal(false);
    setFormData({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      email: allEmails[0] || "",
      type: "task",
      description: ""
    });
  };

  return (
    <>
      <button
        className={styles.dropdownButton}
        onClick={() => setShowModal(true)}
      >
        <FiPlus /> Add Task
      </button>
      {showModal && (
        <div className={styles.eventPopupOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.eventPopup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.eventPopupHeader}>
              <h3>Add New Task</h3>
              <button onClick={() => setShowModal(false)} className={styles.closeButton}>
                <FiX />
              </button>
            </div>
            <div className={styles.eventPopupContent}>
              <form onSubmit={handleSubmit}>
                <div className={styles.eventDetail}>
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Task title"
                  />
                </div>
                <div className={styles.eventDetail}>
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.eventDetail}>
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.eventDetail}>
                  <label>End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.eventDetail}>
                  <label>Calendar</label>
                  <select
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  >
                    {allEmails.map((email) => (
                      <option key={email} value={email}>
                        {email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.eventDetail}>
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="task">Task</option>
                    <option value="meeting">Meeting</option>
                    <option value="holiday">Holiday</option>
                  </select>
                </div>
                <div className={styles.eventDetail}>
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
                <div className={styles.eventPopupActions}>
                  <button type="submit">Add Task</button>
                  <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTaskModal;