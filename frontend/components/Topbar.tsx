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
    const header = "AD\tSOYAD\tKIMLIK/PASAPORT NO\tCINSIYET\tUYRUK\tTELEFON\tHESKODU\tKOLTUKNO";
    const rows = passengers.map(p => {
      const ad = convertTrToEn(p.firstName);
      const soyad = convertTrToEn(p.lastName);
      const uyruk = p.nationality ? convertTrToEn(p.nationality) : "TR";
      return `${ad}\t${soyad}\t${p.tcNo}\tE\t${uyruk}\t${p.phone || ''}\t\t`;
    });
    
    const tsvContent = [header, ...rows].join("\n");
    const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yolcular.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
