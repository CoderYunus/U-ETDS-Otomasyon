import Link from "next/link";

export default function Sidebar() {
  return (
    <>
    <div className="w-64 bg-surface-light border-r border-gray-200 h-screen hidden md:flex md:flex-col">
      <div className="p-6 flex flex-col justify-center border-b border-gray-100 min-h-[120px]">
        <h2 className="text-lg font-extrabold text-primary leading-tight">
          Byzon Gelişmiş
          <span className="block text-sm text-gray-500 font-medium mt-1">U-ETDS Sefer Otomasyonu</span>
        </h2>
      </div>
      <nav className="mt-6 flex-1">
        <ul>
          <Link href="/">
            <li className="px-6 py-3 hover:bg-blue-50 text-gray-700 hover:text-primary font-medium cursor-pointer flex items-center transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Akıllı Veri Girişi
            </li>
          </Link>
          <Link href="/admin">
            <li className="px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-primary cursor-pointer flex items-center transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              Yönetim Paneli
            </li>
          </Link>
          <button 
            onClick={() => {
              if(typeof window !== 'undefined'){
                localStorage.clear();
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "/login";
              }
            }}
            className="w-full text-left px-6 py-3 text-red-500 hover:bg-red-50 cursor-pointer flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sistemden Çıkış
          </button>
        </ul>
      </nav>

      {/* Footer Logoları */}
      <div className="p-6 border-t border-gray-200 bg-gray-50 flex flex-col items-center">
        <p className="text-xs text-gray-400 mb-4 font-semibold uppercase tracking-widest">Powered By</p>
        <div className="flex items-center space-x-4">
          <img src="/byzon.svg" alt="Byzon" className="h-20 w-auto object-contain" />
          <span className="text-xl font-bold text-gray-300">&</span>
          <img src="/zmr.svg" alt="ZMR" className="h-8 w-auto object-contain" />
        </div>
        <p className="text-sm text-gray-600 mt-4 font-bold">Byzon & ZMR Travel</p>
      </div>
    </div>

    {/* Mobil Alt Navigasyon (Sadece mobilde görünür) */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center z-50 p-3 shadow-lg">
      <Link href="/">
        <div className="flex flex-col items-center text-gray-600 hover:text-primary">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <span className="text-[10px] font-medium">Veri Girişi</span>
        </div>
      </Link>
      <Link href="/admin">
        <div className="flex flex-col items-center text-gray-600 hover:text-primary">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span className="text-[10px] font-medium">Yönetim</span>
        </div>
      </Link>
      <button 
        onClick={() => {
          if(typeof window !== 'undefined'){
            localStorage.clear();
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login";
          }
        }}
        className="flex flex-col items-center text-red-500 hover:text-red-700"
      >
        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        <span className="text-[10px] font-medium">Çıkış</span>
      </button>
    </div>
    </>
  );
}
