import { isAuthed, svcGetAllProjects, svcGetProfile } from "@/lib/admin";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = isAuthed();

  if (!authed) {
    return <AdminLogin />;
  }

  let projects = [];
  let profile = { id: 1, building_style: "", story: "" };
  try {
    projects = await svcGetAllProjects();
    const p = await svcGetProfile();
    if (p) profile = p;
  } catch {
    // surface empty state; mutations still work
  }

  return <AdminDashboard initialProjects={projects} initialProfile={profile} />;
}
