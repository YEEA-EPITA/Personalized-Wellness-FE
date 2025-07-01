"use client";

import { verifyGoogleOAuth } from "@/shared/redux/slices/user";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import CircularLoader from "@/shared/components/loader/circularloader";

export default function Page() {
  const dispatch = useDispatch();
  const params = useParams();
  const token = params?.token;

  useEffect(() => {
    if (token) {
      dispatch(verifyGoogleOAuth({ token }));
    }
  }, [token]);

  return (
    <>
      <h1>Verifying...</h1>
      <br />
      <p>Please wait while we verify your account.</p>
      <br />
      <CircularLoader />
    </>
  );
}
