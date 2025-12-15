using System.ComponentModel.DataAnnotations;

namespace Contractmanagement.API.Models // เช็ค namespace ให้ตรงกับโปรเจกต์คุณ
{
    public class Menu
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // ชื่อเมนู (เช่น "Dashboard")
        public string Link { get; set; } = string.Empty; // ลิงก์ (เช่น "/dashboard")
        public int Order { get; set; } = 0; // ลำดับการเรียง
    }
}