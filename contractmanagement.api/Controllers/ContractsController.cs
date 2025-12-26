using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Contractmanagement.API.Data;
using Contractmanagement.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        // ---------------------------------------------------------
        // 1. GET ALL: ดึงข้อมูลสัญญามาแสดงทั้งหมด + งวดงาน
        // ---------------------------------------------------------
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contract>>> GetContracts()
        {
            return await _context.Contracts
                .Include(c => c.ProjectType)
                .Include(c => c.DeviceType)
                .Include(c => c.PaymentPeriods)
                .Include(c => c.Project) // 👈 ดึงงวดงานมาด้วย
                .OrderByDescending(c => c.CreatedDate) // เรียงจากใหม่ไปเก่า
                .ToListAsync();
        }

        // ---------------------------------------------------------
        // 2. GET BY ID: ดูรายสัญญาตาม ID + งวดงาน
        // ---------------------------------------------------------
        [HttpGet("{id}")]
public async Task<ActionResult<Contract>> GetContract(int id)
{
    var contract = await _context.Contracts
        .Include(c => c.ProjectType)
        .Include(c => c.DeviceType)
        .Include(c => c.Project) // <--- เพิ่มบรรทัดนี้ครับ
        .Include(c => c.PaymentPeriods.OrderBy(p => p.InstallmentNo))
        .FirstOrDefaultAsync(c => c.Id == id);

            if (contract == null) return NotFound();
            return contract;
        }

        // ---------------------------------------------------------
        // 3. POST: สร้างสัญญาใหม่ (พร้อมงวดงาน)
        // ---------------------------------------------------------
        [HttpPost]
        public async Task<ActionResult<Contract>> CreateContract(Contract contract)
        {
            // 1. ตรวจสอบ ProjectTypeId
            var projectTypeExists = await _context.Tbl_ProjectTypes.AnyAsync(p => p.Id == contract.ProjectTypeId);
            if (!projectTypeExists)
            {
                return BadRequest($"ไม่พบประเภทโครงการ ID: {contract.ProjectTypeId}");
            }

            // 2. ตั้งค่า Default
            contract.CreatedDate = DateTime.Now;
            contract.IsActive = true;
            contract.CreatedBy = "Admin"; // หรือรับจาก User Login

            // 3. บันทึกลง DB (EF Core จะบันทึก PaymentPeriods ให้อัตโนมัติถ้ามีมาใน List)
            _context.Contracts.Add(contract);
            
            try 
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest($"บันทึกไม่สำเร็จ: {ex.InnerException?.Message ?? ex.Message}");
            }

            return CreatedAtAction("GetContract", new { id = contract.Id }, contract);
        }

        // ---------------------------------------------------------
        // ✅ 4. PUT: แก้ไขสัญญา (ฟังก์ชันใหม่ที่จำเป็นมาก)
        // ---------------------------------------------------------
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContract(int id, Contract contract)
        {
            if (id != contract.Id) return BadRequest("ID ไม่ตรงกัน");

            // 1. ดึงข้อมูลเก่าออกมา (รวมงวดงานเดิมด้วย) โดยใช้ AsNoTracking เพื่อไม่ให้ EF สับสน
            var existingContract = await _context.Contracts
                .Include(c => c.PaymentPeriods)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (existingContract == null) return NotFound();

            // 2. อัปเดตข้อมูลส่วนหัว (Header)
            _context.Entry(existingContract).CurrentValues.SetValues(contract);
            existingContract.UpdatedDate = DateTime.Now;
            existingContract.UpdatedBy = "Admin"; // หรือรับจาก User Login

            // 3. จัดการงวดงาน (Table Detail)
            // วิธีที่ง่ายและปลอดภัยสุด: ลบงวดเก่าทั้งหมด -> ใส่งวดใหม่เข้าไป
            
            // 3.1 ลบงวดงานเก่า
            if (existingContract.PaymentPeriods != null)
            {
                _context.RemoveRange(existingContract.PaymentPeriods);
            }

            // 3.2 เพิ่มงวดงานใหม่ (จากที่ส่งมา)
            if (contract.PaymentPeriods != null)
            {
                foreach (var item in contract.PaymentPeriods)
                {
                    item.ContractId = id; // ย้ำให้ชัวร์ว่าผูกกับ ID นี้
                    _context.Add(item);   // สั่ง Add เป็นแถวใหม่
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContractExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // ---------------------------------------------------------
        // 5. DELETE: ลบสัญญา
        // ---------------------------------------------------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContract(int id)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null) return NotFound();

            _context.Contracts.Remove(contract);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Helper Method
        private bool ContractExists(int id)
        {
            return _context.Contracts.Any(e => e.Id == id);
        }
    }
}