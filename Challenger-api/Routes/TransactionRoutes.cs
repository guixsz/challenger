using Challenger_api.Data;
using Challenger_api.Models;
using Microsoft.EntityFrameworkCore;

namespace Challenger_api.Routes;

public static class TransactionRoutes
{
    public static void TransactionRoute(this WebApplication app)
    {
        // Uso de MapGroup para definir a rota da url "/transaction"
        var route = app.MapGroup("transaction");

        // Método POST -> Criação de transição com o record no corpo da requisição
        route.MapPost("", async (TransactionRequest req, appContext context) =>
        {

            // Tentará transforma a string recebida no corpo da requisição em GUID, caso o id não esteja em formato GUID retornará um Badrequest
            if (!Guid.TryParse(req.personId, out Guid personGuid))
            {
                return Results.BadRequest(new { message = "Essa pessoa não existe" });
            }

            // Encontrará a pessoa com base no id passado no corpo da requisicão do TransactionRequest
            var person = await context.people.FirstOrDefaultAsync(p => p.id == personGuid);

            // Se o id nao existe no banco de dados, retornará um bad request
            if (person == null)
            {
                return Results.BadRequest(new { message = "Essa pessoa não existe" });
            }

            // Validação -> Caso a pessoa seja menor de idade e esteja criando uma transação de receita retornará um bad request
            if (person.age < 18 && req.type == TransactionType.Income)
            {
                return Results.BadRequest(new { message = "Menores de idade não podem efetuar receita" });
            }

            // Validação -> Caso o valor digitado seja menro que zero, retornará um Badrequest
            if(req.amount <= 0)
            {
                return Results.BadRequest(new { message = "Digite um valor maior que zero" });
            }

            // Transformando o record TransactionRequest em uma classe Transaction para conseguir salvar no banco de dados
            var newTransaction = new Transaction(
                req.description,
                req.amount,
                req.type,
                personGuid);

            // Salvamento no banco de dados
            await context.transactions.AddAsync(newTransaction);
            await context.SaveChangesAsync();
            
            return Results.Created($"/transaction/{newTransaction.Id}", newTransaction);
        });
        
        // Método GET -> Retornará todas as transações no banco de dados
        route.MapGet("", async (appContext context) =>
        {
            var transactions = await context.transactions.ToListAsync();
            return Results.Ok(transactions);
        });
    }
}