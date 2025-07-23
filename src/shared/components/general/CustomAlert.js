"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Slide,
  Fade,
} from "@mui/material";
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// Transition component for smooth dialog animation
const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CustomAlert = ({
  open,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  type = "info", // 'success', 'error', 'warning', 'info'
  showCancel = false,
  confirmText = "OK",
  cancelText = "Cancel",
}) => {
  const getIcon = () => {
    const iconProps = {
      sx: {
        fontSize: 60,
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
        animation: "pulse 2s infinite",
      },
    };

    switch (type) {
      case "success":
        return <SuccessIcon color="success" {...iconProps} />;
      case "error":
        return <ErrorIcon color="error" {...iconProps} />;
      case "warning":
        return <WarningIcon color="warning" {...iconProps} />;
      default:
        return <InfoIcon color="info" {...iconProps} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          primary: "#4caf50",
          light: "#e8f5e8",
          gradient: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
        };
      case "error":
        return {
          primary: "#f44336",
          light: "#ffebee",
          gradient: "linear-gradient(135deg, #f44336 0%, #ef5350 100%)",
        };
      case "warning":
        return {
          primary: "#ff9800",
          light: "#fff3e0",
          gradient: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
        };
      default:
        return {
          primary: "#2196f3",
          light: "#e3f2fd",
          gradient: "linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)",
        };
    }
  };

  const colors = getColors();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .custom-alert-content {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={SlideTransition}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 0,
            background: `linear-gradient(135deg, ${colors.light} 0%, #ffffff 100%)`,
            border: `2px solid ${colors.primary}20`,
            boxShadow: `0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px ${colors.primary}10`,
            overflow: "hidden",
          },
        }}
      >
        {/* Header with gradient background */}
        <Box
          sx={{
            background: colors.gradient,
            color: "white",
            position: "relative",
            py: 3,
            px: 3,
          }}
        >
          {/* Close button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogTitle sx={{ textAlign: "center", pt: 3, pb: 1 }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            className="custom-alert-content"
          >
            <Fade in={open} timeout={500}>
              <Box>{getIcon()}</Box>
            </Fade>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                color: colors.primary,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 4, py: 2 }}>
          <Fade in={open} timeout={700}>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: "1.1rem",
                lineHeight: 1.5,
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              {message}
            </Typography>
          </Fade>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            px: 4,
            pb: 4,
            pt: 2,
          }}
        >
          {showCancel && (
            <Button
              onClick={handleCancel}
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                minWidth: 120,
                py: 1.5,
                borderColor: colors.primary,
                color: colors.primary,
                fontWeight: 600,
                "&:hover": {
                  borderColor: colors.primary,
                  backgroundColor: `${colors.primary}08`,
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {cancelText}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              minWidth: 120,
              py: 1.5,
              background: colors.gradient,
              fontWeight: 600,
              boxShadow: `0 4px 12px ${colors.primary}40`,
              "&:hover": {
                background: colors.gradient,
                transform: "translateY(-2px)",
                boxShadow: `0 6px 16px ${colors.primary}50`,
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomAlert;
