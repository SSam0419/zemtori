import { MoveRight } from "lucide-react";
import Link from "next/link";

import { Button } from "./_shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./_shared/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center sm:p-20">
      <Card className="">
        <CardHeader>
          <CardTitle>Ops, page not found </CardTitle>
          <CardDescription>Sorry, the page you are looking for could not be found.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>
            <Link href="/" className="flex items-center gap-2 hover:underline">
              Return to home <MoveRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
