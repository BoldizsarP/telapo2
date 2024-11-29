import { getCurrentUser } from "@/server/userData";
import { redirect } from "next/navigation";
import Image from "next/image";
export default async function Page() {
  let user: Awaited<ReturnType<typeof getCurrentUser>>;
  try {
    user = await getCurrentUser();
  } catch {
    return redirect("/");
  }
  const drawn = user.draws;
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="md:w-[500px] md:h-[500px] w-full aspect-square relative">
        <Image
          src="/backgrounds/secret.png"
          alt=""
          className="w-full h-full absolute"
        />
        <div className="absolute w-full h-full flex flex-col text-black font-bold text-3xl justify-center items-center">
          <h1>You have drawn:</h1>
          {drawn ? (
            <h2>
              {drawn?.lastName} {drawn?.firstName}
            </h2>
          ) : (
            <h2>NO ONE?!</h2>
          )}
        </div>
      </div>
    </div>
  );
}
