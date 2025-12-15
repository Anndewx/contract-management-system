using Microsoft.AspNetCore.Mvc;
using Contractmanagement.API.Data;
// แก้ไขบรรทัดนี้ให้เป็นตัวพิมพ์ใหญ่ (Contractmanagement...) ให้ตรงกับไฟล์ Model
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
            // ถ้าแก้ไฟล์ DbContext แล้ว Error ตรงนี้จะหายไปครับ
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
    }
}