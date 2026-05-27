import { Passenger } from "@/types";
import { cinsiyetData, ulkeKodlariData } from "@/utils/excelTemplateData";

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

  const handleDownloadExcel = async () => {
    try {
      // 1. Orijinal şablonu public klasöründen çek
      const response = await fetch('/sablon.xlsx');
      if (!response.ok) throw new Error("Şablon dosyası bulunamadı.");
      const arrayBuffer = await response.arrayBuffer();

      // 2. xlsx kütüphanesini dinamik yükle
      const XLSX = await import("xlsx");
      
      // 3. Şablonu belleğe oku
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // 4. E-Devletin aradığı o kritik YOLCULAR sayfasını bul
      const sheetName = "YOLCULAR";
      const worksheet = workbook.Sheets[sheetName];
      
      if (!worksheet) throw new Error("Şablonda YOLCULAR sayfası bulunamadı.");

      // Mevcut verileri (başlıkları) diziye çevir
      const data = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
      
      // Şablonun ilk satırı başlıktır, biz 2. satırdan (index 1) itibaren yolcuları ekleyeceğiz
      const basliklar = data.length > 0 ? data[0] : ["ÜLKE", "ADI", "SOYADI", "TC KİMLİK /PASAPORT NO", "CINSIYET", "TELEFON", "HES KODU"];
      
      const newRows = passengers.map(p => {
        const ulke = p.nationality ? p.nationality.toUpperCase() : "TR";
        const ad = p.firstName ? p.firstName.toUpperCase() : "";
        const soyad = p.lastName ? p.lastName.toUpperCase() : "";
        const cinsiyet = p.gender && p.gender.toUpperCase() === "K" ? "K" : "E";
        
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

      // Eski verilerin üstüne yeni yolcuları ekleyerek taze sayfayı oluştur
      const finalData = [basliklar, ...newRows];
      const newWorksheet = XLSX.utils.aoa_to_sheet(finalData);
      
      // Eski sayfayı yenisiyle değiştir
      workbook.Sheets[sheetName] = newWorksheet;

      // 5. Dosyayı indir (Dosyanın geri kalanı tamamen dokunulmamış şablondur)
      XLSX.writeFile(workbook, "yolcular.xlsx");

    } catch (error) {
      console.error("Excel oluşturulurken hata:", error);
      alert("Excel oluşturulurken bir hata oluştu.");
    }
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
