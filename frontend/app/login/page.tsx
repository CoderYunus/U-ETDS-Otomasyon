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
      
      document.cookie = `token=${res.token}; path=/; max-age=28800`;
      window.location.href = "/";
    } else {
      setError(res.message || "Giriş başarısız. Kullanıcı adı veya şifre hatalı.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background-dark">
      {/* Arka plan dekoratif elementler */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>

      <div className="z-10 w-full max-w-md p-4 animate-fade-in-up">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl p-10 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-purple-500"></div>

          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full"></div>
            <div className="relative z-10 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl">
              <img src="/uetds-logo.png" alt="U-ETDS Otomasyon" className="h-28 w-auto object-contain hover:scale-105 transition-transform duration-500 drop-shadow-2xl" />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Sistem <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Girişi</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2 font-medium">Yapay Zeka Destekli Sefer Otomasyonu</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-sm flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 ml-1">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-300"
                placeholder="Yunus"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 ml-1">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-300"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-primary-500 font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-1 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Giriş Yapılıyor...
                </span>
              ) : "Sisteme Giriş Yap"}
            </button>
          </form>

          <div className="mt-12 text-center flex flex-col items-center">
            <p className="text-[10px] text-gray-400 font-semibold mb-3 uppercase tracking-widest">Powered By</p>
            <div className="flex items-center justify-center space-x-4 bg-white/5 px-6 py-3 rounded-full border border-white/5 backdrop-blur-sm">
               <a href="https://www.linkedin.com/company/byzon-technologies/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="group">
                 <img src="/byzon.svg" alt="Byzon" className="h-6 w-auto opacity-70 group-hover:opacity-100 transition-all duration-300 brightness-0 invert" />
               </a>
               <span className="text-gray-500/50 text-xl font-light">|</span>
               <a href="https://www.instagram.com/zmrtravel/" target="_blank" rel="noopener noreferrer" className="group">
                 <img src="/zmr.svg" alt="ZMR" className="h-6 w-auto opacity-70 group-hover:opacity-100 transition-all duration-300 brightness-0 invert" />
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
