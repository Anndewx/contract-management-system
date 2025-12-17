using Microsoft.EntityFrameworkCore;
using Contractmanagement.API.Models;

namespace Contractmanagement.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<RoleMenu> RoleMenus { get; set; }
        public DbSet<Contract> Contracts { get; set; }

        // ส่วน Project & Device
        public DbSet<TblProjectType> Tbl_ProjectTypes { get; set; } 
        public DbSet<TblDeviceType> Tbl_DeviceTypes { get; set; }
        
        // ส่วน Disbursement (ถูกต้องแล้ว)
        public DbSet<TblDisbursementType> Tbl_DisbursementTypes { get; set; }
        public DbSet<TblProjects> Tbl_Projects { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Mapping ตารางเดิม
            modelBuilder.Entity<TblProjectType>().ToTable("Tbl_ProjectType");
            modelBuilder.Entity<TblDeviceType>().ToTable("Tbl_DeviceType");

            // 🚩 บรรทัดนี้ที่หายไปครับ! ต้องเติมเพื่อให้มันวิ่งไปหาตารางที่ถูกต้อง
            modelBuilder.Entity<TblDisbursementType>().ToTable("Tbl_DisbursementType");
            modelBuilder.Entity<TblProjects>().ToTable("Tbl_Projects");
        }
    }
}