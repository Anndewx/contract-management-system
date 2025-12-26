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

        // ✅ PUT: api/Customers/5 (รองรับการแก้ไขข้อมูลและ Contacts)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, [FromBody] Customer customer)
        {
            if (id != customer.Id)
            {
                return BadRequest("Customer ID mismatch");
            }

            // 1. โหลดข้อมูลลูกค้าเก่าจาก DB พร้อม Contacts เดิม
            var existingCustomer = await _context.Customer
                .Include(c => c.Contacts)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (existingCustomer == null)
            {
                return NotFound();
            }

            // 2. อัปเดตข้อมูลทั่วไปของบริษัท
            _context.Entry(existingCustomer).CurrentValues.SetValues(customer);

            // 3. จัดการข้อมูล Contacts (Add / Update / Delete)
            if (customer.Contacts != null)
            {
                // 3.1 ลบ Contact ที่ถูกลบออกจากรายการหน้าเว็บ
                foreach (var existingContact in existingCustomer.Contacts.ToList())
                {
                    if (!customer.Contacts.Any(c => c.Id == existingContact.Id))
                    {
                        _context.Contact.Remove(existingContact);
                    }
                }

                // 3.2 เพิ่มใหม่ หรือ แก้ไข Contact
                foreach (var contactModel in customer.Contacts)
                {
                    // หา Contact เดิมที่มี ID ตรงกัน (และ ID ต้องไม่ใช่ 0)
                    var existingContact = existingCustomer.Contacts
                        .FirstOrDefault(c => c.Id == contactModel.Id && c.Id != 0);

                    if (existingContact != null)
                    {
                        // มีอยู่แล้ว -> อัปเดตข้อมูล
                        _context.Entry(existingContact).CurrentValues.SetValues(contactModel);
                    }
                    else
                    {
                        // ไม่เจอ -> เพิ่มใหม่
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

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
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