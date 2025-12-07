"use client";
import { useSearchParams } from "next/navigation";
import { PasswordReset } from "./token";
import PasswordResetRequest from "./requestReset";
import { ReactElement, Suspense } from "react";

function Reset(): ReactElement {
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
export default function Page(): ReactElement {
  return (
    <>
      <Suspense>
        <Reset />
      </Suspense>
    </>
  );
}
