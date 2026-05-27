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

      // 1. exceljs kütüphanesini yükle
      const exceljsModule = await import("exceljs");
      const ExcelJS = exceljsModule.default || exceljsModule;
      
      // 2. Yüklenen şablonu belleğe oku
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(customTemplateBuffer);
      
      // 3. YOLCULAR sayfasını bul
      const worksheet = workbook.getWorksheet("YOLCULAR");
      
      if (!worksheet) throw new Error("Yüklediğiniz şablonda YOLCULAR sayfası bulunamadı. Doğru dosyayı yüklediğinize emin olun.");

      // 4. 2. Satırdan itibaren verileri yaz (1. Satır Başlık)
      passengers.forEach((p, index) => {
        const rowIndex = index + 2; // exceljs 1-indexed, 1=header, 2=data
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
        row.getCell(7).value = ""; // HES KODU

        // Açılır menü (Dropdown) kurallarını zorla ekle
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

      // 5. Dosyayı indir (Stiller, makrolar, gizli ayarlar tamamen korundu)
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      
      // Tarayıcı üzerinden dosyayı indir (file-saver kullanmadan %100 güvenilir yöntem)
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
    <header className="bg-surface-light h-16 border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800">Yolcu Bildirim Paneli</h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500">
          Onay Bekleyen: <strong>{passengerCount}</strong>
        </span>
        
        {/* Gizli Dosya Seçici */}
        <input 
          type="file" 
          accept=".xlsx" 
          ref={fileInputRef} 
          onChange={handleTemplateUpload} 
          className="hidden" 
        />
        
        {/* Şablon Yükleme Butonu */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`btn-secondary !bg-blue-50 !text-blue-600 !border-blue-200 hover:!bg-blue-100 flex items-center`}
          title="Kendi boş şablonunuzu yüklemek için tıklayın"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {templateName ? `Şablon: ${templateName}` : "Şablon Yükle"}
        </button>

        <button
          onClick={handleDownloadExcel}
          disabled={passengerCount === 0 || !customTemplateBuffer}
          className={`btn-secondary ${passengerCount === 0 || !customTemplateBuffer ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={!customTemplateBuffer ? "Önce şablon yüklemelisiniz" : "Verileri şablona aktar ve indir"}
        >
          Excel İndir (U-ETDS)
        </button>
        <button
          onClick={onSubmitToUetds}
          disabled={isSubmitting || passengerCount === 0}
          className={`btn-primary ${isSubmitting || passengerCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? "İletiliyor..." : "U-ETDS'ye İlet"}
        </button>
      </div>
    </header>
  );
}
