using Microsoft.EntityFrameworkCore;
using TransactionManagement.Models;

namespace TransactionManagement.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Transaction> Transactions { get; set; }

          protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.Property(t => t.UnitPrice).HasColumnType("decimal(18,2)");
            
        });
    }
    }
}
