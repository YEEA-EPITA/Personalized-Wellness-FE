import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const KandbanTaskDialog = ({
  open,
  handleClose,
  handleSave,
  dialogData,
  setDialogData,
  errors,
  setErrors,
  isLoading,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: "#f9fafb",
          boxShadow: 5,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {dialogData.id ? "Edit Task" : "Create New Task"}
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Stack spacing={2}>
          <TextField
            variant="outlined"
            label="Title"
            required
            fullWidth
            value={dialogData.title}
            onChange={(e) => {
              setDialogData({ ...dialogData, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
            error={Boolean(errors.title)}
            helperText={errors.title}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "10px",
              },
            }}
          />

          <TextField
            variant="outlined"
            label="Description"
            required
            fullWidth
            multiline
            rows={3}
            value={dialogData.description}
            onChange={(e) => {
              setDialogData({ ...dialogData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: "" });
            }}
            error={Boolean(errors.description)}
            helperText={errors.description}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "10px",
              },
            }}
          />

          <DatePicker
            label="Due Date (Optional)"
            value={dialogData.dueDate ? dayjs(dialogData.dueDate) : null}
            onChange={(newValue) =>
              setDialogData({
                ...dialogData,
                dueDate: newValue ? dayjs(newValue).format("YYYY-MM-DD") : "",
              })
            }
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
              },
            }}
          />
        </Stack>
      </DialogContent>

      <Divider sx={{ my: 1 }} />

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ fontWeight: "bold" }}
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KandbanTaskDialog;
