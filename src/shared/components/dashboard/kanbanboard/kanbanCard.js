import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const KanbanCard = ({ task, onEdit, onDelete, isDeleting }) => {
  const formatDateTime = (date) => {
    const taskDate = new Date(date);
    return `${taskDate.getFullYear()}-${String(
      taskDate.getMonth() + 1
    ).padStart(2, "0")}-${String(taskDate.getDate()).padStart(2, "0")} ${String(
      taskDate.getHours()
    ).padStart(2, "0")}:${String(taskDate.getMinutes()).padStart(2, "0")}`;
  };

  const isToday = (date) => {
    const taskDate = new Date(date);
    const today = new Date();
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <Card
      sx={{
        mb: 2,
        cursor: "grab",
        boxShadow: 3,
        transition: "0.3s",
        "&:hover": { transform: "scale(1.02)" },
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="start"
        >
          <div style={{ width: "100%" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {task.title}
            </Typography>
            {task.dueDate && (
              <Chip
                icon={<AccessTimeIcon fontSize="small" />}
                label={`Due: ${formatDateTime(task.dueDate)}`}
                color={isToday(task.dueDate) ? "warning" : "default"}
                size="small"
                sx={{ mt: 0.5, mb: 1 }}
              />
            )}
            <Typography variant="body2">{task.description}</Typography>
          </div>

          <Stack direction="row" spacing={1}>
            <IconButton size="small" onClick={() => onEdit(task)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(task)}>
              {isDeleting ? (
                <CircularProgress size={20} />
              ) : (
                <DeleteIcon fontSize="small" />
              )}
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default KanbanCard;
