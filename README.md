# 🚌 U-ETDS Sefer Otomasyonu (Yapay Zeka Destekli)

U-ETDS (Ulaştırma Elektronik Takip ve Denetim Sistemi), yolcu taşımacılığı yapan firmaların sefer ve yolcu bilgilerini e-Devlet sistemine pratik bir şekilde iletmesini sağlayan gelişmiş, yapay zeka destekli bir otomasyon sistemidir.

Geleneksel veri girişindeki hataları ve zaman kaybını ortadan kaldırmak için, karmaşık metinler ve görseller üzerinden **Google Gemini AI** kullanarak verileri saniyeler içinde anlamlandırır, U-ETDS kurallarına uygun formata dönüştürür ve Excel çıktısı olarak hazırlar.

---

## ✨ Öne Çıkan Özellikler

- **🤖 Yapay Zeka ile Akıllı Veri Çözümleme:** WhatsApp, e-posta veya herhangi bir yerden kopyaladığınız düz, karmaşık metinleri anında düzenli yolcu listelerine çevirir.
- **📸 Görsel (OCR) Desteği:** Ekran görüntüsü veya fotoğrafları yükleyerek yapay zekanın görselin içindeki pasaport, TC No, isim ve cinsiyet gibi bilgileri tarayıp ayıklamasını sağlayabilirsiniz.
- **🛡️ Eksik Veri Tamamlama:** Eksik TC veya Pasaport numaraları yerine sistemin hata vermemesi için otomatik olarak `11111111111` değerini atayarak süreci hızlandırır.
- **🔒 Rol Tabanlı Yetkilendirme (JWT):** Güvenli JWT altyapısıyla çalışır. "Admin" yetkisine sahip kullanıcılar Yönetim Paneli'ne erişebilirken, normal kullanıcılar yalnızca veri girişi ekranını görüntüleyebilir.
- **📱 %100 Mobil Uyumlu Arayüz:** Masaüstünde olduğu kadar telefon ve tabletlerde de tamamen duyarlı, dokunmatik dostu kaydırılabilir menülerle kullanım sunar.
- **📄 Dinamik Excel (.xlsx) Üretimi:** E-Devlet uyumlu yolcu şablonu ile çalışır. Kendi güncel şablonunuzu yükleyebilir ve doğrudan U-ETDS sistemine import edebileceğiniz güvenilir Excel dosyaları indirebilirsiniz.

---

## 🛠️ Kullanılan Teknolojiler

Bu proje, güçlü performans ve kolay ölçeklenebilirlik sağlamak adına mikroservis benzeri ayrılmış bir mimari (Frontend & Backend) kullanmaktadır.

### Frontend (Kullanıcı Arayüzü)
- **Framework:** Next.js 14 (App Router)
- **Dil:** TypeScript
- **Stil:** Tailwind CSS
- **Excel İşlemleri:** ExcelJS (Tarayıcı tarafında veri kaybı olmadan şablon manipülasyonu)
- **Hosting / Dağıtım:** Vercel

### Backend (API Sunucusu)
- **Framework:** ASP.NET Core 8 Web API
- **Dil:** C#
- **Veritabanı:** Entity Framework Core (In-Memory Database, isteğe bağlı PostgreSQL/SQL Server'a geçirilebilir)
- **Yapay Zeka Servisi:** Google Gemini Flash API Entegrasyonu (REST & HttpClient)
- **Güvenlik:** JWT Token Authentication
- **Dağıtım:** Render

---

## 🚀 Kurulum & Çalıştırma (Yerel Geliştirme)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### 1. Ön Koşullar
- [Node.js](https://nodejs.org/en/) (v18 veya üzeri)
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- Geçerli bir Google Gemini API Key

### 2. Backend'i Başlatma (.NET 8)
1. Terminali açın ve `backend` klasörüne gidin:
   ```bash
   cd backend
   ```
2. Eksik bağımlılıkları yükleyin ve projeyi çalıştırın:
   ```bash
   dotnet restore
   dotnet run
   ```
3. Backend servisi varsayılan olarak `http://localhost:5000` portunda çalışacaktır. Swagger API belgelerine `http://localhost:5000/swagger` üzerinden ulaşabilirsiniz.

### 3. Frontend'i Başlatma (Next.js)
1. Yeni bir terminal açın ve `frontend` klasörüne gidin:
   ```bash
   cd frontend
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
4. Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı kullanmaya başlayabilirsiniz.

> **Önemli Not:** Frontend varsayılan olarak production API'sine bağlanmaya çalışabilir. Yerel testler için `frontend/services/apiService.ts` dosyasındaki `API_BASE_URL` adresini `http://localhost:5000/api` olarak değiştirmeyi unutmayın.

---

## 👥 Varsayılan Kullanıcılar

Projeyi ilk çalıştırdığınızda hafıza tabanlı (In-Memory) veritabanına eklenen örnek kullanıcılar şunlardır:

| Kullanıcı Adı | Şifre | Yetki |
| :--- | :--- | :--- |
| `admin` | `admin123` | **Admin** (Yönetim Paneli Açık) |
| `user1` | `user123` | **User** (Sadece Veri Girişi) |

---

## 🤝 İletişim ve Katkı

Bu proje, iş yükünü hafifletmek amacıyla geliştirilmiştir.  
- **Proje Geliştiricisi / Entegratör:** [Byzon Technologies](https://www.linkedin.com/company/byzon-technologies/?viewAsMember=true)
- **Sponsor / Partner:** [ZMR Travel](https://www.instagram.com/zmrtravel/)

Herhangi bir hata bildirimi veya özellik önerisi için lütfen Pull Request açmaktan veya issue bırakmaktan çekinmeyin.
