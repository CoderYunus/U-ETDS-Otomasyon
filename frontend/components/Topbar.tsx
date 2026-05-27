import { Passenger } from "@/types";

interface TopbarProps {
  onSubmitToUetds: () => void;
  isSubmitting: boolean;
  passengerCount: number;
  passengers: Passenger[];
}

export default function Topbar({ onSubmitToUetds, isSubmitting, passengerCount, passengers }: TopbarProps) {
  
  const convertTrToEn = (text: string | undefined) => {
    if (!text) return "";
    const trMap: { [key: string]: string } = {
      'ç': 'c', 'Ç': 'C',
      'ğ': 'g', 'Ğ': 'G',
      'ı': 'i', 'I': 'I',
      'İ': 'I', 'ö': 'o',
      'Ö': 'O', 'ş': 's',
      'Ş': 'S', 'ü': 'u',
      'Ü': 'U'
    };
    return text.replace(/[çÇğĞıİöÖşŞüÜ]/g, match => trMap[match]).toUpperCase(); // UETDS sistemi genelde büyük harf tercih eder
  };

  const handleDownloadExcel = () => {
    // xlsx kütüphanesini dinamik yükleyelim (tarayıcıda çalışması için)
    import("xlsx").then((XLSX) => {
      // Başlıklar tam olarak şablondaki (sablon-excel.pdf) gibi olmalı
      const header = ["ÜLKE", "ADI", "SOYADI", "TC KİMLİK /PASAPORT NO", "CİNSİYET", "TELEFON", "HES KODU"];
      
      const rows = passengers.map(p => {
        const ulke = p.nationality ? p.nationality.toUpperCase() : "TR";
        const ad = p.firstName ? p.firstName.toUpperCase() : "";
        const soyad = p.lastName ? p.lastName.toUpperCase() : "";
        const cinsiyet = p.gender && p.gender.toUpperCase() === "K" ? "K" : "E"; // Varsayılan E
        
        return [
          ulke,
          ad,
          soyad,
          p.tcNo,
          cinsiyet,
          p.phone || "",
          "" // HES KODU
        ];
      });

      const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Yolcular");

      XLSX.writeFile(workbook, "yolcular.xlsx");
    });
  };

  return (
    <header className="bg-surface-light h-16 border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800">Yolcu Bildirim Paneli</h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500">
          Onay Bekleyen: <strong>{passengerCount}</strong>
        </span>
        <button
          onClick={handleDownloadExcel}
          disabled={passengerCount === 0}
          className={`btn-secondary ${passengerCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
