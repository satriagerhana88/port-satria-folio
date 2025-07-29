import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import LogoSatria from '../assets/logo-satria.svg';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5100/api/auth/login', {
      username,
      password
    });
    localStorage.setItem('token', res.data.token);
    navigate('/dashboard');
  } catch (err) {
    console.error(err);
    setError('Login gagal. Coba cek username/password.');
  }
};


  return (
    <div className="min-h-screen bg-[#2C2638] px-32 grid grid-cols-2">
      <div className='border flex items-center'>
        <img src={LogoSatria} alt="Logo Satria" className='w-[55%]'/>
        <p>Hey, Hello</p>
        <p>Build Your Future from your skills</p>
      </div>
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-2 border"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
        {/* Reset Password */}
        <div className="text-center mt-4">
          <a href="/reset-password" className="text-blue-500 hover:underline">
            Reset Password
          </a>
        </div>
      </form>
    </div>
  );
}
