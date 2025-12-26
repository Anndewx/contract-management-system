using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization; // เพิ่มเผื่อไว้ใช้

namespace Contractmanagement.API.Models
{
    public class Customer
    {
        public Customer()
        {
            // เตรียม List ไว้กัน Error เวลาไม่มีผู้ติดต่อ
            Contacts = new HashSet<Contact>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; // ชื่อบริษัท (ใส่ค่าเริ่มต้นกัน Error)

        public string TaxId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string SubDistrict { get; set; } = string.Empty;
        public string Zipcode { get; set; } = string.Empty;

        // ความสัมพันธ์: ลูกค้า 1 บริษัท มีผู้ติดต่อได้หลายคน
        public virtual ICollection<Contact> Contacts { get; set; }
    }
}