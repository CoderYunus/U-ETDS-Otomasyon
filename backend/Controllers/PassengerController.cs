using System.Collections.Generic;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[Authorize(Roles = "Admin, Kullanıcı")]
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
            var images = new List<string>();
            if (!string.IsNullOrWhiteSpace(request.ImageBase64))
            {
                images.Add(request.ImageBase64);
            }
            if (request.ImagesBase64 != null)
            {
                foreach (var img in request.ImagesBase64)
                {
                    if (!string.IsNullOrWhiteSpace(img))
                    {
                        images.Add(img);
                    }
                }
            }

            if (string.IsNullOrWhiteSpace(request.RawText) && images.Count == 0)
                return BadRequest(new { success = false, message = "Metin veya görsel boş olamaz." });

            var result = await _aiService.AnalyzeTextAsync(request.RawText, images);
            
            return Ok(new { success = true, data = result.Passengers, tripDetails = result.TripDetails });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Metin ayrıştırma sırasında hata oluştu.");
            return StatusCode(500, new { success = false, message = "Yapay zeka servisi ile iletişim kurulamadı.", error = ex.Message });
        }
    }
}
