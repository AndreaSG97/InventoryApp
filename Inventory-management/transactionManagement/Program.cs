using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TransactionManagement.Data;
using TransactionManagement.Models;
using System.Text.Json;
using System.Text;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Transaction API", Version = "v1" });
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



app.MapGet("/transactions", async (DataContext context) =>
{
    var httpClient = new HttpClient();

    var transactions = await context.Transactions.ToListAsync();

    var result = new List<object>();

    foreach (var transaction in transactions)
    {
        var productResponse = await httpClient.GetAsync($"http://service2:80/products/{transaction.ProductID}");

        if (!productResponse.IsSuccessStatusCode)
        {
           
            result.Add(new
            {
                transaction.TransactionID,
                transaction.Date,
                transaction.TransactionType,
                transaction.ProductID,
                transaction.Quantity,
                transaction.UnitPrice,
                transaction.TotalPrice,
                transaction.Details,
                product = (object?)null
            });
            continue;
        }

        var productJson = await productResponse.Content.ReadAsStringAsync();
        var product = JsonSerializer.Deserialize<Product>(productJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        result.Add(new
        {
            transaction.TransactionID,
            transaction.Date,
            transaction.TransactionType,
            transaction.ProductID,
            transaction.Quantity,
            transaction.UnitPrice,
            transaction.TotalPrice,
            transaction.Details,
            product
        });
    }

    return Results.Ok(result);
})
.WithName("GetTransactionsWithProducts")
.WithOpenApi();



app.MapGet("/transactions/{id}", async (DataContext context, int id) =>
{
    var transaction = await context.Transactions.FindAsync(id);

    if (transaction == null)
    {
        return Results.NotFound();
    }

    var httpClient = new HttpClient();

    object? product = null;

    var productResponse = await httpClient.GetAsync($"http://service2:80/products/{transaction.ProductID}");

    if (productResponse.IsSuccessStatusCode)
    {
        var productJson = await productResponse.Content.ReadAsStringAsync();
        product = JsonSerializer.Deserialize<Product>(productJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }

    var result = new
    {
        transaction.TransactionID,
        transaction.Date,
        transaction.TransactionType,
        transaction.ProductID,
        transaction.Quantity,
        transaction.UnitPrice,
        transaction.TotalPrice,
        transaction.Details,
        product
    };

    return Results.Ok(result);
})
.WithName("GetTransactionByIdWithProduct")
.WithOpenApi();



app.MapPost("/transactions", async (DataContext context, Transaction transaction) =>
{
    var httpClient = new HttpClient();

    
    var productResponse = await httpClient.GetAsync($"http://service2:80/products/{transaction.ProductID}");
    if (!productResponse.IsSuccessStatusCode)
        return Results.BadRequest("Producto no encontrado");

    var product = await productResponse.Content.ReadFromJsonAsync<Product>();
    if (product == null)
        return Results.BadRequest("Error al obtener el producto");

   
    if (transaction.TransactionType.ToLower() == "sale" && product.InStock < transaction.Quantity)
        return Results.BadRequest("Stock insuficiente para realizar la venta");
    
    var adjustStockPayload = new AdjustStockRequest
    {
        ProductID = transaction.ProductID,
        Quantity = transaction.Quantity,
        Operation = transaction.TransactionType.ToLower() 
    };

    var stockResponse = await httpClient.PutAsJsonAsync(
        $"http://service2:80/products/{transaction.ProductID}/adjust-stock",
        adjustStockPayload);

    if (!stockResponse.IsSuccessStatusCode)
        return Results.StatusCode(500); 
 
    context.Transactions.Add(transaction);
    await context.SaveChangesAsync();
    return Results.Created($"/transactions/{transaction.TransactionID}", transaction);
});




app.MapPut("/transactions/{id}", async (DataContext context, int id, Transaction input) =>
{
    var transaction = await context.Transactions.FindAsync(id);
    if (transaction is null)
        return Results.NotFound();

    var httpClient = new HttpClient();

    
    var productResponse = await httpClient.GetAsync($"http://service2:80/products/{input.ProductID}");
    if (!productResponse.IsSuccessStatusCode)
        return Results.BadRequest("Producto no encontrado");

    var product = await productResponse.Content.ReadFromJsonAsync<Product>();
    if (product == null)
        return Results.BadRequest("Error al obtener el producto");

    
    if (input.TransactionType.ToLower() == "sale" && product.InStock < input.Quantity)
        return Results.BadRequest("Stock insuficiente para realizar la venta");

   
    var adjustStockPayload = new AdjustStockRequest
    {
        ProductID = input.ProductID,
        Quantity = input.Quantity,
        Operation = input.TransactionType.ToLower()
    };

    var stockResponse = await httpClient.PutAsJsonAsync(
        $"http://service2:80/products/{input.ProductID}/adjust-stock",
        adjustStockPayload);

    if (!stockResponse.IsSuccessStatusCode)
        return Results.StatusCode(500); 

    
    transaction.Date = input.Date;
    transaction.TransactionType = input.TransactionType;
    transaction.ProductID = input.ProductID;
    transaction.Quantity = input.Quantity;
    transaction.UnitPrice = input.UnitPrice;
    transaction.Details = input.Details;

    await context.SaveChangesAsync();
    return Results.Ok(transaction);
})
.WithName("UpdateTransaction")
.WithOpenApi();




app.MapDelete("/transactions/{id}", async (DataContext context, int id) =>
{
    var transaction = await context.Transactions.FindAsync(id);
    if (transaction is null) return Results.NotFound();

    context.Transactions.Remove(transaction);
    await context.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("DeleteTransaction")
.WithOpenApi();


app.Run();
