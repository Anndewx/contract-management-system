using Microsoft.AspNetCore.Mvc;
using Contractmanagement.API.Data;
using Contractmanagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Contractmanagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _context.Tbl_Projects
                .Include(x => x.Customer) // ✅ Include Customer data
                .OrderByDescending(x => x.Id)
                .ToList();
            return Ok(data);
        }

        // 1. GET BY ID: ดึงข้อมูลรายโครงการ
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var project = await _context.Tbl_Projects.FindAsync(id);
            if (project == null) return NotFound();
            return Ok(project);
        }

        // 2. CREATE: สร้างโครงการ + สร้างสัญญาอัตโนมัติ
        [HttpPost]
        public IActionResult Create(TblProjects model)
        {
            // 2.1 บันทึกโครงการ
            if (model.CreatedDate == default) model.CreatedDate = DateTime.Now;
            
            _context.Tbl_Projects.Add(model);
            _context.SaveChanges(); 

            // 2.2 สร้างสัญญา (Contract) อัตโนมัติ
            var defaultProjectType = _context.Tbl_ProjectTypes.FirstOrDefault();
            int projectTypeIdToUse = defaultProjectType != null ? defaultProjectType.Id : 1; 

            var newContract = new Contract
            {
                ProjectId = model.Id,             
                ContractNumber = model.ProjectId ?? "DRAFT-" + model.Id, 
                Title = model.ProjectName ?? "โครงการใหม่", 
                ProjectTypeId = projectTypeIdToUse, 
                Amount = model.ProjectValue ?? 0, 
                Description = "สร้างอัตโนมัติจากหน้าโครงการเมื่อ " + DateTime.Now.ToString(),
                CreatedDate = DateTime.Now,
                IsActive = true,
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddYears(1)
            };

            _context.Contracts.Add(newContract);
            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest("บันทึกโครงการสำเร็จ แต่สร้างสัญญาไม่ผ่าน: " + ex.Message);
            }

            return Ok(new { message = "บันทึกข้อมูลและสร้างสัญญาสำเร็จ" });
        }

        // ✅ 3. UPDATE (PUT): แก้ไขโครงการ + อัปเดตชื่อสัญญาในฐานข้อมูลให้ตรงกัน
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TblProjects project)
        {
            if (id != project.Id) return BadRequest();

            // 3.1 เตรียมอัปเดตข้อมูลโครงการ
            _context.Entry(project).State = EntityState.Modified;

            // ป้องกันไม่ให้แก้วันที่สร้างและคนสร้าง (รักษาค่าเดิมไว้)
            _context.Entry(project).Property(x => x.CreatedDate).IsModified = false;
            _context.Entry(project).Property(x => x.CreatedBy).IsModified = false;

            try
            {
                // 3.2 ✅ เพิ่มส่วนนี้: ค้นหาสัญญาที่ผูกกับโครงการนี้ แล้วแก้ชื่อให้ตรงกัน
                var relatedContract = await _context.Contracts.FirstOrDefaultAsync(c => c.ProjectId == id);
                if (relatedContract != null)
                {
                    // อัปเดตชื่อสัญญาให้เหมือนชื่อโครงการ
                    relatedContract.Title = project.ProjectName ?? relatedContract.Title;
                    
                    // (Optional) ถ้าต้องการให้อัปเดตมูลค่าสัญญาตามด้วย ก็เปิดบรรทัดล่างนี้ครับ
                    // relatedContract.Amount = project.ProjectValue ?? 0;
                }

                // 3.3 บันทึกทุกอย่างลงฐานข้อมูลทีเดียว (ทั้ง Project และ Contract)
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tbl_Projects.Any(e => e.Id == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // 4. DELETE: ลบโครงการ + ลบสัญญาที่เกี่ยวข้อง
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // 4.1 หาตัวโครงการก่อน
            var project = _context.Tbl_Projects.Find(id);
            if (project == null) return NotFound();

            // 4.2 ค้นหาสัญญาที่ผูกกับโครงการนี้ แล้วลบทิ้งซะ
            var relatedContracts = _context.Contracts.Where(c => c.ProjectId == id).ToList();
            if (relatedContracts.Any())
            {
                _context.Contracts.RemoveRange(relatedContracts);
            }

            // 4.3 ลบโครงการตามปกติ
            _context.Tbl_Projects.Remove(project);
            
            try 
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest("ลบไม่สำเร็จ: " + ex.Message);
            }

            return Ok(new { message = "ลบข้อมูลโครงการและสัญญาเรียบร้อยแล้ว" });
        }
    }
}