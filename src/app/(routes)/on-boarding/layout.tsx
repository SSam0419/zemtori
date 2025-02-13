import React from "react";

function OnboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-20 sm:p-40">
      {children}
    </div>
  );
}

export default OnboardLayout;
