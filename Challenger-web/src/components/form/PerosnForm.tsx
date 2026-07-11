import type { PersonInput }  from '../../Types';
import { useState } from 'react';
import styles from '../form/PersonForm.module.css';

export default function PersonForm() {
  const API_URL = 'http://localhost:5105';
  const [form, setForm] = useState<PersonInput>({ name: '', age: '' });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.name || form.age === '') {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const payloadParaAPI = {
    Name: form.name,
    Age: Number(form.age) 
  };

  try {
    const res = await fetch(`${API_URL}/person`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadParaAPI) 
    });

    if (!res.ok) throw new Error('Erro ao salvar a pessoa.');

    setForm({ name: '', age: '' });
  } catch (err: any) {
    alert(err.message);
  }
};

    return (
    <form onSubmit={handleSubmit} className={styles.formCard}>
      <h2>Nova Pessoa</h2>
      
      <div className={styles.inputGroup}>
        <label htmlFor="name">Nome completo</label>
        <input 
          id="name"
          type="text" 
          placeholder="Ex: João Silva"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="age">Idade</label>
        <input 
          id="age"
          type="number" 
          placeholder="Ex: 25"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value === '' ? '' : Number(e.target.value) })}
        />
      </div>

      <button type="submit" className={styles.submitBtn}>Salvar Cadastro</button>
    </form>
  );
}