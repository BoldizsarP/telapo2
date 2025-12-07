import { auth } from "@/app/api/auth/[...nextauth]/auth";
import Link from "next/link";

import { MenuButton } from "./component/MenuButton";
export const NavBar = async () => {
  const session = await auth();
  const loggedIn = session?.user ?? undefined;
  return (
    <div className="w-full h-20 flex justify-between items-center bg-black px-4 md:px-8 text-red-600">
      <Link href="/" className="christmas-font  text-5xl hidden md:block">
        Secret Santa
      </Link>
      <Link className="christmas-font  text-3xl md:hidden" href={"/"}>
        Santa
      </Link>
      <div className=" space-x-2 md:space-x-8  text-2xl hidden md:flex">
        {loggedIn ? (
          <>
            <Link className="a-button" href={"/profile/wishlist"}>
              My Wishlist
            </Link>
            <Link className="a-button" href={"/secret"}>
              Secret
            </Link>
            <Link className="a-button" href={"/profile"}>
              Profile
            </Link>
            <Link className="a-button" href={"/api/auth/signout"}>
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link className="a-button" href={"/reset"}>
              Reset Password
            </Link>
            <Link href="/api/auth/signin" className="a-button">
              Login
            </Link>
          </>
        )}
      </div>
      <MenuButton loggedIn={!!loggedIn} />
    </div>
  );
};
