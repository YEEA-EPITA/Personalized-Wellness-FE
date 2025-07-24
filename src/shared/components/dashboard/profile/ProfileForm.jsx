"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Typography,
} from "@mui/material";
import {
  FaUser,
  FaEnvelope,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import styles from "./ProfilePage.module.css";

// Validation schema
const profileSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name must be less than 30 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name must be less than 30 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup.string().notRequired(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .nullable(),
});

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    color: "#a2b0c6ff",
    fontSize: "0.95rem",
  },
};

export default function ProfileForm({
  user,
  isEditing,
  isSaving,
  onSave,
  onDeleteProfile,
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await onSave(data);
      reset({
        ...data,
        password: "",
        confirmPassword: "",
      });
    } catch (error) {}
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setDeleteError("");
    setDeletePassword("");
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletePassword("");
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!deletePassword) {
      setDeleteError("Password is required");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await onDeleteProfile(deletePassword);
      setDeleteDialogOpen(false);
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.profileContent}>
      {!isEditing ? (
        // View Mode
        <div className={styles.profileView}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FaUser />
              </div>
              <div className={styles.infoDetails}>
                <span className={styles.infoLabel}>Full Name</span>
                <span className={styles.infoValue}>
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FaEnvelope />
              </div>
              <div className={styles.infoDetails}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{user?.email}</span>
              </div>
            </div>
          </div>

          <div className={styles.dangerZone}>
            <h3 className={styles.dangerTitle}>Danger Zone</h3>
            <div className={styles.dangerCard}>
              <div className={styles.dangerInfo}>
                <h4>Delete Account</h4>
                <p>
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
              </div>
              <button
                onClick={handleDeleteClick}
                className={styles.deleteButton}
                disabled={isSaving}
              >
                <FaTrash /> Delete Account
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit(onSubmit)} className={styles.profileForm}>
          <div className={styles.formGrid}>
            <TextField
              label="First Name"
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              fullWidth
              sx={textFieldSx}
            />
            <TextField
              label="Last Name"
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              fullWidth
              sx={textFieldSx}
            />
          </div>

          <TextField
            label="Email Address"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            sx={textFieldSx}
          />

          <TextField
            label="New Password (Optional)"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            placeholder="Leave blank to keep current password"
            sx={textFieldSx}
          />

          <TextField
            label="Confirm New Password"
            type="password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
            placeholder="Confirm your new password"
            sx={textFieldSx}
          />
        </form>
      )}

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "8px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#dc2626",
            fontWeight: "600",
            fontSize: "1.25rem",
          }}
        >
          <FaExclamationTriangle />
          Delete Account
        </DialogTitle>

        <DialogContent>
          <Alert
            severity="warning"
            sx={{
              marginBottom: "20px",
              borderRadius: "12px",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "500" }}>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </Typography>
          </Alert>

          <Typography
            variant="body1"
            sx={{
              marginBottom: "16px",
              color: "#374151",
              fontWeight: "500",
            }}
          >
            Please enter your current password to confirm account deletion:
          </Typography>

          <TextField
            type="password"
            label="Current Password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            fullWidth
            error={!!deleteError}
            helperText={deleteError}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#f8fafc",
                "& fieldset": {
                  borderColor: "#e2e8f0",
                },
                "&:hover fieldset": {
                  borderColor: "#cbd5e1",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3b82f6",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#64748b",
                "&.Mui-focused": {
                  color: "#3b82f6",
                },
              },
            }}
            placeholder="Enter your password"
          />
        </DialogContent>

        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              borderColor: "#e5e7eb",
              color: "#6b7280",
              "&:hover": {
                borderColor: "#d1d5db",
                backgroundColor: "#f9fafb",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={isDeleting}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              backgroundColor: "#dc2626",
              "&:hover": {
                backgroundColor: "#b91c1c",
              },
              "&:disabled": {
                backgroundColor: "#f87171",
              },
            }}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
