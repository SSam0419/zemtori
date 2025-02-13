import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/app/_shared/components/ui/button";

function BeamAction() {
  return (
    <Link href={"/workspace"}>
      <Button
        type="button"
        variant="outline"
        className="relative my-4 flex w-fit flex-col items-center justify-center overflow-hidden rounded-full hover:shadow-lg"
        hasBorderBeam
      >
        <span className="flex items-center gap-1">
          Start Now <ArrowRight />
        </span>
      </Button>
    </Link>
  );
}

export default BeamAction;
