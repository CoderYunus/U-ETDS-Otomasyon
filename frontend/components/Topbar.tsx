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

      // 2. exceljs ve file-saver kütüphanelerini yükle
      const ExcelJS = await import("exceljs");
      const { saveAs } = await import("file-saver");
      
      // 3. Şablonu tamamen orjinal haliyle belleğe oku
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      
      // 4. YOLCULAR sayfasını bul
      const worksheet = workbook.getWorksheet("YOLCULAR");
      
      if (!worksheet) throw new Error("Şablonda YOLCULAR sayfası bulunamadı.");

      // 5. 2. Satırdan itibaren verileri yaz (1. Satır Başlık)
      passengers.forEach((p, index) => {
        const rowIndex = index + 2; // exceljs 1-indexed, 1=header, 2=data
        const row = worksheet.getRow(rowIndex);

        const ulke = p.nationality ? p.nationality.toUpperCase() : "TR";
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

        row.commit();
      });

      // 6. Dosyayı indir (Stiller, makrolar, gizli ayarlar tamamen korundu)
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "yolcular.xlsx");

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
