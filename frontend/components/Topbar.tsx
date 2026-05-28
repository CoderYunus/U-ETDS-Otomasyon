"use client";

import { Passenger } from "@/types";
import { useState, useRef } from "react";

interface TopbarProps {
  onSubmitToUetds: () => void;
  isSubmitting: boolean;
  passengerCount: number;
  passengers: Passenger[];
}

export default function Topbar({ onSubmitToUetds, isSubmitting, passengerCount, passengers }: TopbarProps) {
  const [customTemplateBuffer, setCustomTemplateBuffer] = useState<ArrayBuffer | null>(null);
  const [templateName, setTemplateName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomTemplateBuffer(event.target.result as ArrayBuffer);
          setTemplateName(file.name);
          alert("Şablon başarıyla yüklendi! Artık indirilen Excel'ler bu dosya üzerinden oluşturulacak.");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      if (!customTemplateBuffer) {
        alert("Lütfen önce E-Devlet üzerinden indirdiğiniz güncel ve boş Excel şablonunu (Şablon Yükle butonundan) sisteme yükleyin.");
        return;
      }

      const exceljsModule = await import("exceljs");
      const ExcelJS = exceljsModule.default || exceljsModule;
      
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(customTemplateBuffer);
      
      const worksheet = workbook.getWorksheet("YOLCULAR");
      if (!worksheet) throw new Error("Yüklediğiniz şablonda YOLCULAR sayfası bulunamadı.");

      passengers.forEach((p, index) => {
        const rowIndex = index + 2;
        const row = worksheet.getRow(rowIndex);

        const countryMap: Record<string, string> = {
          "ARMENIA": "AM", "ERMENISTAN": "AM", "ERMENİSTAN": "AM",
          "RUSSIA": "RU", "RUSSIAN": "RU", "RUSYA": "RU", "RUSSIAN FEDERATION": "RU",
          "TURKEY": "TR", "TÜRKİYE": "TR", "TURKIYE": "TR",
          "GERMANY": "DE", "ALMANYA": "DE",
          "FRANCE": "FR", "FRANSA": "FR",
          "UNITED KINGDOM": "GB", "UK": "GB", "İNGİLTERE": "GB", "INGILTERE": "GB",
          "UNITED STATES": "US", "USA": "US", "AMERİKA": "US", "ABD": "US", "UNITED STATES OF AMERICA": "US",
          "IRAN": "IR", "İRAN": "IR", "ISLAMIC REPUBLIC OF IRAN": "IR",
          "IRAQ": "IQ", "IRAK": "IQ",
          "SYRIA": "SY", "SURİYE": "SY", "SURIYE": "SY",
          "GREECE": "GR", "YUNANİSTAN": "GR", "YUNANISTAN": "GR",
          "BULGARIA": "BG", "BULGARİSTAN": "BG", "BULGARISTAN": "BG",
          "GEORGIA": "GE", "GÜRCİSTAN": "GE", "GURCISTAN": "GE",
          "AZERBAIJAN": "AZ", "AZERBAYCAN": "AZ",
          "NETHERLANDS": "NL", "HOLLANDA": "NL",
          "ITALY": "IT", "İTALYA": "IT", "ITALYA": "IT",
          "SPAIN": "ES", "İSPANYA": "ES", "ISPANYA": "ES",
          "UKRAINE": "UA", "UKRAYNA": "UA",
          "BELARUS": "BY", "BEYAZ RUSYA": "BY",
          "KAZAKHSTAN": "KZ", "KAZAKİSTAN": "KZ", "KAZAKISTAN": "KZ",
          "UZBEKISTAN": "UZ", "ÖZBEKİSTAN": "UZ", "OZBEKISTAN": "UZ"
        };
        const rawUlke = p.nationality ? p.nationality.toUpperCase().trim() : "TR";
        const ulke = countryMap[rawUlke] || rawUlke;
        const ad = p.firstName ? p.firstName.toUpperCase() : "";
        const soyad = p.lastName ? p.lastName.toUpperCase() : "";
        const cinsiyet = p.gender && p.gender.toUpperCase() === "K" ? "K" : "E";

        row.getCell(1).value = ulke;
        row.getCell(2).value = ad;
        row.getCell(3).value = soyad;
        row.getCell(4).value = p.tcNo;
        row.getCell(5).value = cinsiyet;
        row.getCell(6).value = p.phone || "";
        row.getCell(7).value = "";

        row.getCell(1).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['\'ÜLKE KODLARI\'!$A$1:$A$300']
        };
        row.getCell(5).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"E,K"']
        };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "yolcular_uetds.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Excel oluşturulurken hata:", error);
      alert("Excel oluşturulurken bir hata oluştu: " + error);
    }
  };

  return (
    <div className="pt-4 md:pt-8 px-4 md:px-8 mb-6">
      <header className="glass-panel flex flex-col md:flex-row items-center justify-between p-4 md:px-6 gap-4 animate-fade-in-up">
        
        <div className="flex items-center justify-between w-full md:w-auto">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 tracking-tight">
            Sefer Bildirim Paneli
          </h1>
          <div className="md:hidden flex items-center bg-white/50 px-3 py-1 rounded-full border border-white">
            <span className="text-xs font-semibold text-gray-600">
              Bekleyen: <span className="text-primary-600 ml-1">{passengerCount}</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="hidden md:flex items-center bg-white/50 px-4 py-1.5 rounded-full border border-white mr-2 whitespace-nowrap">
            <span className="text-sm font-semibold text-gray-600">
              Onay Bekleyen: <span className="text-primary-600 ml-1">{passengerCount}</span>
            </span>
          </div>
          
          <input type="file" accept=".xlsx" ref={fileInputRef} onChange={handleTemplateUpload} className="hidden" />
          
          <a
            href="/sablon/ornek_sablon.xlsx"
            download
            className="btn-secondary whitespace-nowrap text-xs md:text-sm !py-2 !rounded-full !bg-white/40 hover:!bg-white"
            title="Boş şablonu bilgisayarınıza indirin"
          >
            <span className="flex items-center text-gray-700">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Şablon İndir
            </span>
          </a>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary whitespace-nowrap text-xs md:text-sm !py-2 !rounded-full !bg-white/40 hover:!bg-white"
            title="Kendi boş şablonunuzu yüklemek için tıklayın"
          >
            <span className="flex items-center text-gray-700">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              {templateName ? `Şablon: ${templateName}` : "Şablon Yükle"}
            </span>
          </button>

          <button
            onClick={handleDownloadExcel}
            disabled={passengerCount === 0 || !customTemplateBuffer}
            className={`btn-secondary whitespace-nowrap text-xs md:text-sm !py-2 !rounded-full !bg-white/40 hover:!bg-white ${passengerCount === 0 || !customTemplateBuffer ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!customTemplateBuffer ? "Önce şablon yüklemelisiniz" : "Verileri şablona aktar ve indir"}
          >
            <span className="flex items-center text-green-700">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Excel İndir
            </span>
          </button>
          
          <button
            onClick={onSubmitToUetds}
            disabled={isSubmitting || passengerCount === 0}
            className={`btn-primary whitespace-nowrap text-xs md:text-sm !py-2 !px-6 !rounded-full shadow-primary-500/40 ${isSubmitting || passengerCount === 0 ? 'opacity-50 cursor-not-allowed transform-none hover:shadow-none' : ''}`}
          >
            <span className="flex items-center">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  İletiliyor...
                </>
              ) : (
                <>
                  İlet
                  <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </span>
          </button>
        </div>
      </header>
    </div>
  );
}
