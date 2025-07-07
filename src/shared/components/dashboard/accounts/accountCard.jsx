import {
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  Tooltip,
} from "@mui/material";
import { FiTrash2, FiRefreshCcw } from "react-icons/fi";
import { PLATFORM_THEMES } from "@/shared/constants/platforms";
import { CircularProgress } from "@mui/material";

export default function AccountCard({
  account,
  onRemove,
  onReauth,
  isDeleting,
  isReauthenticating = true,
}) {
  const platform = PLATFORM_THEMES[account.type] || {};
  const Icon = platform.icon;

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 3,
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 4,
          backgroundColor: "#f9f9f9",
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          width={40}
          height={40}
          borderRadius={"50%"}
          display={"flex"}
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: "#f1f1f1",
          }}
        >
          {Icon && <Icon size={20} color={platform.color || "#999"} />}
        </Box>
        <Box>
          <Typography fontWeight={600}>{account.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {account.email}
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={1}>
        <Tooltip title="Re-authenticate">
          {isReauthenticating ? (
            <CircularProgress size={16} />
          ) : (
            <IconButton size="small" onClick={onReauth}>
              <FiRefreshCcw size={16} />
            </IconButton>
          )}
        </Tooltip>
        <Tooltip title="Remove">
          <IconButton size="small" onClick={onRemove} disabled={isDeleting}>
            {isDeleting ? (
              <CircularProgress size={16} />
            ) : (
              <FiTrash2 size={16} />
            )}
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
}
