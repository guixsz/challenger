import type {Transaction} from '../../Types'
import { useEffect, useState } from 'react';
import './TableTransaction.css';

export default function TableTransaction() {

    const [transactions, setData] = useState<Transaction[]>([]);


    const fetchData = async () =>  {
        const API_URL = 'http://localhost:5105';
        const res = await fetch(`${API_URL}/transaction`);
        const jsonData = await res.json();
        setData(jsonData);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="transaction-container">
            <table className="transaction-table">
                <thead>
                    <tr className="transaction-head-row">
                        <th className="transaction-th">Descrição</th>
                        <th className="transaction-th">Valor</th>
                        <th className="transaction-th">Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Laço de repetição para buscar os dados na tabale transactions */}
                    {transactions.map((transaction: Transaction, idx: number) => {
                        const isIncome = transaction.type?.toLowerCase() === 'income' || transaction.type?.toLowerCase() === 'receita';
                        let typeTransalate = '';
                        
                        if(transaction.type?.toLocaleLowerCase() === 'income') {
                            typeTransalate = 'Receita';
                        }   else {
                            typeTransalate = 'Despesa';
                        }

                        return (
                            <tr key={transaction.id ?? idx} className="transaction-body-row">
                                <td className="transaction-td text-name">
                                    {transaction.description}
                                </td>
                                <td className={`transaction-td ${isIncome ? 'text-income' : 'text-expense'}`}>
                                    R$ {Number(transaction.amount).toFixed(2)}
                                </td>
                                <td className="transaction-td text-type">
                                    {typeTransalate}
                                </td>
                            </tr>
                        );
                    })}

                    {transactions.length === 0 && (
                        <tr>
                            <td colSpan={3} className="transaction-empty-td">
                                Nenhuma transação encontrada no sistema.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}