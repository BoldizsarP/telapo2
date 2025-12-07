import { getCurrentUser, getWishlist } from "@/server/userData";
import { redirect } from "next/navigation";
import { WishlistEditor } from "./wishlist-editor";
import Head from "next/head";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secret Santa - My Wishlist",
  description: "My Wishlist",
};

export default async function Page() {
  let user: Awaited<ReturnType<typeof getCurrentUser>>;
  try {
    user = await getCurrentUser();
  } catch {
    return redirect("/");
  }
  const whishlist = await getWishlist();
  return (
    <>
      <div className="flex justify-center min-w-xl">
        <WishlistEditor initialData={whishlist?.data} />
      </div>
    </>
  );
}
