import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    let balance: Balance;

    const income = this.transactions.reduce((accumulator: number, current) => {
      if (current.type === 'income') return accumulator + current.value;
      return accumulator;
    }, 0);

    const outcome = this.transactions.reduce((accumulator: number, current) => {
      if (current.type === 'outcome') return accumulator + current.value;
      return accumulator;
    }, 0);

    balance = { income, outcome, total: income - outcome };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
