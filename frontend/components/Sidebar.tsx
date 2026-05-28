"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <>
    <div className="w-72 bg-white/5 backdrop-blur-3xl border-r border-white/10 h-screen hidden md:flex md:flex-col shadow-2xl relative z-20">
      
      {/* Şık logo alanı */}
      <div className="p-8 flex flex-col justify-center border-b border-gray-200/50 min-h-[140px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <h2 className="text-xl font-extrabold text-gray-800 leading-tight flex items-center">
          <img src="/uetds-icon.png" alt="U-ETDS Icon" className="w-8 h-8 mr-3 object-contain drop-shadow-md" />
          U-ETDS
        </h2>
        <span className="block text-xs text-gray-500 font-semibold mt-2 tracking-wide uppercase ml-11">Yapay Zeka Otomasyonu</span>
      </div>

      <nav className="mt-8 flex-1 px-4 space-y-2">
        <Link href="/">
          <div className={`px-4 py-3.5 rounded-xl cursor-pointer flex items-center transition-all duration-300 ${isActive("/") ? "bg-primary-50 text-primary-700 border border-primary-100 shadow-[inset_4px_0_0_0_rgba(59,130,246,0.8)] font-bold" : "text-gray-500 hover:text-primary-600 hover:bg-primary-50/50 font-medium"}`}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            <span className="text-sm">Akıllı Veri Girişi</span>
          </div>
        </Link>
        
        {role === "Admin" && (
          <Link href="/admin">
            <div className={`px-4 py-3.5 rounded-xl cursor-pointer flex items-center transition-all duration-300 ${isActive("/admin") ? "bg-purple-50 text-purple-700 border border-purple-100 shadow-[inset_4px_0_0_0_rgba(168,85,247,0.8)] font-bold" : "text-gray-500 hover:text-purple-600 hover:bg-purple-50/50 font-medium"}`}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span className="text-sm">Yönetim Paneli</span>
            </div>
          </Link>
        )}
      </nav>

      <div className="px-4 mb-4">
        <button 
          onClick={() => {
            if(typeof window !== 'undefined'){
              localStorage.clear();
              document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = "/login";
            }
          }}
          className="w-full text-left px-4 py-3.5 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer flex items-center transition-all duration-300 group font-medium"
        >
          <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span className="text-sm">Güvenli Çıkış</span>
        </button>
      </div>

      {/* Footer Logoları */}
      <div className="p-6 border-t border-white/5 bg-black/20 flex flex-col items-center">
        <p className="text-[10px] text-gray-500 mb-4 font-bold uppercase tracking-widest">Powered By</p>
        <div className="flex items-center space-x-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <a href="https://www.linkedin.com/company/byzon-technologies/?viewAsMember=true" target="_blank" rel="noopener noreferrer">
            <img src="/byzon.svg" alt="Byzon" className="h-11 w-auto object-contain cursor-pointer brightness-0 invert" />
          </a>
          <span className="text-gray-600 font-light text-lg">|</span>
          <a href="https://www.instagram.com/zmrtravel/" target="_blank" rel="noopener noreferrer">
            <img src="/zmr.svg" alt="ZMR" className="h-6 w-auto object-contain cursor-pointer brightness-0 invert" />
          </a>
        </div>
      </div>
    </div>

    {/* Mobil Alt Navigasyon (Glassmorphism Bottom Bar) */}
    <div className="md:hidden fixed bottom-6 left-4 right-4 bg-white/50 backdrop-blur-xl border border-gray-200 rounded-2xl flex justify-around items-center z-50 p-2 shadow-lg pb-safe">
      <Link href="/" className="flex-1">
        <div className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive("/") ? "bg-primary-100 text-primary-700" : "text-gray-500 hover:text-primary-600"}`}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          <span className="text-[10px] font-bold tracking-wide">Panel</span>
        </div>
      </Link>
      {role === "Admin" && (
        <Link href="/admin" className="flex-1">
          <div className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive("/admin") ? "bg-purple-100 text-purple-700" : "text-gray-500 hover:text-purple-600"}`}>
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span className="text-[10px] font-bold tracking-wide">Yönetim</span>
          </div>
        </Link>
      )}
      <button 
        onClick={() => {
          if(typeof window !== 'undefined'){
            localStorage.clear();
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login";
          }
        }}
        className="flex-1 flex flex-col items-center p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
      >
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        <span className="text-[10px] font-bold tracking-wide">Çıkış</span>
      </button>
    </div>
    </>
  );
}
