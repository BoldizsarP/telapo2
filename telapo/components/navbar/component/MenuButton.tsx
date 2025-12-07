"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

export const MenuButton = ({ loggedIn }: { loggedIn: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  function clickOutside(e: MouseEvent) {
    e.stopPropagation();
    setIsOpen(false);
  }
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", clickOutside);
      return () => {
        document.removeEventListener("click", clickOutside);
      };
    }
  }, [isOpen]);
  return (
    <>
      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        <Menu />
      </button>
      <div
        className="md:hidden fixed top-0 right-0 w-full h-full bg-black"
        style={{
          transform: isOpen ? "translateX(30%)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-x-1 space-y-1  w-[70%] pr-4">
          {loggedIn && (
            <>
              <Link href="/">
                <button className="a-button h-fit">Home</button>
              </Link>
              <Link href="/profile/wishlist">
                <button className="a-button h-fit">My Wishlist</button>
              </Link>
              <Link href="/secret">
                <button className="a-button h-fit">Secret</button>
              </Link>
              <Link href="/profile">
                <button className="a-button h-fit">Profile</button>
              </Link>
              <Link href="/api/auth/signout">
                <button className="a-button h-fit">Logout</button>
              </Link>
            </>
          )}
          {!loggedIn && (
            <>
              <Link href="/reset">
                <button className="a-button h-fit">Reset Password</button>
              </Link>
              <Link href="/api/auth/signin">
                <button className="a-button h-fit">Login</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};
