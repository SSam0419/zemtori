import { auth } from "@clerk/nextjs/server";
import { AuthenticationError } from "../../utils/errors";

export async function isUserSignedIn() {
  const { userId } = await auth();
  if (!userId) {
    throw new AuthenticationError("User not authenticated");
  }
  return userId;
}
