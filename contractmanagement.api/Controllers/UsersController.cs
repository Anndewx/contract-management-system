using Microsoft.AspNetCore.Mvc;
using Contractmanagement.API.Data;
using Contractmanagement.API.Models;

namespace Contractmanagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            // ควรดึงข้อมูล Role ออกมาด้วยเพื่อให้เห็นว่าใครตำแหน่งอะไร
            return Ok(_context.Users.ToList());
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] User request)
        {
            // 1. ค้นหา User คนเดิมใน DB
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            // 2. อัปเดตข้อมูลทีละตัว (*** จุดสำคัญที่แก้ให้ ***)
            
            // แก้ตำแหน่ง (Role) โดยใช้ ID ที่ส่งมา
            if (request.RoleId != 0) 
            {
                user.RoleId = request.RoleId; 
            }

            // แก้ Username
            if (!string.IsNullOrEmpty(request.Username))
            {
                user.Username = request.Username;
            }

            // แก้ Password (เผื่อไว้ถ้ามีการส่งมา)
            if (!string.IsNullOrEmpty(request.PasswordHash))
            {
                user.PasswordHash = request.PasswordHash;
            }

            // 3. บันทึกลงฐานข้อมูล
            // หมายเหตุ: ไม่ต้องยุ่งกับ user.Role (Object) ให้แก้ที่ RoleId พอ
            _context.SaveChanges();

            return Ok(user);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            
            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok(new { message = "User deleted successfully" });
        }
    }
}