"use client";
import { useSearchParams } from "next/navigation";
import { PasswordReset } from "./token";
import PasswordResetRequest from "./requestReset";
import { useEffect, useState } from "react";
export default function Page() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  return (
    <div className=" w-full h-full justify-center items-center">
      {token ? (
        <PasswordReset token={token}></PasswordReset>
      ) : (
        <PasswordResetRequest
          baseUrl={globalThis.window?.location.origin ?? ""}
        />
      )}
    </div>
  );
}
