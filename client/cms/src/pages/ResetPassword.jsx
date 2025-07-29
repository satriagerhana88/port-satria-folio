import { useState } from 'react';

export default function ResetPassword() {
  const [form, setForm] = useState({
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      return alert("Password baru tidak cocok!");
    }

    const res = await fetch('http://localhost:5100/api/auth/manual-reset', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        resetCode: form.resetCode,
        newPassword: form.newPassword
      })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Reset Password Admin</h2>
        <input type="text" name="resetCode" onChange={handleChange} placeholder="Kode Rahasia" required className="w-full border p-2 rounded mb-3" />
        <input type="password" name="newPassword" onChange={handleChange} placeholder="Password Baru" required className="w-full border p-2 rounded mb-3" />
        <input type="password" name="confirmPassword" onChange={handleChange} placeholder="Konfirmasi Password Baru" required className="w-full border p-2 rounded mb-3" />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Reset Password</button>
      </form>
    </div>
  );
}
