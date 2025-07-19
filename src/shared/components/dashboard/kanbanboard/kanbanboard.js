"use client";
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import AddTaskDialog from "./AddTaskDialog";
import CustomAlert from "@/shared/components/general/CustomAlert";
import usePlatformsStore from "@/shared/zustand/stores/usePlatformsStore";
import { PLATFORMS } from "@/shared/constants/platforms";

const KanbanBoard = ({
  boardData,
  platform,
  accountEmail,
  projectKey,
  cloudId,
  // Trello specific props
  listId,
  boardId,
  trelloLists = [], // Array of Trello lists with {id, name}
}) => {
  const {
    createJiraTask,
    createTrelloTask,
    updateJiraTask,
    updateTrelloTask,
    deleteJiraTask,
    deleteTrelloTask,
    updateJiraTaskStatus,
  } = usePlatformsStore();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addColumn, setAddColumn] = useState(null);
  const [data, setData] = useState(boardData);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState("");

  // Alert states
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
    showCancel: false,
    onConfirm: null,
  });

  useEffect(() => {
    if (boardData && Object.keys(boardData).length > 0) {
      setData(boardData);
    }
  }, [boardData]);

  // Get default list ID from first available list
  const getDefaultListId = () => {
    if (listId) return listId;
    if (trelloLists && trelloLists.length > 0) return trelloLists[0].id;
    return null;
  };

  // Get list ID from task data (more reliable than column mapping)
  const getListIdFromTask = (task, columnId) => {
    // If task has a listId, use it, otherwise use the default
    if (task && task.listId) return task.listId;

    // For Trello, the columnId IS the listId in the formatted data structure
    // Check if this columnId exists in our trelloLists
    if (columnId && trelloLists && trelloLists.length > 0) {
      const matchingList = trelloLists.find((list) => list.id === columnId);
      if (matchingList) {
        return columnId; // The column ID is the list ID
      }
    }

    // For new tasks, we need to determine the target list based on column
    // Check if we have actual list data from the boardData
    if (data && data.columns && data.columns[columnId]) {
      const column = data.columns[columnId];
      const firstTaskInColumn = column.taskIds.find(
        (taskId) => data.tasks[taskId]?.listId
      );
      if (firstTaskInColumn && data.tasks[firstTaskInColumn]?.listId) {
        return data.tasks[firstTaskInColumn].listId;
      }
    }

    // Fallback to default list ID
    return getDefaultListId();
  };

  // Find which column a task is currently in
  const findTaskColumn = (taskId) => {
    if (!data || !data.columns) return null;

    for (const columnId of Object.keys(data.columns)) {
      const column = data.columns[columnId];
      if (column.taskIds.includes(taskId)) {
        return columnId;
      }
    }
    return null;
  };

  // Helper functions for alerts
  const showAlert = (config) => {
    setAlertConfig({
      open: true,
      type: "info",
      showCancel: false,
      onConfirm: null,
      ...config,
    });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, open: false }));
  };

  const showConfirmation = (title, message, onConfirm) => {
    showAlert({
      type: "warning",
      title,
      message,
      showCancel: true,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm,
    });
  };

  const showError = (title, message) => {
    showAlert({ type: "error", title, message, confirmText: "OK" });
  };

  const showSuccess = (title, message) => {
    showAlert({ type: "success", title, message, confirmText: "OK" });
  };

  const handleAddClick = (column) => {
    setIsEditMode(false);
    setEditingTask(null);
    setAddColumn(column);
    setAddDialogOpen(true);
  };

  const handleEditClick = (task) => {
    setIsEditMode(true);
    setEditingTask(task);
    setAddColumn(null);
    setAddDialogOpen(true);
  };

  const handleDeleteClick = async (task) => {
    showConfirmation(
      "Delete Task",
      `Are you sure you want to delete "${task.title}"?`,
      async () => {
        setDeletingTaskId(task.id);

        try {
          switch (platform) {
            case PLATFORMS.jira.value:
              await deleteJiraTaskHandler(task);
              break;

            case PLATFORMS.trello.value:
              await deleteTrelloTaskHandler(task);
              break;

            default:
              return;
          }

          // Remove task from local state
          setData((prev) => {
            const newTasks = { ...prev.tasks };
            delete newTasks[task.id];

            const newColumns = { ...prev.columns };
            Object.keys(newColumns).forEach((colId) => {
              newColumns[colId] = {
                ...newColumns[colId],
                taskIds: newColumns[colId].taskIds.filter(
                  (id) => id !== task.id
                ),
              };
            });

            return {
              ...prev,
              tasks: newTasks,
              columns: newColumns,
            };
          });
        } catch (error) {
          showError(
            "Delete Failed",
            "Failed to delete the task. Please try again."
          );
        } finally {
          setDeletingTaskId("");
        }
      }
    );
  };

  // Separate Jira task delete function
  const deleteJiraTaskHandler = async (task) => {
    const issueKey = task.issueKey || task.id;

    const payload = {
      jiraEmail: accountEmail,
      issueKey: issueKey,
      cloudId: cloudId,
    };

    try {
      const result = await deleteJiraTask({ payload });
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Separate Trello task delete function
  const deleteTrelloTaskHandler = async (task) => {
    const cardId = task.id;

    const payload = {
      trelloEmail: accountEmail,
      cardId: cardId,
    };
    const result = await deleteTrelloTask({ payload });
    return result;
  };

  // Separate Jira task update function
  const updateJiraTaskHandler = async (taskData, taskId) => {
    // Use issueKey from editingTask, or fallback to taskId
    const issueKey = editingTask.issueKey || editingTask.id || taskId;

    const payload = {
      jiraEmail: accountEmail,
      summary: taskData.title,
      description: taskData.description,
      issueKey: issueKey,
      endDate: taskData.dueDate || null,
      cloudId: cloudId,
    };
    try {
      const updatedTask = await updateJiraTask({ payload });
      return {
        id: taskId,
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate || null,
        issueKey: issueKey,
        projectKey: projectKey,
        platform: PLATFORMS.jira.value,
        ...editingTask,
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate || null,
      };
    } catch (error) {
      throw error;
    }
  };

  // Separate Trello task update function
  const updateTrelloTaskHandler = async (taskData, taskId) => {
    const cardId = editingTask.id || taskId;

    // Find which column the task is currently in
    const currentColumnId = findTaskColumn(editingTask.id);

    // For Trello, the column ID IS the list ID (from formatTrelloTasksToKanban)
    let currentListId;
    if (currentColumnId) {
      // The column ID is directly the list ID in Trello formatted data
      currentListId = currentColumnId;
    } else {
      // Fallback to task's existing listId or default
      currentListId = editingTask.listId || getDefaultListId();
    }

    if (!currentListId) {
      throw new Error("No list ID available for updating Trello task");
    }

    const payload = {
      trelloEmail: accountEmail,
      cardId: cardId,
      listId: currentListId,
      name: taskData.title,
      description: taskData.description || "",
    };

    try {
      await updateTrelloTask({ payload });

      return {
        id: taskId,
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate || null,
        listId: currentListId,
        boardId: editingTask.boardId,
        platform: PLATFORMS.trello.value,
        // Preserve other existing task properties
        ...editingTask,
        // Override with updated values
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate || null,
      };
    } catch (error) {
      throw error;
    }
  };

  const createJiraTaskHandler = async (taskData) => {
    const payload = {
      jiraEmail: accountEmail,
      projectKey: projectKey,
      summary: taskData.title,
      endDate: taskData.dueDate || null,
      description: taskData.description,
      cloudId: cloudId,
    };
    try {
      const createdTask = await createJiraTask({ payload });

      return {
        id: createdTask?.issueKey || `task-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate || null,
        issueKey: createdTask?.issueKey,
        projectKey: projectKey,
        platform: PLATFORMS.jira.value,
      };
    } catch (error) {
      console.error("Failed to create Jira task:", error);
      throw error;
    }
  };

  // Separate Trello task creation function
  const createTrelloTaskHandler = async (taskData) => {
    // Get the target list ID for the selected column
    const targetListId = getListIdFromTask(null, addColumn?.id);

    if (!targetListId) {
      console.error("No valid listId found:", {
        listId,
        addColumnId: addColumn?.id,
        trelloLists,
        defaultListId: getDefaultListId(),
      });
      throw new Error("No valid list ID available for creating Trello card");
    }

    const payload = {
      trelloEmail: accountEmail,
      listId: targetListId,
      name: taskData.title,
      description: taskData.description,
    };

    try {
      const createdTask = await createTrelloTask({ payload });

      return {
        id: createdTask?.id || `task-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate || null,
        listId: targetListId,
        boardId: boardId,
        platform: PLATFORMS.trello.value,
        assignedTo: { name: accountEmail, avatar: null },
        // Include any additional fields from the API response
        ...createdTask,
      };
    } catch (error) {
      console.error("Failed to create Trello task:", error);
      throw error;
    }
  };

  const handleAddTask = async (task) => {
    if (!task.title?.trim() || !task.description?.trim()) {
      console.error("Task title and description are required");
      showError(
        "Missing Information",
        "Task title and description are required."
      );
      return;
    }
    setIsCreatingTask(true);

    try {
      let newTask;

      if (isEditMode && editingTask) {
        switch (platform) {
          case "JIRA":
            // Use issueKey from editingTask, or fallback to task ID if issueKey is missing
            const issueKey = editingTask.issueKey || editingTask.id;
            if (!issueKey || !cloudId) {
              throw new Error(
                "Issue key and cloud ID are required for Jira task updates"
              );
            }
            newTask = await updateJiraTaskHandler(task, editingTask.id);
            break;

          case "TRELLO":
            // Use cardId from editingTask
            const cardId = editingTask.id;
            if (!cardId) {
              throw new Error("Card ID is required for Trello task updates");
            }
            newTask = await updateTrelloTaskHandler(task, editingTask.id);
            break;

          default:
            // Fallback for other platforms
            newTask = {
              ...editingTask,
              title: task.title,
              description: task.description,
              dueDate: task.dueDate || null,
            };
        }

        // Update existing task in local state
        setData((prev) => ({
          ...prev,
          tasks: {
            ...prev.tasks,
            [editingTask.id]: newTask,
          },
        }));
      } else {
        // Handle task creation (existing logic)
        switch (platform) {
          case PLATFORMS.jira.value:
            if (!projectKey || !cloudId) {
              throw new Error(
                "Project key and cloud ID are required for Jira tasks"
              );
            }
            newTask = await createJiraTaskHandler(task);
            break;

          case PLATFORMS.trello.value:
            // Check if we have valid Trello lists or a default list ID
            const defaultListId = getDefaultListId();
            if (!defaultListId) {
              showError(
                "Missing Trello Configuration",
                "No valid Trello lists found. Please make sure you've selected a Trello board with lists."
              );
              return; // Return instead of throwing to prevent crash
            }
            newTask = await createTrelloTaskHandler(task);
            break;

          default:
            newTask = {
              id: `task-${Date.now()}`,
              title: task.title,
              description: task.description,
              dueDate: task.dueDate || null,
              platform: platform || "demo",
              assignedTo: { name: accountEmail, avatar: null },
            };
        }

        // Add new task to selected column
        const columnId = addColumn?.id || "to-do";
        setData((prev) => ({
          ...prev,
          tasks: {
            ...prev.tasks,
            [newTask.id]: newTask,
          },
          columns: {
            ...prev.columns,
            [columnId]: {
              ...prev.columns[columnId],
              taskIds: [newTask.id, ...prev.columns[columnId].taskIds],
            },
          },
        }));
      }

      // Close dialog and reset state
      setAddDialogOpen(false);
      setAddColumn(null);
      setIsEditMode(false);
      setEditingTask(null);
    } catch (error) {
      showError(
        "Task Operation Failed",
        "Failed to save the task. Please try again."
      );
    } finally {
      setIsCreatingTask(false);
    }
  };

  // Helper function to map column ID to Jira status
  const getJiraStatusFromColumnId = (columnId) => {
    const statusMap = {
      "to-do": "To Do",
      "in-progress": "In Progress",
      done: "Done",
      // Add more mappings as needed based on your column structure
    };

    const status = statusMap[columnId] || columnId;
    return status;
  };

  // Update Jira task status when moved between columns
  const updateJiraTaskStatusHandler = async (task, newColumnId) => {
    const issueKey = task.issueKey || task.id;
    const newStatus = getJiraStatusFromColumnId(newColumnId);

    const payload = {
      jiraEmail: accountEmail,
      issueKey: issueKey,
      newStatus: newStatus,
      cloudId: cloudId,
    };

    try {
      const result = await updateJiraTaskStatus({ payload });
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Update Trello card list when moved between columns
  const updateTrelloCardListHandler = async (task, newColumnId) => {
    // For Trello, the column ID IS the list ID (from formatTrelloTasksToKanban)
    const newListId = newColumnId;
    const cardId = task.id;

    if (!newListId) {
      throw new Error(`Cannot move card to column ${newColumnId}`);
    }

    // Don't make API call if the card is already in the target list
    if (task.listId === newListId) {
      return;
    }

    const payload = {
      trelloEmail: accountEmail,
      cardId: cardId,
      listId: newListId,
      name: task.title, // Include current name
      description: task.description || "", // Include current description
    };

    try {
      const result = await updateTrelloTask({ payload });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];
    const movedTask = data.tasks[draggableId];

    if (start === finish) {
      // Same column - just reorder
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = { ...start, taskIds: newTaskIds };
      setData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      });
      return;
    }

    // Different columns - move task and update status
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    // Update UI immediately for better UX
    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });

    // Update status in backend for platform-specific tasks
    if (movedTask) {
      try {
        if (platform === PLATFORMS.jira.value) {
          await updateJiraTaskStatusHandler(movedTask, destination.droppableId);
        } else if (platform === PLATFORMS.trello.value) {
          await updateTrelloCardListHandler(movedTask, destination.droppableId);
        }
      } catch (error) {
        setData({
          ...data,
          columns: {
            ...data.columns,
            [start.id]: start,
            [finish.id]: finish,
          },
        });

        // Show error to user using custom alert
        showError(
          "Status Update Failed",
          `Failed to update task status in ${platform}. Please try again.`
        );
      }
    }
  };

  if (!data || !data.columnOrder) return null;

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box display="flex" gap={3} minWidth={900}>
          {data.columnOrder.map((colId, index) => {
            const column = data.columns[colId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
            return (
              <KanbanColumn
                key={colId}
                column={column}
                tasks={tasks}
                onAddClick={handleAddClick}
                onEditTask={handleEditClick}
                onDeleteTask={handleDeleteClick}
                deletingTaskId={deletingTaskId}
                isFirstColumn={index === 0} // Pass index to identify first column
              />
            );
          })}
        </Box>
      </DragDropContext>

      <AddTaskDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          setIsEditMode(false);
          setEditingTask(null);
          setAddColumn(null);
        }}
        onAdd={handleAddTask}
        columnTitle={addColumn ? addColumn.title : ""}
        isLoading={isCreatingTask}
        isEdit={isEditMode}
        initialData={editingTask}
      />

      <CustomAlert
        open={alertConfig.open}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={() => {
          if (alertConfig.onConfirm) {
            alertConfig.onConfirm();
          }
          closeAlert();
        }}
        onClose={closeAlert}
        showCancel={alertConfig.showCancel}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
      />
    </Box>
  );
};

export default KanbanBoard;
