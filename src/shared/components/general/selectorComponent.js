import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function SelectorComponent({
  lable = "Select Option",
  options = [],
  onChange,
  value,
  valueKey = "id",
  labelKey = "name",
  ...props
}) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl
        fullWidth
        sx={{
          mb: 2,
          "& .MuiInputBase-root": {
            borderRadius: "10px",
          },
        }}
      >
        <InputLabel id="demo-simple-select-label">{lable}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={lable}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option[valueKey]}>
              {option[labelKey]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
