import {
  getCurrentUser,
  getDrewUserWishlist,
  getWishlist,
} from "@/server/userData";
import { redirect } from "next/navigation";
import { ReadonlyWishlist } from "./readonly-wishlist";

export default async function Page() {
  let user: Awaited<ReturnType<typeof getCurrentUser>>;
  try {
    user = await getCurrentUser();
  } catch {
    return redirect("/");
  }
  const drawnUser = user.latestDrew?.whoWasDrawn;
  const whishlist = await getDrewUserWishlist();
  return (
    <>
      <div className="flex justify-center min-w-xl">
        <ReadonlyWishlist
          data={whishlist}
          user={drawnUser ?? { firstName: "", lastName: "" }}
        />
      </div>
    </>
  );
}
