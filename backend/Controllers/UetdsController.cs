using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[Authorize(Roles = "Admin, Kullanıcı")]
[ApiController]
[Route("api/[controller]")]
public class UetdsController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly UetdsIntegrationService _uetdsService;

    public UetdsController(AppDbContext dbContext, UetdsIntegrationService uetdsService)
    {
        _dbContext = dbContext;
        _uetdsService = uetdsService;
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitToUetds([FromBody] List<Passenger> passengers)
    {
        if (passengers == null || passengers.Count == 0)
            return BadRequest(new { success = false, message = "Gönderilecek yolcu bulunamadı." });

        // Veritabanına kaydet
        _dbContext.Passengers.AddRange(passengers);
        await _dbContext.SaveChangesAsync();

        // U-ETDS servisine gönder
        try
        {
            var isSuccess = await _uetdsService.SubmitPassengersAsync(passengers);
            
            if (isSuccess)
            {
                _dbContext.Logs.Add(new SystemLog
                {
                    Action = "U-ETDS Bildirimi",
                    Username = HttpContext.User.Identity?.Name ?? "Bilinmiyor",
                    Details = $"{passengers.Count} yolcu için başarılı U-ETDS bildirimi yapıldı."
                });

                foreach (var p in passengers)
                {
                    p.IsSubmittedToUetds = true;
                }
                await _dbContext.SaveChangesAsync();
                return Ok(new { success = true, message = $"U-ETDS Sistemine otomatik giriş yapıldı ve {passengers.Count} yolcu Toplu Ekleme kısmına başarıyla iletildi!" });
            }
        }
        catch (Exception)
        {
            // Hata olursa devam et ve 500 dön
        }

        return StatusCode(500, new { success = false, message = "U-ETDS bildiriminde hata oluştu." });
    }
}
