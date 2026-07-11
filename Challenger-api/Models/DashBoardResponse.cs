namespace Challenger_api.Models;

public record DashboardResponse(List<TotalResponse> people, decimal grandTotalIncomes, decimal grandTotalExpenses, decimal netBalance);