import { ProfileEdit } from "@/components/profile/profileClient";
import { getCurrentUser } from "@/server/userData";
import { redirect } from "next/navigation";

export default async function Page() {
  let user: Awaited<ReturnType<typeof getCurrentUser>>;
  try {
    user = await getCurrentUser();
  } catch {
    return redirect("/");
  }
  return (
    <div className="flex w-full h-full items-center justify-center bg-black/20">
      <ProfileEdit {...user}></ProfileEdit>
    </div>
  );
}
