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

  const handleParse = async () => {
    if (!rawText.trim()) return;
    
    setIsParsing(true);
    setMessage(null);
    const res = await parseText(rawText);
    
    if (res.success && res.data) {
      setPassengers(res.data);
      setTripDetails(res.tripDetails || null);
      setMessage({ text: "Metin başarıyla çözümlendi. Lütfen tabloyu kontrol edin.", type: "success" });
    } else {
      setMessage({ text: res.message || "Çözümleme hatası.", type: "error" });
    }
    setIsParsing(false);
  };

  const handleSubmit = async () => {
    // Geçerlilik kontrolü
    const hasInvalidTc = passengers.some(p => !p.tcNo || p.tcNo.length !== 11 || !/^\d+$/.test(p.tcNo));
    if (hasInvalidTc) {
      setMessage({ text: "Hatalı TC Kimlik Numarası girişleri mevcut. Lütfen tabloyu düzeltin.", type: "error" });
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
              <h3 className="text-lg font-medium text-gray-800 mb-4">Serbest Metin Girişi</h3>
              <p className="text-sm text-gray-500 mb-4">
                WhatsApp, SMS veya E-posta üzerinden gelen yolcu listesini aşağıya yapıştırın. Yapay Zeka (Gemini) metni otomatik analiz edecektir.
              </p>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="input-field h-40 resize-y font-mono text-sm"
                placeholder="Örnek: Ali Yılmaz 11111111111 15 nolu koltuk İstanbul'dan Ankara'ya..."
              ></textarea>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleParse}
                  disabled={isParsing || !rawText.trim()}
                  className={`btn-primary px-8 ${isParsing || !rawText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
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
