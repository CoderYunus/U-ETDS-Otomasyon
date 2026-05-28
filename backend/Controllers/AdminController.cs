using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("users")]
    public IActionResult GetUsers()
    {
        var users = _context.Users.Select(u => new { u.Id, u.Username, u.Role }).ToList();
        return Ok(new { success = true, data = users });
    }

    [HttpPost("users")]
    public IActionResult AddUser([FromBody] LoginRequest request)
    {
        if (_context.Users.Any(u => u.Username == request.Username))
        {
            return BadRequest(new { success = false, message = "Bu kullanıcı adı zaten mevcut." });
        }

        var user = new User
        {
            Username = request.Username,
            Password = request.Password, // Demo: Not hashed
            Role = string.IsNullOrEmpty(request.Role) ? "Üye" : request.Role
        };

        _context.Users.Add(user);
        
        // Log action
        _context.Logs.Add(new SystemLog
        {
            Action = "Kullanıcı Eklendi",
            Username = HttpContext.User.Identity?.Name ?? "Bilinmiyor",
            Details = $"Yeni kullanıcı eklendi: {request.Username}"
        });

        _context.SaveChanges();

        return Ok(new { success = true, message = "Kullanıcı başarıyla eklendi." });
    }

    [HttpDelete("users/{id}")]
    public IActionResult DeleteUser(int id)
    {
        var user = _context.Users.Find(id);
        if (user == null) return NotFound(new { success = false, message = "Kullanıcı bulunamadı." });
        
        if (user.Username == "admin") return BadRequest(new { success = false, message = "Varsayılan admin hesabı silinemez." });

        _context.Users.Remove(user);
        
        // Log action
        _context.Logs.Add(new SystemLog
        {
            Action = "Kullanıcı Silindi",
            Username = HttpContext.User.Identity?.Name ?? "Bilinmiyor",
            Details = $"Kullanıcı silindi: {user.Username}"
        });

        _context.SaveChanges();

        return Ok(new { success = true, message = "Kullanıcı silindi." });
    }

    [HttpPut("users/{id}")]
    public IActionResult EditUser(int id, [FromBody] LoginRequest request)
    {
        var user = _context.Users.Find(id);
        if (user == null) return NotFound(new { success = false, message = "Kullanıcı bulunamadı." });

        if (user.Username == "admin" && request.Username != "admin")
            return BadRequest(new { success = false, message = "Varsayılan admin hesabının kullanıcı adı değiştirilemez." });

        if (_context.Users.Any(u => u.Username == request.Username && u.Id != id))
            return BadRequest(new { success = false, message = "Bu kullanıcı adı başka bir hesaba ait." });

        var oldUsername = user.Username;
        user.Username = request.Username;
        if (!string.IsNullOrEmpty(request.Password))
        {
            user.Password = request.Password;
        }
        if (!string.IsNullOrEmpty(request.Role))
        {
            user.Role = request.Role;
        }

        _context.Logs.Add(new SystemLog
        {
            Action = "Kullanıcı Düzenlendi",
            Username = HttpContext.User.Identity?.Name ?? "Bilinmiyor",
            Details = $"Kullanıcı güncellendi: {oldUsername} -> {request.Username}"
        });

        _context.SaveChanges();

        return Ok(new { success = true, message = "Kullanıcı başarıyla güncellendi." });
    }

    [HttpGet("logs")]
    public IActionResult GetLogs()
    {
        var logs = _context.Logs.OrderByDescending(l => l.CreatedAt).Take(50).ToList();
        return Ok(new { success = true, data = logs });
    }
}
