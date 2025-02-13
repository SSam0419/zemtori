import { LoaderCircle } from "lucide-react";

import { cn } from "../lib/utils";

function Spinner({ className }: { className?: string }) {
  return <LoaderCircle className={cn(className, "animate-spin")} />;
}

export default Spinner;
