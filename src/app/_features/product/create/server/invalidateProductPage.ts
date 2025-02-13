"use server";

import { revalidatePath } from "next/cache";

export async function invalidateProductCache() {
  await revalidatePath(
    "/workspace/[shopId]/products",
    "page",
  );
}
