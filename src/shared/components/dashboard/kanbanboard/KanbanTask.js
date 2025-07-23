"use client";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Stack,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const formatDueDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getDueDateChip = (dueDate) => {
  if (!dueDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  let color = "primary";
  let icon = <AccessTimeIcon fontSize="small" />;

  if (due < today) {
    color = "error";
    icon = <ErrorOutlineIcon fontSize="small" />;
  } else if (due.getTime() === today.getTime()) {
    color = "warning";
    icon = <WarningAmberIcon fontSize="small" />;
  }

  return (
    <Tooltip title={`Due: ${formatDueDate(dueDate)}`}>
      <Chip
        icon={icon}
        label={formatDueDate(dueDate)}
        color={color}
        size="small"
        sx={{ mt: 1 }}
      />
    </Tooltip>
  );
};

const KanbanTask = ({ task, onEdit, onDelete, isDeleting = false }) => {
  const assigned = task.assignedTo || { name: "Unassigned", avatar: null };
  const initials =
    assigned.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <Card
      sx={{
        boxShadow: 3,
        cursor: "grab",
        transition: "0.2s",
        "&:hover": { boxShadow: 6, transform: "scale(1.03)" },
        bgcolor: "#fff",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            gutterBottom
            sx={{ flex: 1 }}
          >
            {task.title}
          </Typography>
          <Stack direction="row" spacing={1}>
            {onEdit && (
              <IconButton
                size="small"
                onClick={() => onEdit(task)}
                disabled={isDeleting}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                onClick={() => onDelete(task)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <CircularProgress size={16} />
                ) : (
                  <DeleteIcon fontSize="small" />
                )}
              </IconButton>
            )}
          </Stack>
        </Stack>

        {task.description && (
          <Typography variant="body2" color="text.secondary" mb={0.5}>
            {task.description}
          </Typography>
        )}

        {getDueDateChip(task.dueDate)}

        <Stack
          justifyContent="flex-end"
          direction="row"
          alignItems="center"
          spacing={1}
          mt={2}
        >
          <Avatar
            src={assigned.avatar || undefined}
            sx={{ width: 28, height: 28, fontSize: 14 }}
          >
            {assigned.avatar ? null : initials}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            {assigned.name}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default KanbanTask;
