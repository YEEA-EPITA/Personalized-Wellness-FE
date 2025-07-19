"use client";
import React, { useEffect, useState } from "react";
import SelectorComponent from "@/shared/components/general/selectorComponent";
import usePlatformsStore from "@/shared/zustand/stores/usePlatformsStore";
import { PLATFORMS } from "@/shared/constants/platforms";
import { Box, Button, Grid, Typography, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import KanbanBoard from "./kanbanboard";
import {
  formatJiraTasksToKanban,
  formatTrelloTasksToKanban,
} from "@/shared/utils/general";

const TasksComponent = () => {
  const [selectPlatform, setSelectedPlatform] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingTrelloLists, setIsFetchingTrelloLists] = useState(false);
  const [kanbanboardData, setKanbanBoardData] = useState({});
  const [onBreak, setOnBreak] = useState(false);

  const {
    accounts,
    fetchJiraProjects,
    jiraProjectsList,
    fetchJiraTasks,
    fetchTrelloBoards,
    trelloBoardsList,
    fetchTrelloTasks,
    fetchTrelloLists,
    trelloListsIds,
  } = usePlatformsStore();

  const platformOptions = Object.values(PLATFORMS).map((platform) => ({
    id: platform.value,
    name: platform.name,
  }));

  const filteredAccounts = accounts
    .filter((acc) => acc.type === selectPlatform)
    .map((acc) => ({
      id: acc.id,
      name: acc.email,
    }));

  const jiraProjectsOptions = jiraProjectsList.map((project) => ({
    id: project.key,
    name: project.name,
    key: project.key,
    cloudId: project.cloudId,
  }));

  const trelloBoardsOptions = trelloBoardsList.map((board) => ({
    id: board.id,
    name: board.name,
  }));

  useEffect(() => {
    if (selectedAccount) {
      if (selectPlatform === PLATFORMS.jira.value) {
        fetchJiraProjects({ email: selectedAccount });
      } else if (selectPlatform === PLATFORMS.trello.value) {
        fetchTrelloBoards({ email: selectedAccount });
      }
    }
  }, [selectedAccount]);

  useEffect(() => {
    setSelectedAccount("");
    setSelectedProject("");
  }, [selectPlatform]);

  useEffect(() => {
    if (selectPlatform === PLATFORMS.trello.value && selectedProject) {
      setIsFetchingTrelloLists(true);
      fetchTrelloLists({
        email: selectedAccount,
        boardId: selectedProject,
      }).finally(() => setIsFetchingTrelloLists(false));
    }
  }, [selectedProject]);

  const handleFetch = async () => {
    if (!selectPlatform || !selectedAccount || !selectedProject) {
      return;
    }
    setIsFetching(true);

    if (selectPlatform === PLATFORMS.jira.value) {
      const payload = {
        jiraEmail: selectedAccount,
        jiraProjects: [selectedProject],
        startDate: "2025-01-01",
        endDate: "2025-12-31",
      };
      const tasks = await fetchJiraTasks({ payload }).finally(() =>
        setIsFetching(false)
      );
      setKanbanBoardData(formatJiraTasksToKanban(tasks));
    } else if (selectPlatform === PLATFORMS.trello.value) {
      const payload = {
        trelloEmail: selectedAccount,
        listIds: trelloListsIds.map((list) => list.id),
      };
      const tasks = await fetchTrelloTasks({ payload }).finally(() =>
        setIsFetching(false)
      );
      setKanbanBoardData(formatTrelloTasksToKanban(tasks, trelloListsIds));
    }
  };

  const handleBreak = () => {
    setOnBreak(!onBreak);
  };

  return (
    <Box>
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SelectorComponent
            lable="Platforms"
            options={platformOptions}
            value={selectPlatform}
            onChange={setSelectedPlatform}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SelectorComponent
            lable="Accounts"
            options={filteredAccounts}
            value={selectedAccount}
            onChange={setSelectedAccount}
            valueKey="name"
            disabled={!selectPlatform}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SelectorComponent
            lable={
              isFetchingTrelloLists ? "Fetching Lists..." : "Projects/Boards"
            }
            options={
              selectPlatform === PLATFORMS.jira.value
                ? jiraProjectsOptions
                : trelloBoardsOptions
            }
            value={selectedProject}
            onChange={setSelectedProject}
            valueKey={selectPlatform === PLATFORMS.jira.value ? "key" : "id"}
            disabled={!selectedAccount || isFetchingTrelloLists}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleFetch}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.main",
                color: "white",
                borderColor: "primary.main",
              },
              padding: "14px 20px",
            }}
            disabled={
              !selectPlatform ||
              !selectedAccount ||
              !selectedProject ||
              isFetchingTrelloLists ||
              isFetching
            }
          >
            {isFetching ? "Fetching..." : "Fetch Tasks"}
          </Button>
        </Grid>
      </Grid>
      <Box
        mb={3}
        display={"flex"}
        justifyContent={"flex-end"}
        alignItems="center"
      >
        {/* Status Indicator */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: onBreak ? "error.main" : "primary.main",
              transition: "color 0.3s",
            }}
          >
            {onBreak ? "On Break" : "Back to Work"}
          </Typography>

          {/* Button */}
          <Button
            variant={onBreak ? "outlined" : "contained"}
            sx={{ textTransform: "none", borderRadius: "10px" }}
            onClick={handleBreak}
            startIcon={onBreak ? <PlayArrowIcon /> : <PauseIcon />}
          >
            {onBreak ? "Stop Break" : "Start Break"}
          </Button>
        </Stack>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <KanbanBoard
          boardData={kanbanboardData}
          platform={selectPlatform}
          accountEmail={selectedAccount}
          projectKey={selectedProject}
          cloudId={
            jiraProjectsOptions.find((p) => p.key === selectedProject)
              ?.cloudId || ""
          }
          trelloLists={trelloListsIds} // Pass Trello lists for intelligent mapping
        />
      </LocalizationProvider>
    </Box>
  );
};

export default TasksComponent;
