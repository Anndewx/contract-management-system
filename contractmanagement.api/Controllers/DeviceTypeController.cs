using Microsoft.AspNetCore.Mvc;
using Contractmanagement.API.Data;
using Contractmanagement.API.Models;

namespace Contractmanagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceTypeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DeviceTypeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/DeviceType (ดึงข้อมูลทั้งหมด)
        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _context.Tbl_DeviceTypes.OrderByDescending(x => x.Id).ToList();
            return Ok(data);
        }

        // POST: api/DeviceType (บันทึกข้อมูลใหม่)
        [HttpPost]
        public IActionResult Create(TblDeviceType model)
        {
            // กำหนดค่าเริ่มต้น
            model.CreatedDate = DateTime.Now;
            model.IsActive = true; 
            
            _context.Tbl_DeviceTypes.Add(model);
            _context.SaveChanges();
            
            return Ok(new { message = "บันทึกสำเร็จ" });
        }
    }
}