namespace ProductManagement.Models{
public class Product
{
    public int ProductID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? Image { get; set; }
    public decimal Price { get; set; }
    public int  InStock { get; set; }
}
public class AdjustStockRequest
{
    public int ProductID { get; set; }
    public int Quantity { get; set; }
    public string Operation { get; set; } = string.Empty; 
}
}

