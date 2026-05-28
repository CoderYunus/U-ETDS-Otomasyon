"use client";

import { useState } from "react";
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

  const [imageBase64, setImageBase64] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String);
        setMessage({ text: "Görsel sisteme yüklendi. Şimdi yapay zeka ile çözümleyebilirsiniz.", type: "success" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParse = async () => {
    if (!rawText.trim() && !imageBase64) return;
    
    setIsParsing(true);
    setMessage(null);
    const res = await parseText(rawText, imageBase64);
    
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
      setImageBase64("");
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

            <div className="glass-panel p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 tracking-tight flex items-center">
                  <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
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
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                      <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-300">
                        <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <span className="text-sm font-bold text-gray-700">Görsel (OCR) Yükle</span>
                      <span className="text-xs text-gray-500 mt-1 font-medium">Tıkla veya Sürükle (PNG, JPG)</span>
                    </label>
                    {imageBase64 && (
                      <div className="absolute bottom-4 inset-x-0 mx-auto w-11/12 bg-green-50 border border-green-200 text-green-700 text-xs py-1.5 px-2 rounded-lg font-semibold truncate shadow-sm">
                        ✨ Görsel Hazır
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end relative z-10">
                <button
                  onClick={handleParse}
                  disabled={isParsing || (!rawText.trim() && !imageBase64)}
                  className={`btn-primary px-10 py-3.5 flex items-center ${isParsing || (!rawText.trim() && !imageBase64) ? 'opacity-50 cursor-not-allowed hover:translate-y-0 shadow-none' : ''}`}
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

          </div>
        </main>
      </div>
    </div>
  );
}
