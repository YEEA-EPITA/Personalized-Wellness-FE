"use client";
import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { PLATFORMS } from "@/shared/constants/platforms";

export default function DialogComponent({ open, setOpen, heading }) {
  const dispatch = useDispatch();
  const handleClose = () => setOpen(false);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle
        display={"flex"}
        justifyContent="space-between"
        alignItems="center"
        pb={0}
      >
        <Typography variant="h6" fontWeight={600}>
          {heading || "Connect a new account"}
        </Typography>
        <IconButton onClick={handleClose}>
          <IoCloseSharp size={22} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {Object.values(PLATFORMS).map((platform) => (
            <Box
              key={platform.value}
              onClick={() => {
                dispatch(platform.geneateAuthUrl());
                setOpen(false);
              }}
              display={"flex"}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              p={1.5}
              borderRadius={2}
              border="1px solid #e0e0e0"
              sx={{
                border: "1px solid #e0e0e0",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#f9f9f9",
                  boxShadow: 1,
                },
              }}
            >
              <Typography fontWeight={500}>{platform.name}</Typography>
              <Image
                src={platform.icon}
                alt={platform.name}
                width={platform.width}
                height={platform.height}
              />
            </Box>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
