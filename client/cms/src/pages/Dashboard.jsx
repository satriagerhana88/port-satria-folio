import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Nanti bisa tambahkan menu lainnya di sini */}
      <div>
        <Link
            to="/dashboard/setting"
            className="text-blue-600 underline hover:text-blue-800"
            >
            ⚙️ Pengaturan Admin
        </Link>
        <p>Selamat datang, {user?.username || 'Admin'}!</p>
      </div>
    </div>
  );
}
