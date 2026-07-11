# 💰 Finanças API (Back-End)

Este é o back-end do ecossistema de controle financeiro. A API foi desenvolvida utilizando **.NET / C#** (executando por padrão na porta `5105`), sendo responsável pelo gerenciamento de usuários, consolidação de saldos e aplicação das regras de negócio de transações.

---

## 🛠️ Tecnologias e Configurações

*   **Runtime:** .NET 8.0 / 9.0 (C#)
*   **Porta Local Padrão:** `http://localhost:5105`
*   **Formato de Comunicação:** JSON (`application/json`)

> **Nota sobre Serialização:** A API está configurada para mapear automaticamente payloads enviados pelo Front-end. Caso ocorram problemas de desserialização (valores retornando como `0` ou `null`), certifique-se de enviar os dados em conformidade com as chaves esperadas ou configure o conversor do ciclo de vida da API para *CamelCase*.

---

## 🛡️ Regras de Negócio Implementadas

### 1. Restrição de Maioridade para Receitas
Para evitar fraudes ou cadastros inconsistentes no fluxo financeiro, a API barra transações do tipo Entrada (`Income` / `Receita`) se a pessoa vinculada ao `PersonId` for menor de idade.
*   **Critério:** Idade maior que 18 anos para transações de receita.
*   **Comportamento:** A requisição é rejeitada com código HTTP `400 Bad Request` e retorna um JSON estruturado contendo o motivo no campo `message`.

---

## 🛣️ Endpoints da API

### 👥 Gerenciamento de Pessoas (`/person`)

#### 1. Listar Detalhes e Totais da Dashboard
Retorna a lista completa de pessoas cadastradas acompanhada do balanço consolidado (receitas acumuladas, despesas acumuladas e saldo líquido global).
*   **Rota:** `GET /person/total`
*   **Resposta de Sucesso (200 OK):**
    ```json
    {
      "grandTotalIncomes": 5000.00,
      "grandTotalExpenses": 2500.00,
      "netBalance": 2500.00,
      "people": [
        {
          "id": 1,
          "name": "João Silva",
          "age": 25,
          "incomeTotal": 5000.00,
          "expenseTotal": 2500.00,
          "balance": 2500.00
        }
      ]
    }
    ```

#### 2. Cadastrar Nova Pessoa
*   **Rota:** `POST /person`
*   **Payload Esperado:**
    ```json
    {
      "Name": "Maria Souza",
      "Age": 29
    }
    ```

#### 3. Deletar uma Pessoa
*   **Rota:** `DELETE /person/{id}`
*   **Exemplo:** `DELETE /person/1`

---

### 💸 Fluxo de Transações (`/transaction`)

#### 1. Listar Todas as Transações
Retorna o histórico bruto de movimentações financeiras inseridas no sistema.
*   **Rota:** `GET /transaction`
*   **Resposta de Sucesso (200 OK):**
    ```json
    [
      {
        "id": 10,
        "description": "Salário Mensal",
        "amount": 3500.00,
        "type": "Income",
        "personId": 1
      }
    ]
    ```

#### 2. Criar Nova Transação
Insere uma nova movimentação vinculada a um usuário cadastrado.
*   **Rota:** `POST /transaction`
*   **Payload Esperado:**
    ```json
    {
      "Description": "Aluguel",
      "Amount": 1200.00,
      "Type": "Expense",
      "PersonId": 1
    }
    ```

#### ❌ Respostas de Erro Comuns (Validação)
Caso o `PersonId` pertença a um menor de idade e o tipo seja `Income`, a API retornará:
*   **Status:** `400 Bad Request`
*   **Corpo:**
    ```json
    {
      "message": "Menores de idade não podem efetuar receita"
    }
    ```

---

## 🚀 Como Executar o Back-end Localmente

1. Certifique-se de ter o **SDK do .NET** instalado na sua máquina.
2. Navegue até a pasta raiz do back-end pelo terminal:
   ```bash
   cd caminho/para/o/seu/projeto/backend