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



## 🤝 İletişim ve Katkı

Bu proje, iş yükünü hafifletmek amacıyla geliştirilmiştir.  
- **Proje Geliştiricisi / Entegratör:** [Byzon Technologies](https://www.linkedin.com/company/byzon-technologies/?viewAsMember=true)
- **Sponsor / Partner:** [ZMR Travel](https://www.instagram.com/zmrtravel/)

Herhangi bir hata bildirimi veya özellik önerisi için lütfen Pull Request açmaktan veya issue bırakmaktan çekinmeyin.
