import { ChangeEvent, useActionState, useEffect, useState } from "react";
import { resetPassword } from "./token_server";
import { redirect } from "next/navigation";
import "./reset.css";
import { toast } from "react-toastify";
import { Spinner } from "@/components/widget/spinner";

export const PasswordReset = ({ token }: { token: string }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setConfirmPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const readyAction = resetPassword.bind(null, token);
  const [state, formAction, loading] = useActionState(readyAction, null);

  useEffect(() => {
    if (state === true) {
      toast("Your password has been changed! Redirecting to login!", {
        type: "success",
      });
      return redirect("/api/auth/signin");
    }
    if (state && "global_error" in state) {
      toast("Oh oh, This link is no longer valid! Redirecting...", {
        type: "warning",
      });
      setTimeout(() => redirect("/"), 3000);
      return;
    }
  }, [state]);
  return (
    <div className="password-reset-container">
      <div className="reset-card">
        <h2>🎅 Reset Your Secret Santa Password! 🎄</h2>
        <p>Let’s secure your gift-giving mission! 🎁</p>
        <form action={formAction}>
          <div className="form-group">
            <label htmlFor="password">🎁 Create a New Password</label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="psw"
                placeholder="Enter your new password..."
                value={password}
                onChange={handlePasswordChange}
              />
              <span
                className="toggle-icon"
                onClick={toggleShowPassword}
                role="button"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">🎄 Confirm Your Password</label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="confirm-password"
                name="psw_confirm"
                placeholder="Re-enter your new password..."
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <span
                className="toggle-icon"
                onClick={toggleShowPassword}
                role="button"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {state && state !== true && "field_error" in state && (
            <p className="error-message">
              ❌ Ho ho oh no! Passwords don’t match.
            </p>
          )}

          <button
            disabled={loading == true}
            type="submit"
            className="submit-button"
          >
            {!loading ? "🎅 Save Password" : <Spinner />}
          </button>
        </form>
        <footer>
          <p>Need help? Contact the elves at support! 🎅</p>
        </footer>
      </div>
    </div>
  );
};
