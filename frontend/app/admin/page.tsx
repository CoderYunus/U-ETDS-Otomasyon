"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { getUsers, getLogs, addUser, deleteUser, editUser } from "@/services/apiService";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  
  // Add User State
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");

  // Edit User State
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    
    if (!user || role !== "Admin") {
      router.push("/");
    } else {
      setUsername(user);
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    const usersRes = await getUsers();
    if (usersRes.success) setUsers(usersRes.data);

    const logsRes = await getLogs();
    if (logsRes.success) setLogs(logsRes.data);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setMessage("");

    const res = await addUser({ username: newUsername, password: newPassword });
    if (res.success) {
      setNewUsername("");
      setNewPassword("");
      fetchData(); // Refresh tables
    }
    setMessage(res.message || "Bir hata oluştu.");
    setIsAdding(false);
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Kullanıcıyı silmek istediğinize emin misiniz?")) return;
    const res = await deleteUser(id);
    if (res.success) {
      fetchData();
    } else {
      alert(res.message);
    }
  };

  const handleEditClick = (u: any) => {
    setEditingUserId(u.id);
    setEditUsername(u.username);
    setEditPassword(""); // Boş bırakılırsa şifre değişmez
  };

  const handleSaveEdit = async (id: number) => {
    const res = await editUser(id, { username: editUsername, password: editPassword });
    if (res.success) {
      setEditingUserId(null);
      fetchData();
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="flex h-screen bg-background-light overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden pb-[70px] md:pb-0">
        <header className="bg-white shadow-sm border-b border-gray-200 z-10 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Yönetim Paneli</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hoş geldiniz, <strong>{username}</strong></span>
            <button 
              onClick={() => {
                localStorage.clear();
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "/login";
              }}
              className="text-sm text-red-600 hover:text-red-800 font-medium bg-red-50 px-3 py-1.5 rounded-md border border-red-100"
            >
              Güvenli Çıkış
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Sistem Durumu</h3>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-2xl font-bold text-gray-800">Aktif</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Yapay Zeka Motoru</h3>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-2xl font-bold text-gray-800">Bağlı</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Kayıtlı Kullanıcı</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-800">{users.length}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Kullanıcı Yönetimi */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Kayıtlı Kullanıcılar</h3>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Kullanıcı Adı</th>
                        <th className="px-4 py-2 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b">
                          <td className="px-4 py-2">{u.id}</td>
                          <td className="px-4 py-2">
                            {editingUserId === u.id ? (
                              <div className="flex flex-col space-y-2">
                                <input 
                                  type="text" 
                                  value={editUsername} 
                                  onChange={(e)=>setEditUsername(e.target.value)} 
                                  className={`border px-2 py-1 text-xs rounded w-full outline-none focus:border-primary ${u.username === 'admin' ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
                                  placeholder="Kullanıcı Adı" 
                                  disabled={u.username === 'admin'}
                                />
                                <input type="password" value={editPassword} onChange={(e)=>setEditPassword(e.target.value)} className="border px-2 py-1 text-xs rounded w-full outline-none focus:border-primary" placeholder="Yeni Şifre (Boş = Değişmez)" />
                              </div>
                            ) : (
                              <span className="font-medium text-gray-900">{u.username}</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {editingUserId === u.id ? (
                              <div className="flex flex-col items-end space-y-1">
                                <button onClick={() => handleSaveEdit(u.id)} className="text-green-600 hover:text-green-800 text-xs font-bold uppercase">Kaydet</button>
                                <button onClick={() => setEditingUserId(null)} className="text-gray-500 hover:text-gray-700 text-xs font-bold uppercase">İptal</button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end space-x-3">
                                <button onClick={() => handleEditClick(u)} className="text-blue-500 hover:text-blue-700 text-xs font-bold uppercase">Düzenle</button>
                                {u.username !== 'admin' && (
                                  <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase">Sil</button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-bold text-gray-800 mb-3">Yeni Kullanıcı Ekle</h4>
                  <form onSubmit={handleAddUser} className="flex flex-col space-y-3">
                    <input type="text" placeholder="Kullanıcı Adı" value={newUsername} onChange={(e)=>setNewUsername(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none text-sm"/>
                    <input type="password" placeholder="Şifre" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none text-sm"/>
                    <button type="submit" disabled={isAdding} className="bg-primary text-white py-2 rounded-md hover:bg-blue-700 text-sm font-medium">{isAdding ? 'Ekleniyor...' : 'Ekle'}</button>
                  </form>
                  {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
                </div>
              </div>

              {/* Sistem Logları */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px]">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Son Sistem Logları</h3>
                <div className="overflow-y-auto flex-1 pr-2">
                  <ul className="space-y-4">
                    {logs.length === 0 ? (
                      <li className="text-sm text-gray-500">Henüz log kaydı yok.</li>
                    ) : logs.map(log => (
                      <li key={log.id} className="bg-gray-50 rounded p-3 border border-gray-100">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-sm text-primary">{log.action}</span>
                          <span className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString('tr-TR')}</span>
                        </div>
                        <p className="text-sm text-gray-700">{log.details}</p>
                        <p className="text-xs text-gray-500 mt-1">Kullanıcı: <strong>{log.username}</strong></p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
