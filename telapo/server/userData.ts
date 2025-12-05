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
      draws: { select: { firstName: true, lastName: true, familyGroup: true } },
      familyGroup: true,
    },
  });
};

export const getSessionUser = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user) return false;
  return user;
};
