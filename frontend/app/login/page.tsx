"use client";

import { useState } from "react";
import { login } from "@/services/apiService";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await login(username, password);
    if (res.success && res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("username", res.username);
      localStorage.setItem("role", res.role);
      
      // Cookie needed for middleware
      document.cookie = `token=${res.token}; path=/; max-age=28800`;
      
      // Redirect using window.location to force a full reload and bypass middleware caching
      window.location.href = "/";
    } else {
      setError(res.message || "Giriş başarısız. Kullanıcı adı veya şifre hatalı.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border border-gray-100">
        <div className="flex justify-center mb-8">
          <a href="https://www.linkedin.com/company/byzon-technologies/?viewAsMember=true" target="_blank" rel="noopener noreferrer">
            <img src="/byzon.svg" alt="BYZON Technologies" className="h-24 w-auto object-contain hover:opacity-80 transition-opacity" />
          </a>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          U-ETDS Otomasyonuna Giriş
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none"
              placeholder="Yunus"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-medium transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? "Giriş Yapılıyor..." : "Sisteme Giriş Yap"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6 flex flex-col items-center">
          <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-widest">Powered By</p>
          <div className="flex items-center space-x-3 justify-center">
             <a href="https://www.linkedin.com/company/byzon-technologies/?viewAsMember=true" target="_blank" rel="noopener noreferrer">
               <img src="/byzon.svg" alt="Byzon" className="h-23 w-auto hover:opacity-80 transition-opacity" />
             </a>
             <span className="text-gray-300">&</span>
             <a href="https://www.instagram.com/zmrtravel/" target="_blank" rel="noopener noreferrer">
               <img src="/zmr.svg" alt="ZMR" className="h-12 w-auto hover:opacity-80 transition-opacity" />
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}
