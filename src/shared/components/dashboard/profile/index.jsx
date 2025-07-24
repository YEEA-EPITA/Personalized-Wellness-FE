"use client";
import { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileForm from "./ProfileForm";
import styles from "./ProfilePage.module.css";

// Zustand store for user profile management
import { useUserStore } from "@/shared/zustand";

export default function ProfileComponent() {
  const {
    currentUser,
    fetchUserProfile,
    deleteUserProfile,
    updateUserProfile,
  } = useUserStore();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetchUserProfile();
      const userData = {
        firstName: res.firstName || "",
        lastName: res.lastName || "",
        email: res.email || "",
        avatar: res.avatar || "/images/dashboard/avatar.svg",
        joinDate: res.createdAt || "2024-01-15",
      };
      setUser(userData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    const { password, confirmPassword, ...rest } = formData;
    const payload = {
      ...rest,
      password: password || undefined,
    };
    try {
      const res = await updateUserProfile({ payload });
      setUser((prev) => ({
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        provider: res.provider,
        joinDate: res.createdAt || prev.joinDate,
      }));

      setIsEditing(false);
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async (password) => {
    setIsSaving(true);
    try {
      await deleteUserProfile({ password });
      window.location.href = "/auth/login";
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <ProfileHeader
          user={user}
          isEditing={isEditing}
          isSaving={isSaving}
          onEdit={handleEdit}
          onSave={() => document.querySelector("form").requestSubmit()}
          onCancel={handleCancel}
        />

        <ProfileForm
          user={user}
          isEditing={isEditing}
          isSaving={isSaving}
          onSave={handleSave}
          onDeleteProfile={handleDeleteProfile}
        />
      </div>
    </div>
  );
}
