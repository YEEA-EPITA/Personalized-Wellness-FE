"use client";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import DialogComponent from "./servicesListDialogbox";
import AccountsTab from "./accountsTab";
import { fetchAccountsList } from "@/shared/redux/slices/platforms";
import { useDispatch } from "react-redux";

export default function LinkAccounts() {
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAccountsList());
  }, []);

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ marginBottom: "20px" }}
      >
        <h2>Accounts</h2>
      </Box>
      <AccountsTab />
    </Box>
  );
}
