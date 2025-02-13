import { Bolt } from "lucide-react";
import Link from "next/link";

import { UserButton } from "@clerk/nextjs";

function SectionNavbar() {
  return (
    <div className="fixed left-0 top-0 z-50 flex w-screen items-center justify-between rounded-b-lg bg-foreground px-2 py-2 text-background sm:px-14">
      <div className="flex items-center gap-4">
        <Link href="#" scroll>
          <p className="flex items-center gap-1 font-bold">
            <Bolt />
            ZEMTORI
          </p>
        </Link>
        <Link href="#features">Features</Link>
        <Link href="#pricing">Pricing</Link>
      </div>
      <UserButton />
    </div>
  );
}

export default SectionNavbar;
