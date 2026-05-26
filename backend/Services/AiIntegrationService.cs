using System.Text;
using System.Text.Json;
using backend.Models;

namespace backend.Services;

public class AiIntegrationService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public AiIntegrationService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        var baseUrl = _configuration.GetValue<string>("AiService:BaseUrl") ?? "http://127.0.0.1:8000";
        _httpClient.BaseAddress = new Uri(baseUrl);
    }

    public async Task<AiParseResult> AnalyzeTextAsync(string rawText)
    {
        var payload = new { text = rawText };
        var jsonPayload = JsonSerializer.Serialize(payload);
        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("/analyze-text", content);
        response.EnsureSuccessStatusCode();

        var responseString = await response.Content.ReadAsStringAsync();
        
        // AI servisinden dönen format: { "passengers": [ { "tc_no": "...", ... } ] }
        var result = JsonSerializer.Deserialize<AiServiceResponse>(responseString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
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
        public string Nationality { get; set; } = "TR";
        public string Phone { get; set; } = string.Empty;
    }
}
