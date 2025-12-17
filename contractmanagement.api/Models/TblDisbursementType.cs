using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Contractmanagement.API.Models
{
    [Table("Tbl_DisbursementType")]
    public class TblDisbursementType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } 

        public string? Description { get; set; } 

        public bool IsActive { get; set; } 

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [StringLength(100)]
        public string? CreatedBy { get; set; } 

        public DateTime? UpdatedDate { get; set; } 

        [StringLength(100)]
        public string? UpdateBy { get; set; } 
    }
}