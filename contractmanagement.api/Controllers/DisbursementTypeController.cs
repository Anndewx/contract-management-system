using Microsoft.AspNetCore.Mvc;
using Contractmanagement.API.Data;
using Contractmanagement.API.Models;

namespace Contractmanagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DisbursementTypeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DisbursementTypeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _context.Tbl_DisbursementTypes.OrderByDescending(x => x.Id).ToList();
            return Ok(data);
        }

        [HttpPost]
        public IActionResult Create(TblDisbursementType model)
        {
            if (model.CreatedDate == default) model.CreatedDate = DateTime.Now;
            _context.Tbl_DisbursementTypes.Add(model);
            _context.SaveChanges();
            return Ok(new { message = "บันทึกสำเร็จ" });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _context.Tbl_DisbursementTypes.Find(id);
            if (item == null) return NotFound();

            _context.Tbl_DisbursementTypes.Remove(item);
            _context.SaveChanges();
            return Ok(new { message = "ลบข้อมูลสำเร็จ" });
        }
    }
}