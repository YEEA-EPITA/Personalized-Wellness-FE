const { PLATFORMS } = require("@/shared/constants/platforms");

export const transformToBoardData = (
  tasks,
  sourceType = PLATFORMS.jira.value
) => {
  const boardData = {
    columnOrder: ["todo", "inProgress", "done"],
    columns: {
      todo: { id: "todo", title: "To Do", taskIds: [] },
      inProgress: { id: "inProgress", title: "In Progress", taskIds: [] },
      done: { id: "done", title: "Done", taskIds: [] },
    },
    tasks: {},
  };

  tasks.forEach((task) => {
    let taskId,
      statusKey,
      title,
      description,
      issueKey,
      projectKey,
      listId,
      dueDate,
      trelloTaskId;

    if (sourceType === PLATFORMS.jira.value) {
      taskId = task.issueKey || `jira-${Date.now()}-${Math.random()}`;
      statusKey =
        {
          "To Do": "todo",
          "In Progress": "inProgress",
          Done: "done",
        }[task.status] || "todo";

      title = task.summary || "Untitled Task";
      description = task.description || "No description";
      issueKey = task.issueKey;
      projectKey = task.projectKey || "";
      dueDate = task.dueDate || "";
    } else if (sourceType === PLATFORMS.trello.value) {
      taskId = task.id || `trello-${Date.now()}-${Math.random()}`;
      statusKey =
        {
          "To Do": "todo",
          "In Progress": "inProgress",
          Done: "done",
        }[task.listName] || "todo";

      title = task.name || "Untitled Task";
      description = task.description || "No description";
      trelloTaskId = task.id;
      dueDate = task.dueDate || "";
      listId = task.listId || "";
    }

    boardData.tasks[taskId] = {
      id: taskId,
      title,
      description,
      issueKey,
      projectKey,
      sourceType,
      dueDate,
      listId,
      trelloTaskId,
    };

    if (statusKey && boardData.columns[statusKey]) {
      boardData.columns[statusKey].taskIds.push(taskId);
    }
  });

  return boardData;
};
