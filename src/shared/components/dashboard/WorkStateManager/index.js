"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import StopIcon from "@mui/icons-material/Stop";

import usePlatformsStore from "@/shared/zustand/stores/usePlatformsStore";

const WorkStateManager = () => {
  const { startTrackTime, trackTime } = usePlatformsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isWorking = trackTime?.working || false;

  const handleToggleWork = async () => {
    setIsSubmitting(true);
    await startTrackTime().finally(() => {
      setIsSubmitting(false);
    });
  };

  const getWorkStateConfig = () => {
    if (isWorking) {
      return {
        label: "Stop Work",
        icon: <StopIcon />,
        variant: "contained",
        color: "error",
        statusText: "Working",
        statusColor: "success.main",
      };
    } else {
      return {
        label: "Start Work",
        icon: <WorkIcon />,
        variant: "contained",
        color: "primary",
        statusText: "Ready to Work",
        statusColor: "text.secondary",
      };
    }
  };

  return (
    <Box
      mb={3}
      display={"flex"}
      justifyContent={"flex-end"}
      alignItems="center"
    >
      {/* Work Status Section */}
      <Stack direction="row" spacing={3} alignItems="center">
        {/* Status Indicator with Icon */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: getWorkStateConfig().statusColor,
              animation: isWorking ? "pulse 2s infinite" : "none",
              "@keyframes pulse": {
                "0%": { opacity: 1 },
                "50%": { opacity: 0.5 },
                "100%": { opacity: 1 },
              },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: getWorkStateConfig().statusColor,
              transition: "color 0.3s",
            }}
          >
            {getWorkStateConfig().statusText}
          </Typography>
        </Stack>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1}>
          {/* Main Work Toggle Button */}
          <Button
            variant={getWorkStateConfig().variant}
            color={getWorkStateConfig().color}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              minWidth: "140px",
              fontWeight: 600,
              boxShadow: isWorking
                ? "0 4px 12px rgba(25, 118, 210, 0.3)"
                : "none",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
              },
            }}
            onClick={handleToggleWork}
            startIcon={getWorkStateConfig().icon}
          >
            {isSubmitting ? (
              <CircularProgress size={24} />
            ) : (
              getWorkStateConfig().label
            )}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default WorkStateManager;
