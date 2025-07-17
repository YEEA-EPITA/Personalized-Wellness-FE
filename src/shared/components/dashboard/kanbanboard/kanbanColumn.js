import { Paper, Typography, Button, Stack } from "@mui/material";
import KanbanCard from "@/shared/components/dashboard/kanbanboard/kanbanCard";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const KanbanColumn = ({
  column,
  tasks,
  onAdd,
  onEdit,
  onDelete,
  loadingTasks,
}) => {
  return (
    <Droppable droppableId={column.id}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            p: 2,
            width: "100%",
            minHeight: 500,
            bgcolor: "#f9fafb",
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">{column.title}</Typography>
            {column.id === "todo" && (
              <Button size="small" variant="outlined" onClick={onAdd}>
                + Add
              </Button>
            )}
          </Stack>
          {tasks.map((task, index) => (
            <Draggable draggableId={task.id} index={index} key={task.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <KanbanCard
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDeleting={loadingTasks[task.id]}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Paper>
      )}
    </Droppable>
  );
};

export default KanbanColumn;
