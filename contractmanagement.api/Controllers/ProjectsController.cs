using Microsoft.AspNetCore.Mvc;
using Contractmanagement.API.Data;
using Contractmanagement.API.Models;

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
            var data = _context.Tbl_Projects.OrderByDescending(x => x.Id).ToList();
            return Ok(data);
        }

        [HttpPost]
        public IActionResult Create(TblProjects model)
        {
            if (model.CreatedDate == default) model.CreatedDate = DateTime.Now;
            _context.Tbl_Projects.Add(model);
            _context.SaveChanges();
            return Ok(new { message = "บันทึกสำเร็จ" });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _context.Tbl_Projects.Find(id);
            if (item == null) return NotFound();

            _context.Tbl_Projects.Remove(item);
            _context.SaveChanges();
            return Ok(new { message = "ลบข้อมูลสำเร็จ" });
        }
    }
}