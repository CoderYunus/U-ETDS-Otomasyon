using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Passenger
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [StringLength(11)]
    public string TcNo { get; set; } = string.Empty;
    
    [Required]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    public string LastName { get; set; } = string.Empty;
    
    public string Nationality { get; set; } = "TR";
    public string Phone { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsSubmittedToUetds { get; set; } = false;
}
