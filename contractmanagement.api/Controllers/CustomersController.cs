using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Contractmanagement.API.Data;   
using Contractmanagement.API.Models; 
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Contractmanagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            return await _context.Customer 
                .Include(c => c.Contacts)
                .OrderByDescending(c => c.Id)
                .ToListAsync();
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _context.Customer
                .Include(c => c.Contacts)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                return NotFound();
            }

            return customer;
        }

        // POST: api/Customers
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
        {
            _context.Customer.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCustomer", new { id = customer.Id }, customer);
        }

        // ✅ PUT: api/Customers/5 (ฉบับแก้ไข: บันทึกก่อน แล้วค่อยดึงชื่อไปอัปเดต Project)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, [FromBody] Customer customer)
        {
            if (id != customer.Id)
            {
                return BadRequest("Customer ID mismatch");
            }

            // 1. ดึงข้อมูลลูกค้าเดิม
            var existingCustomer = await _context.Customer
                .Include(c => c.Contacts)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (existingCustomer == null) return NotFound();

            // 2. อัปเดตข้อมูลบริษัท
            _context.Entry(existingCustomer).CurrentValues.SetValues(customer);

            // 3. จัดการข้อมูล Contacts (เพิ่ม/ลบ/แก้ไข)
            if (customer.Contacts != null)
            {
                // ลบ
                foreach (var existingContact in existingCustomer.Contacts.ToList())
                {
                    if (!customer.Contacts.Any(c => c.Id == existingContact.Id))
                        _context.Contact.Remove(existingContact);
                }
                // เพิ่ม/แก้ไข
                foreach (var contactModel in customer.Contacts)
                {
                    var existingContact = existingCustomer.Contacts.FirstOrDefault(c => c.Id == contactModel.Id && c.Id != 0);
                    if (existingContact != null)
                    {
                        _context.Entry(existingContact).CurrentValues.SetValues(contactModel);
                    }
                    else
                    {
                        var newContact = new Contact
                        {
                            FirstName = contactModel.FirstName,
                            LastName = contactModel.LastName,
                            Phone = contactModel.Phone,
                            Email = contactModel.Email,
                            Details = contactModel.Details,
                            CustomerId = id
                        };
                        existingCustomer.Contacts.Add(newContact);
                    }
                }
            }

            // 🔥 STEP 4: บันทึกข้อมูลลูกค้าและผู้ติดต่อลงฐานข้อมูลก่อน (เพื่อให้มั่นใจว่ามีข้อมูลจริง)
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id)) return NotFound();
                else throw;
            }

            // 🔥 STEP 5: ดึงชื่อผู้ติดต่อ "คนแรก" จากฐานข้อมูลจริงๆ มาอัปเดต Project
            var primaryContact = await _context.Contact.Where(c => c.CustomerId == id).FirstOrDefaultAsync();

            if (primaryContact != null)
            {
                string contactFullName = $"{primaryContact.FirstName} {primaryContact.LastName}".Trim();

                // ค้นหาโปรเจกต์ของลูกค้ารายนี้ (ต้องมั่นใจว่า Tbl_Projects มี CustomerId ตรงกัน)
                var relatedProjects = await _context.Tbl_Projects.Where(p => p.CustomerId == id).ToListAsync();

                bool needUpdateProject = false;
                foreach (var project in relatedProjects)
                {
                    if (project.CustomerName != contactFullName)
                    {
                        project.CustomerName = contactFullName;
                        _context.Entry(project).State = EntityState.Modified;
                        needUpdateProject = true;
                    }
                }

                // ถ้ามีการแก้ไขชื่อใน Project ให้บันทึกอีกรอบ
                if (needUpdateProject)
                {
                    await _context.SaveChangesAsync();
                }
            }

            return NoContent();
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customer.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customer.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CustomerExists(int id)
        {
            return _context.Customer.Any(e => e.Id == id);
        }
    }
}