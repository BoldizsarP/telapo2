"use client";

import { saveWishlist } from "@/server/userData";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "react-toastify";
import sample from "./sample.json";

const Editor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
});

export const WishlistEditor = ({ initialData }: { initialData: any }) => {
  const [editorData, setEditorData] = useState<any>(initialData);
  const [showSample, setShowSample] = useState<boolean>(
    Boolean(initialData) == false
  );

  return (
    <>
      <div className="max-w-4xl m-20 p-5 bg-white rounded-xl flex flex-col text-black">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Secret Santa Wishlist</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            disabled={showSample}
            onClick={async () => {
              const result = await fetch("/api/wishlist", {
                method: "POST",
                body: JSON.stringify({ data: editorData }),
              });
              if (!result.ok) {
                toast.error("Failed to save wishlist", {
                  autoClose: 3000,
                });
                return;
              }
              const data = await result.json();
              if (data.success) {
                toast.success("Wishlist saved");
              } else {
                toast.error("Failed to save wishlist", {
                  autoClose: 3000,
                });
              }
            }}
          >
            {showSample ? "Start Editing First" : "Save"}
          </button>
        </div>
        <p>
          This is the place you can tell your secret santa what you want for
          christmas
        </p>
        {showSample ? (
          <div className="w-full h-full p-5  prose max-w-none relative overflow-clip">
            <div
              className=" absolute w-full h-full z-10 bg-slate-800/25 flex justify-center items-start"
              onClick={() => {
                setShowSample(false);
              }}
            >
              <div className="h-full">
                <button className=" bg-slate-800/75 text-white rounded-lg p-4 mt-4 sticky">
                  Create Your Own List!
                </button>
              </div>
            </div>
            <Editor
              data={JSON.parse(sample.data)}
              onChange={setEditorData}
              holder="wishlist"
              readonly
            />
          </div>
        ) : (
          <div className="w-full h-full m-5  prose max-w-none">
            <Editor
              data={editorData}
              onChange={setEditorData}
              holder="wishlist"
            />
          </div>
        )}
      </div>
    </>
  );
};
