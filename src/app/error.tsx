"use client"; // Error components must be Client Components

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/app/_shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_shared/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="md:min-w-[800px]">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>{error.message}</CardContent>
        <CardFooter className="space-x-2">
          <Button className="w-full" variant="outline" onClick={() => reset()}>
            Try again
          </Button>
          <Button className="w-full" type="button">
            <Link href="/">Go Back To Home Page</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
