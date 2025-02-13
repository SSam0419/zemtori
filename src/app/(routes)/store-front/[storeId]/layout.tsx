import React from "react";

import Navbar from "@/app/_features/store-front/Navbar";

async function StoreFrontLayout({
  children,
}: Readonly<{ children: React.ReactNode; params: Promise<{ storeId: string }> }>) {
  return (
    <div>
      <div className="fixed left-0 top-0 z-50 w-screen rounded-b border-b bg-background px-6 py-3">
        <Navbar />
      </div>
      <div className="px-10 pb-6 pt-20">{children}</div>
    </div>
  );
}

export default StoreFrontLayout;
