using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContractAPI.Migrations
{
    public partial class AddTblContract : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ❌ ตัดส่วน RenameTable ทิ้ง เพราะตารางจริงชื่อถูกอยู่แล้ว (Tbl_ProjectType)
            
            // ✅ เหลือไว้แค่ส่วนสร้างตาราง Contracts ครับ
            migrationBuilder.CreateTable(
                name: "Contracts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ContractNumber = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Title = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProjectTypeId = table.Column<int>(type: "int", nullable: false),
                    DeviceTypeId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedBy = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdatedDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contracts", x => x.Id);
                    
                    // เชื่อม Foreign Key ไปยังตารางที่มีอยู่จริง
                    table.ForeignKey(
                        name: "FK_Contracts_Tbl_DeviceType_DeviceTypeId",
                        column: x => x.DeviceTypeId,
                        principalTable: "Tbl_DeviceType",
                        principalColumn: "Id");
                        
                    table.ForeignKey(
                        name: "FK_Contracts_Tbl_ProjectType_ProjectTypeId",
                        column: x => x.ProjectTypeId,
                        principalTable: "Tbl_ProjectType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_DeviceTypeId",
                table: "Contracts",
                column: "DeviceTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_ProjectTypeId",
                table: "Contracts",
                column: "ProjectTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Contracts");
        }
    }
}