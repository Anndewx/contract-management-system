using Microsoft.EntityFrameworkCore;
using Contractmanagement.API.Models;

namespace Contractmanagement.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // ตาราง Users ที่เราจะใช้เก็บข้อมูล
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<RoleMenu> RoleMenus { get; set; }
    }
}