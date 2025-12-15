using Microsoft.EntityFrameworkCore;
// ตรวจสอบชื่อ Namespace นี้ให้ตรงกับไฟล์ Model ของคุณ (น่าจะเป็นตัวใหญ่)
using Contractmanagement.API.Models; 

namespace Contractmanagement.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // ตารางเดิม
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<RoleMenu> RoleMenus { get; set; }

        // --- แก้ไขจุดนี้ครับ (สำคัญ) ---
        // เปลี่ยนจาก object เป็น DbSet<TblProjectType>
        public DbSet<TblProjectType> Tbl_ProjectTypes { get; set; } = default!;
        public DbSet<TblDeviceType> Tbl_DeviceTypes { get; set; } = default!;
    }
}