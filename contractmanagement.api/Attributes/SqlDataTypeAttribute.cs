using ERP.Enum;

namespace ERP.Attributes;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
public class SqlDataTypeAttribute : Attribute
{
    public SqlDataTypeEnum DataType { get; }
    public int? Length { get; }
    public int? Precision { get; }
    public int? Scale { get; }

    public SqlDataTypeAttribute(SqlDataTypeEnum dataType)
    {
        DataType = dataType;
    }

    public SqlDataTypeAttribute(SqlDataTypeEnum dataType, int length)
    {
        DataType = dataType;
        Length = length;
    }

    public SqlDataTypeAttribute(SqlDataTypeEnum dataType, int precision, int scale)
    {
        DataType = dataType;
        Precision = precision;
        Scale = scale;
    }
}
