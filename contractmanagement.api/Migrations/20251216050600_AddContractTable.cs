using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContractAPI.Migrations
{
    public partial class AddContractTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ❌ ลบโค้ดสร้างตารางทิ้งให้หมด เพราะใน Database มีอยู่แล้ว
            // ปล่อยว่างไว้แบบนี้เลยครับ ระบบจะได้ข้ามไป
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // ไม่ต้องทำอะไร
        }
    }
}