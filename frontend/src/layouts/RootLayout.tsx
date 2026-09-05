import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card p-4">
        <h1 className="text-xl font-bold">DealFlow360</h1>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        DealFlow360 - B2B Sales Operations Platform
      </footer>
    </div>
  );
}
