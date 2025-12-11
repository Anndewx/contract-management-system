using System.ComponentModel.DataAnnotations;

namespace Contractmanagement.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
       // public string Role { get; set; } = "user"; // admin, user

        // ส่วนที่เพิ่มมาสำหรับ Refresh Token
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public string? LastLoginIp { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public int AccessFailedCount { get; set; } = 0; // เก็บจำนวนครั้งที่ผิด
        public DateTime? LockoutEnd { get; set; }       // เก็บเวลาปลดล็อค
        public DateTime? LastLogoutDate { get; set; }   // เก็บเวลา Logout ล่าสุด
        public int RoleId { get; set; }  // เก็บ ID ของตำแหน่ง
        public Role? Role { get; set; }   // ตัวเชื่อมความสัมพันธ์ (Navigation Property)
    }
}