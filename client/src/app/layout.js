import "@/app/globals.css";

import AppShell from "@/components/layout/AppShell";

export const metadata = {
  title: "Tomorrow Sales",
  description: "3D Real Estate Experience Center",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-900">
        {/* Wrap your entire app inside AppShell */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
