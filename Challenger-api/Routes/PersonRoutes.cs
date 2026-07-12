using Challenger_api.Data;
using Challenger_api.Models;
using Microsoft.EntityFrameworkCore;

namespace Challenger_api.Routes;

public static class PersonRoutes
{
    public static void PersonRoute(this WebApplication app)
    {
        // Uso de MapGroup para definir a rota da url "/person"
        var route = app.MapGroup("person");
        
        //Metódo POST -> cadastro de pessoas utilizando um record no corpo da requisição
        route.MapPost("", async (PersonRequest person, appContext context) =>
        {
            var newPerson = new Person(person.name, person.age);
            await context.AddAsync(newPerson);
            await context.SaveChangesAsync();
        });

        // Método GET -> Retornará todos os dados da tabela pessoa
        route.MapGet("", async (appContext context) =>
        {
            var people = await context.people.ToListAsync();
            return Results.Ok(people);
        });

        // Método DELETE -> deletará a pessoa e toda as transações pertencentes a essa pessoa
        route.MapDelete("{id:guid}", async (Guid id, appContext context) =>
        {
            // Encontrará a pessao no tabela pessoa com base no id passado como parâmetro
            var person =  await context.people.FirstOrDefaultAsync(x => x.id == id);

            if (person == null)
            {
                return Results.NotFound();
            }

            // Encontrará todas as transações que possui a chave estrangeira do id passado como parâmetro
            var personTransactions = await context.transactions
                .Where(t => t.PersonId == id)
                .ToListAsync();

            // Se houver algum dado dentro do array personTransaction irá ser deletado
            if (personTransactions.Any())
            {
                context.transactions.RemoveRange(personTransactions);
            }
            
            // Deletará a pessoa
            context.people.Remove(person);

            // salvará as mudanças no banco de dados
            await context.SaveChangesAsync();
            return Results.Ok();
        });

        // Método GET -> buscará os dados da tabela pessoa e transação e trará uma panorâmica sobre as despesas e receitas
        route.MapGet("total", async (appContext context) =>
        {
            // Buscará todos os dados da tabela pessoa
            var people = await context.people.ToListAsync();

            // Buscará todos os dados da tabela transação
            var transactions = await context.transactions.ToListAsync();
            
            var peopleBalance = people
                .Select(person =>
                {
                    // Busca todos as transações de receitas
                    var incomeTotal = transactions
                        .Where(t => t.PersonId == person.id && t.Type == TransactionType.Income)
                        .Sum(t => t.Amount);

                    // Busca todas as transações de despesas
                    var expensesTotal = transactions
                        .Where(t => t.PersonId == person.id && t.Type == TransactionType.Expense)
                        .Sum(t => t.Amount);

                    // Cálculo para encontrar o saldo 
                    var balance = incomeTotal - expensesTotal;

                    // Transaformando tudo em um record para saída de dados
                    return new TotalResponse(
                        person.id,
                        person.name,
                        person.age,
                        incomeTotal,
                        expensesTotal,
                        balance
                    );
                })
                .ToList();
            
            // Cálculo para encontrar o total de receita das pessaos na tabela 
            var grandTotalIncomes = peopleBalance.Sum(p => p.incomeTotal);
            // Cálculo para encontrar o total de despesas das pessaos na tabela 
            var grandTotalExpenses = peopleBalance.Sum(p => p.expenseTotal);
            // Cálculo para encontrar o saldo total 
            var netBalance = grandTotalIncomes - grandTotalExpenses;
            
            //
            var finalReslt = new DashboardResponse(peopleBalance, grandTotalIncomes, grandTotalExpenses, netBalance);
            
            return Results.Ok(finalReslt);
        } );
    }
}