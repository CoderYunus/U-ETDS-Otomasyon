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
        setMessage({ text: "Görsel eklendi. Şimdi çözümleyebilirsiniz.", type: "success" });
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
    // Geçerlilik kontrolü (Sadece boş olup olmadığına bak, uzunluk veya rakam kontrolünü kaldırdık)
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
      setPassengers([]); // İşlem sonrası tabloyu temizle
      setRawText("");
    } else {
      setMessage({ text: res.message || "İletim hatası.", type: "error" });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex h-screen bg-surface-light overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden pb-[70px] md:pb-0">
        <Topbar 
          onSubmitToUetds={handleSubmit} 
          isSubmitting={isSubmitting} 
          passengerCount={passengers.length} 
          passengers={passengers}
        />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {message && (
              <div className={`p-4 rounded-md mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                {message.text}
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Metin veya Görsel Girişi</h3>
              <p className="text-sm text-gray-500 mb-4">
                Yolcu listesini metin olarak yapıştırabilir veya bir ekran görüntüsü/fotoğraf yükleyebilirsiniz. Yapay Zeka her ikisini de analiz edecektir.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="input-field h-40 resize-y font-mono text-sm"
                    placeholder="Örnek: Ali Yılmaz 11111111111 15 nolu koltuk İstanbul'dan Ankara'ya..."
                  ></textarea>
                </div>
                
                <div className="md:w-1/3 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <input 
                    type="file" 
                    id="imageUpload" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center text-gray-600">
                    <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-sm font-medium">Görsel Yükle</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG</span>
                  </label>
                  {imageBase64 && (
                    <div className="mt-3 text-xs font-semibold text-green-600 truncate w-full text-center">
                      ✓ Görsel hazır
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleParse}
                  disabled={isParsing || (!rawText.trim() && !imageBase64)}
                  className={`btn-primary px-8 ${isParsing || (!rawText.trim() && !imageBase64) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isParsing ? "Çözümleniyor..." : "Yapay Zeka ile Çözümle"}
                </button>
              </div>
            </div>

            {tripDetails && <TripDetailsBox tripDetails={tripDetails} />}

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800">Doğrulama Tablosu</h3>
              <p className="text-sm text-gray-500">Çözümlenen verileri U-ETDS&apos;ye göndermeden önce inceleyin ve gerekiyorsa düzenleyin.</p>
              <DataTable passengers={passengers} setPassengers={setPassengers} />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
