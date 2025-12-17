using System;
using System.ComponentModel.DataAnnotations; // เผื่อใช้
using System.ComponentModel.DataAnnotations.Schema;
// สังเกตตัวพิมพ์ใหญ่-เล็ก ต้องตรงกับโปรเจกต์คุณ
namespace Contractmanagement.API.Models 
{
    [Table("Tbl_ProjectType")]
    public class TblProjectType
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // ใส่ค่าเริ่มต้นกัน Null
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public string? CreatedBy { get; set; }
    }
}