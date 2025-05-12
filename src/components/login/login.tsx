import { useState } from 'react';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/trust/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', '1');
      localStorage.setItem('username', username); 
      window.location.href = '/admin';
    } else {
      setError(data.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: "url('/splash-background.jpg')" }}>
      <div className="bg-[#686868] rounded-3xl shadow-2xl px-8 py-12 w-full max-w-xl flex flex-col items-center">
        <Image
          src="/trust-or-self-logo.png"
          alt="Logo"
          width={120}
          height={100}
          className="w-30 h-25 mb-4"
        />
        <h2 className="text-3xl font-bold text-[#1b1b62] text-center mb-8 leading-snug">
          Đăng nhập để chuyển sang<br />Admin
        </h2>
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Tên đăng nhập"
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1b1b62] text-lg"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1b1b62] text-lg"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600 text-center text-base">{error}</div>}
          <button
            type="submit"
            className="mt-2 w-full bg-[#1b1b62] hover:bg-[#feb622] text-white font-bold py-3 rounded-lg text-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FaSignInAlt className="text-xl" /> Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}