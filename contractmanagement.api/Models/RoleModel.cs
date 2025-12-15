using Microsoft.AspNetCore.Identity;
using ERP.Attributes;
using ERP.Enum;

namespace ERP.Models
{
    [SqlComment("สิทธิ์การใช้งาน")]
    public class RoleModel : IdentityRole
    {
        [SqlComment("รายละเอียด")]
        [SqlDataType(SqlDataTypeEnum.NVarChar, 200)]
        public string? Description { get; set; }
    }
}