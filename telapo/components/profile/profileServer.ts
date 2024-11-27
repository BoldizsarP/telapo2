"use server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/app/utils/connect";
import { getSessionUser } from "@/server/userData";
import { revalidatePath } from "next/cache";

export const UpdateProfile = async (formData: FormData) => {
  const user = await getSessionUser();
  if (!user) {
    throw Error();
  }
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  if (typeof firstName != "string" || typeof lastName != "string")
    throw Error();

  await prisma.user.update({
    where: { email: user.valid_email },
    data: { firstName, lastName },
  });
  return revalidatePath("/profile");
};
