namespace backend.Models;

public class SystemLog
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Details { get; set; } = string.Empty;
}
