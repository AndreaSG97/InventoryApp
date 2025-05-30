using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ProductManagement.Data;
using ProductManagement.Models;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Product API", Version = "v1" });
});

builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(80); 
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyOrigin() 
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");
app.UseSwagger();
app.UseSwaggerUI();
app.UseStaticFiles();


app.MapGet("/products", async (DataContext context) =>
    await context.Products.ToListAsync())
.WithName("GetProducts")
.WithOpenApi();

app.MapGet("/products/{id}", async (DataContext context, int id) =>
    await context.Products.FindAsync(id) is Product product
        ? Results.Ok(product)
        : Results.NotFound())
.WithName("GetProductById")
.WithOpenApi();

app.MapPost("/products", async (HttpRequest request, DataContext context) =>
{
    var form = await request.ReadFormAsync();

    var name = form["name"];
    var description = form["description"];
    var category = form["category"];
    var price = decimal.Parse(form["price"]);
    var inStock = int.Parse(form["inStock"]);
    var file = form.Files["image"];

    if (file is null || file.Length == 0)
        return Results.BadRequest("No image uploaded.");

    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
    var savePath = Path.Combine("wwwroot/images", fileName);

    Directory.CreateDirectory("wwwroot/images"); 

    using (var stream = new FileStream(savePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }
    var product = new Product
    {
        Name = name,
        Description = description,
        Category = category,
        Price = price,
        InStock = inStock,
        Image = $"/images/{fileName}"
    };

    context.Products.Add(product);
    await context.SaveChangesAsync();

    return Results.Created($"/products/{product.ProductID}", product);
})
.WithName("AddProduct")
.WithOpenApi();


app.MapPut("/products/{id}", async (HttpRequest request, DataContext context, int id) =>
{
    var product = await context.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    var form = await request.ReadFormAsync();
    Console.WriteLine($"Product: {JsonSerializer.Serialize(form)}");
           
  
    var name = form["name"];
    var description = form["description"];
    var category = form["category"];
    var price = decimal.TryParse(form["price"], out var p) ? p : 0;
    var inStock = int.TryParse(form["inStock"], out var s) ? s : 0;

    var file = form.Files["image"];
    var existingImagePath = form["existingImagePath"].ToString();

    if (file is not null && file.Length > 0)
    {
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var savePath = Path.Combine("wwwroot/images", fileName);
        Directory.CreateDirectory("wwwroot/images");
        using var stream = new FileStream(savePath, FileMode.Create);
        await file.CopyToAsync(stream);
        product.Image = $"/images/{fileName}";
    }
    else if (!string.IsNullOrEmpty(existingImagePath))
    {
        product.Image = existingImagePath;
    }

    product.Name = name;
    product.Description = description;
    product.Category = category;
    product.Price = price;
    product.InStock = inStock;

    await context.SaveChangesAsync();

    return Results.Ok(product);
})
.WithName("UpdateProduct")
.WithOpenApi();



app.MapDelete("/products/{id}", async (DataContext context, int id) =>
{
    var product = await context.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    context.Products.Remove(product);
    await context.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("DeleteProduct")
.WithOpenApi();

app.MapPut("/products/{id}/adjust-stock", async (DataContext context, int id, AdjustStockRequest input) =>
{
    var product = await context.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    if (input.Operation.ToLower() == "sale")
    {
        if (product.InStock < input.Quantity)
            return Results.BadRequest("Stock insuficiente");

        product.InStock -= input.Quantity;
    }
    else if (input.Operation.ToLower() == "purchase")
    {
        product.InStock += input.Quantity;
    }
    else
    {
        return Results.BadRequest("Invalid transaction. Use 'sell' or 'buy'.");
    }

    await context.SaveChangesAsync();
    return Results.Ok(product);
});


app.Run();
