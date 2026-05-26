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
      <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200 mt-6">
        Henüz çözümlenmiş veri bulunmuyor.
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
          <tr>
            <th className="px-6 py-4 border-b">Ülke</th>
            <th className="px-6 py-4 border-b">Adı</th>
            <th className="px-6 py-4 border-b">Soyadı</th>
            <th className="px-6 py-4 border-b">TC / Pasaport No</th>
            <th className="px-6 py-4 border-b">Cinsiyet</th>
            <th className="px-6 py-4 border-b">Telefon</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((p, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
              <td className="p-2">
                <input
                  type="text"
                  value={p.nationality}
                  onChange={(e) => handleChange(idx, "nationality", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary w-20"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={p.firstName}
                  onChange={(e) => handleChange(idx, "firstName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={p.lastName}
                  onChange={(e) => handleChange(idx, "lastName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={p.tcNo}
                  onChange={(e) => handleChange(idx, "tcNo", e.target.value)}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary ${!isTcValid(p.tcNo) ? 'table-cell-error' : 'border-gray-300'}`}
                  maxLength={50}
                  placeholder="TC / Pasaport"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={p.gender || ""}
                  onChange={(e) => handleChange(idx, "gender", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary w-16"
                  placeholder="E/K"
                  maxLength={1}
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={p.phone}
                  onChange={(e) => handleChange(idx, "phone", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
