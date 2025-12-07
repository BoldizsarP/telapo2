"use client";
import { User } from "@/generated/prisma/client";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
});

export const ReadonlyWishlist = ({
  data,
  user,
}: {
  data?: any;
  user: Pick<User, "firstName" | "lastName">;
}) => {
  return (
    <>
      <div className="max-w-4xl m-20 p-5 bg-white rounded-xl flex flex-col text-black">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {user.firstName} {user.lastName}'s Wishlist
          </h1>
        </div>
        <p>You might get some inspiration from these ideas!</p>

        <div className="w-full h-full m-5  prose max-w-none">
          {data && (
            <Editor
              data={data}
              onChange={() => {}}
              readonly
              holder="wishlist"
            />
          )}
          {!data && <p>No wishlist found</p>}
        </div>
      </div>
    </>
  );
};
