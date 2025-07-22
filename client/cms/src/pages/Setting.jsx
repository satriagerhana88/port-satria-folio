import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Setting() {
  const { user } = useAuth(); // hanya ambil yang digunakan
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:5100/api/auth/update',
        { username, password },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      setMessage('Berhasil update');
    } catch (err) {
      console.error(err);
      setMessage('Gagal update');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Pengaturan Admin</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2"
          placeholder="Username baru"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2"
          placeholder="Password baru"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}

