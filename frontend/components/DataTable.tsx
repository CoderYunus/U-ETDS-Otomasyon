import { Passenger } from "../types";

interface DataTableProps {
  passengers: Passenger[];
  setPassengers: React.Dispatch<React.SetStateAction<Passenger[]>>;
}

export default function DataTable({ passengers, setPassengers }: DataTableProps) {
  const handleChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const isTcValid = (tc: string) => tc && tc.trim() !== "";

  if (passengers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white/50 backdrop-blur-md rounded-2xl border border-dashed border-gray-300/60">
        <div className="w-16 h-16 bg-gray-100/50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <p className="text-gray-500 font-medium text-lg">Henüz veri çözümlenmedi</p>
        <p className="text-gray-400 mt-1 text-sm">Yapay zeka ile analiz yaptığınızda sonuçlar burada listelenecektir.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] bg-white/70 backdrop-blur-xl">
      <table className="min-w-full text-sm text-left text-gray-600 border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50/80 to-white/80 border-b border-gray-200">
            <th className="px-6 py-5 text-xs font-bold text-gray-700 uppercase tracking-wider">Ülke</th>
            <th className="px-6 py-5 text-xs font-bold text-gray-700 uppercase tracking-wider">Adı</th>
            <th className="px-6 py-5 text-xs font-bold text-gray-700 uppercase tracking-wider">Soyadı</th>
            <th className="px-6 py-5 text-xs font-bold text-gray-700 uppercase tracking-wider">TC / Pasaport No</th>
            <th className="px-6 py-5 text-xs font-bold text-gray-700 uppercase tracking-wider">Cinsiyet</th>
            <th className="px-6 py-5 text-xs font-bold text-gray-700 uppercase tracking-wider">Telefon</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100/50">
          {passengers.map((p, idx) => (
            <tr key={idx} className="hover:bg-primary-50/30 transition-colors group">
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={p.nationality}
                  onChange={(e) => handleChange(idx, "nationality", e.target.value)}
                  className="w-full min-w-[70px] p-2.5 bg-transparent border border-transparent rounded-lg focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-500/20 hover:bg-white/50 transition-all font-medium text-gray-700 text-center uppercase"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={p.firstName}
                  onChange={(e) => handleChange(idx, "firstName", e.target.value)}
                  className="w-full min-w-[120px] p-2.5 bg-transparent border border-transparent rounded-lg focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-500/20 hover:bg-white/50 transition-all font-medium text-gray-700 uppercase"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={p.lastName}
                  onChange={(e) => handleChange(idx, "lastName", e.target.value)}
                  className="w-full min-w-[120px] p-2.5 bg-transparent border border-transparent rounded-lg focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-500/20 hover:bg-white/50 transition-all font-medium text-gray-700 uppercase"
                />
              </td>
              <td className="px-4 py-3">
                <div className="relative">
                  <input
                    type="text"
                    value={p.tcNo}
                    onChange={(e) => handleChange(idx, "tcNo", e.target.value)}
                    className={`w-full min-w-[140px] p-2.5 bg-transparent border rounded-lg focus:bg-white focus:ring-2 transition-all font-mono font-medium ${!isTcValid(p.tcNo) ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-400/20 text-red-700' : 'border-transparent focus:border-primary-300 focus:ring-primary-500/20 hover:bg-white/50 text-gray-700'}`}
                    maxLength={50}
                    placeholder="TC / Pasaport"
                  />
                  {!isTcValid(p.tcNo) && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={p.gender || ""}
                  onChange={(e) => handleChange(idx, "gender", e.target.value)}
                  className="w-full min-w-[60px] p-2.5 bg-transparent border border-transparent rounded-lg focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-500/20 hover:bg-white/50 transition-all font-medium text-gray-700 text-center uppercase"
                  placeholder="E/K"
                  maxLength={1}
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={p.phone}
                  onChange={(e) => handleChange(idx, "phone", e.target.value)}
                  className="w-full min-w-[130px] p-2.5 bg-transparent border border-transparent rounded-lg focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-500/20 hover:bg-white/50 transition-all font-medium text-gray-700"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
