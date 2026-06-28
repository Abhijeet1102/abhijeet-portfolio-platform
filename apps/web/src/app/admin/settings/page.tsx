export default function AdminSettingsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings Management</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">Create New</button>
      </div>
      <div className="border border-border rounded-lg bg-card p-6">
        <p className="text-muted-foreground">Settings Data Table & CMS Foundation</p>
      </div>
    </div>
  );
}