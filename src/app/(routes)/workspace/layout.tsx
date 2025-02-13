import WorkspaceLayout from "@/app/_shared/components/layout/page-layout/WorkspaceLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WorkspaceLayout>{children}</WorkspaceLayout>;
}
