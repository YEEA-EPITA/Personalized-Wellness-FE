// 📁 kanbanBoard.js
import { Box } from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import KanbanColumn from "@/shared/components/dashboard/kanbanboard/kanbanColumn";
import KandbanTaskDialog from "@/shared/components/dashboard/kanbanboard/kanbanTaskDialog";
import { PLATFORMS } from "@/shared/constants/platforms";
import usePlatformsStore from "@/shared/zustand/stores/usePlatformsStore";
import { transformToBoardData } from "@/shared/utils/general";

const KanbanBoard = ({
  kandboardData,
  platform,
  account,
  selectedProjectKey,
}) => {
  const {
    fetchJiraTasks,
    fetchTrelloTasks,
    createJiraTask,
    updateJiraTask,
    deleteJiraTask,
    createTrelloTask,
    updateTrelloTask,
    deleteTrelloTask,
    updateJiraTaskStatus,
    jiraProjectsList,
  } = usePlatformsStore();

  const [data, setData] = useState(kandboardData);
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [errors, setErrors] = useState({});
  const [loadingTasks, setLoadingTasks] = useState({});

  const handleOpen = (columnId) => {
    setDialogData({
      id: "",
      title: "",
      description: "",
      dueDate: "",
      columnId,
      projectKey: selectedProjectKey || "",
    });
    setErrors({});
    setOpen(true);
  };

  const handleEdit = (task) => {
    setDialogData({
      ...task,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      projectKey: task.projectKey || selectedProjectKey || "",
      columnId: Object.keys(data.columns).find((colId) =>
        data.columns[colId].taskIds.includes(task.id)
      ),
    });
    setErrors({});
    setOpen(true);
  };

  const handleDelete = async (task) => {
    setLoadingTasks((prev) => ({ ...prev, [task.id]: true }));
    try {
      if (platform === PLATFORMS.jira.value) {
        await deleteJiraTask({
          jiraEmail: account,
          issueKey: task.issueKey,
        });
      } else if (platform === PLATFORMS.trello.value) {
        await deleteTrelloTask({
          trelloTaskId: task.trelloTaskId,
          listId: task.listId,
        });
      }

      const newTasks = { ...data.tasks };
      delete newTasks[task.id];

      const newColumns = { ...data.columns };
      for (const col of Object.values(newColumns)) {
        col.taskIds = col.taskIds.filter((id) => id !== task.id);
      }

      setData({ ...data, tasks: newTasks, columns: newColumns });
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoadingTasks((prev) => {
        const updated = { ...prev };
        delete updated[task.id];
        return updated;
      });
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    const startTaskIds = Array.from(start.taskIds);
    const finishTaskIds = Array.from(finish.taskIds);

    startTaskIds.splice(source.index, 1);
    finishTaskIds.splice(destination.index, 0, draggableId);

    const updatedColumns = {
      ...data.columns,
      [start.id]: { ...start, taskIds: startTaskIds },
      [finish.id]: { ...finish, taskIds: finishTaskIds },
    };

    setData({ ...data, columns: updatedColumns });

    const movedTask = data.tasks[draggableId];
    try {
      if (platform === PLATFORMS.jira.value) {
        const newStatus = {
          todo: "To Do",
          inProgress: "In Progress",
          done: "Done",
        }[finish.id];
        await updateJiraTaskStatus({
          jiraEmail: account,
          issueKey: movedTask.issueKey,
          newStatus,
        });
      } else if (platform === PLATFORMS.trello.value) {
        await updateTrelloTask({
          trelloTaskId: movedTask.trelloTaskId,
          listId: finish.id,
        });
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  useEffect(() => {
    if (kandboardData) {
      setData(kandboardData);
    }
  }, [kandboardData]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          display="flex"
          justifyContent="space-between"
          mb={2}
          gap={3}
          flexDirection={{ xs: "column", md: "row" }}
        >
          {data?.columnOrder?.map((colId) => {
            const column = data.columns[colId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
            return (
              <KanbanColumn
                key={colId}
                column={column}
                tasks={tasks}
                onAdd={handleOpen}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loadingTasks={loadingTasks}
              />
            );
          })}
        </Box>
      </DragDropContext>
      <KandbanTaskDialog
        open={open}
        handleClose={() => setOpen(false)}
        handleSave={() => {}}
        dialogData={dialogData}
        setDialogData={setDialogData}
        errors={errors}
        setErrors={setErrors}
        isLoading={false}
      />
    </>
  );
};

export default KanbanBoard;
