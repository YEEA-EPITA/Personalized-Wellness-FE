"use client";
import { Box, Typography } from "@mui/material";
import TasksComponent from "@/shared/components/dashboard/kanbanboard";

export default function KanbanPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={4}>
        Manage Tasks
      </Typography>
      <TasksComponent />
    </Box>
  );
}
