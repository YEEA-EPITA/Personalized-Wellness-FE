// Format Jira TaskLists
export const formatJiraTasksToKanban = (jiraTasks) => {
  const tasks = {};
  const columns = {};
  const columnOrder = [];

  // Define default columns
  const defaultStatuses = ["To Do", "In Progress", "Done"];

  // Step 1: Build all columns upfront
  defaultStatuses.forEach((status) => {
    const columnId = status.replace(/\s/g, "-").toLowerCase();
    columns[columnId] = {
      id: columnId,
      title: status,
      taskIds: [],
    };
    columnOrder.push(columnId);
  });

  // Step 2: Map Jira tasks into columns
  jiraTasks.forEach((task) => {
    const taskId = task.issueKey;
    const columnId = (task.status || "To Do").replace(/\s/g, "-").toLowerCase();

    tasks[taskId] = {
      id: taskId,
      title: task.summary,
      description: task.description || "",
      dueDate: task.dueDate,
      issueKey: task.issueKey, // Add issueKey to the task object
      projectKey: task.projectKey, // Add projectKey if available
      assignedTo: task.assignedBy
        ? { name: task.assignedBy.name, avatar: task.assignedBy.imgUrl }
        : { name: task.createdBy, avatar: null },
    };

    if (columns[columnId]) {
      columns[columnId].taskIds.push(taskId);
    } else {
      // Optional: Handle unexpected statuses
      columns[columnId] = {
        id: columnId,
        title: task.status,
        taskIds: [taskId],
      };
      columnOrder.push(columnId);
    }
  });

  return { tasks, columns, columnOrder };
};

// Format Trello Task Lists
export const formatTrelloTasksToKanban = (trelloCards, trelloLists) => {
  const tasks = {};
  const columns = {};
  const columnOrder = [];

  // Step 1: Build columns from all Trello lists
  trelloLists.forEach((list) => {
    columns[list.id] = {
      id: list.id,
      title: list.name,
      taskIds: [],
    };
    columnOrder.push(list.id);
  });

  // Step 2: Map cards into tasks and assign to columns
  trelloCards.forEach((card) => {
    const taskId = card.id;
    const columnId = card.listId;

    tasks[taskId] = {
      id: taskId,
      title: card.name,
      description: card.description || "",
      dueDate: card.dueDate,
      assignedTo: { name: "Unassigned", avatar: null },
    };

    if (columns[columnId]) {
      columns[columnId].taskIds.push(taskId);
    }
  });

  return { tasks, columns, columnOrder };
};
