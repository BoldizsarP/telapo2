"use server";

import { auth } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/utils/connect";

export const getCurrentUser = async () => {
  const user = await getSessionUser();
  if (!user || !user.valid_email) throw Error();
  return await prisma.user.findFirstOrThrow({
    where: { email: user.valid_email },
    select: {
      firstName: true,
      email: true,
      lastName: true,
      latestDrew: {
        select: {
          whoWasDrawn: {
            select: { firstName: true, lastName: true, familyGroup: true },
          },
        },
      },
      familyGroup: true,
    },
  });
};
export const getDrewUserWishlist = async () => {
  const sessionUser = await getSessionUser();
  if (!sessionUser) throw Error();
  const user = await prisma.user.findFirstOrThrow({
    where: { email: sessionUser.valid_email },
    select: {
      id: true,
      latestDrew: {
        select: {
          whoWasDrawn: { select: { wishlists: { select: { data: true } } } },
        },
      },
    },
  });
  console.log(user);
  return user.latestDrew?.whoWasDrawn?.wishlists?.data;
};

export const getWishlist = async () => {
  const sessionUser = await getSessionUser();
  if (!sessionUser) throw Error();
  const user = await prisma.user.findFirstOrThrow({
    where: { email: sessionUser.valid_email },
    select: { id: true },
  });
  if (!user) throw Error();
  const wishlist = await prisma.wishlist.findFirst({
    where: { userId: user.id },
  });
  return wishlist;
};

export const getSessionUser = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user) return false;
  return user;
};

export const saveWishlist = async (data: any) => {
  const sessionUser = await getSessionUser();
  if (!sessionUser) throw Error();
  const user = await prisma.user.findFirstOrThrow({
    where: { email: sessionUser.valid_email },
    select: { id: true },
  });
  await prisma.wishlist.upsert({
    where: { userId: user.id },
    update: { data },
    create: { userId: user.id, data },
  });
  return {
    success: true,
  };
};
