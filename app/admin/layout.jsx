import Sidebar from "@/Components/admin/Sidebar";

export default function AdminLayout({ children }) {

  

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      {children}
    </div>
  );
}