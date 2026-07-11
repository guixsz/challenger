namespace Challenger_api.Models;

public record TotalResponse(Guid id, string name, int age, decimal incomeTotal, decimal expenseTotal, decimal balance);