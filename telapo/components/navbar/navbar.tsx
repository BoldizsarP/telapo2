import { auth } from "@/app/api/auth/[...nextauth]/auth";
import Link from "next/link";

export const NavBar = async () => {
  const session = await auth();
  const loggedIn = session?.user ?? undefined;
  return (
    <div className="w-full h-[10%] flex justify-between items-center bg-blue-200/75 px-4 md:px-8 text-black">
      <Link href="/" className="christmas-font  text-5xl hidden md:block">
        Secret Santa
      </Link>
      <Link className="christmas-font  text-3xl md:hidden" href={"/"}>
        Santa
      </Link>
      <div className="flex space-x-2 md:space-x-8  text-2xl">
        {loggedIn ? (
          <>
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
    </div>
  );
};
