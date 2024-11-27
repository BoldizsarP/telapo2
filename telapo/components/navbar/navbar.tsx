import { auth } from "@/app/api/auth/[...nextauth]/auth";

export const NavBar = async () => {
  const session = await auth();
  const loggedIn = session?.user ?? undefined;
  return (
    <div className="w-full h-[10%] flex justify-between items-center bg-blue-200/30 px-4 text-black">
      <a className="christmas-font  text-3xl hidden md:block">Secret Santa</a>
      <a className="christmas-font  text-3xl md:hidden">Santa</a>
      <div className="flex space-x-2  text-2xl">
        {loggedIn ? (
          <>
            <a href={"/secret"}>Secret</a>
            <a href={"/profile"}>Profile</a>
            <a href={"/api/auth/signout"}>Logout</a>
          </>
        ) : (
          <a href="/api/auth/signin">Login</a>
        )}
      </div>
    </div>
  );
};
