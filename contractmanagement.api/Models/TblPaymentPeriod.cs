using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // 👈 จำเป็นสำหรับ [Table]
using System.Text.Json.Serialization;

namespace Contractmanagement.API.Models
{
    // ✅ เพิ่มบรรทัดนี้ เพื่อบอกให้ตรงกับชื่อตารางใน Database เป๊ะๆ
    [Table("Tbl_PaymentPeriod")] 
    public class TblPaymentPeriod
    {
        [Key]
        public int Id { get; set; }

        public int ContractId { get; set; } // FK

        public int InstallmentNo { get; set; } // งวดที่
        
        public string? DeliverableItem { get; set; } // รายการ

        [Column(TypeName = "decimal(18, 2)")]
        public decimal PaymentAmount { get; set; } // จำนวนเงิน

        public DateTime? DueDate { get; set; }

        // เชื่อมกลับไปหา Contract แม่
        [ForeignKey("ContractId")]
        [JsonIgnore]
        public virtual Contract? Contract { get; set; }
    }
}