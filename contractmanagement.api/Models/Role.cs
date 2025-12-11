namespace Contractmanagement.API.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // เช่น Admin, User, Manager
        public string Description { get; set; } = string.Empty; // คำอธิบาย (เผื่อไว้)
    }
}