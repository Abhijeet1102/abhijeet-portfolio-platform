import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Abhijeet Rai",
  description: "Explore my admin.",
};

export default function AdminPage() {
  return (
    <section className="flex flex-col gap-6 py-8 md:py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Admin</h1>
        <p className="text-lg text-muted-foreground">
          Detailed information about admin.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Content */}
        <div className="h-64 rounded-lg border bg-card p-6 shadow-sm"></div>
        <div className="h-64 rounded-lg border bg-card p-6 shadow-sm"></div>
        <div className="h-64 rounded-lg border bg-card p-6 shadow-sm"></div>
      </div>
    </section>
  );
}
