using System.Text;
using System.Text.Json;
using backend.Models;
using Microsoft.Extensions.Configuration;

namespace backend.Services;

public class AiIntegrationService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public AiIntegrationService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration.GetValue<string>("GEMINI_API_KEY") 
                  ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY") 
                  ?? "";
    }

    public async Task<AiParseResult> AnalyzeTextAsync(string rawText, List<string>? imagesBase64 = null)
    {
        if (string.IsNullOrEmpty(_apiKey))
        {
            throw new Exception("Gemini API anahtarı bulunamadı! Lütfen Render'a GEMINI_API_KEY ekleyin.");
        }

        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_apiKey}";

        var prompt = @"Aşağıdaki metinden veya görselden yolcu ve sefer bilgilerini çıkar ve sadece geçerli bir JSON formatında döndür. Görselde bir tablo varsa onu oku. TC/Pasaport no için 11 hane kuralı arama, harf ve rakam karışık olabilir. Cinsiyet bilgisi için Erkek ise 'E', Kadın ise 'K' yaz. JSON harici hiçbir şey yazma. Şablon:
{
  ""passengers"": [
    { ""tc_no"": """", ""first_name"": """", ""last_name"": """", ""gender"": ""E veya K"", ""nationality"": ""TR"", ""phone"": """" }
  ],
  ""trip_details"": {
    ""departure_city"": """", ""departure_district"": """", ""arrival_city"": """", ""arrival_district"": """", ""description"": """"
  }
}

Metin:
" + (string.IsNullOrWhiteSpace(rawText) ? "(Metin girilmedi, sadece görsel üzerinden oku)" : rawText);

        var partsList = new List<object> { new { text = prompt } };

        if (imagesBase64 != null && imagesBase64.Count > 0)
        {
            foreach (var img in imagesBase64)
            {
                if (string.IsNullOrWhiteSpace(img)) continue;

                var commaIndex = img.IndexOf(',');
                var mimeType = "image/jpeg";
                var base64Data = img;
                
                if (commaIndex > 0 && img.StartsWith("data:"))
                {
                    var prefix = img.Substring(5, commaIndex - 5);
                    mimeType = prefix.Split(';')[0];
                    base64Data = img.Substring(commaIndex + 1);
                }
                
                partsList.Add(new
                {
                    inlineData = new
                    {
                        mimeType = mimeType,
                        data = base64Data
                    }
                });
            }
        }

        var payload = new
        {
            contents = new[]
            {
                new { parts = partsList.ToArray() }
            }
        };

        var jsonPayload = JsonSerializer.Serialize(payload);
        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(url, content);
        response.EnsureSuccessStatusCode();

        var responseString = await response.Content.ReadAsStringAsync();
        
        using var doc = JsonDocument.Parse(responseString);
        var root = doc.RootElement;
        
        var textContent = root.GetProperty("candidates")[0]
                              .GetProperty("content")
                              .GetProperty("parts")[0]
                              .GetProperty("text").GetString();

        if (textContent == null) throw new Exception("AI yanıt veremedi.");
        
        textContent = textContent.Replace("```json", "").Replace("```", "").Trim();

        var result = JsonSerializer.Deserialize<AiServiceResponse>(textContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        var passengers = new List<Passenger>();
        if (result?.Passengers != null)
        {
            foreach (var p in result.Passengers)
            {
                passengers.Add(new Passenger
                {
                    TcNo = p.Tc_No ?? "",
                    FirstName = p.First_Name ?? "",
                    LastName = p.Last_Name ?? "",
                    Gender = p.Gender ?? "",
                    Nationality = p.Nationality ?? "TR",
                    Phone = p.Phone ?? ""
                });
            }
        }

        var tripDetailsDto = new TripDetailsDto();
        if (result?.Trip_Details != null)
        {
            tripDetailsDto.DepartureCity = result.Trip_Details.Departure_City ?? "";
            tripDetailsDto.DepartureDistrict = result.Trip_Details.Departure_District ?? "";
            tripDetailsDto.ArrivalCity = result.Trip_Details.Arrival_City ?? "";
            tripDetailsDto.ArrivalDistrict = result.Trip_Details.Arrival_District ?? "";
            tripDetailsDto.Description = result.Trip_Details.Description ?? "";
        }

        return new AiParseResult { Passengers = passengers, TripDetails = tripDetailsDto };
    }

    public class AiParseResult
    {
        public List<Passenger> Passengers { get; set; } = new();
        public TripDetailsDto TripDetails { get; set; } = new();
    }

    public class TripDetailsDto
    {
        public string DepartureCity { get; set; } = string.Empty;
        public string DepartureDistrict { get; set; } = string.Empty;
        public string ArrivalCity { get; set; } = string.Empty;
        public string ArrivalDistrict { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    private class AiServiceResponse
    {
        public List<AiPassengerDto>? Passengers { get; set; }
        public AiTripDetailsDto? Trip_Details { get; set; }
    }

    private class AiTripDetailsDto
    {
        public string Departure_City { get; set; } = string.Empty;
        public string Departure_District { get; set; } = string.Empty;
        public string Arrival_City { get; set; } = string.Empty;
        public string Arrival_District { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    private class AiPassengerDto
    {
        public string Tc_No { get; set; } = string.Empty;
        public string First_Name { get; set; } = string.Empty;
        public string Last_Name { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Nationality { get; set; } = "TR";
        public string Phone { get; set; } = string.Empty;
    }
}
