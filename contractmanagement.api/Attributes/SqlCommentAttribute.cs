namespace ERP.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Property, AllowMultiple = false)]
public class SqlCommentAttribute : Attribute
{
    public string Comment { get; }

    public SqlCommentAttribute(string comment)
    {
        Comment = comment;
    }
}
