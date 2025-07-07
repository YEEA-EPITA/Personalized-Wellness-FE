// AccountsTab.jsx
"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Stack,
  Skeleton,
} from "@mui/material";
import DialogComponent from "@/shared/components/dashboard/accounts/servicesListDialogbox";
import usePlatformsStore from "@/shared/zustand/stores/usePlatformsStore";
import AccountCard from "@/components/dashboard/accounts/accountCard";
import { PLATFORMS } from "@/shared/constants/platforms";
import Image from "next/image";

const TABS = Object.values(PLATFORMS).map((platform) => ({
  label: platform.name,
  value: platform.value,
  icon: platform.icon ? (
    <Image src={platform.icon} alt={platform.name} width={24} height={24} />
  ) : (
    platform.icon || null
  ),
}));

export default function AccountsTab() {
  const [value, setValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReauthenticating, setIsReauthenticating] = useState(false);

  const { platforms, isLoading, fetchAccounts, deleteConnectedAccount } =
    usePlatformsStore();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredAccounts = platforms.filter(
    (acc) =>
      acc.type === TABS[value].value &&
      (acc.name?.toLowerCase()?.includes(search.toLowerCase()) ||
        acc.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <Tabs
          value={value}
          onChange={(e, val) => setValue(val)}
          variant="fullWidth"
        >
          {TABS.map((tab, i) => (
            <Tab icon={tab.icon} label={tab.label} key={i} />
          ))}
        </Tabs>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => setDialogOpen(true)}>
            + New Account
          </Button>
          <Button variant="contained" onClick={fetchAccounts}>
            Refresh
          </Button>
        </Stack>
      </Box>

      <TextField
        size="small"
        placeholder="Search accounts..."
        value={search}
        onChange={handleSearch}
        sx={{ mt: 2, width: 300 }}
      />

      <Typography variant="h6" mt={4} mb={2}>
        {TABS[value].label} Accounts
      </Typography>

      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" height={100} />
      ) : filteredAccounts.length > 0 ? (
        <Stack spacing={2}>
          {filteredAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onRemove={() => {
                setIsDeleting(true);
                deleteConnectedAccount({ accountId: account.id }).finally(() =>
                  setIsDeleting(false)
                );
              }}
              isDeleting={isDeleting}
              isReauthenticating={isReauthenticating}
              onReauth={() => {
                setIsReauthenticating(true);
                PLATFORMS[account.type?.toLowerCase()]
                  .geneateAuthUrl()
                  .then(() => setIsReauthenticating(false));
              }}
            />
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No accounts found.
        </Typography>
      )}

      <DialogComponent
        open={dialogOpen}
        setOpen={setDialogOpen}
        heading="Link New Account"
      />
    </Box>
  );
}
