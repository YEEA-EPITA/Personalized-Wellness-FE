"use client";
import { useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaVideo,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Grid,
  Chip,
  FormControlLabel,
  Switch,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  VideoCall as VideoIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import useDashboardStore from "@/shared/zustand/stores/useDashboardStore";

export default function AddMeetingDialog({ isOpen, onClose, onSuccess }) {
  const { createGoogleCalendarEvent, isLoading } = useDashboardStore();

  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    startTime: "",
    endTime: "",
    attendees: [""],
    isVideoLink: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleAttendeeChange = (index, value) => {
    const newAttendees = [...formData.attendees];
    newAttendees[index] = value;
    setFormData((prev) => ({
      ...prev,
      attendees: newAttendees,
    }));
  };

  const addAttendee = () => {
    setFormData((prev) => ({
      ...prev,
      attendees: [...prev.attendees, ""],
    }));
  };

  const removeAttendee = (index) => {
    if (formData.attendees.length > 1) {
      const newAttendees = formData.attendees.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        attendees: newAttendees,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.summary.trim()) {
      newErrors.summary = "Meeting title is required";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (formData.startTime && formData.endTime) {
      const startDate = new Date(formData.startTime);
      const endDate = new Date(formData.endTime);

      if (endDate <= startDate) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    // Validate attendees (remove empty ones and check email format)
    const validAttendees = formData.attendees.filter((email) => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const email of validAttendees) {
      if (!emailRegex.test(email)) {
        newErrors.attendees = "Please enter valid email addresses";
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Filter out empty attendees
      const validAttendees = formData.attendees.filter((email) => email.trim());

      const payload = {
        summary: formData.summary,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        attendees: validAttendees,
        isVideoLink: formData.isVideoLink,
      };

      await createGoogleCalendarEvent({ payload });

      // Reset form
      setFormData({
        summary: "",
        description: "",
        startTime: "",
        endTime: "",
        attendees: [""],
        isVideoLink: false,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      summary: "",
      description: "",
      startTime: "",
      endTime: "",
      attendees: [""],
      isVideoLink: false,
    });
    setErrors({});
    onClose();
  };

  // Format datetime for input (datetime-local format)
  const formatDateTimeForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  // Set default times (next hour and hour after)
  const getDefaultTimes = () => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);

    const hourAfter = new Date(nextHour);
    hourAfter.setHours(nextHour.getHours() + 1);

    return {
      start: formatDateTimeForInput(nextHour),
      end: formatDateTimeForInput(hourAfter),
    };
  };

  // Set default times when dialog opens
  const defaultTimes = getDefaultTimes();
  if (isOpen && !formData.startTime && !formData.endTime) {
    setFormData((prev) => ({
      ...prev,
      startTime: defaultTimes.start,
      endTime: defaultTimes.end,
    }));
  }

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventIcon />
          <Typography variant="h6" component="div" fontWeight={700}>
            Create New Meeting
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: "white" }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Meeting Title */}
            <Grid item size={12}>
              <TextField
                fullWidth
                label={"Meeting Title"}
                placeholder="Enter meeting title..."
                value={formData.summary}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                error={!!errors.summary}
                helperText={errors.summary}
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                  },
                  mt: 2,
                }}
              />
            </Grid>

            {/* Description */}
            <Grid item size={12}>
              <TextField
                fullWidth
                label="Description"
                placeholder="Add meeting description or agenda..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                multiline
                rows={3}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                  },
                }}
              />
            </Grid>

            {/* Start and End Time */}
            <Grid item size={6}>
              <TextField
                fullWidth
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TimeIcon sx={{ fontSize: 16 }} />
                    Start Time
                  </Box>
                }
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                error={!!errors.startTime}
                helperText={errors.startTime}
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item size={6}>
              <TextField
                fullWidth
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TimeIcon sx={{ fontSize: 16 }} />
                    End Time
                  </Box>
                }
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                error={!!errors.endTime}
                helperText={errors.endTime}
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                  },
                }}
              />
            </Grid>

            {/* Attendees */}
            <Grid item size={12}>
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  fontWeight: 600,
                  color: "#1f2937",
                }}
              >
                <PeopleIcon sx={{ fontSize: 20, color: "#3b82f6" }} />
                Attendees
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {formData.attendees.map((attendee, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <TextField
                      fullWidth
                      type="email"
                      placeholder="Enter email address..."
                      value={attendee}
                      onChange={(e) =>
                        handleAttendeeChange(index, e.target.value)
                      }
                      error={!!errors.attendees}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#3b82f6",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#3b82f6",
                          },
                        },
                      }}
                    />
                    {formData.attendees.length > 1 && (
                      <IconButton
                        onClick={() => removeAttendee(index)}
                        color="error"
                        size="small"
                        sx={{
                          backgroundColor: "#fef2f2",
                          border: "1px solid #fecaca",
                          "&:hover": {
                            backgroundColor: "#fee2e2",
                          },
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addAttendee}
                  sx={{
                    borderStyle: "dashed",
                    borderColor: "#cbd5e1",
                    color: "#6b7280",
                    "&:hover": {
                      borderColor: "#3b82f6",
                      color: "#3b82f6",
                      backgroundColor: "rgba(59, 130, 246, 0.05)",
                    },
                    borderRadius: 2,
                    py: 1,
                  }}
                >
                  Add Another Attendee
                </Button>

                {errors.attendees && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.attendees}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Video Conference */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "#f8fafc",
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isVideoLink}
                      onChange={(e) =>
                        handleInputChange("isVideoLink", e.target.checked)
                      }
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#3b82f6",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#3b82f6",
                          },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <VideoIcon sx={{ color: "#3b82f6" }} />
                      <Typography variant="body2" fontWeight={500}>
                        Add video conference link
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1.5 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isLoading}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            borderColor: "#e2e8f0",
            color: "#6b7280",
            "&:hover": {
              borderColor: "#cbd5e1",
              backgroundColor: "#f8fafc",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? null : <EventIcon />}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            },
          }}
        >
          {isLoading ? "Creating..." : "Create Meeting"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
