"use client";
import React from "react";
import { Paper, Typography, Stack, Button } from "@mui/material";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import KanbanTask from "./KanbanTask";

const KanbanColumn = ({
  column,
  tasks,
  onAddClick,
  onEditTask,
  onDeleteTask,
  deletingTaskId,
  isFirstColumn = false, // New prop to identify first column
}) => {
  return (
    <Droppable droppableId={column.id}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            p: 2,
            width: "100%",
            minHeight: 500,
            bgcolor: snapshot.isDraggingOver ? "#e3f2fd" : "#f9fafb",
            borderRadius: 2,
            boxShadow: 2,
            transition: "background 0.2s",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight={600} align="center">
              {column.title}
            </Typography>
            {/* Show Add Task button only on the first column (language-independent) */}
            {onAddClick && isFirstColumn && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => onAddClick(column)}
              >
                + Add Task
              </Button>
            )}
          </Stack>
          <Stack spacing={2}>
            {tasks.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 10 }}
              >
                No tasks here
              </Typography>
            ) : (
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.7 : 1,
                      }}
                    >
                      <KanbanTask
                        task={task}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                        isDeleting={deletingTaskId === task.id}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </Stack>
        </Paper>
      )}
    </Droppable>
  );
};

export default KanbanColumn;
