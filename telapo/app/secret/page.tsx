import { getCurrentUser } from "@/server/userData";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Secret Santa - Secret",
  description: "Secret",
};

export default async function Page() {
  let user: Awaited<ReturnType<typeof getCurrentUser>>;
  try {
    user = await getCurrentUser();
  } catch {
    return redirect("/");
  }
  const canShowSecret = process.env.CAN_SHOW_SECRET === "true";
  if (!canShowSecret) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="md:w-[500px] md:h-[500px] w-full aspect-square relative">
          <img
            src="/backgrounds/secret.png"
            alt=""
            className="w-full h-full absolute"
          />
          <div className="absolute w-full h-full flex flex-col text-black font-bold text-3xl justify-center items-center">
            <h1>Oh the suspense!</h1>
            <p>I can't tell you yet!</p>
          </div>
        </div>
      </div>
    );
  }
  const drawn = user.latestDrew?.whoWasDrawn;
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="md:w-[500px] md:h-[500px] w-full aspect-square relative">
        <img
          src="/backgrounds/secret.png"
          alt=""
          className="w-full h-full absolute"
        />
        <div className="absolute w-full h-full flex flex-col text-black font-bold text-3xl justify-center items-center">
          <h1>You have drawn:</h1>
          {drawn ? (
            <>
              <h2>
                {drawn?.lastName} {drawn?.firstName}
              </h2>
              <h3 className="text-blue-500">
                <Link href={"/secret/wishlist"}>View their wishlist</Link>
              </h3>
            </>
          ) : (
            <h2>NO ONE?!</h2>
          )}
        </div>
      </div>
    </div>
  );
}
