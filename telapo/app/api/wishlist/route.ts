import { getSessionUser, saveWishlist } from "@/server/userData";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestZodSchema = z.object({
  data: z.any(),
});

async function POST(req: Request) {
  const { data } = requestZodSchema.parse(await req.json());
  const result = await saveWishlist(data);
  return NextResponse.json({ success: result.success });
}

export { POST };
