using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PassengerController : ControllerBase
{
    private readonly AiIntegrationService _aiService;
    private readonly ILogger<PassengerController> _logger;

    public PassengerController(AiIntegrationService aiService, ILogger<PassengerController> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    [HttpPost("parse")]
    public async Task<IActionResult> ParseText([FromBody] ParseRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.RawText))
                return BadRequest(new { success = false, message = "Metin boş olamaz." });

            var result = await _aiService.AnalyzeTextAsync(request.RawText);
            
            return Ok(new { success = true, data = result.Passengers, tripDetails = result.TripDetails });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Metin ayrıştırma sırasında hata oluştu.");
            return StatusCode(500, new { success = false, message = "Yapay zeka servisi ile iletişim kurulamadı.", error = ex.Message });
        }
    }
}
