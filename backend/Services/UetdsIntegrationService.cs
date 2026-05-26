using System.Text;
using System.Text.Json;
using backend.Models;
using Microsoft.Extensions.Configuration;

namespace backend.Services;

public class UetdsIntegrationService
{
    private readonly ILogger<UetdsIntegrationService> _logger;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public UetdsIntegrationService(ILogger<UetdsIntegrationService> logger, HttpClient httpClient, IConfiguration configuration)
    {
        _logger = logger;
        _httpClient = httpClient;
        _configuration = configuration;
        
        var baseUrl = _configuration.GetValue<string>("UetdsSettings:BaseUrl") ?? "https://app.uetds.net";
        _httpClient.BaseAddress = new Uri(baseUrl);
    }

    private async Task<string?> LoginAsync()
    {
        var username = _configuration.GetValue<string>("UetdsSettings:Username");
        var password = _configuration.GetValue<string>("UetdsSettings:Password");

        _logger.LogInformation("U-ETDS sistemine '{Username}' kullanıcısı ile giriş yapılıyor...", username);

        // Not: app.uetds.net'in gerçek login uç noktası /api/login veya benzeri olabilir. 
        // Şimdilik oturum/token aldığımızı simüle eden bir mock yapısı kuruyoruz.
        var loginPayload = new { username, password };
        var content = new StringContent(JsonSerializer.Serialize(loginPayload), Encoding.UTF8, "application/json");

        // var response = await _httpClient.PostAsync("/api/auth/login", content);
        // if (response.IsSuccessStatusCode) ...
        
        await Task.Delay(500); // Ağ gecikmesi simülasyonu
        _logger.LogInformation("U-ETDS sistemine giriş başarılı, oturum (Token) alındı.");
        
        return "fake-jwt-token-12345";
    }

    public async Task<bool> SubmitPassengersAsync(List<Passenger> passengers)
    {
        try
        {
            // 1. Sisteme Otomatik Giriş Yap ve Token Al
            var token = await LoginAsync();
            if (string.IsNullOrEmpty(token))
            {
                _logger.LogError("U-ETDS Giriş başarısız oldu. Yolcular gönderilemiyor.");
                return false;
            }

            // Gelen token'ı yetkilendirme (Authorization) başlığına ekle
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

            _logger.LogInformation("Oturum açıldı, {Count} yolcu U-ETDS Toplu Ekleme uç noktasına gönderiliyor...", passengers.Count);
            
            // 2. Özel Formata Çevir (Örn: Sadece belirli alanları gönder)
            var payloadList = passengers.Select(p => new {
                ad = p.FirstName,
                soyad = p.LastName,
                uyruk = "TR", // Varsayılan değer
                tcPasaport = p.TcNo,
                telefon = "" // İsteğe bağlı
            }).ToList();

            var jsonPayload = JsonSerializer.Serialize(payloadList);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            // 3. Gerçek uç noktaya veriyi POST et
            var response = await _httpClient.PostAsync("/?yeni=ekle", content);
            
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("U-ETDS Toplu Ekleme başarıyla tamamlandı.");
                return true;
            }
            else
            {
                _logger.LogWarning("U-ETDS Toplu Ekleme reddedildi. Status: {StatusCode}", response.StatusCode);
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "U-ETDS sunucusuna veri iletilirken kritik hata oluştu.");
            return false;
        }
    }
}
