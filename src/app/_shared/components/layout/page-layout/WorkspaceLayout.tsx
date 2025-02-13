"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";

import { UserButton } from "@clerk/nextjs";

import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../../ui/sidebar";
import WorkspaceSidebar from "../../workspace-side-bar/WorkspaceSidebar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const { shopId } = useParams<{ shopId: string }>();

  const viewName = useMemo(() => {
    if (!shopId) return null;

    const workspaceLink = (
      <Link href={`/workspace/${shopId}`} className="text-xs font-medium hover:underline">
        Workspace
      </Link>
    );

    const productLink = (
      <Link href={`/workspace/${shopId}/products`} className="text-xs font-medium hover:underline">
        Product
      </Link>
    );

    const newProductLink = (
      <Link
        href={`/workspace/${shopId}/products/new`}
        className="text-xs font-medium hover:underline"
      >
        New
      </Link>
    );

    if (pathName === `/workspace/${shopId}/products/new`) {
      return (
        <div className="flex items-center gap-2 text-sm">
          {workspaceLink} / {productLink} / {newProductLink}
        </div>
      );
    }

    if (pathName.startsWith(`/workspace/${shopId}/products/edit`)) {
      return (
        <div className="flex items-center gap-2 text-xs font-medium">
          {workspaceLink} / {productLink} / Edit
        </div>
      );
    }

    if (pathName.startsWith(`/workspace/${shopId}/products`)) {
      return (
        <div className="flex items-center gap-2 text-sm">
          {workspaceLink} / {productLink}
        </div>
      );
    }

    return <div className="flex items-center gap-2 text-sm">{workspaceLink}</div>;
  }, [pathName, shopId]);

  return (
    <SidebarProvider className="">
      <WorkspaceSidebar />
      <SidebarInset className="">
        <ScrollArea className="h-screen w-full">
          <div className="flex items-center gap-2 bg-background p-1">
            <SidebarTrigger />
            <div className="text-sm text-muted-foreground">{viewName}</div>
            <div className="ml-auto flex items-center gap-2">
              <UserButton />
            </div>
          </div>

          <div className="max-h-full w-full rounded p-4">{children}</div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
