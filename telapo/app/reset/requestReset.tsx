import React, { useActionState, useEffect, useState } from "react";
import "./PasswordResetRequest.css"; // Import the CSS file
import { requestReset } from "./token_server";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/widget/spinner";

const PasswordResetRequest = ({ baseUrl }: { baseUrl: string }) => {
  const [message, setMessage] = useState("");
  const readyAction = requestReset.bind(null, baseUrl);
  const [state, formAction, loading] = useActionState(readyAction, null);
  useEffect(() => {
    if (state !== null) {
      toast("Redirect link was sent!", {
        type: "success",
      });
      setTimeout(() => {
        redirect("/api/auth/signin");
      }, 3000);
    }
  }, [state]);
  return (
    <div className="container reset-card text-black">
      <h1>Forgot Your Password?</h1>
      <p>
        No worries! Just enter your email address below, and we’ll send you
        instructions to reset your password.
      </p>

      <form action={formAction} className="form">
        <label htmlFor="email" className="label">
          Enter Your Email Address:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email address"
          className="input"
          required
        />
        <button disabled={loading === true} type="submit" className="button">
          {!loading ? "Send Reset Link" : <Spinner />}
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      <p>
        If you don’t receive an email, check your spam folder or{" "}
        <a href="/support" className="link">
          Contact Support
        </a>
        .
      </p>
    </div>
  );
};

export default PasswordResetRequest;
