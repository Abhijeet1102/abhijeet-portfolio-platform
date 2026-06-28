export default function AdminEditProject({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Project: {params.id}</h1>
      <div className="border border-border rounded-lg bg-card p-6">
        <p className="text-muted-foreground">Project Editor Foundation</p>
      </div>
    </div>
  );
}