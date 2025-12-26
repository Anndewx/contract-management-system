using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Contractmanagement.API.Data; // ✅ ตรวจสอบว่า namespace ตรงกับไฟล์ ApplicationDbContext.cs
using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()   // อนุญาตทุกเว็บ (รวมถึง localhost ของคุณ)
                  .AllowAnyMethod()   // อนุญาตทุกท่า (GET, POST, PUT, DELETE)
                  .AllowAnyHeader();  // อนุญาตทุก Header
        });
});
// --- 1. เชื่อมต่อ Database (ใช้ชื่อ ApplicationDbContext) ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// --- 2. ตั้งค่า JWT Authentication ---
var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"] ?? "ThisIsTheSecretKeyForYourApp_ChangeItLater12345");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false, // ถ้าใน appsettings มี Issuer ให้แก้เป็น true
        ValidateAudience = false, // ถ้าใน appsettings มี Audience ให้แก้เป็น true
        ClockSkew = TimeSpan.Zero
    };
});

// --- 3. ตั้งค่า Swagger (ให้มีปุ่มแม่กุญแจ) ---
builder.Services.AddControllers().AddJsonOptions(x =>
{ // ✅ ต้องมีปีกกาเปิดตรงนี้
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    x.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Contract API", Version = "v1" });

    // เพิ่มปุ่ม Authorize (รูปแม่กุญแจ)
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "ใส่คำว่า Bearer เว้นวรรคตามด้วย Token ตัวอย่าง: \"Bearer eyJhbG...\""
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// อนุญาตให้ทุกที่ (AllowAll) เข้ามาใช้งาน API ได้
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// --- 4. จัดลำดับการทำงาน (Pipeline) ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors("AllowAll");
// ⚠️ สำคัญ: ต้องเอา UseAuthentication ไว้ก่อน UseAuthorization
app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();