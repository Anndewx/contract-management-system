using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization; // 👈 ต้องมีบรรทัดนี้

namespace Contractmanagement.API.Models
{
    public class Contract
    {
        // ✅ ต้องมี Constructor เปล่าๆ หรือไม่มีเลยก็ได้ (ห้ามมีตัวรับค่า DeviceType)
        public Contract() { }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string ContractNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Amount { get; set; }

        public string Description { get; set; } = string.Empty;

        // --- ส่วนเชื่อมโยง (Foreign Keys) ---
        public int ProjectTypeId { get; set; }
        
        [ForeignKey("ProjectTypeId")]
        [JsonIgnore] // 👈 ใส่เพื่อป้องกัน Error วนลูปตอนบันทึก
        public virtual TblProjectType? ProjectType { get; set; }

        public int? DeviceTypeId { get; set; }

        [ForeignKey("DeviceTypeId")]
        [JsonIgnore] // 👈 ใส่ตรงนี้ด้วย
        public virtual TblDeviceType? DeviceType { get; set; }

        // --- Audit Log ---
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}