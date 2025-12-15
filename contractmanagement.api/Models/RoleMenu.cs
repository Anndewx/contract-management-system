using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Contractmanagement.API.Models
{
    // ตารางนี้เอาไว้เก็บว่า Role ไหน มีสิทธิ์เข้า Menu ไหนบ้าง
    public class RoleMenu
    {
        [Key]
        public int Id { get; set; }

        public int RoleId { get; set; }
        [ForeignKey("RoleId")]
        public Role? Role { get; set; }

        public int MenuId { get; set; }
        [ForeignKey("MenuId")]
        public Menu? Menu { get; set; }
    }
}