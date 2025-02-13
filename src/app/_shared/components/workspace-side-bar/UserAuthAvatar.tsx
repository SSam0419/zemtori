"use client";
import { CircleUserRound } from "lucide-react";
import React from "react";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

function UserAuthAvatar() {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <CircleUserRound className="h-6 w-6 hover:cursor-pointer" />
        </SignInButton>
      </SignedOut>
    </>
  );
}

export default UserAuthAvatar;
