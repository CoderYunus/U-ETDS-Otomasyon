"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import DataTable from "@/components/DataTable";
import TripDetailsBox from "@/components/TripDetailsBox";
import { Passenger, TripDetails } from "@/types";
import { parseText, submitToUetds } from "@/services/apiService";

export default function Home() {
  const [rawText, setRawText] = useState("");
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      window.location.href = "/login";
    } else {
      setRole(storedRole);
    }
  }, []);

  const [uploadedImages, setUploadedImages] = useState<{ id: string; name: string; base64: string }[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: { id: string; name: string; base64: string }[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64String = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        newImages.push({
          id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          base64: base64String
        });
      }
      
      setUploadedImages((prev) => [...prev, ...newImages]);
      setMessage({ text: `${files.length} adet görsel başarıyla eklendi. Şimdi yapay zeka ile çözümleyebilirsiniz.`, type: "success" });
      
      // Reset the file input value so the same file can be uploaded again
      e.target.value = "";
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages((prev) => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length === 0) {
        setMessage(null);
      } else {
        setMessage({ text: "Görsel silindi.", type: "success" });
      }
      return filtered;
    });
  };

  const handleParse = async () => {
    if (!rawText.trim() && uploadedImages.length === 0) return;
    
    setIsParsing(true);
    setMessage(null);
    const imagesPayload = uploadedImages.map((img) => img.base64);
    const res = await parseText(rawText, imagesPayload);
    
    if (res.success && res.data) {
      const filledPassengers = res.data.map(p => ({
        ...p,
        tcNo: p.tcNo && p.tcNo.trim() !== "" ? p.tcNo.trim() : "11111111111"
      }));
      setPassengers(filledPassengers);
      setTripDetails(res.tripDetails || null);
      setMessage({ text: "Veriler başarıyla çözümlendi. Lütfen tabloyu kontrol edin.", type: "success" });
    } else {
      setMessage({ text: res.message || "Çözümleme hatası.", type: "error" });
    }
    setIsParsing(false);
  };

  const handleSubmit = async () => {
    const hasInvalidTc = passengers.some(p => !p.tcNo || p.tcNo.trim() === "");
    if (hasInvalidTc) {
      setMessage({ text: "Hatalı veya eksik Kimlik/Pasaport Numarası girişleri mevcut. Lütfen tabloyu düzeltin.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    
    const res = await submitToUetds(passengers);
    if (res.success) {
      setMessage({ text: res.message || "Veriler başarıyla U-ETDS sistemine iletildi.", type: "success" });
      setPassengers([]); 
      setRawText("");
      setUploadedImages([]);
    } else {
      setMessage({ text: res.message || "İletim hatası.", type: "error" });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex h-screen bg-background-light overflow-hidden relative">
      
      {/* Dekoratif Arka Plan Işıkları */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-300/30 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-300/20 rounded-full blur-[150px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden pb-[80px] md:pb-0 relative z-10">
        <Topbar 
          onSubmitToUetds={handleSubmit} 
          isSubmitting={isSubmitting} 
          passengerCount={passengers.length} 
          passengers={passengers}
        />
        
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {message && (
              <div className={`p-4 rounded-xl mb-6 backdrop-blur-md shadow-sm border animate-fade-in-up ${message.type === 'success' ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-red-500/10 text-red-700 border-red-500/20'}`}>
                <div className="flex items-center">
                  {message.type === 'success' ? (
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  ) : (
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  )}
                  <span className="font-medium text-sm">{message.text}</span>
                </div>
              </div>
            )}

            {role === "Üye" ? (
              <div className="glass-panel p-10 text-center animate-fade-in-up mt-10 border-amber-200/50 bg-gradient-to-b from-amber-50/50 to-white/50 backdrop-blur-xl">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-amber-100/50 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-amber-800 mb-3">Hesabınız Onay Bekliyor</h3>
                <p className="text-amber-700/80 font-medium max-w-lg mx-auto text-lg">
                  Sisteme <strong>&quot;Üye&quot;</strong> rolü ile kayıtlısınız. Çözümleme yapabilmek ve U-ETDS bildirimi gönderebilmek için yöneticinin size <strong>&quot;Kullanıcı&quot;</strong> yetkisi vermesi gerekmektedir.
                </p>
              </div>
            ) : (
              <>
                <div className="glass-panel p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 tracking-tight flex items-center">
                  <img src="/uetds-icon.png" alt="Icon" className="w-6 h-6 mr-2 object-contain" />
                  Veri Girişi Merkezi
                </h3>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  WhatsApp veya SMS&apos;den gelen karışık yolcu listelerini metin olarak yapıştırın veya doğrudan bir ekran görüntüsü yükleyin. Gemini AI gerisini halleder.
                </p>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-6 mb-6">
                <div className="flex-1 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="relative w-full h-48 md:h-56 p-5 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-y font-mono text-sm text-gray-700 placeholder-gray-400 shadow-sm transition-all"
                    placeholder="Örnek:&#10;TC: 12345678901 İsim: Ali Yılmaz Tel: 05551112233 İstanbul'dan Ankara'ya&#10;TC: 11111111111 İsim: Ayşe Demir"
                  ></textarea>
                </div>
                
                <div className="lg:w-72 flex flex-col items-center justify-center relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-primary-500 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative w-full h-full min-h-[160px] flex flex-col items-center justify-center border-2 border-dashed border-primary-300/50 rounded-2xl bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all p-6 text-center">
                    <input 
                      type="file" 
                      id="imageUpload" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                      multiple
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                      <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-300">
                        <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <span className="text-sm font-bold text-gray-700">Görselleri Yükle</span>
                      <span className="text-xs text-gray-500 mt-1 font-medium">Tıkla veya Çoklu Seç (PNG, JPG)</span>
                    </label>
                    {uploadedImages.length > 0 && (
                      <div className="absolute bottom-4 inset-x-0 mx-auto w-11/12 bg-green-50 border border-green-200 text-green-700 text-xs py-1.5 px-2 rounded-lg font-semibold truncate shadow-sm">
                        ✨ {uploadedImages.length} Görsel Hazır
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-4 mb-6 p-4 bg-white/60 border border-white/50 rounded-2xl backdrop-blur-md shadow-inner animate-fade-in-up">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-gray-700 flex items-center">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 animate-ping"></span>
                      Yüklü Görseller ({uploadedImages.length})
                    </span>
                    <button 
                      onClick={() => {
                        setUploadedImages([]);
                        setMessage({ text: "Tüm görseller temizlendi.", type: "success" });
                      }}
                      className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors"
                    >
                      Tümünü Temizle
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {uploadedImages.map((img) => (
                      <div key={img.id} className="relative group/img bg-white/80 border border-gray-100 rounded-xl p-2 flex flex-col items-center shadow-sm hover:shadow-md transition-all">
                        <img 
                          src={img.base64} 
                          alt={img.name} 
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <span className="text-[10px] text-gray-600 mt-1.5 font-medium truncate w-full text-center px-1" title={img.name}>{img.name}</span>
                        <button
                          onClick={() => removeImage(img.id)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md hover:scale-110 transition-all opacity-100 sm:opacity-90 sm:group-hover/img:opacity-100 z-20 animate-fade-in"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end relative z-10">
                <button
                  onClick={handleParse}
                  disabled={isParsing || (!rawText.trim() && uploadedImages.length === 0)}
                  className={`btn-primary px-10 py-3.5 flex items-center ${isParsing || (!rawText.trim() && uploadedImages.length === 0) ? 'opacity-50 cursor-not-allowed hover:translate-y-0 shadow-none' : ''}`}
                >
                  {isParsing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Yapay Zeka Analiz Ediyor...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✨</span> Akıllı Çözümleme Başlat
                    </>
                  )}
                </button>
              </div>
            </div>

            {tripDetails && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <TripDetailsBox tripDetails={tripDetails} />
              </div>
            )}

            <div className="glass-panel p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 tracking-tight flex items-center">
                    <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                    Veri Doğrulama Tablosu
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 font-medium">U-ETDS&apos;ye veya Excel&apos;e aktarılacak olan liste. Eksiklikleri manuel düzeltebilirsiniz.</p>
                </div>
                <div className="mt-4 md:mt-0 px-4 py-2 bg-purple-50 border border-purple-100 rounded-xl text-sm font-semibold text-purple-700">
                  Toplam Yolcu: {passengers.length}
                </div>
              </div>
              <DataTable passengers={passengers} setPassengers={setPassengers} />
            </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
