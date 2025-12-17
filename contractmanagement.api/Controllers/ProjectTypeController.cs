using Microsoft.AspNetCore.Mvc;
using Contractmanagement.API.Data;
using Contractmanagement.API.Models; 

namespace Contractmanagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectTypeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectTypeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. ดึงข้อมูลทั้งหมด (GET)
        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _context.Tbl_ProjectTypes.ToList(); 
            return Ok(data);
        }

        // 2. บันทึกข้อมูลใหม่ (POST)
        [HttpPost]
        public IActionResult Create(TblProjectType model)
        {
            _context.Tbl_ProjectTypes.Add(model);
            _context.SaveChanges();
            return Ok(new { message = "บันทึกสำเร็จ" });
        }

        // 3. ลบข้อมูล (DELETE) --- [ส่วนที่ผมเพิ่มให้ครับ]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // ค้นหาข้อมูลตาม ID
            var item = _context.Tbl_ProjectTypes.Find(id);
            
            // ถ้าไม่เจอ ให้แจ้งกลับว่า NotFound (404)
            if (item == null)
            {
                return NotFound();
            }

            // ถ้าเจอ ให้สั่งลบและบันทึก
            _context.Tbl_ProjectTypes.Remove(item);
            _context.SaveChanges();
            
            return Ok(new { message = "ลบข้อมูลสำเร็จ" });
        }
    }
}