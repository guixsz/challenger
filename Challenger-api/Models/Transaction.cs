namespace Challenger_api.Models;

public class Transaction
{
    public Transaction() {}

    public Transaction(string description, decimal amount, TransactionType type, Guid personId)
    {
        Id = Guid.NewGuid();
        Description = description;
        Amount = amount;
        Type = type;
        PersonId = personId;
    }
    
    public Guid Id { get; init; }
    public string Description { get; private set; }
    public decimal Amount { get; private set; }
    public TransactionType Type { get; private set; }
    public Guid PersonId { get; private set; }
}