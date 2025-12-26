using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Contractmanagement.API.Models // เช็ค namespace ให้ตรงกัน
{
    public class Contact
    {
        [Key]
        public int Id { get; set; }

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;

        // Foreign Key เชื่อมกลับไปหา Customer
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        [JsonIgnore]
        public virtual Customer? Customer { get; set; }
    }
}