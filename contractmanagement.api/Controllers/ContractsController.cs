using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Contractmanagement.API.Data;
using Contractmanagement.API.Models; 

namespace Contractmanagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContractsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET ALL: ดึงข้อมูลสัญญามาแสดงทั้งหมด
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contract>>> GetContracts()
        {
            return await _context.Contracts
                .Include(c => c.ProjectType)
                .Include(c => c.DeviceType)
                .ToListAsync();
        }

        // 2. GET BY ID: ดูรายสัญญาตาม ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Contract>> GetContract(int id)
        {
            var contract = await _context.Contracts
                .Include(c => c.ProjectType)
                .Include(c => c.DeviceType)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (contract == null) return NotFound();
            return contract;
        }

        // 3. POST: สร้างสัญญาใหม่
        [HttpPost]
        public async Task<ActionResult<Contract>> CreateContract(Contract contract)
        {
            var projectTypeExists = await _context.Tbl_ProjectTypes.AnyAsync(p => p.Id == contract.ProjectTypeId);
            
            if (!projectTypeExists)
            {
                return BadRequest($"ไม่พบประเภทโครงการ ID: {contract.ProjectTypeId}");
            }

            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContract", new { id = contract.Id }, contract);
        }

        // ---------------------------------------------------------
        // ✅ 4. DELETE: เพิ่มฟังก์ชันลบสัญญา (ส่วนที่เพิ่มใหม่)
        // ---------------------------------------------------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContract(int id)
        {
            // ค้นหาข้อมูลตาม ID
            var contract = await _context.Contracts.FindAsync(id);
            
            // ถ้าหาไม่เจอ ให้บอกว่า NotFound
            if (contract == null)
            {
                return NotFound();
            }

            // ถ้าเจอ ให้ลบออกจาก Database
            _context.Contracts.Remove(contract);
            await _context.SaveChangesAsync();

            // ส่งค่ากลับว่า "ทำสำเร็จแล้ว แต่ไม่มีเนื้อหาต้องแสดง" (NoContent 204)
            return NoContent();
        }
    }
}