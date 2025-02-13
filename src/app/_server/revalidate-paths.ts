"use server";

import { revalidatePath } from 'next/cache';


export async function revalidateEditProductPage() {
  revalidatePath(`/workspace/[shopId]/products/edit/[productId]`);
}

export async function revalidateSettingPage() {
  revalidatePath(`/workspace/[shopId]/settings`);
}
