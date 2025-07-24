"use client";
import { FaSave } from "react-icons/fa";
import styles from "./ProfilePage.module.css";

export default function ProfileHeader({
  user,
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
}) {
  return (
    <div className={styles.profileHeader}>
      <div className={styles.avatarSection}>
        <div className={styles.avatarContainer}>
          <img
            src={user?.avatar || "/images/dashboard/avatar.svg"}
            alt={`${user?.firstName} ${user?.lastName}`}
            className={styles.avatar}
          />
        </div>
      </div>
      <div className={styles.userInfo}>
        <h1 className={styles.userName}>
          {user?.firstName} {user?.lastName}
        </h1>
        <p className={styles.userEmail}>{user?.email}</p>
        <p className={styles.memberSince}>
          Member since{" "}
          {new Date(user?.joinDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </p>
      </div>
      <div className={styles.headerActions}>
        {!isEditing ? (
          <button onClick={onEdit} className={styles.editButton}>
            Edit Profile
          </button>
        ) : (
          <div className={styles.editActions}>
            <button
              onClick={onSave}
              className={styles.saveButton}
              disabled={isSaving}
            >
              <FaSave /> {isSaving ? "Saving..." : "Save"}
            </button>
            <button onClick={onCancel} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
