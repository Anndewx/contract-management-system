using System;
using System.Collections.Generic; // 👈 เพิ่มบรรทัดนี้เพื่อใช้ ICollection
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Contractmanagement.API.Models
{
    public class Contract
    {
        // ✅ Constructor: เตรียม List ไว้สำหรับงวดเงิน เพื่อกัน Error Null Reference
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        public Contract()
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        { 
            PaymentPeriods = new HashSet<TblPaymentPeriod>();
        }

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

        // --- 🆕 ส่วนที่เพิ่มใหม่ตาม Database ---
        
        // คอลัมน์ ProjectId (ที่มีอยู่แล้วใน DB)
        public int ProjectId { get; set; } 

        // วันที่ลงนามสัญญา (แยกกับ StartDate)
        public DateTime? ContractDate { get; set; }

        [StringLength(100)]
        public string? HiringMethod { get; set; } // วิธีการจ้าง

        [StringLength(100)]
        public string? ProcurementMethod { get; set; } // วิธีการจัดหา

        public int? WarrantyPeriod { get; set; } // ระยะประกัน (จำนวน)

        [StringLength(20)]
        public string? WarrantyUnit { get; set; } = "วัน"; // หน่วยนับ (วัน/ปี)

        // --- ส่วนเชื่อมโยง (Foreign Keys) ---
        public int ProjectTypeId { get; set; }
        
        [ForeignKey("ProjectTypeId")]
        [JsonIgnore]
        public virtual TblProjectType? ProjectType { get; set; }

        public int? DeviceTypeId { get; set; }

        [ForeignKey("DeviceTypeId")]
        [JsonIgnore]
        public virtual TblDeviceType? DeviceType { get; set; }

        // 🆕 ความสัมพันธ์กับตารางงวดเงิน (1 สัญญา มีหลายงวด)
        public virtual ICollection<TblPaymentPeriod> PaymentPeriods { get; set; }

        // --- Audit Log ---
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }
        
        [ForeignKey("ProjectId")]
        public virtual TblProjects? Project { get; set; }
    }
}