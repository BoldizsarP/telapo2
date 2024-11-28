import { auth } from "@/app/api/auth/[...nextauth]/auth";

export const NavBar = async () => {
  const session = await auth();
  const loggedIn = session?.user ?? undefined;
  return (
    <div className="w-full h-[10%] flex justify-between items-center bg-blue-200/75 px-4 md:px-8 text-black">
      <a href="/" className="christmas-font  text-5xl hidden md:block">
        Secret Santa
      </a>
      <a className="christmas-font  text-3xl md:hidden">Santa</a>
      <div className="flex space-x-2 md:space-x-8  text-2xl">
        {loggedIn ? (
          <>
            <a className="a-button" href={"/secret"}>
              Secret
            </a>
            <a className="a-button" href={"/profile"}>
              Profile
            </a>
            <a className="a-button" href={"/api/auth/signout"}>
              Logout
            </a>
          </>
        ) : (
          <>
            <a className="a-button" href={"/reset"}>
              Reset Password
            </a>
            <a href="/api/auth/signin" className="a-button">
              Login
            </a>
          </>
        )}
      </div>
    </div>
  );
};
