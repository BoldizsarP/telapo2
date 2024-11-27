"use client";

import { signIn } from "next-auth/react";

export const SignInButton = () => {
  return (
    <>
      <button onClick={() => signIn()}>Log the fuck in</button>
    </>
  );
};
