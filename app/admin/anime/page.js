// app/admin/anime/page.jsx
import AnimeManagement from "@/components/admin/AnimeManagement";

export const metadata = {
  title: "Anime Management | Admin",
  description: "Manage anime database",
};

export default function AnimeAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AnimeManagement />
    </div>
  );
}
