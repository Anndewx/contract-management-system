using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Contractmanagement.API.Data;
using Contractmanagement.API.Models;

namespace Contractmanagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PermissionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. ดึงข้อมูลว่า Role นี้ เห็นเมนูอะไรได้บ้าง
        // GET: api/Permissions/GetMenusByRole/1
        [HttpGet("GetMenusByRole/{roleId}")]
        public async Task<ActionResult<IEnumerable<Menu>>> GetMenusByRole(int roleId)
        {
            // ดึงเฉพาะเมนูที่มีในตาราง RoleMenu ตรงกับ roleId ที่ส่งมา
#pragma warning disable CS8602 // Dereference of a possibly null reference.
            var menus = await _context.RoleMenus
                .Where(rm => rm.RoleId == roleId)
                .Select(rm => rm.Menu) // เลือกเอาเฉพาะข้อมูล Menu ออกมา
                .OrderBy(m => m.Order)
                .ToListAsync();
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            return Ok(menus);
        }

        // 2. เพิ่มสิทธิ์ (จับคู่ Role กับ Menu)
        // POST: api/Permissions/Assign
        [HttpPost("Assign")]
        public async Task<IActionResult> AssignPermission(int roleId, int menuId)
        {
            // เช็คว่ามีอยู่แล้วหรือยัง กันซ้ำ
            var existing = await _context.RoleMenus
                .FirstOrDefaultAsync(rm => rm.RoleId == roleId && rm.MenuId == menuId);

            if (existing != null) return BadRequest("Role already has this menu.");

            var roleMenu = new RoleMenu { RoleId = roleId, MenuId = menuId };
            _context.RoleMenus.Add(roleMenu);
            await _context.SaveChangesAsync();

            return Ok("Permission assigned successfully.");
        }

        // 3. ถอนสิทธิ์ (ลบการจับคู่)
        // DELETE: api/Permissions/Remove
        [HttpDelete("Remove")]
        public async Task<IActionResult> RemovePermission(int roleId, int menuId)
        {
            var item = await _context.RoleMenus
                .FirstOrDefaultAsync(rm => rm.RoleId == roleId && rm.MenuId == menuId);

            if (item == null) return NotFound("Permission not found.");

            _context.RoleMenus.Remove(item);
            await _context.SaveChangesAsync();

            return Ok("Permission removed.");
        }
    }
}