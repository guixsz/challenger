using Challenger_api.Models;
using Microsoft.EntityFrameworkCore;

namespace Challenger_api.Data;

// Configuração do banco de dados SQLite e suas tabelas
public class appContext : DbContext
{
    public DbSet<Person> people { get; set; }
    public DbSet<Transaction> transactions { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=challenger.sqlite");
        base.OnConfiguring(optionsBuilder); 
    }
}