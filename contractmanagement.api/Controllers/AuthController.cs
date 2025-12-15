using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Contractmanagement.API.Data;   
using Contractmanagement.API.Models; 
using Microsoft.EntityFrameworkCore;

namespace Contractmanagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context; 

        public AuthController(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost]
        [Route("/api/create")]
        public IActionResult Create([FromBody] User user)
        {
            _context.Users.Add(user); // เพิ่มลง DB
            _context.SaveChanges();   // บันทึก!
            return Ok(user);
        }
        
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
           var user = _context.Users
            .Include(u => u.Role) // สั่งให้ดึงข้อมูลจากตาราง Role มาแปะด้วย
            .FirstOrDefault(u => u.Username == request.Username);

            // ถ้าไม่เจอ User เลย -> ตอบกลับ error กลางๆ เพื่อความปลอดภัย
            if (user == null) return Unauthorized("Username or Password incorrect");

            // 2. เช็คว่าติดสถานะล็อคอยู่ไหม (Lockout Check)
            if (user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTime.Now)
            {
                // คำนวณเวลาที่เหลือ
                var timeLeft = user.LockoutEnd.Value - DateTime.Now;
                return StatusCode(403, $"Account is locked. Please try again in {Math.Ceiling(timeLeft.TotalMinutes)} minutes.");
            }

            // 3. เช็ค Password
            if (user.PasswordHash != request.Password)
            {
                // ถ้าผิด: บวกจำนวนครั้งที่ผิด
                user.AccessFailedCount++;

                // ถ้าผิดครบ 5 ครั้ง -> สั่งล็อค 15 นาที 
                if (user.AccessFailedCount >= 5)
                {
                    user.LockoutEnd = DateTime.Now.AddMinutes(15);
                }

                _context.SaveChanges(); // บันทึกการนับผิดลง DB
                return Unauthorized("Username or Password incorrect");
            }

            // 4. ถ้า Login ผ่าน (Success)
            // รีเซ็ตค่าการทำผิดเป็น 0 และปลดล็อค
            user.AccessFailedCount = 0;
            user.LockoutEnd = null;

            // อัปเดตข้อมูล Login ปกติ
            user.LastLoginIp = HttpContext.Connection.RemoteIpAddress?.ToString();
            user.LastLoginDate = DateTime.Now;
            
            // สร้าง Token
            var accessToken = CreateAccessToken(user);
            var refreshToken = GenerateRefreshToken();
            
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
            
            _context.SaveChanges(); // บันทึกข้อมูลทั้งหมดลง DB

            return Ok(new { accessToken, refreshToken });
        }

        [HttpPost("refresh-token")]
        public IActionResult RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.RefreshToken == request.Token);
            if (user == null || user.RefreshTokenExpiryTime <= DateTime.Now) return BadRequest("Invalid Token");
            
            var newAccessToken = CreateAccessToken(user);
            var newRefreshToken = GenerateRefreshToken();
            
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
            _context.SaveChanges();
            
            return Ok(new { accessToken = newAccessToken, refreshToken = newRefreshToken });
        }

        [HttpPost("logout")]
        public IActionResult Logout([FromBody] RefreshTokenRequest request)
        {
            // ค้นหาจาก Refresh Token ที่ส่งมา
            var user = _context.Users.FirstOrDefault(u => u.RefreshToken == request.Token);
            
            if (user == null) return BadRequest("Invalid Token");

            // ✅ Logic: เคลียร์ Token และบันทึกเวลา Logout
            user.RefreshToken = null;          
            user.LastLogoutDate = DateTime.Now; 
            
            _context.SaveChanges();
            return Ok("Logged out successfully");
        }

        // --- Helper Methods ---
        private string CreateAccessToken(User user)
{
    // 1. กำหนด Claims (ข้อมูลใน Token)
    var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Username),
        new Claim("role", user.Role?.Name ?? "User") // ใช้ ?.Name เพื่อดึงชื่อ Role
    };

    // 2. สร้าง Key
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "ThisIsTheSecretKeyForYourApp_ChangeItLater12345"));
    
    // 3. สร้าง Credentials
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    // 4. สร้าง Token Object
    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.Now.AddHours(1),
        signingCredentials: creds
    );

    // 5. คืนค่าเป็น String
    return new JwtSecurityTokenHandler().WriteToken(token);
}
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
    
    // Class สำหรับรับค่า Request
    public class LoginRequest { public string Username { get; set; } = ""; public string Password { get; set; } = ""; }
    public class RefreshTokenRequest { public string Token { get; set; } = ""; }
}