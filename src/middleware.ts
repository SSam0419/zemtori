import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { isStoreValid } from "./app/_server/is-store-valid";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);
const currentDomain = process.env.NEXT_PUBLIC_DOMAIN;

export default clerkMiddleware(async (auth, request) => {
  const hostname = request.headers.get("host") || "";
  const subdomain = hostname.split(".")[0];

  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (subdomain === currentDomain) {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
  } else {
    // Store front handling
    const pathname = request.nextUrl.pathname;
    const searchParams = request.nextUrl.searchParams;
    const isValidStore = await isStoreValid(subdomain);
    if (!isValidStore) {
      //redirect to 404 page
      if (request.url.includes("/404")) {
        return NextResponse.next();
      }
      const newUrl = new URL("/404", request.url);
      return NextResponse.redirect(newUrl);
    } else {
      // Create new URL with subdomain path
      const newUrl = new URL(`/store-front/${subdomain}${pathname}`, request.url);

      // Preserve all search parameters
      searchParams.forEach((value, key) => {
        newUrl.searchParams.append(key, value);
      });

      return NextResponse.rewrite(newUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
