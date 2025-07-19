"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AddTaskIcon from "@mui/icons-material/PlaylistAddCheck";
import CancelIcon from "@mui/icons-material/Cancel";

const AddTaskDialog = ({
  open,
  onClose,
  onAdd,
  initialData = null,
  isEdit = false,
  isLoading = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate(null);
    setErrors({});
  };

  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        setTitle(initialData.title || "");
        setDescription(initialData.description || "");
        setDueDate(initialData.dueDate ? dayjs(initialData.dueDate) : null);
      } else {
        resetForm();
      }
    }
  }, [open, isEdit, initialData]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (isLoading) return; // Prevent multiple submissions

    onAdd({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate.toISOString() : null,
    }).finally(() => {
      resetForm();
    });
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{ textAlign: "center", fontWeight: "bold", fontSize: 18 }}
      >
        {isEdit ? "Edit Task" : `Add Task`}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} mt={1}>
          <TextField
            label="Title"
            variant="outlined"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
            minRows={4}
            required
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={setDueDate}
              slotProps={{
                textField: {
                  error: !!errors.dueDate,
                  helperText: errors.dueDate,
                  required: false,
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
          </LocalizationProvider>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          color="secondary"
          variant="outlined"
          startIcon={<CancelIcon />}
          disabled={isLoading}
          sx={{
            borderRadius: "10px",
            color: "var(--primary-color)",
            borderColor: "var(--primary-color)",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} /> : <AddTaskIcon />
          }
          sx={{ borderRadius: "10px" }}
        >
          {isLoading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update"
            : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskDialog;
