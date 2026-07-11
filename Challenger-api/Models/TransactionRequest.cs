namespace Challenger_api.Models;

public record TransactionRequest(string description, decimal amount, TransactionType type, Guid personId);