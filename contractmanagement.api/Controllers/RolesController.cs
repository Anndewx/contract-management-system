using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Contractmanagement.API.Data;
using Contractmanagement.API.Models;

[Route("api/[controller]")]
[ApiController]
public class RolesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RolesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // 1. GET: ดึงรายชื่อ Role ทั้งหมด
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
    {
        return await _context.Roles.ToListAsync();
    }

    // 2. POST: สร้าง Role ใหม่
    [HttpPost]
    public async Task<ActionResult<Role>> CreateRole(Role role)
    {
        _context.Roles.Add(role);
        await _context.SaveChangesAsync();
        return Ok(role);
    }
    
    // 3. DELETE: ลบ Role (เผื่อใช้)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null) return NotFound();

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}