import { useEffect, useState } from 'react';
import type { DashboardData, TransactionInput } from './Types';
import './style.css';
import '../src/components/popUp/PopUp.css'

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

  {/*Método GET -> Busca os dados*/}
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

  {/* Método POST -> Validação de dados */}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.personId || form.amount <= 0) {
      showToast('Por favor, preencha o ID da pessoa e um valor maior que 0.');
      return;
    }

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
        throw new Error(erroObjeto.message);
      }

      setForm({ ...form, description: '', amount: 0 });
      fetchData();
      alert('Transação adicionada com sucesso!');
    } catch (err: any) {
      showToast(err.message);
    }
  };

  {/* Método para delete, Busca a url do backend para deletar uma pessoa do banco de dados*/}
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

  if (loading) return <div style={styles.centerScreen}>Carregando painel...</div>;

  const totalIncomes = data?.grandTotalIncomes ?? (data as any)?.grandTotalIncomes ?? 0;
  const totalExpenses = data?.grandTotalExpenses ?? (data as any)?.grandTotal?.totalExpenses ?? 0;
  const netBalance = data?.netBalance ?? (data as any)?.grandTotal?.netBalance ?? 0;
  const peopleList = data?.people ?? (data as any)?.people ?? [];

  return (
    <div style={styles.container}>

      {toastMessage && (
      <div className="toastContainer">
        <span>{toastMessage}</span>
      </div>

      )}
      <main style={styles.mainGrid}>
      
        <div style={styles.leftColumn}>
          <div style={styles.cardGrid}>
            <div style={styles.card}>
              <span style={styles.cardLabel}>Total Receitas</span>
              <span style={{ ...styles.cardValue, color: '#10b981' }}>
                R$ {totalIncomes.toFixed(2)}
              </span>
            </div>

            <div style={styles.card}>
              <span style={styles.cardLabel}>Total Despesas</span>
              <span style={{ ...styles.cardValue, color: '#f43f5e' }}>
                R$ {totalExpenses.toFixed(2)}
              </span>
            </div>

            <div style={{ 
              ...styles.card, 
              borderLeft: `4px solid ${netBalance >= 0 ? '#10b981' : '#f43f5e'}` 
            }}>
              <span style={styles.cardLabel}>Saldo Líquido Geral</span>
              <span style={{ 
                ...styles.cardValue, 
                color: netBalance >= 0 ? '#10b981' : '#f43f5e' 
              }}>
                R$ {netBalance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Criação de tabela de pessoas */}
          <div style={styles.tableContainer}>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={{...styles.th, textAlign: 'center' }}>Nome</th>
                    <th style={{...styles.th, textAlign: 'center' }}>Idade</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Receitas</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Despesas</th>
                    <th style={{...styles.th, textAlign: 'center' }}>Saldo</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {peopleList.map((person: any, idx: number) => {

                    const income = person.incomeTotal
                    const expenses = person.expenseTotal
                    const balance = person.balance

                    return (
                      <tr key={idx} style={styles.tableBodyRow}>
                        <td style={{ ...styles.td, fontWeight: 500, color: '#0f172a', textAlign: 'center' }}>
                            {person.name}
                        </td>
                        <td style={{ ...styles.td, textAlign: 'center' }}>  
                            {person.age ?? person.idade ?? 0} anos
                        </td>
                        <td style={{ ...styles.td, color: '#10b981', fontWeight: 500, textAlign: 'center' }}>
                            R$ {Number(income).toFixed(2)}
                        </td>
                        <td style={{ ...styles.td, color: '#f43f5e', fontWeight: 500, textAlign: 'center' }}>
                            R$ {Number(expenses).toFixed(2)}
                        </td>
                        <td style={{  
                            ...styles.td, 
                            fontWeight: '500',
                            color: balance >= 0 ? '#10b981' : '#f43f5e',
                            textAlign: 'center'
                        }}>
                            R$ {Number(balance).toFixed(2)}
                        </td>
                        <td style={{ ...styles.td, textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              title="Usar este ID no formulário"
                              onClick={() => setForm(prev => ({ ...prev, personId: person.id }))}
                              style={styles.getId}
                            >
                              Usar ID
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => handleDeletePerson(person.id)}
                              style={{ ...styles.deleteButton}}
                              title="Excluir pessoa"
                            >
                              Deletar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                    })}
                  {peopleList.length === 0 && (
                    <tr>
                      <td colSpan={5} style={styles.emptyTd}>Nenhuma pessoa encontrada no sistema.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA: FORMULÁRIO */}
        <div style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Nova Transação</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>ID da Pessoa</label>
              <input
                type="text"
                required
                style={styles.input}
                placeholder="Cole o ID aqui"
                value={form.personId}
                onChange={e => setForm({ ...form, personId: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Descrição</label>
              <input
                type="text"
                required
                style={styles.input}
                placeholder="Ex: Salário, Mercado..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div style={styles.formRow}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  style={styles.input}
                  value={form.amount || ''}
                  onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) })}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Tipo</label>
                <select
                  style={styles.input}
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value as 'Income' | 'Expense' })}
                >
                  <option value="Income">Receita</option>
                  <option value="Expense">Despesa</option>
                </select>
              </div>
            </div>

            <button type="submit" style={styles.button}>
              Lançar Transação
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    margin: '0',
    padding: '0',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    marginTop: '6em',
    color: '#334155',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    boxSizing: 'border-box'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#64748b',
    margin: 0,
  },
  mainGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '32px',
  },
  leftColumn: {
    flex: '2 1 600px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  cardGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },
  card: {
    flex: '1 1 200px',
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardLabel: {
    fontSize: '14px',
    color: '#94a3b8',
    fontWeight: 500,
    marginBottom: '8px',
  },
  cardValue: {
    fontSize: '24px',
    fontWeight: '500',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  tableHeaderSection: {
    padding: '24px',
    borderBottom: '1px solid #f1f5f9',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f172a',
    margin: 0,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeadRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #f1f5f9',
  },
  th: {
    padding: '16px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: '#64748b',
  },
  tableBodyRow: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#475569',
  },
  emptyTd: {
    padding: '32px',
    textAlign: 'center',
    color: '#94a3b8',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  getId: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    borderRadius: '6px',
    border: 'none'
  },
  formCard: {
    flex: '1 1 300px',
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    height: 'fit-content',
  },
  formGroup: {
    marginBottom: '16px',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#334155',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    fontWeight: 500,
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  centerScreen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    fontFamily: 'sans-serif',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: '40px',
    fontFamily: 'sans-serif',
    padding: '0 20px'
  }
};