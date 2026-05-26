namespace backend.Models;

public class ParseRequest
{
    public string RawText { get; set; } = string.Empty;
    public string? ImageBase64 { get; set; }
}
