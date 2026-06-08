import { BottomNav } from "@/components/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="h-full overflow-y-auto pb-24">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
