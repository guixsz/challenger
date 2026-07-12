import { useEffect, useState } from 'react';
import type { DashboardData, TransactionInput } from './Types';
import './style.css';
import '../src/components/popUp/PopUp.css';

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [form, setForm] = useState<TransactionInput>({
    description: '',
    amount: 0,
    type: 'Income',
    personId: ''
  });

  const API_URL = 'http://localhost:5105';

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/person/total`);
    if (!res.ok) throw new Error('Erro ao buscar dados do servidor.');
    const jsonData = await res.json();

    setData(jsonData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transactionPayload = {
      Description: form.description,
      Amount: Number(form.amount),
      Type: form.type,
      PersonId: form.personId
    };

    try {
      const res = await fetch(`${API_URL}/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionPayload)
      });

      if (!res.ok) {
        const erroTexto = await res.text();
        const erroObjeto = JSON.parse(erroTexto);
        showToast(erroObjeto.message);
      }

      setForm({ ...form, description: '', amount: 0 });
      fetchData();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const handleDeletePerson = async (id: string | number) => {
    if (!confirm('Tem certeza que deseja deletar esta pessoa e todas as suas transações?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/person/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const erroTexto = await res.text();
        let mensagemAmigavel = 'Erro ao deletar pessoa.';
        try {
          const erroObjeto = JSON.parse(erroTexto);
          mensagemAmigavel = erroObjeto.message || erroTexto;
        } catch {
          mensagemAmigavel = erroTexto || mensagemAmigavel;
        }
        throw new Error(mensagemAmigavel);
      }
      fetchData(); 
      alert('Pessoa removida com sucesso!');
    } catch (err: any) {
        showToast(err.message);
    }
  };

  if (loading) return <div className="app-center-screen">Carregando painel...</div>;

  const totalIncomes = data?.grandTotalIncomes ?? (data as any)?.grandTotalIncomes ?? 0;
  const totalExpenses = data?.grandTotalExpenses ?? (data as any)?.grandTotal?.totalExpenses ?? 0;
  const netBalance = data?.netBalance ?? (data as any)?.grandTotal?.netBalance ?? 0;
  const peopleList = data?.people ?? (data as any)?.people ?? [];

  return (
    <div className="app-container">
      {toastMessage && (
        <div className="toastContainer">
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="app-main-grid">
        <div className="app-left-column">
          <div className="app-card-grid">
            <div className="app-card">
              <span className="app-card-label">Total Receitas</span>
              <span className="app-card-value color-income">
                R$ {totalIncomes.toFixed(2)}
              </span>
            </div>

            <div className="app-card">
              <span className="app-card-label">Total Despesas</span>
              <span className="app-card-value color-expense">
                R$ {totalExpenses.toFixed(2)}
              </span>
            </div>

            <div className={`app-card ${netBalance >= 0 ? 'border-income' : 'border-expense'}`}>
              <span className="app-card-label">Saldo Líquido Geral</span>
              <span className={`app-card-value ${netBalance >= 0 ? 'color-income' : 'color-expense'}`}>
                R$ {netBalance.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="app-table-container">
            <div style={{ overflowX: 'auto' }}>
              <table className="app-table">
                <thead>
                  <tr className="app-table-head-row">
                    <th className="app-th">Nome</th>
                    <th className="app-th">Idade</th>
                    <th className="app-th">Receitas</th>
                    <th className="app-th">Despesas</th>
                    <th className="app-th">Saldo</th>
                    <th className="app-th">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {peopleList.map((person: any, idx: number) => {
                    const income = person.incomeTotal;
                    const expenses = person.expenseTotal;
                    const balance = person.balance;

                    return (
                      <tr key={idx} className="app-table-body-row">
                        <td className="app-td text-bold-slate">
                          {person.name}
                        </td>
                        <td className="app-td">  
                          {person.age ?? person.idade ?? 0} anos
                        </td>
                        <td className="app-td color-income" style={{ fontWeight: 500 }}>
                          R$ {Number(income).toFixed(2)}
                        </td>
                        <td className="app-td color-expense" style={{ fontWeight: 500 }}>
                          R$ {Number(expenses).toFixed(2)}
                        </td>
                        <td className={`app-td ${balance >= 0 ? 'color-income' : 'color-expense'}`} style={{ fontWeight: 500 }}>
                          R$ {Number(balance).toFixed(2)}
                        </td>
                        <td className="app-td">
                          <div className="app-actions-wrapper">
                            <button
                              type="button"
                              title="Usar este ID no formulário"
                              onClick={() => setForm(prev => ({ ...prev, personId: person.id }))}
                              className="btn-get-id"
                            >
                              Usar ID
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => handleDeletePerson(person.id)}
                              className="btn-delete"
                              title="Excluir pessoa"
                            >
                              Deletar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {peopleList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="app-empty-td">Nenhuma pessoa encontrada no sistema.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="app-form-card">
          <h2 className="app-section-title" style={{ marginBottom: '16px' }}>Nova Transação</h2>
          <form onSubmit={handleSubmit}>
            <div className="app-form-group">
              <label className="app-label">ID da Pessoa</label>
              <input
                type="text"
                required
                className="app-input"
                placeholder="Cole o ID aqui"
                value={form.personId}
                onChange={e => setForm({ ...form, personId: e.target.value })}
              />
            </div>

            <div className="app-form-group">
              <label className="app-label">Descrição</label>
              <input
                type="text"
                required
                className="app-input"
                placeholder="Ex: Salário, Mercado..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="app-form-row">
              <div style={{ flex: 1 }}>
                <label className="app-label">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="app-input"
                  value={form.amount || ''}
                  onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) })}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="app-label">Tipo</label>
                <select
                  className="app-input"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value as 'Income' | 'Expense' })}
                >
                  <option value="Income">Receita</option>
                  <option value="Expense">Despesa</option>
                </select>
              </div>
            </div>

            <button type="submit" className="app-btn-submit">
              Lançar Transação
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}