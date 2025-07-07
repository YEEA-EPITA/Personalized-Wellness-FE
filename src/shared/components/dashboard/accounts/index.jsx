"use client";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import AccountsTab from "./accountsTab";
import usePlatformsStore from "@/shared/zustand/stores/usePlatformsStore";

export default function LinkAccounts() {
  const { fetchAccounts } = usePlatformsStore();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

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
