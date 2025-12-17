using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Contractmanagement.API.Models
{
    [Table("Tbl_Projects")]
    public class TblProjects
    {
        [Key]
        public int Id { get; set; }
        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public string? ProjectType { get; set; }
        public string? CustomerName { get; set; }
        public string? ProcurementMethod { get; set; }
        public string? EvaluationMethod { get; set; }
        public int? FiscalYear { get; set; }
        public string? ProjectStatus { get; set; }
        public decimal? ProjectValue { get; set; }
        public string? CompanyName { get; set; }
        public string? ProjectDetail { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public string? CreatedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public string? LastModifiedBy { get; set; }
    }
}